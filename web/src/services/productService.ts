import { Product } from "../models/Product";
import { products as initialProducts } from "../data/products";

// Base de datos en memoria
let products: Product[] = [...initialProducts];
let nextId = Math.max(...products.map(p => p.id), 0) + 1;

export const productService = {
  // Obtener todos los productos
  getAll(): Promise<Product[]> {
    return Promise.resolve(products);
  },

  // Obtener producto por ID
  getById(id: number): Promise<Product | undefined> {
    return Promise.resolve(products.find(p => p.id === id));
  },

  // Obtener productos por usuario
  getByOwner(ownerId: number): Promise<Product[]> {
    return Promise.resolve(products.filter(p => p.ownerId === ownerId));
  },

  // Crear producto
  create(data: Omit<Product, "id" | "createdAt">): Promise<Product> {
    const newProduct: Product = {
      id: nextId++,
      createdAt: new Date(),
      ...data,
    };

    products.push(newProduct);
    return Promise.resolve(newProduct);
  },

  // Actualizar producto
  update(
    id: number,
    data: Partial<Omit<Product, "id" | "ownerId" | "createdAt">>
  ): Promise<Product | null> {
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return Promise.resolve(null);

    products[index] = { ...products[index], ...data };
    return Promise.resolve(products[index]);
  },

  // Eliminar producto
  remove(id: number): Promise<boolean> {
    const initialLength = products.length;
    products = products.filter(p => p.id !== id);
    return Promise.resolve(products.length < initialLength);
  },
};
