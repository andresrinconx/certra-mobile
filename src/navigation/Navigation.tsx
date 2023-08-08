import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { theme } from '../styles'
import Home from '../views/Home'
import Cart from '../views/Cart'
import Login from '../views/Login'
import LogoScreen from '../components/LogoScreen'
import useLogin from '../hooks/useLogin'

const Stack = createNativeStackNavigator()

const Navigation = () => {
  const {login, loading} = useLogin()

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
              <Stack.Screen name='Login' component={Login} options={{headerShown: false, title: 'Login' }}/>

              <Stack.Screen name='Home'
                options={{
                  headerShown: false,
                  title: 'Inventario',
                  headerBackVisible: false,
                }}
              >
                {() => (<Home />)}
              </Stack.Screen>

              <Stack.Screen name='Cart'
                options={{
                  headerShown: false, 
                  title: 'cart',
                  headerTintColor: '#fff',
                }}
              >
                {() => (<Cart />)}
              </Stack.Screen>
            </Stack.Navigator>
          </NavigationContainer>
        )
      }
    </>
  )
}

export default Navigation