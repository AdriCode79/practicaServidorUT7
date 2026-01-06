import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { users } from "../data/users";
import { productService } from "../services/productService";


export const showRegister = (req: Request, res: Response) => {
  res.render("completes/users/register");
};

export const registerUser = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  const exists = users.find(u => u.email === email);
  if (exists) {
    req.session.flash = { type: "error", message: "El email ya está registrado" };
    return res.redirect("/users/register");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  users.push({
    id: users.length + 1,
    username,
    email,
    passwordHash
  });

  req.session.flash = { type: "success", message: "Registro completado" };
  res.redirect("/users/login");
};

export const showLogin = (req: Request, res: Response) => {
  res.render("completes/users/login");
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email);
  if (!user) {
    req.session.flash = { type: "error", message: "Credenciales incorrectas" };
    return res.redirect("/users/login");
  }

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) {
    req.session.flash = { type: "error", message: "Credenciales incorrectas" };
    return res.redirect("/users/login");
  }

  req.session.user = { id: user.id, username: user.username };
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

  const user = users.find(u => u.id === req.session.user!.id);

  const products = await productService.getByOwner(user!.id);

  res.render("completes/users/profile", {
    user,
    products,
    session: req.session
  });
};


export const showEditProfile = (req: Request, res: Response) => {
  const user = users.find(u => u.id === req.session.user!.id);


  res.render("completes/users/edit", {
    user,
    session: req.session
  });
};
export const updateProfile = (req: Request, res: Response) => {
  const { username, email } = req.body;
  const user = users.find(u => u.id === req.session.user!.id);


  if (!user) {
    req.session.flash = { type: "error", message: "Usuario no encontrado" };
    return res.redirect("/users/profile");
  }

  user.username = username;
  user.email = email;

  if (req.file) {
    user.avatarUrl = req.file.path; // Cloudinary URL
  }

  req.session.user!.username = username;

  req.session.flash = { type: "success", message: "Perfil actualizado" };
  res.redirect("/users/profile");
};

