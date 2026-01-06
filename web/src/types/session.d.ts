// Necesario para que TypeScript trate este archivo como módulo
export {};

import "express-session";

declare module "express-session" {
  interface SessionData {
    flash?: {
      type: string;
      message: string;
    };
    user?: {
      id: number;
      username: string;
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
