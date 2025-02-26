import jwt from "jsonwebtoken"

const sectretKey = "coder"

const generateToken = (user) => {
    const token = jwt.sign({first_name: user.first_name, email: user.email}, sectretKey, {expiresIn: "24h"})
    return token
}

export default generateToken