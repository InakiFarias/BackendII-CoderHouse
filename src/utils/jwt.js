import jwt from "jsonwebtoken";

const sectretKey = "coder";

const generateToken = (user) => {
  const token = jwt.sign(
    {
      _id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      age: user.age,
      rol: user.rol,
    },
    sectretKey,
    { expiresIn: "24h" }
  );
  return token;
};

export default generateToken;
