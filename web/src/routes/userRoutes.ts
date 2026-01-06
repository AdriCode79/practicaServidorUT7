import { Router } from "express";
import {
  showRegister,
  registerUser,
  showLogin,
  loginUser,
  logoutUser,
} from "../controllers/userController";
import { requireAuth } from "../middleware/requireAuth";
import {
  showProfile,
  showEditProfile,
  updateProfile,
} from "../controllers/userController";
import upload from "../middleware/upload";

const router = Router();

router.get("/register", showRegister);
router.post("/register", registerUser);

router.get("/login", showLogin);
router.post("/login", loginUser);

router.post("/logout", logoutUser);

router.get("/profile", requireAuth, showProfile);
router.get("/edit", requireAuth, showEditProfile);
router.post(
  "/edit",
  requireAuth,
  upload.single("avatar"), // 👈 Multer debe ir ANTES del controlador
  updateProfile
);

export default router;
