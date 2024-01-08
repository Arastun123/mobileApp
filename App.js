import React from 'react';
import { View } from 'react-native';
import Singup from './screens/Signup';
import Singin from './screens/Signin';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Singup' screenOptions={{ headerShown:false }}> 
        <Stack.Screen name="Singup" component={Singup} />
        <Stack.Screen name="Singin" component={Singin} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
