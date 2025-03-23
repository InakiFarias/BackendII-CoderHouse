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

app.use("", indexRouter)

mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("DB is connected"))
.catch((err) => console.error("Error connecting to DB:", err))

inicializatePassport()
app.use(passport.initialize())
app.use(passport.session())

app.listen(PORT, (req, res) => {
  console.log("Server ON 8080")
})
