import { formatCurrency } from '../formatCurrency';

test('should format currency correctly', () => {
  const result  = formatCurrency(9);
  expect(result).toMatchInlineSnapshot('"R$ 9,00"');
});
