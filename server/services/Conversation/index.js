import express from "express";
import "dotenv/config";
import connectDB from "./configs/connectDB.js";
import router from "./routes/conversation.routes.js";

const app = express();

const port = process.env.PORT || 8003;

connectDB();

app.use(express.json());

app.get("/health", (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: "Conversation is working fine",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Conversation health check failed",
      error: error.message,
    });
  }
});

app.use("/", router);

app.listen(port, () => {
  console.log(`Conversation Server Running on PORT : ${port}`);
});
