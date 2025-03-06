import { FC, useMemo, useCallback } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  AppDispatch,
  isAuthCheckedSelector,
  RootState
} from '../../services/store';
import { newOrder, resetOrder } from '../../slices/newOrderSlice';
import { clearAll } from '../../slices/burgerConstructor';

export const BurgerConstructor: FC = () => {
  /** Получаем данные из стора */
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const constructorItems = useSelector(
    (state: RootState) => state.burgerConstructor
  );
  const orderRequest = useSelector(
    (state: RootState) => state.newOrder.request
  );
  const orderModalData = useSelector(
    (state: RootState) => state.newOrder.orderData
  );
  const isAuthChecked = useSelector(isAuthCheckedSelector);

  const onOrderClick = useCallback(() => {
    if (!constructorItems.bun || orderRequest) return;

    if (!isAuthChecked) {
      navigate('/login');
      return;
    }

    const orderData = constructorItems.bun
      ? [
          constructorItems.bun._id,
          ...constructorItems.ingredients.map((item) => item._id)
        ]
      : [];

    dispatch(newOrder(orderData));
  }, [constructorItems, orderRequest, isAuthChecked, dispatch, navigate]);

  const closeOrderModal = useCallback(() => {
    dispatch(resetOrder());
    dispatch(clearAll());
    navigate('/');
  }, [dispatch, navigate]);

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
