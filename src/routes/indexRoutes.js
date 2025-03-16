import { Router } from "express"
import usersRouter from "./usersRoutes.js"
import sessionsRouter from "./sessionsRoutes.js"
import cartsRouter from "./cartsRoutes.js"
import productsRouter from "./productsRoutes.js"

const indexRouter = Router()

indexRouter.use("/api/users", usersRouter)
indexRouter.use("/api/sessions", sessionsRouter)
indexRouter.use("/api/carts", cartsRouter)
indexRouter.use("/api/products", productsRouter)

indexRouter.use("*", (req, res) => res.status(404).send("Pagina no encontrada"))

export default indexRouter
