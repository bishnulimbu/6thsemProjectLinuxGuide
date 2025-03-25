const express = require("express");
const app = express();
const sequelize = require("./config/database");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/posts");
const guideRoutes = require("./routes/guides");
require("dotenv").config();

const PORT = process.env.PORT;

app.use(express.json());
app.use(cors());

app.use("/auth", authRoutes);
app.use("/posts", postRoutes);
app.use("/guides", guideRoutes);

(async () => {
  try {
    console.log("Attempting to connect to database...");
    await sequelize.authenticate();
    console.log("Database connected");
    await sequelize.sync({ alter: true });
    console.log("Models synced");
  } catch (error) {
    console.error("Database connection error:", error);
  }
})();

app.listen(PORT, () => {
  console.log(`server running at http://localhost:${PORT}`);
});
app.get("/", (req, res) => {
  res.send("Server is running!");
});
