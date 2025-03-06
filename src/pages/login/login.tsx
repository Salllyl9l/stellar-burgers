import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { RootState, useDispatch, useSelector } from '../../services/store';
import { loginUser } from '../../slices/userSlice';
import { useLocation, useNavigate } from 'react-router-dom';
import { unwrapResult } from '@reduxjs/toolkit';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState('');

  const error = useSelector((store: RootState) => store.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setErrorText('');

    try {
      const resultAction = await dispatch(loginUser({ email, password }));
      unwrapResult(resultAction);
      const from =
        (location.state as { from?: Location })?.from?.pathname || '/';
      navigate(from);
    } catch (err: any) {
      setErrorText(
        err.message || 'Не вышло зайти, попробуйте другой пароль или почту'
      );
    }
  };

  return (
    <LoginUI
      errorText={
        errorText ||
        (typeof error === 'string'
          ? error
          : (error as { message?: string })?.message)
      }
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
