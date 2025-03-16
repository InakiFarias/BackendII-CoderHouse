import productModel from "../models/productModels.js"

export const getProducts = async (req, res) => {
    try {
        const { limit, page, metFilter, filter, metOrder, order } = req.query
        const pag = page || 1
        const lim = limit || 10
        const filterQuery = metFilter && filter ? { [metFilter]: filter } : {}
        const orderQuery = metOrder && order ? { [metOrder]: order } : {}

        const products = await productModel.paginate(filterQuery, { limit: lim, page: pag, sort: orderQuery, lean: true })

        products.pageNumbers = Array.from({ length: products.totalPages }, (_, i) => ({
            number: i + 1,
            isCurrent: i + 1 === products.page
        }))

        res.status(200).send(products)
    } catch(e) {
        res.status(500).send({ error: e})
    }
}

export const getProduct = async (req, res) => {
    try {
        const idProd = req.params.pId
        const prod = await productModel.findById(idProd)
        if(prod) 
            res.status(200).send(prod)
        else 
            res.status(404).send("Producto no encontrado")
    } catch(e) {
        res.status(500).send({ error: e})
    }
}

export const createProduct = async (req, res) => {
    try {
        const { title, description, category, code, price, stock } = req.body    
        const message = await productModel.create({ title, description, category, code, price, stock })
        res.status(201).send({ message })
    } catch(e) {
        res.status(500).send({ error: e})
    }
}

export const updateProduct = async (req, res) => {
    try {
        const idProd = req.params.pId
        const { title, description, category, code, price, stock } = req.body    
        const message = await productModel.findByIdAndUpdate(idProd, { title, description, category, code, price, stock })
        if(message) 
            res.status(200).send({ message: "Producto actualizado" })
        else 
            res.status(404).send("Producto no encontrado")
    } catch(e) {
        res.status(500).send({ error: e})
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const idProd = req.params.pId
        const message = await productModel.findByIdAndDelete(idProd)
        if(message) 
            res.status(200).send({ message: "Producto eliminado" })
        else 
            res.status(404).send("Producto no encontrado")
    } catch(e) {
        res.status(500).send({ error: e})
    }
}