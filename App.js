import React from 'react';
import Index from './screens/Index';
import Debst from './screens/Debts';
import Singup from './screens/Signup';
import Singin from './screens/Signin';
import Orders from './screens/Orders';
import Routes from './screens/Routes';
import Invoce from './screens/Invoce';
import Settings from './screens/Settings';
import Balances from './screens/Balances';
import Contracts from './screens/Contract';
import Kontragent from './screens/Kontragent';
import CassaOrders from './screens/CassaOrders';
import Nomenklatura from './screens/Nomenklatura';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Server from './screens/Server';
import Goods from './screens/Goods';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Index' screenOptions={{ headerShown:false }}> 
        <Stack.Screen name="Index" component={Index} />
        <Stack.Screen name="Orders" component={Orders} />
        <Stack.Screen name="Routes" component={Routes} />
        <Stack.Screen name="Invoce" component={Invoce} />
        <Stack.Screen name="Contracts" component={Contracts} />
        <Stack.Screen name="Kontragent" component={Kontragent} />
        <Stack.Screen name="Nomenklatura" component={Nomenklatura} />
        <Stack.Screen name="Balances" component={Balances} />
        <Stack.Screen name="Debts" component={Debst} />
        <Stack.Screen name="CassaOrders" component={CassaOrders} />
        <Stack.Screen name="Settings" component={Settings} />
        <Stack.Screen name="Server" component={Server} />
        <Stack.Screen name="Goods" component={Goods} />
        <Stack.Screen name="Singup" component={Singup} />
        <Stack.Screen name="Singin" component={Singin} />
      </Stack.Navigator> 
    </NavigationContainer>
  );
}
