import express from "express";
import "dotenv/config";
import proxy from "express-http-proxy";
import cors from "cors";

const app = express();

const port = process.env.PORT || 8000;

app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

app.get("/api/health", (req, res) => {
  res.send("Gateway is working fine");
});

app.use("/api/auth", proxy(process.env.AUTH_URL));

app.listen(port, () => {
  console.log(`Gateway is running on PORT:${port}`);
});
