
export interface Artwork {
    id: string; // Измените на string для совместимости с Unsplash
    artist: string;
    title: string;
    year: string;
    gallery: string;
    price: number; // Храним как число, форматируем при отображении
    imageUrl: string;
    category?: string; // Опциональное поле
  }