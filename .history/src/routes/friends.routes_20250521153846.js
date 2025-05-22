import { Router } from "express";
import { 
  sendFriendRequest, 
  acceptFriendRequest, 
  removeFriend, 
  getMyFriends, 
  getFriendRequests, 
  searchUsersByName,
  cancelFriendRequest // Añadir esta función (aún no la has creado)
} from "../controllers/friends.controller.js";
import { authRequired } from "../middlewares/validateToken.js";

const router = Router();

router.post("/request", authRequired, sendFriendRequest);
router.post("/accept", authRequired, acceptFriendRequest);
router.post("/remove", authRequired, removeFriend);
router.post("/cancel", authRequired, cancelFriendRequest); // Añadir esta ruta
router.get("/my-friends", authRequired, getMyFriends);
router.get("/requests", authRequired, getFriendRequests);
router.get('/search', authRequired, searchUsersByName);

export default router;