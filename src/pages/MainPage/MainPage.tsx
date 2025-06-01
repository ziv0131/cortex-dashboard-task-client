import { useState } from 'react';
import { type User } from 'firebase/auth';
import { SignInButton } from '../../components/SignInButton';
import { Container } from '@mui/material';
import { useMainPageStyles } from './useMainPageStyles';
import { TrafficDataProvider } from '../../contexts/TrafficDataContext';
import { TrafficDisplayPage } from '../TrafficDisplayPage/TrafficDisplayPage';

export const MainPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [idToken, setIdToken] = useState<string>('');

  const classes = useMainPageStyles();

  return (
    <Container className={classes.pageContainer}>
      {user ? (
        <TrafficDataProvider idToken={idToken}>
          <TrafficDisplayPage />
        </TrafficDataProvider>
      ) : (
        <SignInButton setUser={setUser} setIdToken={setIdToken} />
      )}
    </Container>
  );
};
