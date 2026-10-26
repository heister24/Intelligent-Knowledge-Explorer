import express from "express";
import "dotenv/config";
import router from "./routes/auth.routes.js";
import connectDB from "./configs/connectDB.js";

const app = express();

const port = process.env.PORT || 8001;

connectDB();

app.use(express.json());

app.get("/health", (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: "Auth Service is working fine",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Auth health check failed",
      error: error.message,
    });
  }
});

app.use("/", router);

// 404 Not Found handler
app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled Auth Service Error:", err);
  return res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error in Auth service",
  });
});

app.listen(port, () => {
  console.log(`Auth running on PORT ${port}`);
});
