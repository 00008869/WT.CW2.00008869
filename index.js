const path = require("path");
const fs = require('fs');
const port = 8000

const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const employees = require("./routes/employees");
const getCollection = require("./public/javascripts/utils").getCollection;

const db = "./database/employees.json"

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set("view engine", "pug");

app.use("/", employees);

app.get("/", (req, res) => {
  res.render("index", { title: "Employees", message: "Application for employees managment" });
});

app.get("/api/v1/employees", (req, res) => {
	fs.readFile(db, (err, data) => {
		const employees = JSON.parse(data)
		res.json(employees)
	})
})

const listener = app.listen(port, () => {
  console.log(`App is running on port  http://localhost:${port}`);
});