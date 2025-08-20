require("dotenv").config();
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const serverless = require("serverless-http");

const Chat = require("../models/chat");

const app = express();

// Views & Static
const VIEWS_PATH = path.join(__dirname, "..", "views");
const STATIC_PATH = path.join(__dirname, "..", "public");
app.set("views", VIEWS_PATH);
app.set("view engine", "ejs");
app.use(express.static(STATIC_PATH));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// MongoDB
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/KrishnaDatabase";
mongoose.connect(MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// Routes
app.get("/", (req, res) => res.redirect("/chats"));

app.get("/chats", async (req, res) => {
  try {
    const chats = await Chat.find().sort({ created_at: -1 });
    res.render("index", { chats });
  } catch (e) {
    res.status(500).send("Server Error");
  }
});

app.get("/chats/new", (req, res) => res.render("new"));

app.post("/chats", async (req, res) => {
  try {
    const { from, to, msg } = req.body;
    await new Chat({ from, to, msg, created_at: new Date() }).save();
    res.redirect("/chats");
  } catch {
    res.status(400).send("Bad Request");
  }
});

app.get("/chats/:id/edit", async (req, res) => {
  const chat = await Chat.findById(req.params.id);
  if (!chat) return res.status(404).send("Not Found");
  res.render("edit", { chat });
});

app.put("/chats/:id", async (req, res) => {
  await Chat.findByIdAndUpdate(req.params.id, { msg: req.body.msg });
  res.redirect("/chats");
});

app.delete("/chats/:id", async (req, res) => {
  await Chat.findByIdAndDelete(req.params.id);
  res.redirect("/chats");
});

// Local vs Vercel
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Local server listening on port ${PORT}`));
} else {
  module.exports = serverless(app);
}
