import { Router } from "express";
import {
  showRegister,
  registerUser,
  showLogin,
  loginUser,
  logoutUser,
  showProfile,
  showEditProfile,
  updateProfile,
  toggleFavorite,
  showFavorites,
} from "../controllers/userController";
import { requireAuth } from "../middleware/requireAuth";
import upload from "../middleware/upload";

const router = Router();

// Registro
router.get("/register", showRegister);
router.post("/register", registerUser);

// Login
router.get("/login", showLogin);
router.post("/login", loginUser);

// Logout
router.post("/logout", logoutUser);

// Perfil
router.get("/profile", requireAuth, showProfile);
router.get("/edit", requireAuth, showEditProfile);
router.post("/edit", requireAuth, upload.single("avatar"), updateProfile);
router.post("/favorites/:id", requireAuth, toggleFavorite);
router.get("/favorites", requireAuth, showFavorites);




export default router;
