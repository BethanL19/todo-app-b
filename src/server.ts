import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import pg from "pg";

dotenv.config();
const Client = pg.Client;
const client = new Client({ connectionString: process.env.DATABASE_URL });

const app = express();
app.use(express.json());
app.use(cors());

const PORT_NUMBER = process.env.PORT ?? 4000;

// get all todos
app.get("/items", async (req, res) => {
  try {
    const all = "SELECT * from todo";
    const allItems = await client.query(all);
    res.status(200).json(allItems.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong");
  }
});

// create a todo
app.post<{}, {}, { text: string }>("/items", async (req, res) => {
  try {
    const insert = "INSERT INTO todo (task, complete) VALUES ($1, $2)";
    const insertValues = [req.body.text, false];
    const addItem = await client.query(insert, insertValues);
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong");
  }
});
// delete a todo
// not working
app.delete("/items/:id", async (req, res) => {
  try {
    const del = "DELETE FROM todo WHERE id = $1";
    const idNum = parseInt(req.params.id);
    const delValue = [idNum];
    const delItem = await client.query(del, delValue);
    res.json("Item deleted");
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong");
  }
});

// mark as complete
app.patch<{ id: string }, {}>("/items/:id", async (req, res) => {
  try {
    const update = "UPDATE todo SET complete = true WHERE id = $1";
    const idNum = parseInt(req.params.id);
    const updateValue = [idNum];
    const updateItem = await client.query(update, updateValue);
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong");
  }
});

const start = async () => {
  await client.connect();
  const result = await client.query("SELECT COUNT(*) FROM todo");
  console.log("Found: ", result.rows[0].count);
  app.listen(PORT_NUMBER, () => {
    console.log(`Server is listening on port ${PORT_NUMBER}!`);
  });
};
start();
