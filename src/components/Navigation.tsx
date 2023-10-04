import { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { getDataStorage } from '../utils/asyncStorage'
import LoaderLogoScreen from './elements/LoaderLogoScreen'
import Home from '../views/Home'
import Cart from '../views/Cart'
import Login from '../views/Login'
import Inventory from '../views/Inventory'
import Product from '../views/Product'
import useLogin from '../hooks/useLogin'
import useInv from '../hooks/useInv'
import Profile from '../views/Profile'
import Itinerary from '../views/Itinerary'
import ItineraryDay from '../views/ItineraryDay'
import OrderRecord from '../views/OrderRecord'
import Customer from '../views/Customer'

const Stack = createNativeStackNavigator()

const Navigation = () => {
  const [loadingStorage, setLoadingStorage] = useState(true)

  const { login, setLogin, setThemeColors, setMyUser } = useLogin()
  const { setProductsCart } = useInv()

  // get storage (global)
  useEffect(() => {
    const getStorage = async () => {
      console.log('getting')
      // get storage
      const productsCartStorage = await getDataStorage('productsCart')
      const themeColorsStorage = await getDataStorage('themeColors')
      const loginStorage = await getDataStorage('login')
      const myUserStorage = await getDataStorage('myUser')
  
      // set data
      setProductsCart(productsCartStorage ? JSON.parse(productsCartStorage) : [])
      setThemeColors(themeColorsStorage ? JSON.parse(themeColorsStorage) : {})
      setLogin(loginStorage === 'true' ? true : false)
      setMyUser(myUserStorage ? JSON.parse(myUserStorage) : {})
    }
    getStorage().then(() => {
      setTimeout(() => {
        setLoadingStorage(false)
      }, 1000)
    })
  }, [])

  return (
    <>
      {loadingStorage ? (
        <LoaderLogoScreen />
      ) : (
        <NavigationContainer>
          <Stack.Navigator initialRouteName={login ? 'Home' : 'Login'}>
            <Stack.Screen name='Login' component={Login} options={{ headerShown: false }} />
            <Stack.Screen name='Home' component={Home} options={{ headerShown: false, headerBackVisible: false }} />
            <Stack.Screen name='Customer' component={Customer} options={{ headerShown: false, animation: 'fade_from_bottom' }} />
            <Stack.Screen name='Profile' component={Profile} options={{ headerShown: false, animation: 'fade_from_bottom' }} />
            <Stack.Screen name='Itinerary' component={Itinerary} options={{ headerShown: false, animation: 'fade_from_bottom' }} />
            <Stack.Screen name='ItineraryDay' component={ItineraryDay} options={{ headerShown: false, animation: 'fade_from_bottom' }} />
            <Stack.Screen name='OrderRecord' component={OrderRecord} options={{ headerShown: false, animation: 'fade_from_bottom' }} />
            <Stack.Screen name='Inventory' component={Inventory} options={{ headerShown: false, animation: 'fade_from_bottom' }} />
            <Stack.Screen name='Cart' component={Cart} options={{ headerShown: false, animation: 'fade_from_bottom' }} />
            <Stack.Screen name='Product' component={Product} options={{ headerShown: false, animation: 'fade_from_bottom' }} />
          </Stack.Navigator>
        </NavigationContainer>
      )}
    </>
  )
}

export default Navigation