import { users } from "../data/users";
import { products } from "../data/products";

export const favoriteService = {
  getUserFavorites(userId: number) {
    const user = users.find(u => u.id === userId);
    if (!user) throw new Error("Usuario no encontrado");

    return products.filter(p => user.favorites.includes(p.id));
  },

  isFavorite(userId: number, productId: number): boolean {
    const user = users.find(u => u.id === userId);
    if (!user) throw new Error("Usuario no encontrado");

    return user.favorites.includes(productId);
  },

  addFavorite(userId: number, productId: number) {
    const user = users.find(u => u.id === userId);
    const product = products.find(p => p.id === productId);
    if (!user || !product) throw new Error("Usuario o producto no encontrado");

    if (!user.favorites.includes(productId)) {
      user.favorites.push(productId);
    }
  },

  removeFavorite(userId: number, productId: number) {
    const user = users.find(u => u.id === userId);
    if (!user) throw new Error("Usuario no encontrado");

    user.favorites = user.favorites.filter(id => id !== productId);
  }
};
