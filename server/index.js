require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

// Create express app
const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(cors());

// CORS configuration
const corsOptions = {
  origin: "*",
};

app.use(cors(corsOptions));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_DB)
  .then(() => console.log("Successfully connected to MongoDB"))
  .catch((err) => console.error("Connection error", err));

// API Routes
app.get("/", (req, res) => {
  res.send("Express App is running");
});

// Load routes
const taskRoute = require("./Routes/taskRoute");
const userRoute = require("./Routes/userRoute");

// Use routes
app.use("/task", taskRoute);
app.use("/user", userRoute);

// Start the server
app.listen(port, (err) => {
  if (err) {
    console.error("Error starting the server:", err);
  }
  console.log(`Server running on Port ${port}`);
});
