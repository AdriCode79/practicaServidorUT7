import express, { Request, Response, NextFunction } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import session from "express-session";
import dotenv from "dotenv";
dotenv.config();

import indexRouter from "./routes/index";
import productRouter from "./routes/productRoutes";
import userRouter from "./routes/userRoutes";
// (luego añadiremos userRoutes, statsRoutes, etc.)

import notFoundHandler from "./middleware/notFoundHandler";
import errorHandler from "./middleware/errorHandler";


const app = express();

// Configuración básica
const PORT = process.env.PORT || 3000;

// Motor de vistas
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Middlewares globales
app.use(express.urlencoded({ extended: true })); // formularios
app.use(express.json()); // por si luego quieres JSON
app.use(cookieParser());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev-secret",
    resave: false,
    saveUninitialized: false,
  })
);

// Archivos estáticos
app.use(express.static(path.join(__dirname, "public")));

//middleware de session
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});


// Rutas
app.use("/", indexRouter);
app.use("/products", productRouter);
app.use("/users", userRouter);



// 404 y errores
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`SSR app listening on http://localhost:${PORT}`);
});

export default app;
