import { useState, useRef } from "react"
import { View, TouchableOpacity, Text, Image } from "react-native"
import { useNavigation } from "@react-navigation/native"
import useInv from "../../hooks/useInv"
import useLogin from "../../hooks/useLogin"
import { setDataStorage } from "../../utils/asyncStorage"
import { widthPercentageToDP as wp } from "react-native-responsive-screen"
import { AlertDialog, Button } from "native-base"
import Loader from "../loaders/Loader"

const IconLogOut = () => {
  // theme
  const { themeColors: { darkTurquoise } } = useLogin()

  // state
  const [alertLogOut, setAlertLogOut] = useState(false)

  const cancelRef = useRef(null);

  const { setProductsCart, setFlowControl, setValueSearchCustomers, setProducts, setLoaders, loaders } = useInv()
  const { setMyUser, setUser, setPassword, setLogin, setThemeColors } = useLogin()
  const navigation = useNavigation()

  const onCloseAlertClearCart = () => setAlertLogOut(false);

  const logOut = async () => {
    setLoaders({ ...loaders, loadingLogOut: true })

    // reset login and navigate
    setUser("")
    setPassword("")
    setLogin(false)

    // redirect
    setTimeout(() => {
      navigation.navigate("Login")

      // reset alert
      setAlertLogOut(false)
    }, 2000);

    await setDataStorage("login", false)
    await setDataStorage("themeColors", {})
    await setDataStorage("myUser", {})
    await setDataStorage("productsCart", [])
    await setDataStorage("flowControl", {
      showProducts: false,
      showSelectCustomer: false,
      showSelectSearch: false,
      showSelectResults: false,
      showSelectLabel: false,
      showLogoCertra: false,
      showLogoLab: false,
      selected: false,
    })
    await setDataStorage("themeColors", {
      primary: "",
      backgrund: "",
      charge: "",
      list: "",
      turquoise: "",
      darkTurquoise: "",
      green: "",
      blue: "",
      icon: "",
      typography: "",
      processBtn: "",
    })

    setTimeout(() => {
      // reset products
      setProductsCart([])
      setProducts([])
  
      // reset flow
      setFlowControl({
        showProducts: false,
        showSelectCustomer: false,
        showSelectSearch: false,
        showSelectResults: false,
        showSelectLabel: false,
        showLogoCertra: false,
        showLogoLab: false,
        selected: false,
      })
      setMyUser({})
      setThemeColors({
        primary: "",
        backgrund: "",
        charge: "",
        list: "",
        lightList: "",
        turquoise: "",
        darkTurquoise: "",
        green: "",
        blue: "",
        icon: "",
        typography: "",
        processBtn: "",
      })
      setValueSearchCustomers("")
  
      setLoaders({ ...loaders, loadingLogOut: false })
    }, 2000);
  }

  return (
    <>
      <TouchableOpacity onPress={() => setAlertLogOut(true)}>
        <View className="flex flex-row items-center gap-2">
          <Image style={{ width: wp(6), height: wp(6) }} resizeMode="cover"
            source={require("../../assets/leave.png")}
          />
          <Text className="text-sm w-8 text-white font-bold">Salir</Text>
        </View>
      </TouchableOpacity>

      {/* alert log out */}
      <AlertDialog leastDestructiveRef={cancelRef} isOpen={alertLogOut} onClose={onCloseAlertClearCart}>
        <AlertDialog.Content>
          <AlertDialog.CloseButton />
          <AlertDialog.Header>¿Deseas cerrar sesión?</AlertDialog.Header>

          <AlertDialog.Body>
            <Text className="font-normal">
              Se eliminarán todos los productos de tu carrito.
            </Text>
          </AlertDialog.Body>

          <AlertDialog.Footer>
            <Button.Group space={2}>
              <Button variant="unstyled" colorScheme="coolGray" onPress={onCloseAlertClearCart} ref={cancelRef}>
                Cancelar
              </Button>
              <Button color={darkTurquoise} onPress={() => logOut()}>
                {loaders.loadingLogOut ? (
                  <View className="flex flex-row justify-center items-center w-20">
                    <Loader color="white" size={wp(4)} />
                  </View>
                ) : (
                  <Text className="font-normal text-white">Cerrar sesión</Text>
                )}
              </Button>
            </Button.Group>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    </>
  )
}

export default IconLogOut