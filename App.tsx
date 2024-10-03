//rfc +tab funcion normal
//rafc +tab arrow function
import React from 'react'
import { Text } from 'react-native'
import { PaperProvider } from 'react-native-paper'
import LoginScreen from './src/screens/LoginScreen';
import { NavigationContainer } from '@react-navigation/native';
import { StackNavigator } from './src/navigator/StackNavigator';

const App = () => {
  return (
    <NavigationContainer>

      <PaperProvider>
        <StackNavigator/>
      </PaperProvider>
      
    </NavigationContainer>
  )
}

export default App

