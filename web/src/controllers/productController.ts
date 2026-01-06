import { Request, Response, NextFunction } from "express";
import { productService } from "../services/productService";
import cloudinary from "../config/cloudinary";

// ===============================
// LISTAR PRODUCTOS
// ===============================
export const listProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = (req.query.q as string)?.toLowerCase() || "";
    const category = (req.query.category as string) || "";
    const minPrice = Number(req.query.minPrice) || 0;
    const maxPrice = Number(req.query.maxPrice) || Infinity;
    const sort = (req.query.sort as string) || "";

    let products = await productService.getAll();

    // 🔍 Búsqueda
    if (query) {
      products = products.filter(p =>
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
      );
    }

    // 🏷️ Categoría
    if (category) {
      products = products.filter(p => p.category === category);
    }

    // 💶 Precio
    products = products.filter(p => p.price >= minPrice && p.price <= maxPrice);

    // 🔽 ORDENACIÓN
    if (sort === "price_asc") {
      products.sort((a, b) => a.price - b.price);
    }

    if (sort === "price_desc") {
      products.sort((a, b) => b.price - a.price);
    }

    if (sort === "newest") {
      products.sort((a, b) => b.id - a.id); // asumiendo que id más alto = más reciente
    }

    res.render("completes/products/list", {
      title: "Productos tecnológicos",
      products,
      query,
      category,
      minPrice: req.query.minPrice,
      maxPrice: req.query.maxPrice,
      sort,
      session: req.session,
    });
  } catch (err) {
    next(err);
  }
};


// ===============================
// DETALLE DE PRODUCTO
// ===============================
export const showProductDetail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);
    const product = await productService.getById(id);

    if (!product) {
      return res.status(404).render("completes/error", {
        title: "Producto no encontrado",
        message: "El producto que buscas no existe.",
      });
    }

    res.render("completes/products/detail", {
      title: product.title,
      product,
      session: req.session,
    });
  } catch (err) {
    next(err);
  }
};

// ===============================
// FORMULARIO DE CREACIÓN
// ===============================
export const showCreateForm = (req: Request, res: Response) => {
  res.render("completes/products/form", {
    title: "Subir producto",
    product: null,
    formAction: "/products",
    formMethod: "POST",
    session: req.session,
  });
};

// ===============================
// CREAR PRODUCTO
// ===============================
// ===============================
// CREAR PRODUCTO
// ===============================
export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, description, price, category, condition } = req.body;

    // Validaciones básicas
    if (!title || !description || !price) {
      return res.status(400).render("completes/products/form", {
        title: "Subir producto",
        product: req.body,
        formAction: "/products",
        formMethod: "POST",
        error: "Título, descripción y precio son obligatorios.",
        session: req.session,
      });
    }

    // Imagen subida a Cloudinary (si existe)
    const imageUrl = req.file ? req.file.path : "/img/default-product.jpg";

    // Crear producto
    await productService.create({
      title,
      description,
      price: Number(price),
      category,
      condition,
      imageUrl,
      ownerId: req.session.user!.id,
    });

    res.redirect("/products/mine");
  } catch (error) {
    next(error);
  }
};

// ===============================
// FORMULARIO DE EDICIÓN
// ===============================
export const showEditForm = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);
    const product = await productService.getById(id);

    if (!product) {
      return res.status(404).render("completes/error", {
        title: "Producto no encontrado",
        message: "No existe un producto con ese ID.",
      });
    }

    // PROTECCIÓN: solo el dueño puede editar
    if (product.ownerId !== req.session.user!.id) {
      // 👈 FIX
      req.session.flash = {
        type: "error",
        message: "No tienes permiso para editar este producto.",
      };
      return res.redirect(`/products/${id}`);
    }

    res.render("completes/products/form", {
      title: "Editar producto",
      product,
      formAction: `/products/${id}/edit`,
      formMethod: "POST",
      session: req.session,
    });
  } catch (err) {
    next(err);
  }
};

// ===============================
// ACTUALIZAR PRODUCTO
// ===============================

export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);
    const product = await productService.getById(id);

    if (!product) {
      return res.status(404).render("completes/error", {
        title: "Error al actualizar",
        message: "No se pudo actualizar el producto.",
      });
    }

    // PROTECCIÓN: solo el dueño puede actualizar
    if (product.ownerId !== req.session.user!.id) {
      req.session.flash = {
        type: "error",
        message: "No tienes permiso para actualizar este producto.",
      };
      return res.redirect(`/products/${id}`);
    }

    const { title, description, price, category, condition } = req.body;

    const updateData: any = {
      title,
      description,
      price: Number(price),
      category,
      condition,
    };

    // Si el usuario sube una nueva imagen
    if (req.file) {
      // Borrar imagen antigua si no es la default
      if (
        product.imageUrl &&
        !product.imageUrl.includes("default-product.jpg")
      ) {
        const publicId = product.imageUrl.split("/").pop()?.split(".")[0];
        await cloudinary.uploader.destroy(`wearify-products/${publicId}`);
      }

      // Guardar nueva imagen
      updateData.imageUrl = req.file.path;
    }

    await productService.update(id, updateData);

    res.redirect(`/products/${id}`);
  } catch (err) {
    next(err);
  }
};

// ===============================
// BORRAR PRODUCTO
// ===============================

export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);
    const product = await productService.getById(id);

    if (!product) {
      return res.status(404).render("completes/error", {
        title: "Error al borrar",
        message: "No se pudo borrar el producto.",
      });
    }

    // PROTECCIÓN: solo el dueño puede borrar
    if (product.ownerId !== req.session.user!.id) {
      req.session.flash = {
        type: "error",
        message: "No tienes permiso para borrar este producto.",
      };
      return res.redirect(`/products/${id}`);
    }

    // Borrar imagen de Cloudinary si no es la default
    if (product.imageUrl && !product.imageUrl.includes("default-product.jpg")) {
      const publicId = product.imageUrl.split("/").pop()?.split(".")[0];
      await cloudinary.uploader.destroy(`wearify-products/${publicId}`);
    }

    await productService.remove(id);

    res.redirect("/products/mine");
  } catch (err) {
    next(err);
  }
};

// ===============================
// MIS PRODUCTOS
// ===============================
export const myProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const products = await productService.getByOwner(req.session.user!.id); // 👈 FIX

    res.render("completes/products/mine", {
      title: "Mis productos",
      products,
      session: req.session,
    });
  } catch (err) {
    next(err);
  }
};
