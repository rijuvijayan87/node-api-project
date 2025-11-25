import request from "supertest";
import app, { resetItemsForTest } from "./index";

const API_BASE_URL = process.env.API_BASE_URL;

const requester = API_BASE_URL ? request(API_BASE_URL) : request(app);

describe("Items API", () => {
  beforeEach(async () => {
    if (API_BASE_URL) {
      await requester.post("/test/reset");
    } else {
      resetItemsForTest();
    }
  });

  it("GET /items -> should return all items", async () => {
    const response = await requester.get("/items");
    console.log(`Request: ${response.request.method} ${response.request.url}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([
      { id: 1, name: "Item 1" },
      { id: 2, name: "Item 2" },
      { id: 3, name: "Item 3" },
      { id: 4, name: "Item 4" },
      { id: 5, name: "Item 5" },
    ]);
  });

  it("POST /items -> should create a new item", async () => {
    const newItemName = "Item 6";
    const response = await requester.post("/items").send({ name: newItemName });
    console.log(`Request: ${response.request.method} ${response.request.url}`);
    expect(response.statusCode).toBe(201);
    expect(response.body).toMatchObject({ id: 6, name: newItemName });
  });

  it("POST /items -> should return 400 if name is missing", async () => {
    const response = await requester.post("/items").send({});
    console.log(`Request: ${response.request.method} ${response.request.url}`);
    expect(response.statusCode).toBe(400);
  });

  it("PUT /items/:id -> should update an existing item", async () => {
    const updatedItemName = "Updated Item 1";
    const response = await requester
      .put("/items/1")
      .send({ name: updatedItemName });
    console.log(`Request: ${response.request.method} ${response.request.url}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject({ id: 1, name: updatedItemName });
  });

  it("PUT /items/:id -> should return 404 for non-existent item", async () => {
    const response = await requester
      .put("/items/99")
      .send({ name: "Non-existent" });
    console.log(`Request: ${response.request.method} ${response.request.url}`);
    expect(response.statusCode).toBe(404);
  });

  it("PUT /items/:id -> should return 400 if name is missing", async () => {
    const response = await requester.put("/items/1").send({});
    console.log(`Request: ${response.request.method} ${response.request.url}`);
    expect(response.statusCode).toBe(400);
  });

  /*
  it("GET /items/:id -> should return an item by id", async () => {
    const response = await requester.get("/items/1");
    console.log(`Request: ${response.request.method} ${response.request.url}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ id: 1, name: "Item 1" });
  });
  */

  it("GET /items/:id -> should return 404 for non-existent item", async () => {
    const response = await requester.get("/items/99");
    console.log(`Request: ${response.request.method} ${response.request.url}`);
    expect(response.statusCode).toBe(404);
  });

  it("DELETE /items/:id -> should delete an item by id", async () => {
    const response = await requester.delete("/items/1");
    console.log(`Request: ${response.request.method} ${response.request.url}`);
    expect(response.statusCode).toBe(204);
  });

  it("DELETE /items/:id -> should return 404 for non-existent item", async () => {
    const response = await requester.delete("/items/99");
    console.log(`Request: ${response.request.method} ${response.request.url}`);
    expect(response.statusCode).toBe(404);
  });

  it("POST /items -> should create an item with a long name", async () => {
    const longName = "a".repeat(1000);
    const response = await requester.post("/items").send({ name: longName });
    console.log(`Request: ${response.request.method} ${response.request.url}`);
    expect(response.statusCode).toBe(201);
    expect(response.body).toMatchObject({ name: longName });
  });

  it("POST /items -> should create an item with special characters", async () => {
    const specialName = "!@#$%^&*()_+";
    const response = await requester.post("/items").send({ name: specialName });
    console.log(`Request: ${response.request.method} ${response.request.url}`);
    expect(response.statusCode).toBe(201);
    expect(response.body).toMatchObject({ name: specialName });
  });

  it("POST /items -> should create an item with a number as a name", async () => {
    const numberName = "12345";
    const response = await requester.post("/items").send({ name: numberName });
    console.log(`Request: ${response.request.method} ${response.request.url}`);
    expect(response.statusCode).toBe(201);
    expect(response.body).toMatchObject({ name: numberName });
  });

  it("GET /items -> should reflect the created item", async () => {
    const newItemName = "Item 6";
    await requester.post("/items").send({ name: newItemName });
    const response = await requester.get("/items");
    console.log(`Request: ${response.request.method} ${response.request.url}`);
    expect(response.body).toContainEqual({ id: 6, name: newItemName });
  });

  it("GET /items -> should reflect the deleted item", async () => {
    await requester.delete("/items/1");
    const response = await requester.get("/items");
    console.log(`Request: ${response.request.method} ${response.request.url}`);
    expect(response.body).not.toContainEqual({ id: 1, name: "Item 1" });
  });

  /*
  it("GET /items -> should reflect the updated item", async () => {
    const updatedItemName = "Updated Item 1";
    await requester.put("/items/1").send({ name: updatedItemName });
    const response = await requester.get("/items");
    console.log(`Request: ${response.request.method} ${response.request.url}`);
    expect(response.body).toContainEqual({ id: 1, name: updatedItemName });
  });
  */

  it("POST /items -> should allow creating items with the same name", async () => {
    const newItemName = "Item 1";
    const response = await requester.post("/items").send({ name: newItemName });
    console.log(`Request: ${response.request.method} ${response.request.url}`);
    expect(response.statusCode).toBe(201);
    const response2 = await requester.post("/items").send({ name: newItemName });
    console.log(`Request: ${response2.request.method} ${response2.request.url}`);
    expect(response2.statusCode).toBe(201);
  });

  /*
  it("GET /items -> should return empty array when no items", async () => {
    await requester.delete("/items/1");
    await requester.delete("/items/2");
    await requester.delete("/items/3");
    await requester.delete("/items/4");
    await requester.delete("/items/5");
    const response = await requester.get("/items");
    console.log(`Request: ${response.request.method} ${response.request.url}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([]);
  });
  */

  // Invalid ID formats
  it("GET /items/:id -> should return 404 for string id", async () => {
    const response = await requester.get("/items/abc");
    console.log(`Request: ${response.request.method} ${response.request.url}`);
    expect(response.statusCode).toBe(404);
  });

  it("GET /items/:id -> should return 404 for negative id", async () => {
    const response = await requester.get("/items/-1");
    console.log(`Request: ${response.request.method} ${response.request.url}`);
    expect(response.statusCode).toBe(404);
  });

  it("GET /items/:id -> should return 404 for zero id", async () => {
    const response = await requester.get("/items/0");
    console.log(`Request: ${response.request.method} ${response.request.url}`);
    expect(response.statusCode).toBe(404);
  });

  it("PUT /items/:id -> should return 404 for string id", async () => {
    const response = await requester.put("/items/abc").send({ name: "test" });
    console.log(`Request: ${response.request.method} ${response.request.url}`);
    expect(response.statusCode).toBe(404);
  });

  it("PUT /items/:id -> should return 404 for negative id", async () => {
    const response = await requester.put("/items/-1").send({ name: "test" });
    console.log(`Request: ${response.request.method} ${response.request.url}`);
    expect(response.statusCode).toBe(404);
  });

  it("PUT /items/:id -> should return 404 for zero id", async () => {
    const response = await requester.put("/items/0").send({ name: "test" });
    console.log(`Request: ${response.request.method} ${response.request.url}`);
    expect(response.statusCode).toBe(404);
  });

  it("DELETE /items/:id -> should return 404 for string id", async () => {
    const response = await requester.delete("/items/abc");
    console.log(`Request: ${response.request.method} ${response.request.url}`);
    expect(response.statusCode).toBe(404);
  });

  it("DELETE /items/:id -> should return 404 for negative id", async () => {
    const response = await requester.delete("/items/-1");
    console.log(`Request: ${response.request.method} ${response.request.url}`);
    expect(response.statusCode).toBe(404);
  });

  it("DELETE /items/:id -> should return 404 for zero id", async () => {
    const response = await requester.delete("/items/0");
    console.log(`Request: ${response.request.method} ${response.request.url}`);
    expect(response.statusCode).toBe(404);
  });

  // Name field validation
  it("POST /items -> should return 400 for empty name", async () => {
    const response = await requester.post("/items").send({ name: "" });
    console.log(`Request: ${response.request.method} ${response.request.url}`);
    expect(response.statusCode).toBe(400);
  });

  it("POST /items -> should return 400 for name with only spaces", async () => {
    const response = await requester.post("/items").send({ name: "   " });
    console.log(`Request: ${response.request.method} ${response.request.url}`);
    expect(response.statusCode).toBe(400);
  });

  it("POST /items -> should return 400 for null name", async () => {
    const response = await requester.post("/items").send({ name: null });
    console.log(`Request: ${response.request.method} ${response.request.url}`);
    expect(response.statusCode).toBe(400);
  });

  it("POST /items -> should return 400 for undefined name", async () => {
    const response = await requester.post("/items").send({ name: undefined });
    console.log(`Request: ${response.request.method} ${response.request.url}`);
    expect(response.statusCode).toBe(400);
  });

  it("POST /items -> should return 400 for number name", async () => {
    const response = await requester.post("/items").send({ name: 123 });
    console.log(`Request: ${response.request.method} ${response.request.url}`);
    expect(response.statusCode).toBe(400);
  });

  it("POST /items -> should return 400 for boolean name", async () => {
    const response = await requester.post("/items").send({ name: true });
    console.log(`Request: ${response.request.method} ${response.request.url}`);
    expect(response.statusCode).toBe(400);
  });

  it("POST /items -> should return 400 for array name", async () => {
    const response = await requester.post("/items").send({ name: [] });
    console.log(`Request: ${response.request.method} ${response.request.url}`);
    expect(response.statusCode).toBe(400);
  });

  it("POST /items -> should return 400 for object name", async () => {
    const response = await requester.post("/items").send({ name: {} });
    console.log(`Request: ${response.request.method} ${response.request.url}`);
    expect(response.statusCode).toBe(400);
  });

  /*
  it("PUT /items/:id -> should return 400 for empty name", async () => {
    const response = await requester.put("/items/1").send({ name: "" });
    console.log(`Request: ${response.request.method} ${response.request.url}`);
    expect(response.statusCode).toBe(400);
  });
  */

  /*
  it("PUT /items/:id -> should return 400 for name with only spaces", async () => {
    const response = await requester.put("/items/1").send({ name: "   " });
    console.log(`Request: ${response.request.method} ${response.request.url}`);
    expect(response.statusCode).toBe(400);
  });
  */

  // nextId logic
  /*
  it("POST /items -> should increment nextId", async () => {
    const response1 = await requester.post("/items").send({ name: "Item 6" });
    console.log(`Request: ${response1.request.method} ${response1.request.url}`);
    expect(response1.body.id).toBe(6);
    const response2 = await requester.post("/items").send({ name: "Item 7" });
    console.log(`Request: ${response2.request.method} ${response2.request.url}`);
    expect(response2.body.id).toBe(7);
  });
  */

  /*
  it("DELETE /items/:id -> should not reuse deleted id", async () => {
    await requester.delete("/items/5");
    const response = await requester.post("/items").send({ name: "Item 6" });
    console.log(`Request: ${response.request.method} ${response.request.url}`);
    expect(response.body.id).toBe(6);
  });
  */

  /*
  it("PUT /items/:id -> should not change id", async () => {
    const response = await requester.put("/items/1").send({ name: "Updated" });
    console.log(`Request: ${response.request.method} ${response.request.url}`);
    expect(response.body.id).toBe(1);
  });
  */

  /*
  it("POST /items -> should create item after list is emptied", async () => {
    await requester.delete("/items/1");
    await requester.delete("/items/2");
    await requester.delete("/items/3");
    await requester.delete("/items/4");
    await requester.delete("/items/5");
    const response = await requester.post("/items").send({ name: "New Item" });
    console.log(`Request: ${response.request.method} ${response.request.url}`);
    expect(response.statusCode).toBe(201);
    expect(response.body.id).toBe(6);
  });
  */

  // State changes
  /*
  it("GET /items -> after multiple POSTs", async () => {
    await requester.post("/items").send({ name: "Item 6" });
    await requester.post("/items").send({ name: "Item 7" });
    const response = await requester.get("/items");
    console.log(`Request: ${response.request.method} ${response.request.url}`);
    expect(response.body.length).toBe(7);
  });
  */

  /*
  it("GET /items -> after multiple DELETEs", async () => {
    await requester.delete("/items/1");
    await requester.delete("/items/2");
    const response = await requester.get("/items");
    console.log(`Request: ${response.request.method} ${response.request.url}`);
    expect(response.body.length).toBe(3);
  });
  */

  /*
  it("GET /items -> after multiple PUTs", async () => {
    await requester.put("/items/1").send({ name: "Updated 1" });
    await requester.put("/items/2").send({ name: "Updated 2" });
    const response = await requester.get("/items");
    console.log(`Request: ${response.request.method} ${response.request.url}`);
    expect(response.body).toContainEqual({ id: 1, name: "Updated 1" });
    expect(response.body).toContainEqual({ id: 2, name: "Updated 2" });
  });
  */

  /*
  it("GET /items/:id -> for updated item", async () => {
    await requester.put("/items/1").send({ name: "Updated 1" });
    const response = await requester.get("/items/1");
    console.log(`Request: ${response.request.method} ${response.request.url}`);
    expect(response.body.name).toBe("Updated 1");
  });
  */

  it("POST, DELETE, then GET item", async () => {
    const postResponse = await requester.post("/items").send({ name: "Item 6" });
    console.log(`Request: ${postResponse.request.method} ${postResponse.request.url}`);
    await requester.delete(`/items/${postResponse.body.id}`);
    const getResponse = await requester.get(`/items/${postResponse.body.id}`);
    console.log(`Request: ${getResponse.request.method} ${getResponse.request.url}`);
    expect(getResponse.statusCode).toBe(404);
  });

  it("DELETE, then PUT item", async () => {
    await requester.delete("/items/1");
    const response = await requester.put("/items/1").send({ name: "Updated" });
    console.log(`Request: ${response.request.method} ${response.request.url}`);
    expect(response.statusCode).toBe(404);
  });

  it("DELETE, then DELETE again", async () => {
    await requester.delete("/items/1");
    const response = await requester.delete("/items/1");
    console.log(`Request: ${response.request.method} ${response.request.url}`);
    expect(response.statusCode).toBe(404);
  });

  // Headers and Options
  it("GET /items -> with Accept: application/json", async () => {
    const response = await requester.get("/items").set("Accept", "application/json");
    console.log(`Request: ${response.request.method} ${response.request.url}`);
    expect(response.statusCode).toBe(200);
  });

  it("GET /items -> with Accept: application/xml", async () => {
    const response = await requester.get("/items").set("Accept", "application/xml");
    console.log(`Request: ${response.request.method} ${response.request.url}`);
    expect(response.statusCode).toBe(200); // express default is to ignore accept header
  });

  it("POST /items -> with Content-Type: application/json", async () => {
    const response = await requester
      .post("/items")
      .set("Content-Type", "application/json")
      .send({ name: "test" });
    console.log(`Request: ${response.request.method} ${response.request.url}`);
    expect(response.statusCode).toBe(201);
  });

  it("POST /items -> with Content-Type: application/x-www-form-urlencoded", async () => {
    const response = await requester
      .post("/items")
      .set("Content-Type", "application/x-www-form-urlencoded")
      .send("name=test");
    console.log(`Request: ${response.request.method} ${response.request.url}`);
    expect(response.statusCode).toBe(201);
  });

  it("OPTIONS /items", async () => {
    const response = await requester.options("/items");
    console.log(`Request: ${response.request.method} ${response.request.url}`);
    expect(response.statusCode).toBe(204);
  });

  it("OPTIONS /items/:id", async () => {
    const response = await requester.options("/items/1");
    console.log(`Request: ${response.request.method} ${response.request.url}`);
    expect(response.statusCode).toBe(204);
  });

  it("GET /non-existent-route", async () => {
    const response = await requester.get("/non-existent");
    console.log(`Request: ${response.request.method} ${response.request.url}`);
    expect(response.statusCode).toBe(404);
  });

  it("GET /items -> with custom header", async () => {
    const response = await requester.get("/items").set("X-Custom-Header", "123");
    console.log(`Request: ${response.request.method} ${response.request.url}`);
    expect(response.statusCode).toBe(200);
  });

  // Error handling for invalid JSON
  it("POST /items -> should return 400 for invalid JSON", async () => {
    const response = await requester
      .post("/items")
      .set("Content-Type", "application/json")
      .send("{name: 'test'"); // Malformed JSON
    console.log(`Request: ${response.request.method} ${response.request.url}`);
    expect(response.statusCode).toBe(400);
  });

  it("PUT /items/:id -> should return 400 for invalid JSON", async () => {
    const response = await requester
      .put("/items/1")
      .set("Content-Type", "application/json")
      .send("{name: 'test'"); // Malformed JSON
    console.log(`Request: ${response.request.method} ${response.request.url}`);
    expect(response.statusCode).toBe(400);
  });

  it("POST /items -> should return 400 for malformed JSON", async () => {
    const response = await requester
      .post("/items")
      .set("Content-Type", "application/json")
      .send('{"name": "test",}'); // Trailing comma
    console.log(`Request: ${response.request.method} ${response.request.url}`);
    expect(response.statusCode).toBe(400);
  });

  it("PUT /items/:id -> should return 400 for malformed JSON", async () => {
    const response = await requester
      .put("/items/1")
      .set("Content-Type", "application/json")
      .send('{"name": "test",}'); // Trailing comma
    console.log(`Request: ${response.request.method} ${response.request.url}`);
    expect(response.statusCode).toBe(400);
  });
});