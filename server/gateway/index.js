import express from "express";
import "dotenv/config";
import proxy from "express-http-proxy";
import cors from "cors";
import authMiddleware from "./middleware/authMiddleware.js";
import { getMe } from "./controller/user.controller.js";
import cookieParser from "cookie-parser";

const app = express();

const port = process.env.PORT || 8000;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

app.get("/api/health", (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: "Gateway is working fine",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Gateway health check failed",
      error: error.message,
    });
  }
});

app.use("/api/auth", proxy(process.env.AUTH_URL));
app.get("/api/getMe", authMiddleware, getMe);

// 404 Not Found handler
app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled Gateway Error:", err);
  return res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error in Gateway",
  });
});

app.listen(port, () => {
  console.log(`Gateway is running on PORT:${port}`);
});
