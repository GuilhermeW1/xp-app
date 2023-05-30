export interface Service{
  id: string;
  name: string;
  price: number;
  time: number;
  imagePath?: string | null;
}


export type UserService = Omit<Service, 'imagePath'> & {imageUrl: null | string}
