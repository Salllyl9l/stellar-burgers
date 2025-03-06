import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient } from '@utils-types';

interface StateConstructor {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
}

const initialConstructorState: StateConstructor = {
  bun: null,
  ingredients: []
};

const generateUniqueId = () => `${Date.now()}_${Math.random()}`;

export const burgerConstructorSlice = createSlice({
  name: 'burgerBuilder',
  initialState: initialConstructorState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        const { type } = action.payload;
        state.bun = type === 'bun' ? action.payload : state.bun;
        if (type !== 'bun') {
          state.ingredients = [...state.ingredients, action.payload];
        }
      },
      prepare: (ingredient: TConstructorIngredient) => {
        const uniqueId = generateUniqueId();
        return { payload: { ...ingredient, id: uniqueId } };
      }
    },
    removeIngredient: (
      state,
      action: PayloadAction<TConstructorIngredient>
    ) => {
      state.ingredients = state.ingredients.filter(
        (ingredient) => ingredient.id !== action.payload.id
      );
    },
    clearAll: (state) => {
      state.bun = null;
      state.ingredients = [];
    },
    setIngredients: (
      state,
      action: PayloadAction<TConstructorIngredient[]>
    ) => {
      state.ingredients = [...action.payload];
    }
  }
});

export const { addIngredient, removeIngredient, clearAll, setIngredients } =
  burgerConstructorSlice.actions;

export default burgerConstructorSlice.reducer;
