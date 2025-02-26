import { Router } from "express";
import passport from "passport";
import { register, login, githubLogin } from "../controllers/sessionsController.js";

const sessionsRouter = Router()

sessionsRouter.post("/register", passport.authenticate("register"), register)
sessionsRouter.post("/login", passport.authenticate("login"), login)
sessionsRouter.get("/github", passport.authenticate("github", {scope: ['user:email']}), async (req, res) => {})
sessionsRouter.get("/githubcallback", passport.authenticate("github", {failureRedirect: "/api/sessions/login"}), githubLogin)


export default sessionsRouter