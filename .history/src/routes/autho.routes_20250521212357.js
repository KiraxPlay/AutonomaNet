import { Router } from "express";
import {
  login,
  logout,
  register,
  profile,
  verifytoken
} from "../controllers/auth.controller.js";
import jwt from "jsonwebtoken";

import { authRequired } from "../middlewares/validateToken.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { registerSchema, loginSchema } from "../schemas/auth.schemas.js";


const router = Router();

router.post("/register", validateSchema(registerSchema), register);
router.post("/login", validateSchema(loginSchema), login);
router.post("/logout", logout);
router.get("/verify",verifytoken);
router.get("/profile", authRequired, profile);

export default router;
