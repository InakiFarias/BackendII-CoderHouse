import { Router } from "express";
import {
  getCart,
  insertProductCart,
  deleteProductCart,
  deleteCart,
} from "../controllers/cartsControllers.js";

const cartsRouter = Router();

cartsRouter.get("/:cid", getCart);
cartsRouter.post("/:cid/products/:pid", insertProductCart);
cartsRouter.delete("/:cid/products/:pid", deleteProductCart);
cartsRouter.delete("/:cid", deleteCart);

export default cartsRouter;
