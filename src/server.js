import express from "express"
import mongoose from "mongoose"
import cookieParser from "cookie-parser"
import session from "express-session"
import MongoStore from "connect-mongo"
import passport from "passport"
import indexRouter from "./routes/indexRoutes.js"
import inicializatePassport from "./config/passport.js"
import dotenv from "dotenv"
dotenv.config()

const app = express()
const PORT = 8080

app.use(express.json())
app.use(cookieParser("coder"))
app.use(session({
    store: MongoStore.create({
      mongoUrl: process.env.DB_CONNECTION,
      ttl: 86400,
    }),
    secret: "coder",
    resave: true,
    saveUninitialized: true,
  })
)

app.use("", indexRouter)

mongoose
  .connect(process.env.DB_CONNECTION)
  .then(() => console.log("DB is connected"))
  .catch((err) => console.error("Error connecting to DB:", err))

inicializatePassport()
app.use(passport.initialize())
app.use(passport.session())

app.listen(PORT, (req, res) => {
  console.log("Server ON 8080")
})
