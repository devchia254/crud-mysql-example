const path = require("path");
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mysql = require("mysql");

const app = express();

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "node_crud"
});

connection.connect(err => {
  if (!err) {
    console.log("Database node_crud is connected");
  } else {
    console.log(err);
  }
});

// set views file
app.set("views", path.join(__dirname, "views"));

// set view engine
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  // res.send("CRUD Operation using NodeJS, ExpressJS, MySQL");
  let sql = "SELECT * FROM users";

  let query = connection.query(sql, (err, rows) => {
    if (err) throw err;
    res.render("user_index", {
      title: "CRUD operations using NodeJs / ExpresJS / MySQL",
      users: rows
    });
    // console.log("Rows: ", rows);
  });
});

app.get("/add", (req, res) => {
  res.render("user_add", {
    title: "CRUD operations using NodeJs / ExpresJS / MySQL - Add User"
  });
});

app.post("/save", (req, res) => {
  // 'req.body' fetches the 'name' attr from the input tag
  let data = {
    name: req.body.name,
    email: req.body.email,
    phone_no: req.body.phone_no
  };
  let sql = "INSERT INTO users SET ?";
  let query = connection.query(sql, data, (err, results) => {
    if (err) throw err;
    res.redirect("/");
  });
});

app.get("/edit/:userId", (req, res) => {
  const userId = req.params.userId;

  let sql = `SELECT * FROM users WHERE id = ${userId}`;

  // 'result' gets the array and 'result[0]' get the object from that array and shows the values on the form
  let query = connection.query(sql, (err, result) => {
    if (err) throw err;
    res.render("user_edit", {
      title: "CRUD operations using NodeJs / ExpresJS / MySQL",
      user: result[0]
    });
  });
});

app.post("/update", (req, res) => {
  const userId = req.body.id;

  let sql = `UPDATE users SET name = '${req.body.name}', email = '${req.body.email}', phone_no = '${req.body.phone_no}' WHERE id = '${userId}'`;

  let query = connection.query(sql, (err, results) => {
    if (err) throw err;
    res.redirect("/");
    // console.log(sql);
  });
});

app.get("/delete/:userId", (req, res) => {
  const userId = req.params.userId;

  let sql = `DELETE FROM users WHERE id = ${userId}`;

  let query = connection.query(sql, (err, result) => {
    if (err) throw err;
    res.redirect("/");
  });
});

//Server Listening
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
