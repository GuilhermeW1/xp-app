import { CartItem } from './CartItem';

export type RootStackParamList = {
  HomeUser: undefined;
  Schedule: {
    price: number;
    time: number;
    cartItems: CartItem[]
  } | undefined
}
