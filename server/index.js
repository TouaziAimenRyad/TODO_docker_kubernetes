const keys = require("./keys");

// Express Application setup
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Postgres client setup
const { Pool } = require("pg");
const pgClient = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDatabase,
  password: keys.pgPassword,
  port: keys.pgPort
});

pgClient.on("connect", client => {
  console.log("databse connected")	
  client
    .query("CREATE TABLE IF NOT EXISTS todo(todo_id SERIAL PRIMARY KEY,description VARCHAR(255))")
    .catch(err => console.log("PG ERROR", err));
});

//Express route definitions
app.get("/", (req, res) => {
  res.send("Hi");
});

// get the values
app.get("/todos", async (req, res) => {
  const values = await pgClient.query("SELECT * FROM todo");
  
  res.send(values);
});

// now the post -> insert value
app.post("/todos", async (req, res) => {
  if (!req.body.description) res.send({ working: false });
  pgClient.query("INSERT INTO todo (description) VALUES($1)", [req.body.description]);
  res.send({ working: true })
});

app.delete("/todos/:id",async (req, res) => {
    const { id } = req.params;
    const deleteTodo = await pgClient.query("DELETE FROM todo WHERE todo_id = $1", [
      id
    ]);
    res.json("Todo was deleted!");
  
})

app.put("/todos/:id", async (req, res) => {
  if (!req.body.description) res.send({ working: false });
  const { id } = req.params;
  const  description = req.body.description;
  const updateTodo = await pgClient.query(
    "UPDATE todo SET description = $1 WHERE todo_id = $2",
    [description, id]
  );

  res.json("Todo was updated!");
})
app.listen(5000, err => {
  console.log("Listening");
});
