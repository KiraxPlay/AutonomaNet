import User from "../models/user.model.js";

// Enviar solicitud de amistad
export const sendFriendRequest = async (req, res) => {
  try {
    const { userId } = req.body;
    const senderId = req.user.id;

    // Verificar que no se envíe solicitud a sí mismo
    if (userId === senderId) {
      return res.status(400).json({ message: "No puedes enviarte solicitud a ti mismo" });
    }

    const receiver = await User.findById(userId);
    const sender = await User.findById(senderId);

    if (!receiver) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Verificar si ya son amigos
    if (receiver.friends.includes(senderId)) {
      return res.status(400).json({ message: "Ya son amigos" });
    }

    // Verificar si ya existe una solicitud pendiente
    if (receiver.friendRequests.includes(senderId)) {
      return res.status(400).json({ message: "Ya existe una solicitud pendiente" });
    }

    // Agregar solicitud
    receiver.friendRequests.push(senderId);
    sender.sentRequests.push(userId);

    await receiver.save();
    await sender.save();

    res.json({ message: "Solicitud de amistad enviada" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Aceptar solicitud de amistad
export const acceptFriendRequest = async (req, res) => {
  try {
    const { userId } = req.body;
    const receiverId = req.user.id;

    const receiver = await User.findById(receiverId);
    const sender = await User.findById(userId);

    if (!sender || !receiver) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Verificar que exista la solicitud
    if (!receiver.friendRequests.includes(userId)) {
      return res.status(400).json({ message: "No existe solicitud pendiente" });
    }

    // Agregar amigos mutuamente
    receiver.friends.push(userId);
    sender.friends.push(receiverId);

    // Eliminar solicitudes
    receiver.friendRequests = receiver.friendRequests.filter(id => id.toString() !== userId);
    sender.sentRequests = sender.sentRequests.filter(id => id.toString() !== receiverId);

    await receiver.save();
    await sender.save();

    res.json({ message: "Solicitud aceptada" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cancelar/Rechazar solicitud de amistad
export const cancelFriendRequest = async (req, res) => {
  try {
    const { userId } = req.body;
    const currentUserId = req.user.id;

    const currentUser = await User.findById(currentUserId);
    const otherUser = await User.findById(userId);

    if (!currentUser || !otherUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Eliminar solicitud enviada o recibida
    currentUser.friendRequests = currentUser.friendRequests.filter(id => id.toString() !== userId);
    currentUser.sentRequests = currentUser.sentRequests.filter(id => id.toString() !== userId);
    otherUser.friendRequests = otherUser.friendRequests.filter(id => id.toString() !== currentUserId);
    otherUser.sentRequests = otherUser.sentRequests.filter(id => id.toString() !== currentUserId);

    await currentUser.save();
    await otherUser.save();

    res.json({ message: "Solicitud cancelada" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Eliminar amigo
export const removeFriend = async (req, res) => {
  try {
    const { userId } = req.body;
    const currentUserId = req.user.id;

    const currentUser = await User.findById(currentUserId);
    const friendUser = await User.findById(userId);

    if (!currentUser || !friendUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Eliminar amigos mutuamente
    currentUser.friends = currentUser.friends.filter(id => id.toString() !== userId);
    friendUser.friends = friendUser.friends.filter(id => id.toString() !== currentUserId);

    await currentUser.save();
    await friendUser.save();

    res.json({ message: "Amigo eliminado" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener lista de amigos
export const getMyFriends = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('friends', 'username email');
    res.json(user.friends);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener solicitudes de amistad
export const getFriendRequests = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('friendRequests', 'username email')
      .populate('sentRequests', 'username email');

    res.json({
      received: user.friendRequests,
      sent: user.sentRequests
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Buscar usuarios por nombre
export const searchUsersByName = async (req, res) => {
  try {
    const { q } = req.query;
    const currentUserId = req.user.id;

    if (!q) {
      return res.json([]);
    }

    const users = await User.find({
      username: { $regex: q, $options: 'i' },
      _id: { $ne: currentUserId }
    }).select('username email');

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};