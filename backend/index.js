import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import Productrouter from "./Routes/ProductRoute.js";
import Brandrouter from "./Routes/BrandRoute.js";
import Categoryrouter from "./Routes/CategoryRoute.js";
import UserRouter from "./Routes/UserRoutes.js";
import AuthRouter from "./Routes/AuthRoutes.js";
import CartRouter from "./Routes/CartRoutes.js";
import OrderRouter from "./Routes/OrderRoute.js";

const app = express();

app.use(
  cors({
    exposedHeaders: ["X-Total-Count"],
  })
);

app.use(express.json());
app.use('/users',UserRouter);
app.use('/auth',AuthRouter);
app.use("/products", Productrouter);
app.use("/brands", Brandrouter);
app.use("/categories", Categoryrouter);
app.use("/cart",CartRouter)
app.use("/orders",OrderRouter)

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/ecommerce");
  console.log("database connected");
}

app.listen(8080, () => {
  console.log("server started.");
});
