export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  condition: "nuevo" | "como_nuevo" | "bueno" | "aceptable";
  imageUrl: string;
  createdAt: Date;
  ownerId: number; // 👈 este es el único dueño real
}
