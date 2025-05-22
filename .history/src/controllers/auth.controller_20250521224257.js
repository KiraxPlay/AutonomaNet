import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Función para crear token JWT
const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET || "secretkey", {
    expiresIn: "7d", // ejemplo: duración 7 días
  });
};

export const register = async (req, res) => {
  const { email, username, password } = req.body;

  try {
    const userFound = await User.findOne({ email });
    if (userFound) return res.status(400).json(["El correo ya está en uso :c"]);

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      username,
      password: passwordHash,
    });

    const userSave = await newUser.save();

    const token = createAccessToken({ id: userSave._id });
    res.cookie("token", token, {
      httpOnly: true,
      // secure: true, // habilitar si usas https
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
    });

    res.json({
      id: userSave._id,
      email: userSave.email,
      username: userSave.username,
      createdAt: userSave.createdAt,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el registro" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userFound = await User.findOne({ email });
    if (!userFound) return res.status(400).json(["Usuario no encontrado"]);

    const isMatch = await bcrypt.compare(password, userFound.password);
    if (!isMatch) return res.status(400).json(["Contraseña Incorrecta"]);

    const token = createAccessToken({ id: userFound._id });
    res.cookie("token", token, {
      httpOnly: true,
      // secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
      createdAt: userFound.createdAt,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el login" });
  }
};

export const logout = (req, res) => {
  res.cookie("token", "", {
    expires: new Date(0),
    httpOnly: true,
  });
  return res.sendStatus(200);
};

export const profile = async (req, res) => {
  try {
    const userFound = await User.findById(req.user.id);

    if (!userFound)
      return res.status(404).json({ message: "Usuario no encontrado" });

    res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
      profilePicture: userFound.profilePicture,
      createdAt: userFound.createdAt,
      updatedAt: userFound.updatedAt,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener el perfil" });
  }
};
