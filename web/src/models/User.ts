export interface User {
  id: number;
  username: string;
  email: string;
  passwordHash: string;
  avatarUrl?: string;
  favorites: number[]; // IDs de productos favoritos
}
