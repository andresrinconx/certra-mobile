import React, {useState} from 'react';

import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import Inicio from './src/components/views/Inicio';
import Carrito from './src/components/ui/Carrito';
import Cart from './src/components/views/Cart';

const Stack = createNativeStackNavigator()

const App = () => {
  const [ carrito, setCarrito ] = useState([])
  const [ itemsCarrito, setItemsCarrito ] = useState(0)

  return(
    <>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName='Inicio'
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
            name='Inicio'
            options={({ navigation, route }) => ({
              title: 'Inventario',
              headerTitleStyle: {
                color: '#fff'
              },
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
