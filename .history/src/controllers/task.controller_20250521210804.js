import Task from "../models/task.model.js";

// Obtener todas las "tasks" del usuario
export const getTasks = async (req, res) => {
  try {
    // Obtener todas las tareas y poblar el campo "user" con los datos del usuario
    const tasks = await Task.find().populate("user", "username email"); // Solo incluye `username` y `email`
    res.json(tasks);
  } catch (error) {
    console.error("Error al obtener las tareas:", error);
    res.status(500).json({ message: "Error al obtener las tareas." });
  }
};

// Crear una "task" (post con imagen)
export const createTask = async (req, res) => {
  try {
    const { text } = req.body; // Obtener el texto del cuerpo de la solicitud
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null; // Obtener la URL de la imagen si se sube

    // Validar que al menos uno de los dos (texto o imagen) esté presente
    if (!text && !imageUrl) {
      return res.status(400).json({ message: 'Debes proporcionar texto o una imagen.' });
    }

    // Crear una nueva tarea
    const newTask = new Task({
      text: text || null, // Si no hay texto, guarda `null`
      imageUrl, // La imagen es opcional
      user: req.user.id, // ID del usuario autenticado
    });

    const savedTask = await newTask.save(); // Guardar la tarea en la base de datos
    res.status(201).json(savedTask); // Responder con la tarea creada
  } catch (error) {
    console.error('Error al crear la Publicacion:', error);
    res.status(500).json({ message: 'Error al crear la publicación.' });
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