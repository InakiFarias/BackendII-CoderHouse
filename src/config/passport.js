import passport from "passport"
import local from "passport-local"
import GithubStrategy from "passport-github"
import jwt from "passport-jwt"
import userModel from "../models/userModels.js"
import { createHash, validatePassword } from "../utils/bCrypt.js"

const localStrategy = local.Strategy
const JWTStrategy = jwt.Strategy
const ExcratctJWT = jwt.ExtractJwt

const cookieExcractor = (req) => {
  let token = null
  if (req.cookies) {
    token = req.cookies["coderSession"]
  }
  return token
}

const inicializatePassport = () => {
  passport.use(
    "register",
    new localStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        try {
          const { first_name, last_name, email, password, age } = req.body
          if (
            first_name === undefined ||
            last_name === undefined ||
            email === undefined ||
            password === undefined ||
            age === undefined
          )
            return done(null, false)
          const user = await userModel.create({
            first_name,
            last_name,
            email,
            password: createHash(password),
            age,
          })
          return done(null, user)
        } catch (err) {
          return done(err)
        }
      }
    )
  )

  passport.use(
    "login",
    new localStrategy(
      { usernameField: "email" },
      async (username, password, done) => {
        try {
          const user = await userModel.findOne({ email: username })
          if (user && validatePassword(password, user.password)) {
            done(null, user)
          } else {
            return done(null, false)
          }
        } catch (err) {
          return done(err)
        }
      }
    )
  )

  passport.use(
    "github",
    new GithubStrategy(
      {
        clientID: "Iv23lieD28mgxxeiIpZB",
        clientSecret: process.env.GITHUB_SECRET,
        callbackURL: "http://localhost:8080/api/sessions/githubcallback",
      },
      async (accesToken, refreshToken, profile, done) => {
        try {
          const user = await userModel.findOne({ email: profile._json.email })
          if (!user) {
            const newUser = await userModel.create({
              first_name: profile._json.name,
              last_name: " ",
              email: profile._json.email,
              password: createHash("coder"),
              age: 18,
            })
            done(null, newUser)
          } else {
            done(null, user)
          }
        } catch (e) {
          done(e)
        }
      }
    )
  )

  passport.use(
    "jwt",
    new JWTStrategy(
      {
        jwtFromRequest: ExcratctJWT.fromExtractors([cookieExcractor]),
        secretOrKey: "coder",
      },
      (jwt_payload, done) => {
        try {
          return done(null, jwt_payload)
        } catch (e) {
          return done(e)
        }
      }
    )
  )

  passport.serializeUser((user, done) => {
    done(null, user?._id)
  })

  passport.deserializeUser(async (id, done) => {
    const user = await userModel.findById(id)
    done(null, user)
  })
}

export default inicializatePassport
