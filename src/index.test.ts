import request from 'supertest';
import app from './index';

describe('Items API', () => {
  it('GET /items -> should return all items', async () => {
    const response = await request(app).get('/items');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
    ]);
  });

  it('POST /items -> should create a new item', async () => {
    const newItemName = 'Item 3';
    const response = await request(app)
      .post('/items')
      .send({ name: newItemName });
    expect(response.statusCode).toBe(201);
    expect(response.body).toMatchObject({ id: 3, name: newItemName });
  });

  it('POST /items -> should return 400 if name is missing', async () => {
    const response = await request(app).post('/items').send({});
    expect(response.statusCode).toBe(400);
  });

  it('PUT /items/:id -> should update an existing item', async () => {
    const updatedItemName = 'Updated Item 1';
    const response = await request(app)
      .put('/items/1')
      .send({ name: updatedItemName });
    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject({ id: 1, name: updatedItemName });
  });

  it('PUT /items/:id -> should return 404 for non-existent item', async () => {
    const response = await request(app)
      .put('/items/99')
      .send({ name: 'Non-existent' });
    expect(response.statusCode).toBe(404);
  });

  it('PUT /items/:id -> should return 400 if name is missing', async () => {
    const response = await request(app).put('/items/1').send({});
    expect(response.statusCode).toBe(400);
  });
});
