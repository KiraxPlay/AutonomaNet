import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { createAccesToken } from "../libs/jwt.js";
import jwt from "jsonwebtoken";
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
    const token = await createAccesToken({ id: userSave._id }); //creando el token
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

    const token = await createAccesToken({ id: userFound._id }); //creando el token
    res.cookie("token", token);

    res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
      createdAt: userFound.createdAt,
    });
  } catch (error) {
    res.statusU(500).json({ message: error.message }); //si hay un error en el servidor, devuelve un error
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
    profilePicture: userFound.profilePicture,
    createdAt: userFound.createdAt,
    updatedAt: userFound.updatedAt,
  });
  console.log(req.user); //imprimiendo el usuario en la consola
  res.send("profile");
};


export const verifytoken = async (req, res) => {
  const { token } = req.cookies;

  if (!token) return res.status(401).json({ message: "No autorizado" });

  jwt.verify(token, TOKEN_SECRET, async (err, user) => {
    if (err) return res.status(401).json({ message: "No autorizado" });

    const userFound = await User.findById(user.id);
    if (!userFound) return res.status(401).json({ message: "No autorizado" });

    return res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
      profilePicture: userFound.profilePicture,
    });
  });
};