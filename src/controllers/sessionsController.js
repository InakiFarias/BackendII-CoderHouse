import generateToken from "../utils/jwt.js";

export const register = async (req, res) => {
  try {
    console.log(req.user);
    if (!req.user)
      return res.status(400).send("Deben cargarse todos los campos");
    res.status(201).send(`Usuario registrado correctamente: ${req.user._id}`);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

export const login = async (req, res) => {
  try {
    if (!req.user)
      return res.status(400).send("Usuario o contrasena no validos");
    req.session.user = {
      email: req.user.email,
      first_name: req.user.first_name,
    };
    res
      .status(200)
      .cookie("coderSession", generateToken(req.user), {
        httpOnly: true,
        secure: false,
        magAxe: 86400000,
      })
      .send("Usuario logueado correctamente");
  } catch (err) {
    res.status(500).send(err);
  }
};

export const githubLogin = (req, res) => {
  try {
    req.session.user = {
      email: req.user.email,
      first_name: req.user.first_name,
    };
    res
      .status(200)
      .cookie("coderSession", generateToken(req.user), {
        httpOnly: true,
        secure: false,
        magAxe: 86400000,
      })
      .send("Usuario logueado correctamente");
  } catch (err) {
    res.status(500).send(err);
  }
};
