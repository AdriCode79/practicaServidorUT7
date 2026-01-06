import { Request, Response, NextFunction } from "express";

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);

  const status = err.status || 500;
  const message = err.message || "Error interno del servidor";

  res.status(status).render("completes/error", {
    title: "Error",
    message,
  });
};

export default errorHandler;
