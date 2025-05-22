import User from '../models/user.model.js';
import fs from 'fs/promises';
import path from 'path';

export const updateProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se subió ninguna imagen' });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    // Eliminar imagen anterior si existe
    if (user.profilePicture) {
      const oldImagePath = path.join('uploads/profile/', path.basename(user.profilePicture));
      try {
        await fs.unlink(oldImagePath);
      } catch (err) {
        console.warn('No se pudo eliminar la imagen anterior:', err);
      }
    }

    // Actualizar con la nueva ruta
    user.profilePicture = `/uploads/profile/${req.file.filename}`;
    await user.save();

    res.json({
      id: user._id,
      profilePicture: user.profilePicture
    });

  } catch (error) {
    console.error('Error al actualizar foto:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
};