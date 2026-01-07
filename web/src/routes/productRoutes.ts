import { Router } from "express";
import {
  listProducts,
  showProductDetail,
  showCreateForm,
  createProduct,
  showEditForm,
  updateProduct,
  deleteProduct,
  myProducts
} from "../controllers/productController";

import { requireAuth } from "../middleware/requireAuth";
import upload from "../middleware/upload";

const router = Router();

// Listado público
router.get("/", listProducts);

// Mis productos (solo logueado)
router.get("/mine", requireAuth, myProducts);

// Crear producto (solo logueado)
router.get("/new", requireAuth, showCreateForm);

// Crear producto con subida de imagen
router.post("/", requireAuth, upload.single("image"), createProduct);

// Detalle público
router.get("/:id", showProductDetail);

// Editar producto (solo dueño)
router.get("/:id/edit", requireAuth, showEditForm);

// ✅ Corrige esta línea
router.post("/:id/edit", requireAuth, upload.single("image"), updateProduct);


// Eliminar producto (solo dueño)
router.post("/:id/delete", requireAuth, deleteProduct);

export default router;
