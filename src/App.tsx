import React, { type ReactNode } from 'react';
import { TrafficDisplayPage } from './pages/TrafficDisplayPage';
import { Typography } from '@mui/material';
import { TrafficDataProvider } from './contexts/TrafficDataContext';

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

  static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error(`caught the following error: ${error}. ${errorInfo}`);
  }

  render() {
    return !this.state.hasError ? (
      <TrafficDataProvider>
        <TrafficDisplayPage />
      </TrafficDataProvider>
    ) : (
      <Typography variant='h1'>Something went wrong...</Typography>
    );
  }
}

export default App;
