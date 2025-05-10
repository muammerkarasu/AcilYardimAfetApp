import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import StackRoutes from './StackRoutes';
import { AuthProvider } from '../context/AuthContext';

const App = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <StackRoutes />
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;
