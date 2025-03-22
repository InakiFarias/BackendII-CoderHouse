import userModel from "../models/userModels.js"
import { createHash } from "../utils/bCrypt.js"

export const getUsers = async (req, res) => {
  try {
    const users = await userModel.find()
    res.status(200).send(users)
  } catch (err) {
    res.status(500).send(err)
  }
}

export const getUser = async (req, res) => {
  try {
    const { uid } = req.params
    const user = await userModel.findById(uid)
    if (user) {
      res.status(200).send(user)
    } else {
      res.status(404).send("Usuario no encontrado")
    }
  } catch (err) {
    res.status(500).send(err)
  }
}

export const createUser = async (req, res) => {
  try {
    const { first_name, last_name, email, password, age } = req.body
    if (
      first_name === undefined ||
      last_name === undefined ||
      email === undefined ||
      password === undefined ||
      age === undefined
    )
      res.status(400).send("Deben cargarse todos los datos")
    const message = await userModel.create({
      first_name,
      last_name,
      email,
      password: createHash(password),
      age,
    })
    res.status(200).send(message)
  } catch (err) {
    console.log(err)

    res.status(500).send(err)
  }
}

export const updateUser = async (req, res) => {
  try {
    const { uid } = req.params
    const { first_name, last_name, email, password, age } = req.body
    const user = await userModel.findById(uid)
    if (user) {
      await userModel.findByIdAndUpdate(uid, {
        first_name,
        last_name,
        email,
        password: createHash(password),
        age,
      })
      res.status(200).send("Usuario actualizado")
    } else {
      res.status(400).send("Usuario no encontrado")
    }
  } catch (err) {
    console.log(err)
    res.status(500).send(err)
  }
}

export const deleteUser = async (req, res) => {
  try {
    const { uid } = req.params
    const message = await userModel.findByIdAndDelete(uid)
    if (message) {
      res.status(200).send("Usuario eliminado")
    } else {
      res.status(404).send("Usuario no encontrado")
    }
  } catch (err) {
    res.status(500).send(err)
  }
}
