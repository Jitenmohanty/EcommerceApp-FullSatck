import { Router } from "express";
import {
  createProduct,
  fetchAllProducts,
  fetchProductById,
  updateProduct,
} from "../Controllers/Product.js";
import { Product } from "../Models/Product.js";

const Productrouter = Router();

Productrouter.post("/", createProduct)
  .get("/", fetchAllProducts)
  .get("/:id", fetchProductById)
  .patch("/:id", updateProduct)
//   .get("/update/test", async (req, res) => {
//     // For adding discountPrice to existing data : delete this code after use
//     const products = await Product.find({});
//     for (let product of products) {
//       product.discountPrice = Math.round(
//         product.price * (1 - product.discountPercentage / 100)
//       );
//       await product.save();
//       console.log(product.title + " updated");
//     }
//     res.send("ok");
//   });

export default Productrouter;
