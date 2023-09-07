import { View, TouchableOpacity, Text, Image } from "react-native"
import { useNavigation } from "@react-navigation/native"
import useInv from "../../hooks/useInv"
import useLogin from "../../hooks/useLogin"
import { setDataStorage } from "../../utils/asyncStorage"
import { widthPercentageToDP as wp } from "react-native-responsive-screen"

const IconLogOut = () => {
  const { setProductsCart, setFlowControl, setValueSearchCustomers, setProducts } = useInv()
  const { setMyUser, setUser, setPassword, setLogin, setThemeColors } = useLogin()
  const navigation = useNavigation()

  const handleLogOut = async () => {
    // reset login and navigate
    setUser("")
    setPassword("")
    setLogin(false)
    navigation.navigate("Login")
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
  }

  return (
    <TouchableOpacity onPress={handleLogOut}>
      <View className="flex flex-row items-center gap-2">
        <Image style={{ width: wp(6), height: wp(6) }} resizeMode="cover"
          source={require("../../assets/leave.png")}
        />
        <Text className="text-sm w-8 text-white">Salir</Text>
      </View>
    </TouchableOpacity>
  )
}

export default IconLogOut