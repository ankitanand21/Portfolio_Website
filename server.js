require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const rateLimit = require("express-rate-limit");

const apiRoutes = require("./routes/api");

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

// --- Middleware ---
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Basic rate limiting on the contact endpoint to prevent spam.
const writeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 submissions per IP per window
  message: { error: "Too many submissions — please try again later." },
});
app.use("/api/contact", writeLimiter);

// --- Routes ---
app.use("/api", apiRoutes);

// Fallback: serve index.html for any non-API route (simple single-page setup).
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// --- Start server after DB connects ---
async function start() {
  if (!MONGODB_URI) {
    console.error("MONGODB_URI is missing from .env — see .env.example");
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error.message);
    process.exit(1);
  }
}

start();
