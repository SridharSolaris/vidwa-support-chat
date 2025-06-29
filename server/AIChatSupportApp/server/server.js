require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const chatRoutes = require("./routes/chat");
const uploadRoutes = require("./routes/upload");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/chat", chatRoutes);
app.use("/api/upload", uploadRoutes);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
  });
