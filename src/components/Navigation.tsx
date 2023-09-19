import { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { getDataStorage } from '../utils/asyncStorage'
import LoaderLogoScreen from './LoaderLogoScreen'
import Home from '../views/Home'
import Cart from '../views/Cart'
import Login from '../views/Login'
import Search from '../views/Search'
import Product from '../views/Product'
import useLogin from '../hooks/useLogin'
import useInv from '../hooks/useInv'
import Profile from '../views/Profile'
import Itinerary from '../views/Itinerary'
import ItineraryDay from '../views/ItineraryDay'

const Stack = createNativeStackNavigator()

const Navigation = () => {
  const [loadingStorage, setLoadingStorage] = useState(true)

  const { login, setLogin, setThemeColors, setMyUser, myUser } = useLogin()
  const { setProductsCart, setFlowControl, flowControl } = useInv()

  // get storage (global)
  useEffect(() => {
    const getStorage = async () => {
      // get storage
      const productsCartStorage = await getDataStorage('productsCart')
      const flowControlStorage = await getDataStorage('flowControl')
      const themeColorsStorage = await getDataStorage('themeColors')
      const loginStorage = await getDataStorage('login')
      const myUserStorage = await getDataStorage('myUser')
  
      // set data
      setProductsCart(productsCartStorage ? JSON.parse(productsCartStorage) : [])
      setFlowControl(flowControlStorage ? JSON.parse(flowControlStorage) : {})
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

  useEffect(() => {
    if (!loadingStorage) {
      if (!flowControl.selected) {
        setFlowControl({
          ...flowControl,
          showProducts: myUser.from === 'scli'           ? true  : 
                        myUser.from === 'usuario'        ? false :
                        myUser.from === 'usuario-clipro' ? false : null,

          showLogoCertra: myUser.from === 'scli'           ? false : 
                          myUser.from === 'usuario'        ? true  :
                          myUser.from === 'usuario-clipro' ? true  : null,

          showItinerary: myUser.from === 'scli'           ? false : 
                         myUser.from === 'usuario'        ? true  :
                         myUser.from === 'usuario-clipro' ? false : null,

          showSelectCustomer: myUser.from === 'scli'           ? false : 
                              myUser.from === 'usuario'        ? true  :
                              myUser.from === 'usuario-clipro' ? true  : null,

          showSelectSearch: myUser.from === 'scli'           ? false : 
                            myUser.from === 'usuario'        ? true  :
                            myUser.from === 'usuario-clipro' ? true  : null,
        })
      }
    }
  }, [loadingStorage, myUser])

  return (
    <>
      {loadingStorage ? (
        <LoaderLogoScreen />
      ) : (
        <NavigationContainer>
          <Stack.Navigator initialRouteName={login ? 'Home' : 'Login'}>
            <Stack.Screen name='Login' component={Login} options={{ headerShown: false, title: 'Login' }} />
            <Stack.Screen name='Home' component={Home} options={{ headerShown: false, title: 'Home', headerBackVisible: false }} />
            <Stack.Screen name='Profile' component={Profile} options={{ headerShown: false, title: 'Profile', animation: 'fade_from_bottom' }} />
            <Stack.Screen name='Itinerary' component={Itinerary} options={{ headerShown: false, title: 'Itinerary', animation: 'fade_from_bottom'  }} />
            <Stack.Screen name='ItineraryDay' component={ItineraryDay} options={{ headerShown: false, title: 'ItineraryDay' }} />
            <Stack.Screen name='Search' component={Search} options={{ headerShown: false, title: 'Search', animation: 'fade_from_bottom'  }} />
            <Stack.Screen name='Cart' component={Cart} options={{ headerShown: false, title: 'Cart', animation: 'fade_from_bottom' }} />
            <Stack.Screen name='Product' component={Product} options={{ headerShown: false, title: 'Product', animation: 'fade_from_bottom' }} />
          </Stack.Navigator>
        </NavigationContainer>
      )}
    </>
  )
}

export default Navigation