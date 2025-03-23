import { Router } from "express"
import { getCart, insertProductCart, deleteProductCart, deleteCart, checkout } from "../controllers/cartsControllers.js"
import passport from "passport"
import { authorization } from "../config/middlewares.js"

const cartsRouter = Router()

cartsRouter.get("/:cid", passport.authenticate("jwt"), authorization("User"), getCart)
cartsRouter.post("/:cid/products/:pid", passport.authenticate("jwt"), authorization("User"), insertProductCart)
cartsRouter.delete("/:cid/products/:pid", passport.authenticate("jwt"), authorization("User"), deleteProductCart)
cartsRouter.delete("/:cid", passport.authenticate("jwt"), authorization("User"), deleteCart)
cartsRouter.post("/:cid/checkout", passport.authenticate("jwt"), authorization("User"), checkout)

export default cartsRouter
