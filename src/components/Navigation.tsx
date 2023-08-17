import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { theme } from '../styles'
import Home from '../views/Home'
import Cart from '../views/Cart'
import Login from '../views/Login'
import Search from '../views/Search'
import Product from '../views/Product'
import useLogin from '../hooks/useLogin'
import LoaderLogoScreen from './loaders/LoaderLogoScreen'
import useInv from '../hooks/useInv'

const Stack = createNativeStackNavigator()

const Navigation = () => {
  const {login, loaders: loadersLogin} = useLogin()
  const {loadingLogin} = loadersLogin

  const {loaders: loadersInv} = useInv()
  const {loadingStorageInv} = loadersInv

  return (
    <>
      {loadingLogin || loadingStorageInv ? (
        <LoaderLogoScreen />
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
            <Stack.Screen name='Login' component={Login} options={{headerShown: false, title: 'Login'}} />
            <Stack.Screen name='Home' component={Home} options={{headerShown: false, title: 'Home', headerBackVisible: false}} />
            <Stack.Screen name='Cart' component={Cart} options={{headerShown: false, title: 'Cart', headerTintColor: '#fff'}} />
            <Stack.Screen name='Search' component={Search} options={{headerShown: false, title: 'Search', animation: 'none'}}/>
            <Stack.Screen name='Product' component={Product} options={{headerShown: false, title: 'Product', animation: 'fade_from_bottom'}} />
          </Stack.Navigator>
        </NavigationContainer>
      )}
    </>
  )
}

export default Navigation