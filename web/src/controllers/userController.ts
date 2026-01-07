import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { users } from "../data/users";
import { productService } from "../services/productService";
import { products } from "../data/products";

import {
  isValidEmail,
  isValidUsername,
  isValidPassword,
  isValidAvatar,
} from "../validators/userValidator";

export const showRegister = (req: Request, res: Response) => {
  const { formData } = req.session;

  res.render("completes/users/register", {
    session: req.session,
    username: formData?.username || "",
    email: formData?.email || "",
  });
};

export const registerUser = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  // Guardar valores para mantenerlos en el formulario si hay error
  req.session.formData = { username, email };

  if (!isValidUsername(username)) {
    req.session.flash = {
      type: "error",
      message: "El nombre debe tener entre 3 y 20 caracteres",
    };
    return res.redirect("/users/register");
  }

  if (!isValidEmail(email)) {
    req.session.flash = { type: "error", message: "Email no válido" };
    return res.redirect("/users/register");
  }

  if (!isValidPassword(password)) {
    req.session.flash = {
      type: "error",
      message: "La contraseña debe tener al menos 6 caracteres",
    };
    return res.redirect("/users/register");
  }

  const exists = users.find((u) => u.email === email);
  if (exists) {
    req.session.flash = {
      type: "error",
      message: "El email ya está registrado",
    };
    return res.redirect("/users/register");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  users.push({
    id: users.length + 1,
    username,
    email,
    passwordHash,
    avatarUrl: undefined,
    favorites: [],
  });

  // Limpiar datos temporales
  req.session.formData = undefined;

  req.session.flash = { type: "success", message: "Registro completado" };
  res.redirect("/users/login");
};

export const showLogin = (req: Request, res: Response) => {
  res.render("completes/users/login");
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = users.find((u) => u.email === email);
  if (!user) {
    req.session.flash = { type: "error", message: "Credenciales incorrectas" };
    return res.redirect("/users/login");
  }

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) {
    req.session.flash = { type: "error", message: "Credenciales incorrectas" };
    return res.redirect("/users/login");
  }

  req.session.user = {
    id: user.id,
    username: user.username,
    email: user.email,
    avatar: user.avatarUrl, // si lo tienes
    favorites: user.favorites, // 👈 añade esto
  };

  req.session.flash = { type: "success", message: "Sesión iniciada" };

  res.redirect("/");
};

export const logoutUser = (req: Request, res: Response) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};

export const showProfile = async (req: Request, res: Response) => {
  if (!req.session.user) {
    req.session.flash = { type: "error", message: "Debes iniciar sesión" };
    return res.redirect("/users/login");
  }

  const user = users.find((u) => u.id === req.session.user!.id);

  const products = await productService.getByOwner(user!.id);

  res.render("completes/users/profile", {
    user,
    products,
    session: req.session,
  });
};

export const showEditProfile = (req: Request, res: Response) => {
  const user = users.find((u) => u.id === req.session.user!.id);

  res.render("completes/users/edit", {
    user,
    session: req.session,
  });
};

export const updateProfile = (req: Request, res: Response) => {
  const { username, email } = req.body;
  const user = users.find((u) => u.id === req.session.user!.id);

  if (!user) {
    req.session.flash = { type: "error", message: "Usuario no encontrado" };
    return res.redirect("/users/profile");
  }

  if (!isValidUsername(username)) {
    req.session.flash = {
      type: "error",
      message: "El nombre debe tener entre 3 y 20 caracteres",
    };
    return res.redirect("/users/edit");
  }

  if (!isValidEmail(email)) {
    req.session.flash = { type: "error", message: "Email no válido" };
    return res.redirect("/users/edit");
  }

  const avatarError = isValidAvatar(req.file);
  if (avatarError) {
    req.session.flash = { type: "error", message: avatarError };
    return res.redirect("/users/edit");
  }

  if (req.file) {
    user.avatarUrl = req.file.path;
  }

  user.username = username;
  user.email = email;
  req.session.user!.username = username;

  req.session.flash = { type: "success", message: "Perfil actualizado" };
  res.redirect("/users/profile");
};

export const toggleFavorite = (req: Request, res: Response) => {
  const productId = parseInt(req.params.id);
  const user = users.find((u) => u.id === req.session.user!.id);

  if (!user) {
    req.session.flash = { type: "error", message: "Usuario no encontrado" };
    return res.redirect("back");
  }

  const index = user.favorites.indexOf(productId);

  if (index === -1) {
    user.favorites.push(productId); // Añadir a favoritos
  } else {
    user.favorites.splice(index, 1); // Quitar de favoritos
  }

  // Actualizar sesión
  req.session.user!.favorites = user.favorites;

  const returnTo = req.get("Referer") || "/products";
  res.redirect(returnTo);
};
export const showFavorites = (req: Request, res: Response) => {
  const user = users.find((u) => u.id === req.session.user!.id);

  if (!user) {
    req.session.flash = { type: "error", message: "Usuario no encontrado" };
    return res.redirect("/");
  }

  const favoriteProducts = user.favorites
    .map((id) => products.find((p) => p.id === id))
    .filter((p) => p !== undefined); // eliminar nulos

  res.render("completes/users/favorites", {
    products: favoriteProducts,
    session: req.session,
  });
};

