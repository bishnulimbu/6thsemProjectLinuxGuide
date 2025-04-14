const express = require("express");
const sequelize = require("./config/database");
const cors = require("cors");
const { Server } = require("ws");
const Docker = require("dockerode");
const fs = require("fs");
const path = require("path");
const docker = new Docker();
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/posts");
const guideRoutes = require("./routes/guides");
const commentRoutes = require("./routes/comments");
const contactRoutes = require("./routes/contact");
const searchRoutes = require("./routes/search");
require("dotenv").config();

const logDir = path.join(__dirname, "logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}
const logFile = path.join(logDir, "terminal-commands.log");
const app = express();
const PORT = process.env.PORT || 8000;
const server = require("http").createServer(app);
const wss = new Server({ server });

// Middleware
app.use(express.json());
app.use(cors());

app.use("/auth", authRoutes);
app.use("/posts", postRoutes);
app.use("/guides", guideRoutes);
app.use("/comments", commentRoutes);
app.use("/contact", contactRoutes);
app.use("/search", searchRoutes);

wss.on("connection", async (ws) => {
  console.log("New WebSocket connection");

  let container;
  try {
    const images = await docker.listImages({
      filters: { reference: ["linux-sandbox"] },
    });
    if (images.length === 0) {
      console.error("Docker image 'linux-sandbox' not found");
      ws.send(
        "Error: Docker image 'linux-sandbox' not found. Please build the image.\r\n",
      );
      ws.close();
      return;
    }

    container = await docker.createContainer({
      Image: "linux-sandbox",
      Tty: true,
      OpenStdin: true,
      StdinOnce: false,
      HostConfig: {
        Memory: 128 * 1024 * 1024, // Limit to 128MB of RAM
        CpuPeriod: 100000,
        CpuQuota: 50000, // Limit CPU usage
        AutoRemove: true, // Remove container when it exits
      },
    });
    await container.start();
    console.log("Container started:", container.id);
    const stream = await container.attach({
      stream: true,
      stdin: true,
      stdout: true,
      stderr: true,
    });
    let timeout;
    const resetTimeout = () => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(
        async () => {
          ws.send("Session timed out due to inactivity.\r\n");
          ws.close();
        },
        5 * 60 * 1000,
      ); // 5 mins
    };
    resetTimeout();

    ws.on("message", (message) => {
      const command = message.toString().trim();
      if (command) {
        const logEntry = `${new Date().toISOString()} - Command: ${command}\n`;
        fs.appendFileSync(logFile, logEntry);

        stream.write(command + "\n");
        resetTimeout();
      }
    });
    stream.on("data", (data) => {
      ws.send(data.toString());
    });
    ws.on("close", async () => {
      try {
        await container.stop();
        await container.remove();
      } catch (err) {
        console.error("Error clearing up containers", err);
      }
      if (timeout) clearTimeout(timeout);
    });

    stream.on("error", (err) => {
      console.error("Stream error:", err.message);
      ws.send(`Error: ${err.message}\r\n`);
      ws.close();
    });
  } catch (err) {
    console.error("Error starting container:", err.message);
    ws.send(`Error: Failed to start container - ${err.message}\r\n`);
    ws.close();
  }
});

(async () => {
  try {
    console.log("Attempting to connect to database...");
    await sequelize.authenticate();
    console.log("Database connected");
    await sequelize.sync();
    console.log("Models synced");
  } catch (error) {
    console.error("Database connection error:", error);
  }
})();

// Start the server
server
  .listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://localhost:${PORT}`);
  })
  .on("error", (err) => {
    console.error(`Failed to start server: ${err.message}`);
    process.exit(1);
  });

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("Shutting down server...");
  wss.close();
  server.close();
  await sequelize.close();
  process.exit(0);
});

app.get("/", (req, res) => {
  res.send("Server is running!");
});
