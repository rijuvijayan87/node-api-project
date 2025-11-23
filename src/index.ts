import express, { Request, Response } from "express";

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

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
];
let nextId = 3;

// GET endpoint to retrieve all items
app.get("/items", (req: Request, res: Response) => {
  res.json(items);
});

// POST endpoint to create a new item
app.post("/items", (req: Request, res: Response) => {
  if (!req.body.name) {
    return res.status(400).send("Item name is required");
  }
  const newItem: Item = {
    id: nextId++,
    name: req.body.name,
  };
  items.push(newItem);
  res.status(201).json(newItem);
});

// PUT endpoint to update an existing item
app.put("/items/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const itemIndex = items.findIndex((i) => i.id === id);

  if (itemIndex > -1) {
    if (!req.body.name) {
      return res.status(400).send("Item name is required");
    }
    const updatedItem = { ...items[itemIndex], name: req.body.name };
    items[itemIndex] = updatedItem;
    res.json(updatedItem);
  } else {
    res.status(404).send("Item not found");
  }
});

// Start the server only if this file is run directly
if (require.main === module) {
  app.listen(port, "0.0.0.0", () => {
    console.log(`Server is running at http://0.0.0.0:${port}`);
  });
}

export default app;
