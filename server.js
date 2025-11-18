const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(cors());

const usersFile = path.join(__dirname, "data", "users.json");
const bookingsFile = path.join(__dirname, "data", "bookings.json");

if (!fs.existsSync("data")) fs.mkdirSync("data");
if (!fs.existsSync(usersFile)) fs.writeFileSync(usersFile, "[]");
if (!fs.existsSync(bookingsFile)) fs.writeFileSync(bookingsFile, "[]");

function readJSON(file) {
  const data = fs.readFileSync(file, "utf-8");
  return data.trim() ? JSON.parse(data) : [];
}

function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

app.post("/register", (req, res) => {
  const { username, password } = req.body;
  const users = readJSON(usersFile);
  if (users.find(u => u.username === username)) {
    return res.json({ success: false, message: "User already exists" });
  }
  users.push({ username, password });
  writeJSON(usersFile, users);
  res.json({ success: true });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const users = readJSON(usersFile);
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.json({ success: false, message: "Invalid credentials" });
  res.json({ success: true });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/book", (req, res) => {
  const booking = req.body;
  const bookings = readJSON(bookingsFile);
  bookings.push(booking);
  writeJSON(bookingsFile, bookings);
  res.json({ success: true });
});

app.get("/bookings", (req, res) => {
  const bookings = readJSON(bookingsFile);
  res.json(bookings);
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
