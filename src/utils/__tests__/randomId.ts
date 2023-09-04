import { generateRandomId } from '../getRandomId';


test('should generate random ids', () => {
  const id1 = generateRandomId(5);
  const id2 = generateRandomId(5);
  expect(id2).not.toEqual(id1);
});
