import generateToken from "../utils/jwt.js"

export const register = async (req, res) => {
  try {
    console.log(req.user)
    if (!req.user)
      return res.status(400).send("Deben cargarse todos los campos")
    res.status(201).json({ message: "Usuario Creado Correctamente" })
  } catch (err) {
    console.log(err)
    res.status(500).send(err)
  }
}

export const login = async (req, res) => {
  try {
    if (!req.user)
      return res.status(400).send("Usuario o contrasena no validos")
    req.session.user = {
      email: req.user.email,
      first_name: req.user.first_name,
    }
    res.status(200).cookie("coderSession", generateToken(req.user), {
        httpOnly: true,
        secure: false,
        magAxe: 86400000,
      })
      .json({ message: "Usuario Logueado correctamente"})
  } catch (err) {
    res.status(500).send(err)
  }
}

export const githubLogin = (req, res) => {
  try {
    req.session.user = {
      email: req.user.email,
      first_name: req.user.first_name,
    }
    res
      .status(200)
      .cookie("coderSession", generateToken(req.user), {
        httpOnly: true,
        secure: false,
        magAxe: 86400000,
      })
      .send("Usuario logueado correctamente")
  } catch (err) {
    res.status(500).send(err)
  }
}

export const viewRegister = (req, res) => {
  res.status(200).render('templates/register', {
      title: "Registro de Usuario",
      url_js: "/js/register.js",
      url_css: "/css/main.css"
  })
}

export const viewLogin = (req,res) => {
  res.status(200).render('templates/login', {
      title: "Inicio de Sesion de Usuario",
      url_js: "/js/login.js",
      url_css: "/css/main.css"
  })
}
