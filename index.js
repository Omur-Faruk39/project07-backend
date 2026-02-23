const express = require("express");
const usersRouter = require("./src/routes/user.routes.js");
const env = require("./src/config/env.js");
const helmet = require("helmet");
// const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});

const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(helmet());
app.use(limiter);
// app.use(xss());

app.use("/api/user", usersRouter);

app.use((req, res) => {
  res.status(404).json({ status: "not ok", message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

const PORT = env.APP_PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
