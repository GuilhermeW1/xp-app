import { UserProduct } from './Product';
import { UserService } from './service';

export interface CartItem {
  item: UserService | UserProduct;
  quantity?: number;
}
