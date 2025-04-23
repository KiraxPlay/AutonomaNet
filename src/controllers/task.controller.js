import Task from "../models/task.model.js";

// Obtener todas las "tasks" del usuario
export const getTasks = async (req, res) => {
  const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(tasks);
};

// Crear una "task" (post con imagen)
export const createTask = async (req, res) => {
  try {
    const { text } = req.body; // Asegúrate de que el texto se reciba correctamente
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    if (!text && !imageUrl) {
      return res.status(400).json({ message: 'El texto o la imagen son obligatorios.' });
    }

    const newTask = new Task({
      text,
      imageUrl,
      user: req.user.id,
    });

    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (error) {
    console.error('Error al crear la tarea:', error);
    res.status(500).json({ message: 'Error al crear la tarea.' });
  }
};

// Obtener una sola "task"
export const getTask = async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: "No encontrada" });
  res.json(task);
};

// Actualizar una "task"
export const updateTask = async (req, res) => {
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

  const updateFields = {
    ...req.body,
    ...(imageUrl && { imageUrl }),
  };

  const task = await Task.findByIdAndUpdate(req.params.id, updateFields, {
    new: true,
  });
  if (!task) return res.status(404).json({ message: "No encontrada" });
  res.json(task);
};

// Eliminar una "task"
export const deleteTask = async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);
  if (!task) return res.status(404).json({ message: "No encontrada" });
  res.json(task);
};
