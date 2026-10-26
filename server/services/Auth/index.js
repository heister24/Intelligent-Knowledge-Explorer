import express from "express";
import "dotenv/config";
import router from "./routes/auth.routes.js";
import connectDB from "./configs/connectDB.js";

const app = express();

const port = process.env.PORT || 8001;

connectDB();

app.use(express.json());

app.get("/health", (req, res) => {
  res.send("Auth Service is Working Fine");
});

app.use("/", router);

app.listen(port, () => {
  console.log(`Auth running on PORT ${port}`);
});
