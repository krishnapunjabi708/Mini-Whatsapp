require('dotenv').config();
const path = require("path");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const Chat = require("./models/chat.js");

// Views and static files are located one level up from /api
const VIEWS_PATH = path.join(__dirname, "..", "views");
const STATIC_PATH = path.join(__dirname, "..", "public");
app.set("views", VIEWS_PATH);
app.set("view engine", "ejs");
app.use(express.static(STATIC_PATH));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/Whatsapp";
mongoose.connect(MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// Models
const Chat = require("../models/chat");

// Routes
app.get("/", (req, res) => {
  return res.redirect("/chats");
});

app.get("/chats", async (req, res) => {
  try {
    const chats = await Chat.find().sort({ created_at: -1 });
    res.render("index", { chats });
  } catch (e) {
    console.error(e);
    res.status(500).send("Server Error");
  }
});

app.get("/chats/new", (req, res) => {
  res.render("new");
});

app.post("/chats", async (req, res) => {
  try {
    const { from, to, msg } = req.body;
    const chat = new Chat({ from, to, msg, created_at: new Date() });
    await chat.save();
    res.redirect("/chats");
  } catch (e) {
    console.error(e);
    res.status(400).send("Bad Request");
  }
});

app.get("/chats/:id/edit", async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);
    if (!chat) return res.status(404).send("Not Found");
    res.render("edit", { chat });
  } catch (e) {
    console.error(e);
    res.status(500).send("Server Error");
  }
});

app.put("/chats/:id", async (req, res) => {
  try {
    const { msg } = req.body;
    await Chat.findByIdAndUpdate(req.params.id, { msg });
    res.redirect("/chats");
  } catch (e) {
    console.error(e);
    res.status(400).send("Bad Request");
  }
});

app.delete("/chats/:id", async (req, res) => {
  try {
    await Chat.findByIdAndDelete(req.params.id);
    res.redirect("/chats");
  } catch (e) {
    console.error(e);
    res.status(500).send("Server Error");
  }
});

// Export as serverless function handler for Vercel
const serverless = require("serverless-http");

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Local server listening on port ${PORT}`));
} else {
  module.exports = serverless(app);
}

