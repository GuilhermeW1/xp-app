import type { UserProduct } from '../types/Product';

export function isProduct(item: unknown): item is UserProduct{
  return (
    typeof item === 'object' &&
    item !== null &&
    'id' in item &&
    'name' in item &&
    'description' in item &&
    'imageUrl' in item
  );
}
