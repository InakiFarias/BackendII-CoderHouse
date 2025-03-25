import cartModel from "../models/cartModels.js"
import productModel from "../models/productModels.js"
import ticketModel from "../models/ticketModels.js"

export const getCart = async (req, res) => {
  try {
    const cartId = req.params.cid
    const cart = await cartModel.findOne({ _id: cartId })
    if (cart) res.status(200).send(cart)
    else res.status(404).send("Carrito no encontrado")
  } catch (e) {
    res.status(500).send(e)
  }
}

export const insertProductCart = async (req, res) => {
  try {
    const cartId = req.params.cid
    const prodId = req.params.pid
    const quantity = req.body
    const cart = await cartModel.findOne({ _id: cartId })
    if (cart) {
      const product = await productModel.findById(prodId)
      if (product) {
        if (product.stock >= quantity) {
          const indice = cart.products.findIndex(
            (prod) => prod.id_prod === prodId
          )
          if (indice != -1) cart.products[indice].quantity = quantity
          else cart.products.push({ id_prod: prodId, quantity: quantity })
          await cartModel.findByIdAndUpdate(cartId, cart)
          res.status(200).send("Carrito actualizado")
        } else {
          res.status(400).send("Stock no disponible")
        }
      } else {
        res.status(404).send("Producto no existe")
      }
    } else res.status(404).send("Carrito no encontrado")
  } catch (e) {
    res.status(500).send(e)
  }
}

export const deleteProductCart = async (req, res) => {
  try {
    const cartId = req.params.cid
    const prodId = req.params.pid
    const cart = await cartModel.findOne({ _id: cartId })
    if (cart) {
      const indice = cart.products.findIndex((prod) => prod.id_prod === prodId)
      if (indice != -1) {
        cart.products.splice(indice, 1)
        cart.save()
        res.status(200).send(cart)
      } else {
        res.status(404).send("Producto no existente en el carrito")
      }
    } else res.status(404).send("Carrito no encontrado")
  } catch (e) {
    res.status(500).send(e)
  }
}

export const deleteCart = async (req, res) => {
  try {
    const cartId = req.params.cid
    const cart = await cartModel.findOne({ _id: cartId })
    if (cart) {
      cart.products = []
      cart.save()
      res.status(200).send(cart)
    } else res.status(404).send("Carrito no encontrado")
  } catch (e) {
    res.status(500).send(e)
  }
}

export const checkout =  async (req, res) => {
  try {
    const cartId = req.params.cid
    const cart = await cartModel.findById(cartId)
    const prodStockNull = []
    if(cart) {
      for(const prod of cart.products) {
        const product = await productModel.findById(prod.id_prod)
        if(product) {
        if(product.stock < prod.quantity) {
          prodStockNull.push(product.id)
        }
        }
        
        if(prodStockNull.length === 0) {
          let totalAmount = 0

          for(const prod of cart.products) {
            const product = await productModel.findById(prod.id_prod)
            if(product) {
              product.stock -= prod.quantity
              totalAmount += product.price * prod.quantity
              await product.save()
            }
          }

          const newTicket = await ticketModel.create({
            code: crypto.randomUUID(),
            purchaser: req.user.email,
            amount: totalAmount,
            products: cart.products
          })

          await cartModel.findByIdAndUpdate(cartId, { products: [] })

          res.status(200).json({ message: "Compra finalizada correctamente" })
        } else {
          prodStockNull.forEach( async (prodId) => {
            const index = cart.products.findIndex(prod => prod.id_prod === prodId)
            cart.products.splice(index, 1)
            await cartModel.findByIdAndUpdate(cartId, { products: cart.products })
          })
          res.status(400).json({ message: "Productos sin stock" })
        }
      }
    } else {
      res.status(404).json({ message: "Carrito no existe"})
    }
  } catch (e) {
    res.status(500).send(e)
  }
}
