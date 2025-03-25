import express from "express"
import mongoose from "mongoose"
import path from "path"
import cookieParser from "cookie-parser"
import session from "express-session"
import MongoStore from "connect-mongo"
import passport from "passport"
import { create } from "express-handlebars"
import indexRouter from "./routes/indexRoutes.js"
import inicializatePassport from "./config/passport.js"
import __dirname from "./path.js"
import dotenv from "dotenv"
dotenv.config()

const app = express()
const PORT = 8080
const hbs = create()

app.use(express.json())
app.use(cookieParser(process.env.SECRET_COOKIE))
app.use(session({
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL,
      ttl: 86400,
    }),
    secret: process.env.SECRET_SESSION,
    resave: true,
    saveUninitialized: true,
  })
)

mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("DB is connected"))
.catch((err) => console.error("Error connecting to DB:", err))

inicializatePassport()
app.use(passport.initialize())
app.use(passport.session())

app.engine("handlebars", hbs.engine)
app.set("view engine", "handlebars")
app.set("views", path.join(__dirname, "views"))
app.use(express.static(path.join(__dirname, "public")))

app.use("", indexRouter)

app.listen(PORT, (req, res) => {
  console.log("Server ON 8080")
})
