import express, { Request, Response } from "express";

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Error handling middleware for JSON parsing errors
app.use((err: any, req: Request, res: Response, next: Function) => {
  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).send({ message: "Malformed JSON in request body" });
  }
  next();
});

app.use(express.urlencoded({ extended: true }));

// Options handler for /items
app.options("/items", (req: Request, res: Response) => {
  res.header("Allow", "GET, POST, OPTIONS");
  res.status(204).send();
});

// Options handler for /items/:id
app.options("/items/:id", (req: Request, res: Response) => {
  res.header("Allow", "GET, PUT, DELETE, OPTIONS");
  res.status(204).send();
});

// Simple in-memory database
interface Item {
  id: number;
  name: string;
}

let items: Item[] = [
  { id: 1, name: "Item 1" },
  { id: 2, name: "Item 2" },
  { id: 3, name: "Item 3" },
  { id: 4, name: "Item 4" },
  { id: 5, name: "Item 5" },
];
let nextId = 6;

// GET endpoint to retrieve all items
app.get("/items", (req: Request, res: Response) => {
  res.json(items.slice(0, 3));
});

// GET endpoint to retrieve an item by ID
app.get("/items/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const item = items.find((i) => i.id === id);

  if (item) {
    res.json(item);
  } else {
    res.status(404).send("Item not found");
  }
});

// POST endpoint to create a new item
app.post("/items", (req: Request, res: Response) => {
  const { name } = req.body;
  if (typeof name !== "string" || name.trim() === "") {
    return res
      .status(400)
      .send("Item name is required and must be a non-empty string");
  }
  const newItem: Item = {
    id: nextId++,
    name: name,
  };
  items.push(newItem);
  res.status(201).json(newItem);
});

// PUT endpoint to update an existing item
app.put("/items/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const itemIndex = items.findIndex((i) => i.id === id);

  if (itemIndex > -1) {
    const { name } = req.body;
    if (typeof name !== "string" || name.trim() === "") {
      return res
        .status(400)
        .send("Item name is required and must be a non-empty string");
    }
    const updatedItem = { ...items[itemIndex], name: name };
    items[itemIndex] = updatedItem;
    res.json(updatedItem);
  } else {
    res.status(404).send("Item not found");
  }
});

// DELETE endpoint to delete an item
app.delete("/items/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const itemIndex = items.findIndex((i) => i.id === id);

  if (itemIndex > -1) {
    items.splice(itemIndex, 1);
    res.status(204).send();
  } else {
    res.status(404).send("Item not found");
  }
});

if (process.env.NODE_ENV === "test") {
  app.post("/test/reset", (req: Request, res: Response) => {
    resetItemsForTest();
    res.status(204).send();
  });
}

// Start the server only if this file is run directly
if (require.main === module) {
  app.listen(port, "0.0.0.0", () => {
    console.log(`Server is running at http://0.0.0.0:${port}`);
  });
}

export const resetItemsForTest = () => {
  items = [
    { id: 1, name: "Item 1" },
    { id: 2, name: "Item 2" },
    { id: 3, name: "Item 3" },
    { id: 4, name: "Item 4" },
    { id: 5, name: "Item 5" },
  ];
  nextId = 6;
};

export default app;
