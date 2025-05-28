import Comment from '../models/comment.model.js';

// Crear un comentario
export const createComment = async (req, res) => {
  try {
    const { text } = req.body;
    const taskId = req.params.id;
    const userId = req.user.id;

    const newComment = new Comment({
      text,
      user: userId,
      task: taskId
    });

    const savedComment = await newComment.save();
    res.status(201).json(savedComment);
  } catch (error) {
    console.error("Error al crear el comentario:", error);
    res.status(500).json({ message: "Error al crear el comentario." });
  }
};

// Obtener comentarios de una tarea
export const getCommentsByTask = async (req, res) => {
  try {
    const taskId = req.params.id;

    const comments = await Comment.find({ task: taskId })
      .populate('user', 'username profilePicture')
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    console.error("Error al obtener los comentarios:", error);
    res.status(500).json({ message: "Error al obtener los comentarios." });
  }
};
