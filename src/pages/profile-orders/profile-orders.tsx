import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { RootState, useDispatch, useSelector } from '../../services/store';
import { getOrders } from '../../slices/orderSlice';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getOrders());
  }, []);

  const orders: TOrder[] = useSelector(
    (store: RootState) => store.orders.orders
  );

  return <ProfileOrdersUI orders={orders} />;
};
