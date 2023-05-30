export interface Product{
  id: string;
  name: string;
  price: number;
  description?: string;
  imagePath?: string | null;
  time?: number;
}

export type UserProduct = Omit<Product, 'imagePath'> & {imageUrl: string}
