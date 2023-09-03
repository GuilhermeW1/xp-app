import { isProduct } from '../isProcudt';
import type { UserProduct } from '../../types/Product';

describe('isProduct test', () => {
  it('should return true if is product', () => {
    const product:UserProduct = {
      id: 'fake-id',
      name: 'fake-name',
      price: 100,
      description: 'fake-description',
      imageUrl: 'fake-url',
      time: undefined
    };

    expect(isProduct(product)).toBeTruthy();
  });

  it('isProduct should return false if is not id', () => {
    const notAProduct = {
      name: 'fake-name',
      price: 100,
      description: 'fake-description',
      imageUrl: 'fake-url',
      time: undefined
    };

    expect(isProduct(notAProduct)).toBeFalsy();
  });

  it('isProduct should return false if is not name', () => {
    const notAProduct = {
      id: 'fake-id',
      price: 100,
      description: 'fake-description',
      imageUrl: 'fake-url',
      time: undefined
    };

    expect(isProduct(notAProduct)).toBeFalsy();
  });

  it('isProduct should return false if is not price', () => {
    const notAProduct = {
      id: 'fake-id',
      name: 'fake-name',
      description: 'fake-description',
      imageUrl: 'fake-url',
      time: undefined
    };

    expect(isProduct(notAProduct)).toBeFalsy();
  });

  it('isProduct should return false if is not description', () => {
    const notAProduct = {
      id: 'fake-id',
      name: 'fake-name',
      price: 100,
      imageUrl: 'fake-url',
      time: undefined
    };

    expect(isProduct(notAProduct)).toBeFalsy();
  });

  it('isProduct should return false if is not imageUrl', () => {
    const notAProduct = {
      id: 'fake-id',
      name: 'fake-name',
      price: 100,
      description: 'fake-description',
      time: undefined
    };

    expect(isProduct(notAProduct)).toBeFalsy();
  });
});

