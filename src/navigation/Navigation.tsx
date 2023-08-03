import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { theme } from '../styles'
import Home from '../views/Home'
import Cart from '../views/Cart'
import Login from '../views/Login'
import CartIcon from '../components/CartIcon'
import LogoScreen from '../components/LogoScreen'
import LogOut from '../components/LogOut'
import useLogin from '../hooks/useLogin'
import useCart from '../hooks/useCart'

const Stack = createNativeStackNavigator()

const Navigation = () => {
  const {login, loading} = useLogin()
  const {cart, setCart, type, setType} = useCart()

  return (
    <>
      {loading
        ? (
          <LogoScreen />
        ) : (
          <NavigationContainer>
            <Stack.Navigator initialRouteName={login ? 'Home' : 'Login'}
              screenOptions={{
                headerShown: false,
                headerTitleAlign: 'center',
                headerStyle: {backgroundColor: `${theme.turquesaClaro}`},
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
                      cart={cart}
                    />
                  ),
                  headerLeft: () => (
                    <LogOut
                      setCart={setCart}
                    />
                  )
                }}
              >
                {() => (
                  <Home
                    cart={cart}
                    setCart={setCart}
                    type={type}
                    setType={setType}
                  />
                )}
              </Stack.Screen>

              <Stack.Screen name='Cart'
                options={{
                  headerShown: false, 
                  title: 'cart',
                  headerTintColor: '#fff',
                }}
              >
                {() => (
                  <Cart
                    cart={cart}
                    setCart={setCart}
                  />
                )}
              </Stack.Screen>
            </Stack.Navigator>
          </NavigationContainer>
        )
      }
    </>
  )
}

export default Navigation