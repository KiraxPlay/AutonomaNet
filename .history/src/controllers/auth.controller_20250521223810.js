import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { createAccesToken , verifyToken  } from "../libs/jwt.js";

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

export const verifyToken = async (req, res) => {
  try {
    const { token } = req.cookies;
    
    if (!token) {
      console.log("No token found in cookies");
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    const decoded = jwt.verify(token, TOKEN_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user) {
      console.log("User not found with decoded token");
      return res.status(401).json({ message: "User not found" });
    }

    return res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture || null
    });
  } catch (error) {
    console.error('Error in verifyToken:', error);
    return res.status(401).json({ message: "Token is not valid" });
  }
};

export const profile = async (req, res) => {
  try {
    const userFound = await User.findById(req.user.id);
    if (!userFound) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
      profilePicture: userFound.profilePicture || null
    });
  } catch (error) {
    console.error('Error in profile:', error);
    res.status(500).json({ message: "Error getting profile" });
  }
};