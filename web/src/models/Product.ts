export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  condition: "nuevo" | "como nuevo" | "bueno" | "aceptable";
  imageUrl: string;
  createdAt: Date;
  ownerId: number; 
}
