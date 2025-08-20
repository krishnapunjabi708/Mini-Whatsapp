const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const Chat = require("./models/chat");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// View Engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// MongoDB Connection
async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ MongoDB connected");
}
main().catch((err) => console.log("❌ MongoDB Error:", err));

// Routes
app.get("/", (req, res) => {
  res.send("Mini Whatsapp Home");
});

// Show all chats
app.get("/chats", async (req, res) => {
  const chats = await Chat.find({});
  res.render("chats", { chats });
});

// Add a new chat
app.post("/chats", async (req, res) => {
  const { from, to, msg } = req.body;
  await Chat.create({ from, to, msg });
  res.redirect("/chats");
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
