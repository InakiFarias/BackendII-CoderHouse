import cartModel from "../models/cartModels.js";
import productModel from "../models/productModels.js";

export const getCart = async (req, res) => {
    try {
        const cartId = req.params.cid
        const cart = await cartModel.findOne({_id: cartId})
        if(cart)
            res.status(200).send(cart)
        else 
            res.status(404).send("Carrito no encontrado")
    } catch(e) {
        res.status(500).send(e)
    }
}

export const insertProductCart = async (req, res) => {
    try {
        const cartId = req.params.cid
        const prodId = req.params.pid
        const quantity = req.body
        const cart = await cartModel.findOne({_id: cartId})
        if(cart) {
            const product = await productModel.findById(prodId)
            if(product) {
                if(product.stock >= quantity) {
                    const indice = cart.products.findIndex(prod => prod.id_prod === prodId)
                    if(indice != -1) 
                        cart.products[indice].quantity = quantity
                    else
                        cart.products.push({id_prod: prodId, quantity: quantity})
                    await cartModel.findByIdAndUpdate(cartId, cart)
                    res.status(200).send("Carrito actualizado")
                } else {
                    res.status(400).send("Stock no disponible")
                }
            } else {
                res.status(404).send("Producto no existe")
            }
        }
        else 
            res.status(404).send("Carrito no encontrado")
    } catch(e) {
        res.status(500).send(e)
    }
}

export const deleteProductCart = async (req, res) => {
    try {
        const cartId = req.params.cid
        const prodId = req.params.pid
        const cart = await cartModel.findOne({_id: cartId})
        if(cart){
            const indice = cart.products.findIndex(prod => prod.id_prod === prodId)
            if(indice != -1) {
                cart.products.splice(indice, 1)
                cart.save()
                res.status(200).send(cart)
            }
            else {
                res.status(404).send("Producto no existente en el carrito")
            }

        }
        else 
            res.status(404).send("Carrito no encontrado")
    } catch(e) {

    }
}

export const deleteCart = async (req, res) => {
    try {
        const cartId = req.params.cid
        const cart = await cartModel.findOne({_id: cartId})
        if(cart) {
            cart.products = []
            cart.save()
            res.status(200).send(cart)
        }
        else 
            res.status(404).send("Carrito no encontrado")
    } catch(e) {
        res.status(500).send(e)
    }
}