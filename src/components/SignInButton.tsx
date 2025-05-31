import React, { type Dispatch } from 'react';
import { auth, provider } from '../firebase';
import { signInWithPopup, type User } from 'firebase/auth';
import { Button } from '@mui/material';

interface SignInButtonProps {
  setUser: Dispatch<User | null>;
  setIdToken: Dispatch<string>;
}

export const SignInButton = ({ setUser, setIdToken }: SignInButtonProps) => {
  const onSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      setIdToken(idToken);
      setUser(result.user);
    } catch (error) {
      console.error('Error during sign-in:', error);
    }
  };

  return (
    <Button
      variant='contained'
      onClick={onSignIn}
      sx={{ width: '25%', height: '20%' }}
    >
      Sign in with Google
    </Button>
  );
};
