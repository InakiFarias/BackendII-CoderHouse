import { Router } from "express";
import usersRouter from "./usersRoutes.js";
import sessionsRouter from "./sessionsRoutes.js"; 
import cartsRouter from "./cartsRoutes.js";

const indexRouter = Router()

indexRouter.use("/users", usersRouter)
indexRouter.use("/sessions", sessionsRouter)
indexRouter.use("/carts", cartsRouter)

export default indexRouter