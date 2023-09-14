const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(cors());
dotenv.config();

const db = require("./utils/database");
const port = process.env.SERVER_PORT || 3000;

app.get("/todo", async (req, res) => {
  try {
    let [data] = await db.execute("SELECT * FROM tasks");
    res.status(200).json(data);
  } catch (error) {
    res.json(error);
  }
});

app.post("/todo", async (req, res) => {
  const { name, status } = req.body;
  console.log(name, status);
  try {
    await db.execute("INSERT INTO tasks(name,status) VALUES(?,?)", [
      name,
      status,
    ]);
    res.status(201).json({
      message: "Add new task successfully",
      status: "success",
    });
  } catch (error) {
    res.json(error);
  }
});

app.put("/todo/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await db.execute("UPDATE tasks SET status=1 WHERE task_id=?", [id]);
    res.status(200).json({
      message: "Update task successfully",
      status: "success",
    });
  } catch (error) {
    res.json(error);
  }
});

app.delete("/todo/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.execute("DELETE FROM tasks where task_id=?", [id]);
    res.status(200).json({
      message: "Delete task successfully",
    });
  } catch (error) {
    res.json(error);
  }
});

app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`);
});
