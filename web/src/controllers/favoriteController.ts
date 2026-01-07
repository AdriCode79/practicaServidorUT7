import { Request, Response } from "express";
import { favoriteService } from "../services/favoriteService";

export const toggleFavorite = (req: Request, res: Response) => {
  const userId = req.session.user?.id;
  const productId = parseInt(req.params.id);

  if (!userId) {
    req.session.flash = { type: "error", message: "Debes iniciar sesión" };
    return res.redirect("/users/login");
  }

  const isFav = favoriteService.isFavorite(userId, productId);

  if (isFav) {
    favoriteService.removeFavorite(userId, productId);
    req.session.flash = {
      type: "success",
      message: "Producto eliminado de favoritos",
    };
  } else {
    favoriteService.addFavorite(userId, productId);
    req.session.flash = {
      type: "success",
      message: "Producto añadido a favoritos",
    };
  }

  res.redirect("back");
};

export const showFavorites = (req: Request, res: Response) => {
  const userId = req.session.user?.id;

  if (!userId) {
    req.session.flash = { type: "error", message: "Debes iniciar sesión" };
    return res.redirect("/users/login");
  }

  const favorites = favoriteService.getUserFavorites(userId);

  res.render("completes/users/favorites", {
    favorites,
    session: req.session,
  });
};
