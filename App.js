import React, {useState, useEffect} from 'react';

import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import Inicio from './src/controllers/Inicio';
import Carrito from './src/controllers/ui/Carrito';
import Cart from './src/controllers/Cart';

const Stack = createNativeStackNavigator()

const App = () => {

  const [data, setData] = useState([]);

  useEffect(() => {
    const jsonData = require('./src/consultas/sinv.json'); // el require se usa para cargar archivos
    setData(jsonData);
  }, []);

  return(
    <>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName='Inicio'
          screenOptions={{
            headerStyle: {
              backgroundColor: '#002c5f'
            },
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            headerTitleAlign: 'center',
          }}
        >
          <Stack.Screen
            name='Inicio'
            component={Inicio}
            options={ ({navigation, route}) => ({
              title: 'Inventario',
              headerTitleStyle: {
                color: '#fff'
              },
              headerRight: () => <Carrito 
                                  navigation={navigation}
                                  route={route}
                                 />
            }) }
          />
          <Stack.Screen
            name='Cart'
            component={Cart}
            options={{
              title: 'Cart',
              headerTitleStyle: {
                color: '#fff'
              },
              headerTintColor: '#fff', // color de la flecha
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  )
}

export default App;
