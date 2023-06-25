import React, {useState} from 'react';

import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import Inicio from './src/components/views/Inicio';
import Cart from './src/components/views/Cart';
import Login from './src/components/views/Login';

import Carrito from './src/components/ui/Carrito';

const Stack = createNativeStackNavigator()


const App = () => {
  const [ carrito, setCarrito ] = useState([])
  const [ itemsCarrito, setItemsCarrito ] = useState(0)

  const funcionnuevacarrito = () => {
    const hola = 2
  }

  return(
    <>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName='Login'
          screenOptions={{
            headerStyle: {
              backgroundColor: '#223C82'
            },
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            headerTitleAlign: 'center',
          }}
        >
          <Stack.Screen
            name='Login'
            component={Login}
            options={{
              title: 'Inicia Sesion',
              headerTitleStyle: {
                color: '#fff'
              },
              headerShown: false
            }}
          />
          <Stack.Screen
            name='Inicio'
            options={({ navigation, route }) => ({
              title: 'Inventario',
              headerTitleStyle: {
                color: '#fff'
              },
              headerBackVisible: false,
              headerRight: () => (
                <Carrito
                  navigation={navigation}
                  route={route}
                  carrito={carrito}
                  itemsCarrito={itemsCarrito}
                />
              )
            })}
          >
            {() => (
              <Inicio
                carrito={carrito}
                setCarrito={setCarrito}
                setItemsCarrito={setItemsCarrito}
                itemsCarrito={itemsCarrito}
              />
            )}
          </Stack.Screen>

          <Stack.Screen
            name='Cart'
            options={{
              title: 'Carrito',
              headerTitleStyle: {
                color: '#fff'
              },
              headerTintColor: '#fff', // color de la flecha
            }}
          >
            {() => (
              <Cart
                carrito={carrito}
                itemsCarrito={itemsCarrito}
              />
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </>
  )
}

export default App;
