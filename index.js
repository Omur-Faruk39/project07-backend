const express = require("express");
const http = require("http");
const cors = require("cors");
const usersRouter = require("./src/routes/user.routes.js");
const env = require("./src/config/env.js");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { initSocket } = require("./src/config/websocket.js");

const app = express();
const server = http.createServer(app);

initSocket(server);

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});

app.use(express.json({ limit: "10mb" }));
app.use(helmet());
app.use(limiter);
app.use(
  cors({
    origin: "*", // Allow all origins (good for development)
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // If you need cookies/auth later
  }),
);

app.use("/api/user", usersRouter);

app.use((req, res) => {
  res.status(404).json({ status: false, message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ status: false, message: "Something went wrong!" });
});

const PORT = env.APP_PORT;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
