// Necesario para que TypeScript trate este archivo como módulo
export {};

import "express-session";

declare module "express-session" {
  interface SessionData {
    user?: {
      id: number;
      username: string;
      email: string;
      avatar?: string;
      favorites: number[]; // 👈 Añadido aquí
    };
    flash?: {
      type: "success" | "error";
      message: string;
    };
    formData?: {
      username?: string;
      email?: string;
    };
  }
}


declare global {
  namespace Express {
    interface Request {
      file?: Express.Multer.File;
      files?: Express.Multer.File[];
    }
  }
}
