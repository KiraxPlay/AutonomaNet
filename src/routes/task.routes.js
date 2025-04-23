import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import {
  getTasks,
  getTask,
  createTask,
  deleteTask,
  updateTask,
} from "../controllers/task.controller.js";
import multer from "multer";

const router = Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

router.get("/task", authRequired, getTasks);
router.get("/task/:id", authRequired, getTask);
router.post("/task", authRequired, upload.single("image"), createTask);
router.put("/task/:id", authRequired, upload.single("image"), updateTask);
router.delete("/task/:id", authRequired, deleteTask);

export default router;
