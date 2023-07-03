import React, {useState} from 'react';

import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { theme } from '../styles';

import Home from '../views/Home';
import Cart from '../views/Cart';
import Login from '../views/Login';
import CartIcon from '../components/CartIcon';

const Stack = createNativeStackNavigator()

const Navigation = () => {
  const [carrito, setCarrito] = useState([])
  const [itemsCarrito, setItemsCarrito] = useState(0)
  const [type, setType] = useState('grid')

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login' 
        screenOptions={{
          headerShown: false,
          headerTitleAlign: 'center',
          headerStyle: {backgroundColor: `${theme.turquesaOscuro}`},
          headerTitleStyle: {
            color: '#fff', 
            fontWeight: '800', 
            fontSize: 24,
          },
          
        }}
      >
        <Stack.Screen name='Login' component={Login} options={{title: 'Login'}} />

        <Stack.Screen name='Home'
          options={{
            headerShown: true,
            title: 'Inventario',
            headerBackVisible: false,
            headerRight: () => (
              <CartIcon
                carrito={carrito}
                itemsCarrito={itemsCarrito}
              />
            )
          }}
        >
          {() => (
            <Home
              carrito={carrito}
              setCarrito={setCarrito}
              setItemsCarrito={setItemsCarrito}
              itemsCarrito={itemsCarrito}
              type={type}
              setType={setType}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name='Cart'
          options={{
            headerShown: false, 
            title: 'Carrito',
            headerTintColor: '#fff',
          }}
        >
          {() => (
            <Cart
              carrito={carrito}
              setCarrito={setCarrito}
              itemsCarrito={itemsCarrito}
              type={type}
              setType={setType}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default Navigation