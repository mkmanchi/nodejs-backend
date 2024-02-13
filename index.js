const express = require("express");
var bodyParser = require("body-parser");
const fakerdata = require("./fakerdata");
const { readFileSync, writeFileSync } = require("fs");
const app = express();
const port = 5001;

const path = "./data.json";

// get all todos by username

app.get("/mytodos", (req, res) => {
  if (!req.query.user)
    return res
      .status(404)
      .json({ status: 404, msg: "Query parameter not found" });

  let respData = [];

  try {
    respData = JSON.parse(readFileSync(path));
  } catch (err) {
    writeFileSync(path, JSON.stringify(fakerdata()), (error) => {
      if (error) {
        console.log("An error has occurred ", error);
        return;
      }
    });
    respData = JSON.parse(readFileSync(path));
  }
  return res
    .status(200)
    .json(
      respData.todos.filter((data) =>
        data.username.toLowerCase().includes(req.query.user.toLowerCase()),
      ),
    );
});

// add new todo item

app.post("/mytodos/:id", bodyParser.json(), (req, res) => {
  respData = JSON.parse(readFileSync(path));

  respData.todos.map((data) => {
    if (data.username.toLowerCase().includes(req.params.id.toLowerCase())) {
      data.todos.push(req.body);
    }
  });
  writeFileSync(path, JSON.stringify(respData), (error) => {
    if (error) {
      console.log("An error has occurred ", error);
      return;
    }
  });
  return res
    .status(200)
    .json(
      respData.todos.filter((data) =>
        data.username.toLowerCase().includes(req.params.id.toLowerCase()),
      ),
    );
});

// update existing todo item

app.patch("/mytodos/:username/:todo/status", (req, res) => {
  const jsonData = JSON.parse(readFileSync(path));

  jsonData.todos.map((data) => {
    if (
      data.username.toLowerCase().includes(req.params.username.toLowerCase())
    ) {
      data.todos.map((item) => {
        if (item.name === req.params.todo) {
          item.status = "1";
        }
      });
    }
  });
  writeFileSync(path, JSON.stringify(jsonData), (error) => {
    if (error) {
      console.log("An error has occurred ", error);
      return;
    }
  });
  return res
    .status(200)
    .json(
      jsonData.todos.filter((data) =>
        data.username.toLowerCase().includes(req.params.username.toLowerCase()),
      ),
    );
});

// delete existing todo item
app.delete("/mytodos/:username/:todo", (req, res) => {
  const jsonData = JSON.parse(readFileSync(path));

  jsonData.todos.map((data) => {
    if (
      data.username.toLowerCase().includes(req.params.username.toLowerCase())
    ) {
      data.todos = data.todos.filter((e) => e.name != req.params.todo);
    }
  });
  writeFileSync(path, JSON.stringify(jsonData), (error) => {
    if (error) {
      console.log("An error has occurred ", error);
      return;
    }
  });
  return res
    .status(200)
    .json(
      jsonData.todos.filter((data) =>
        data.username.toLowerCase().includes(req.params.username.toLowerCase()),
      ),
    );
});

app.listen(port, () => {
  console.log(`Server started on PORT ${port}`);
});
