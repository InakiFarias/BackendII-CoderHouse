import { model, Schema } from "mongoose";
import cartModel from "./cartModels.js";

const userSchema = new Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    rol: {
        type: String,
        default: "User"
    },
    cart: {
        type: Schema.Types.ObjectId,
        ref: "carts"
    }
})

userSchema.post("save", async function (doc) {
    try {
        if(!doc.cart) {
            const newCart = await cartModel.create({product: []})
            await model("users").findByIdAndUpdate(doc._id, {cart: newCart})
        }
    } catch(err) {
        console.log(err)
    }
} )

const userModel = model("users", userSchema)

export default userModel