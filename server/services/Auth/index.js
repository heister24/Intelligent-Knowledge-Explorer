import express from "express";
import "dotenv/config";

const app = express();

const port = process.env.PORT || 8001;

app.get("/health", (req, res) => {
  res.send("Auth Service is Working Fine");
});

app.listen(port, () => {
  console.log(`Auth running on PORT ${port}`);
});
