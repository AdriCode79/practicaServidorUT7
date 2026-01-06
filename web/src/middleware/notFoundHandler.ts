import { Request, Response, NextFunction } from "express";

const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).render("completes/error", {
    title: "Página no encontrada",
    message: "La página que buscas no existe.",
  });
};

export default notFoundHandler;
