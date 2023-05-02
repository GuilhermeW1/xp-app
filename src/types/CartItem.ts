import { Service } from './service';

export interface CartItem {
  item: Service;
  quantity?: number;
}
