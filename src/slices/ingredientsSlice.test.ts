import { expect, describe } from '@jest/globals';
import { getInridients } from './ingredientsSlice';
import ingredientsSlice, { initialState } from './ingredientsSlice';
import { TIngredient } from '@utils-types';

// Моковые данные для тестов
const mockIngredients: TIngredient[] = [
  {
    _id: '1',
    name: 'Булка',
    type: 'bun',
    proteins: 10,
    fat: 5,
    carbohydrates: 15,
    calories: 100,
    price: 100,
    image: 'image_url',
    image_mobile: 'mobile_image_url',
    image_large: 'large_image_url'
  }
];

describe('ingredientsSlice reducer', () => {
  it('should return initial state when passed empty action', () => {
    const state = ingredientsSlice.reducer(undefined, { type: '' });
    expect(state).toEqual(initialState);
  });

  it('should handle getInridients.pending', () => {
    const state = ingredientsSlice.reducer(
      initialState,
      getInridients.pending('')
    );
    expect(state).toEqual({
      ...initialState,
      isLoading: true,
      error: null
    });
  });

  it('should handle getInridients.fulfilled', () => {
    const state = ingredientsSlice.reducer(
      initialState,
      getInridients.fulfilled(mockIngredients, '')
    );
    expect(state).toEqual({
      ...initialState,
      ingredients: mockIngredients,
      isLoading: false
    });
  });

  it('should handle getInridients.rejected', () => {
    const errorMessage = 'Failed to fetch ingredients';
    const state = ingredientsSlice.reducer(
      initialState,
      getInridients.rejected(new Error(errorMessage), '')
    );
    expect(state).toEqual({
      ...initialState,
      isLoading: false,
      error: errorMessage
    });
  });
});