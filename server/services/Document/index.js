import express from "express";
import "dotenv/config";
import connectDB from "./configs/connectDB.js";
import router from "./routes/document.router.js";

const app = express();

const port = process.env.PORT || 8002;

app.use(express.json());

connectDB();

app.get("/health", (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: "Document Service is working fine",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Document health check failed",
      error: error.message,
    });
  }
});

app.use("/", router);

// Error handling middleware (catches multer errors, validation errors, etc.)
app.use((err, req, res, next) => {
  console.error("Document Service Error:", err.message);

  if (err.name === "MulterError") {
    return res.status(400).json({
      success: false,
      message: `File upload error: ${err.message}`,
    });
  }

  return res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error in Document Service",
  });
});

app.listen(port, () => {
  console.log(`Document Service Running on Port:${port}`);
});
