import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { RootState, useSelector } from '../../services/store';

export const AppHeader: FC = () => {
  const name = useSelector((store: RootState) => store.user.user.name);

  return <AppHeaderUI userName={name} />;
};
