import React from 'react';
import { InsertDataComponent } from './data/insertDataComponent';
import { TrafficDisplayPage } from './pages/TrafficDisplayPage';

class App extends React.Component {
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error(error);
  }

  render() {
    return (
      <>
        <TrafficDisplayPage />
      </>
    );
  }
}

export default App;
