import { Router } from "express";
import { toggleFavorite, showFavorites } from "../controllers/favoriteController";

const router = Router();

// Añadir o quitar producto de favoritos
router.post("/products/:id/favorite", toggleFavorite);

// Ver todos los productos favoritos del usuario
router.get("/users/favorites", showFavorites);

export default router;
