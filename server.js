require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const compression = require("compression");
const rateLimit = require("express-rate-limit");

const apiRoutes = require("./routes/api");

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;
app.set("trust proxy", 1);

// --- Middleware ---
app.use(compression()); // gzip all responses — smaller payload, faster paint
app.use(express.json());
app.use(
  express.static(path.join(__dirname, "public"), {
    // Cache static assets (css/js/images/fonts) aggressively on repeat visits.
    // index.html is excluded so page updates always show immediately.
    maxAge: "1d",
    etag: true,
    setHeaders: (res, filePath) => {
      if (filePath.endsWith("index.html")) {
        res.setHeader("Cache-Control", "no-cache");
      }
    },
  })
);

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

// --- Start server immediately; connect to MongoDB in parallel ---
// The homepage and static assets don't need the DB at all, so we no longer
// block app.listen() on mongoose.connect(). Mongoose queues any DB queries
// that arrive before the connection is ready (bufferCommands defaults to
// true), so /api routes still work correctly — they just wait briefly on
// the very first request after a cold start instead of the whole page
// waiting on it.
function connectDB() {
  if (!MONGODB_URI) {
    console.error("MONGODB_URI is missing from .env — see .env.example");
    return;
  }
  mongoose
    .connect(MONGODB_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => {
      console.error("Failed to connect to MongoDB:", error.message);
      // Retry once after a short delay instead of crashing the whole server.
      setTimeout(connectDB, 5000);
    });
}

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
connectDB();
