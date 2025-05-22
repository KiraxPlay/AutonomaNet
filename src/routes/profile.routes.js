import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { uploadProfile } from '../middlewares/upload.js';
import User from "../models/user.model.js";
import fs from "fs";
import path from "path";

const router = Router();

// 🔄 Subir o actualizar foto de perfil
router.put("/profile/photo", authRequired, uploadProfile, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    // Si el usuario ya tenía una imagen, eliminarla del sistema de archivos
    if (user.profilePicture) {
      const previousPath = path.join("uploads/profile", user.profilePicture);
      if (fs.existsSync(previousPath)) fs.unlinkSync(previousPath);
    }

    // Guardar el nuevo nombre de archivo
    user.profilePicture = req.file.filename;
    await user.save();

    res.json({
      message: "Foto de perfil actualizada",
      profilePicture: user.profilePicture,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar foto de perfil" });
  }
});

// 📄 Obtener información del usuario (opcional si ya tienes `/profile`)
router.get("/profile/photo", authRequired, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    res.json({
      profilePicture: user.profilePicture,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la foto de perfil" });
  }
});

// ❌ Eliminar foto de perfil
router.delete("/profile/photo", authRequired, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user.profilePicture) {
      const photoPath = path.join("uploads/profile", user.profilePicture);
      if (fs.existsSync(photoPath)) fs.unlinkSync(photoPath);

      user.profilePicture = null;
      user.profilePicturePublicId = null;
      await user.save();
    }

    res.json({ message: "Foto de perfil eliminada" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar la foto de perfil" });
  }
});

router.get("/profile", authRequired, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // No enviar contraseña
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener el perfil del usuario" });
  }
});

export default router;
