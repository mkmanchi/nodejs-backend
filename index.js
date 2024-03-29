const express = require("express");
var bodyParser = require("body-parser");
const fakerdata = require("./fakerdata");
const { readFileSync, writeFileSync } = require("fs");
const app = express();
const port = 5001;

const path = "./data.json";

writeJsonToFile = function (json) {
  writeFileSync(path, JSON.stringify(json), (error) => {
    if (error) {
      console.log("An error has occurred ", error);
      return;
    }
  });
};

// get all todos by username

app.get("/api/mytodos", (req, res) => {
  if (!req.query.user)
    return res
      .status(404)
      .json({ status: 404, msg: "Query parameter not found" });

  let respData = [];

  try {
    respData = JSON.parse(readFileSync(path));
  } catch (err) {
    writeJsonToFile(respData);
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

app.post("/api/mytodos/:id", bodyParser.json(), (req, res) => {
  respData = JSON.parse(readFileSync(path));

  respData.todos.map((data) => {
    if (data.username.toLowerCase().includes(req.params.id.toLowerCase())) {
      data.todos.push(req.body);
    }
  });
  writeJsonToFile(respData);
  return res
    .status(200)
    .json(
      respData.todos.filter((data) =>
        data.username.toLowerCase().includes(req.params.id.toLowerCase()),
      ),
    );
});

// update existing todo item

app.patch("/api/mytodos/:username/:todo/status", bodyParser.json(), (req, res) => {
  const jsonData = JSON.parse(readFileSync(path));

  jsonData.todos.map((data) => {
    if (
      data.username.toLowerCase().includes(req.params.username.toLowerCase())
    ) {
      data.todos.map((item) => {
        if (item.name === req.params.todo) {
          item.status = req.body.status;
        }
      });
    }
  });
  
  writeJsonToFile(jsonData);
  return res
    .status(200)
    .json(
      jsonData.todos.filter((data) =>
        data.username.toLowerCase().includes(req.params.username.toLowerCase()),
      ),
    );
});

// delete existing todo item
app.delete("/api/mytodos/:username/:todo", (req, res) => {
  const jsonData = JSON.parse(readFileSync(path));

  jsonData.todos.map((data) => {
    if (
      data.username.toLowerCase().includes(req.params.username.toLowerCase())
    ) {
      data.todos = data.todos.filter((e) => e.name != req.params.todo);
    }
  });
  writeJsonToFile(jsonData);
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
