import React, { type ReactNode } from 'react';
import { TrafficDisplayPage } from './pages/TrafficDisplayPage/TrafficDisplayPage';
import { Typography } from '@mui/material';
import { TrafficDataProvider } from './contexts/TrafficDataContext';
import { MainPage } from './pages/MainPage/MainPage';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

class App extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  componentDidMount(): void {
    const missingEssentialEnvVariables = [
      import.meta.env.VITE_FIREBASE_API_KEY,
      import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      import.meta.env.VITE_FIREBASE_PROJECT_ID,
      import.meta.env.VITE_FIREBASE_REGION,
    ].filter((envVariable) => !envVariable);
    if (missingEssentialEnvVariables.length > 0) {
      console.error(
        `the following environment variables: ${missingEssentialEnvVariables}`
      );
      this.state.hasError = true;
    }
  }

  static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error(`caught the following error: ${error}. ${errorInfo}`);
  }

  render() {
    return !this.state.hasError ? (
      <MainPage />
    ) : (
      <Typography variant='h1'>Something went wrong...</Typography>
    );
  }
}

export default App;
