import { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';

import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';

// Импортируйте типизированные хуки из store.ts
import { useDispatch, useSelector } from '../../services/store'; // Убедитесь, что путь правильный
import { addIngredient } from '../../slices/burgerConstructor';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const location = useLocation();

    const dispatch = useDispatch(); // Теперь типизация происходит автоматически

    const handleAdd = () => {
      dispatch(addIngredient({ ...ingredient, id: ingredient._id }));
    };

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={count}
        locationState={{ background: location }}
        handleAdd={handleAdd}
      />
    );
  }
);
