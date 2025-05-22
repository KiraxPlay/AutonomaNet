import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Función para crear token JWT
const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET || "secretkey", {
    expiresIn: "7d",
  });
};

// Función para verificar token JWT
const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET || "secretkey", (err, decoded) => {
      if (err) reject(err);
      else resolve(decoded);
    });
  });
};

export const register = async (req, res) => {
  const { email, username, password } = req.body; //el requ.body es lo que el usuario va a enviar en el formulario

  try {
    const userFound = await User.findOne({email}); //buscando el usuario por email
    if (userFound) return res.status(400).json(["El correo ya esta en uso :c"]); //si encuentra el usuario, devuelve un error

    const passwordHash = await bcrypt.hash(password, 10); //encriptando la contraseña con bcrypt

    const newUser = new User({
      //guardando el usuario
      email,
      username,
      password: passwordHash,
    });
    const userSave = await newUser.save(); //guardando el usuario en la base de datos
    const token = createAccessToken({ id: userSave._id }); //creando el token
    res.cookie("token", token);

    res.json({
      id: userSave._id,
      email: userSave.email,
      username: userSave.username,
      createdAt: userSave.createdAt,
    });
  } catch (error) {
    console.log(error);
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body; //el requ.body es lo que el usuario va a enviar en el formulario

  try {
    const userFound = await User.findOne({ email });

    if (!userFound)
      return res.status(400).json(["Usuario no encontrado"]); //si no encuentra el usuario, devuelve un error

    const isMatch = await bcrypt.compare(password, userFound.password); //Comparando contraseña ingresada y de la base de datos

    if (!isMatch)
      return res.status(400).json(["Contraseña Incorrecta"]); //si no coincide la contraseña, devuelve un error

    const token = createAccessToken({ id: userFound._id }); //creando el token
    res.cookie("token", token);

    res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
      createdAt: userFound.createdAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message }); //si hay un error en el servidor, devuelve un error
  }
};

export const logout = async (req, res) => {
  res.cookie("token", "", {
    expires: new Date(0), //eliminando la cookie
  });
  return res.sendStatus(200);
};

export const profile = async (req, res) => {
  const userFound = await User.findById(req.user.id); //buscando el usuario por id

  if (!userFound)
    return res.status(400).json({ message: "Usuario no encontrado" }); //si no encuentra el usuario, devuelve un error
  return res.json({
    id: userFound._id,
    username: userFound.username,
    email: userFound.email,
    createdAt: userFound.createdAt,
    updatedAt: userFound.updatedAt,
  });
  console.log(req.user); //imprimiendo el usuario en la consola
  res.send("profile");
};

export const verifytoken = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = await verifyToken(token); // 👈 aquí usas tu helper

    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.json({
      id: user._id,
      email: user.email,
      username: user.username,
      profilePicture: user.profilePicture,
      profilePicturePublicId: user.profilePicturePublicId,
      createdAt: user.createdAt,
    });
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
