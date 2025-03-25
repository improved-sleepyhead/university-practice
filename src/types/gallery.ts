export interface Artwork {
  id: string;
  title: string;
  artist: string;
  year: string;
  imageUrl: string;
  gallery: string;
  price: number; // 🔥 Исправлено, теперь это `number`
  category: string;
}
