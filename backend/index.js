import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import router from "./Routes/ProductRoute.js";

const app = express();

app.use(
  cors({
    exposedHeaders: ["X-Total-Count"],
  })
);

app.use(express.json());
app.use("/products", router);

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/ecommerce");
  console.log("database connected");
}

app.listen(8080, () => {
  console.log("server started.");
});