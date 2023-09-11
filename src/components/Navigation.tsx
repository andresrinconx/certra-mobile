import { useEffect, useState } from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import Home from "../views/Home"
import Cart from "../views/Cart"
import Login from "../views/Login"
import Search from "../views/Search"
import Product from "../views/Product"
import useLogin from "../hooks/useLogin"
import LoaderLogoScreen from "./loaders/LoaderLogoScreen"
import useInv from "../hooks/useInv"
import { getDataStorage } from "../utils/asyncStorage"
import Profile from "../views/Profile"
import Itinerary from "../views/Itinerary"
import ItineraryDay from "../views/ItineraryDay"

const Stack = createNativeStackNavigator()

const Navigation = () => {
  const [loadingStorage, setLoadingStorage] = useState(false) // esta cargando el storage
  const [storageLoaded, setStorageLoaded] = useState(false) // ya cargo el storage

  const { login, setLogin, setThemeColors, setMyUser, myUser } = useLogin()
  const { setProductsCart, setFlowControl, flowControl } = useInv()

  // get storage (global)
  useEffect(() => {
    const getStorage = async () => {
      setLoadingStorage(true)

      // get storage
      const productsCartStorage = await getDataStorage("productsCart")
      const flowControlStorage = await getDataStorage("flowControl")
      const themeColorsStorage = await getDataStorage("themeColors")
      const loginStorage = await getDataStorage("login")
      const myUserStorage = await getDataStorage("myUser")

      // set data
      setProductsCart(productsCartStorage ? JSON.parse(productsCartStorage) : [])
      setFlowControl(flowControlStorage ? JSON.parse(flowControlStorage) : {})
      setThemeColors(themeColorsStorage ? JSON.parse(themeColorsStorage) : {})
      setLogin(loginStorage === "true" ? true : false)
      setMyUser(myUserStorage ? JSON.parse(myUserStorage) : {})

      // finish loader logo screen
      setTimeout(() => {
        setLoadingStorage(false)
        setStorageLoaded(true)
      }, 1000);
    }
    getStorage()
  }, [])

  useEffect(() => {
    if (storageLoaded) {
      if (!flowControl.selected) { // is not selected
        if (myUser.from === "usuario") {

          // "usuario" will see this
          setFlowControl({
            ...flowControl,
            showProducts: false,
            showLogoCertra: true,
            showItinerary: true,
            showSelectCustomer: true,
            showSelectSearch: true
          })
        } else if (myUser.from === "usuario-clipro") {

          // "usuario-clipro" will see this
          setFlowControl({
            ...flowControl,
            showProducts: false,
            showLogoCertra: true,
            showItinerary: false,
            showSelectCustomer: true,
            showSelectSearch: true
          })
        } else if (myUser.from === "scli") {

          // "scli" will see this
          setFlowControl({
            ...flowControl,
            showProducts: true,
            showItinerary: false,
            showSelectCustomer: false
          })
        }
      }
    }
  }, [storageLoaded, myUser])

  return (
    <>
      {loadingStorage ? (
        <LoaderLogoScreen />
      ) : (
        <NavigationContainer>
          <Stack.Navigator initialRouteName={login ? "Home" : "Login"}>
            <Stack.Screen name="Login" component={Login} options={{ headerShown: false, title: "Login" }} />
            <Stack.Screen name="Home" component={Home} options={{ headerShown: false, title: "Home", headerBackVisible: false }} />
            <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false, title: "Profile", animation: "fade_from_bottom" }} />
            <Stack.Screen name="Itinerary" component={Itinerary} options={{ headerShown: false, title: "Itinerary", animation: "fade_from_bottom"  }} />
            <Stack.Screen name="ItineraryDay" component={ItineraryDay} options={{ headerShown: false, title: "ItineraryDay" }} />
            <Stack.Screen name="Search" component={Search} options={{ headerShown: false, title: "Search", animation: "fade_from_bottom"  }} />
            <Stack.Screen name="Cart" component={Cart} options={{ headerShown: false, title: "Cart", animation: "fade_from_bottom" }} />
            <Stack.Screen name="Product" component={Product} options={{ headerShown: false, title: "Product", animation: "fade_from_bottom" }} />
          </Stack.Navigator>
        </NavigationContainer>
      )}
    </>
  )
}

export default Navigation