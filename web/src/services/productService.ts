import { Product } from "../models/Product";

// Base de datos temporal en memoria
let products: Product[] = [];
let nextId = 1;

export const productService = {
  // Obtener todos los productos
  async getAll(): Promise<Product[]> {
    return products;
  },

  // Obtener producto por ID
  async getById(id: number): Promise<Product | undefined> {
    return products.find((p) => p.id === id);
  },

  // Obtener productos por usuario (para "Mis productos")
  async getByOwner(ownerId: number): Promise<Product[]> {
    return products.filter((p) => p.ownerId === ownerId);
  },

  // Crear producto
  async create(data: Omit<Product, "id" | "createdAt">): Promise<Product> {
    const newProduct: Product = {
      id: nextId++,
      createdAt: new Date(),
      ...data,
    };

    products.push(newProduct);
    return newProduct;
  },

  // Actualizar producto
  async update(
    id: number,
    data: Partial<Omit<Product, "id" | "ownerId" | "createdAt">>
  ): Promise<Product | null> {
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return null;

    products[index] = {
      ...products[index],
      ...data,
    };

    return products[index];
  },

  // Eliminar producto
  async remove(id: number): Promise<boolean> {
    const initialLength = products.length;
    products = products.filter((p) => p.id !== id);
    return products.length < initialLength;
  },
};
