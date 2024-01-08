import React from 'react';
import { View } from 'react-native';
import Singup from './screens/Signup';
import Singin from './screens/Signin';
import Index from './screens/Index';
import Orders from './screens/Orders';
import Routes from './screens/Routes';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Index' screenOptions={{ headerShown:false }}> 
        <Stack.Screen name="Index" component={Index} />
        <Stack.Screen name="Orders" component={Orders} />
        <Stack.Screen name="Routes" component={Routes} />

        {/* <Stack.Screen name="Singup" component={Singup} />
        <Stack.Screen name="Singin" component={Singin} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
