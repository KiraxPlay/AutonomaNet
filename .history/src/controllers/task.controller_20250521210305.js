// filepath: c:\Users\SEBASTIAN\Desktop\Sebas\proyecto-BD\src\controllers\task.controller.js
import Task from "../models/task.model.js";
import fs from 'fs';

export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      user: req.user.id
    }).populate('user');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createTask = async (req, res) => {
  try {
    const { text } = req.body;
    const image = req.file?.filename;

    const newTask = new Task({
      text,
      image,
      user: req.user.id
    });

    const savedTask = await newTask.save();
    res.json(savedTask);
  } catch (error) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: error.message });
  }
};

export const getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('user');
    if (!task) return res.status(404).json({ message: "Publicación no encontrada" });
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { text } = req.body;
    const task = await Task.findById(req.params.id);
    
    if (!task) return res.status(404).json({ message: "Publicación no encontrada" });
    
    // Verificar que el usuario sea el propietario
    if (task.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "No autorizado" });
    }

    // Si hay una nueva imagen, eliminar la anterior
    if (req.file && task.image) {
      fs.unlinkSync(`uploads/${task.image}`);
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      {
        text,
        image: req.file?.filename || task.image
      },
      { new: true }
    );

    res.json(updatedTask);
  } catch (error) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Publicación no encontrada" });

    // Verificar que el usuario sea el propietario
    if (task.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "No autorizado" });
    }

    // Eliminar imagen si existe
    if (task.image) {
      fs.unlinkSync(`uploads/${task.image}`);
    }

    await task.deleteOne();
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};