import User from "../models/user.model.js";

// Enviar solicitud de amistad
export const sendFriendRequest = async (req, res) => {
  const { recipientId } = req.body;
    const senderId = req.user.id;

    if (!recipientId) {
      return res.status(400).json({ message: "Se requiere un ID de usuario" });
    }

    if (recipientId === senderId) {
      return res.status(400).json({ message: "No puedes agregarte a ti mismo" });
    }

    const sender = await User.findById(senderId);
    const recipient = await User.findById(recipientId);

    if (!recipient)
      return res.status(404).json({ message: "Usuario no encontrado" });

    if (recipient.friendsRequests.includes(senderId)) {
      return res.status(400).json({ message: "Ya enviaste una solicitud" });
    }

    recipient.friendsRequests.push(senderId);
    sender.sentRequests.push(recipientId);

    await recipient.save();
    await sender.save();

    res.json({ message: "Solicitud enviada" });
  } catch (error) {
    console.error("Error en sendFriendRequest:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// Cancelar solicitud de amistad enviada
export const cancelFriendRequest = async (req, res) => {
  try {
    const recipientId = req.body.recipientId || req.body.userId;
    const senderId = req.user.id;

    if (!recipientId) {
      return res.status(400).json({ message: "Se requiere un ID de usuario" });
    }

    const sender = await User.findById(senderId);
    const recipient = await User.findById(recipientId);

    if (!sender || !recipient) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Eliminar la solicitud de los arreglos correspondientes
    sender.sentRequests = sender.sentRequests.filter(
      (id) => id.toString() !== recipientId
    );
    
    recipient.friendsRequests = recipient.friendsRequests.filter(
      (id) => id.toString() !== senderId
    );

    await sender.save();
    await recipient.save();

    res.json({ message: "Solicitud cancelada" });
  } catch (error) {
    console.error("Error en cancelFriendRequest:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// Aceptar solicitud de amistad
export const acceptFriendRequest = async (req, res) => {
  const { senderId } = req.body;
    const recipientId = req.user.id;

    if (!senderId) {
      return res.status(400).json({ message: "Se requiere un ID de usuario" });
    }

    console.log("Aceptando solicitud de:", senderId);
    console.log("Usuario actual:", recipientId);
    
    const recipient = await User.findById(recipientId);
    const sender = await User.findById(senderId);

    if (!recipient || !sender) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Verificar que exista la solicitud
    const hasFriendRequest = recipient.friendsRequests.some(
      (id) => id.toString() === senderId
    );

    if (!hasFriendRequest) {
      return res.status(400).json({ message: "No hay solicitud de ese usuario" });
    }

    // Añadir a amigos
    recipient.friends.push(senderId);
    sender.friends.push(recipientId);

    // Eliminar solicitudes
    recipient.friendsRequests = recipient.friendsRequests.filter(
      (id) => id.toString() !== senderId
    );
    
    sender.sentRequests = sender.sentRequests.filter(
      (id) => id.toString() !== recipientId
    );

    await recipient.save();
    await sender.save();

    res.json({ message: "Solicitud aceptada" });
  } catch (error) {
    console.error("Error en acceptFriendRequest:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// Eliminar amigo
export const removeFriend = async (req, res) => {
  try {
    // Aceptar tanto friendId como userId para mayor compatibilidad
    const friendId = req.body.friendId || req.body.userId;
    const userId = req.user.id;

    if (!friendId) {
      return res.status(400).json({ message: "Se requiere un ID de usuario" });
    }

    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!user || !friend) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Verificar que sean amigos
    const areFriends = user.friends.some(id => id.toString() === friendId);
    
    if (!areFriends) {
      return res.status(400).json({ message: "No son amigos" });
    }

    user.friends = user.friends.filter((id) => id.toString() !== friendId);
    friend.friends = friend.friends.filter((id) => id.toString() !== userId);

    await user.save();
    await friend.save();

    res.json({ message: "Amigo eliminado" });
  } catch (error) {
    console.error("Error en removeFriend:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

//Obtener amigos del usuario logueado
export const getMyFriends = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate(
      "friends",
      "username profilePicture"
    );
    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });

    res.json(user.friends); // Lista de amigos con datos básicos
  } catch (error) {
    console.error("Error en getMyFriends:", error);
    res.status(500).json({ message: "Error al obtener amigos" });
  }
};

export const searchUsersByName = async (req, res) => {
  try {
    const { name } = req.query;
    if (!name) return res.json([]);
    
    const regex = new RegExp(name, "i"); // insensible a mayúsculas
    
    // Excluir al usuario actual de los resultados
    const users = await User.find({ 
      username: regex,
      _id: { $ne: req.user.id } // Ne significa "Not equal"
    }).select("username _id profilePicture");
    
    res.json(users);
  } catch (error) {
    console.error("Error en searchUsersByName:", error);
    res.status(500).json({ message: "Error al buscar usuarios" });
  }
};

// Obtener solicitudes recibidas y enviadas
export const getFriendRequests = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId)
      .populate("friendsRequests", "username profilePicture")
      .populate("sentRequests", "username profilePicture");

    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });

    res.json({
      received: user.friendsRequests,
      sent: user.sentRequests,
    });
  } catch (error) {
    console.error("Error en getFriendRequests:", error);
    res.status(500).json({ message: "Error al obtener solicitudes" });
  }
};