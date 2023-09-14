import { Text, TouchableOpacity, View } from "react-native"
import UserFromScliInterface from "../interfaces/UserFromScliInterface"
import useLogin from "../hooks/useLogin"
import useInv from "../hooks/useInv"
import { widthPercentageToDP as wp } from "react-native-responsive-screen"

const CustomersSearch = ({ customer }: { customer: UserFromScliInterface }) => {
  // theme
  const { themeColors: { charge, typography } } = useLogin()

  const { setMyUser, myUser } = useLogin()
  const { flowControl, setFlowControl, setProductsCart, loaders, setLoaders, getProducts } = useInv()
  const { cliente, nombre } = customer

  // select customer
  const selectCustomer = () => {
    setLoaders({ ...loaders, loadingSlectedCustomer: true })
    // user
    setMyUser({ ...myUser, customer })

    // products & cart
    setProductsCart([])

    // flow & reset
    setFlowControl({
      ...flowControl,
      showSelectResults: false,
      showProducts: true,
      showSelectLabel: true,
      showItinerary: myUser.from === 'usuario' ? true : false,
      selected: true
    })
    setTimeout(() => {
      getProducts()
      setLoaders({ ...loaders, loadingSlectedCustomer: false })
    }, 300)
  }

  return (
    <TouchableOpacity className="flex flex-col justify-center h-12 mb-4 rounded-xl" style={{ backgroundColor: charge }}
      onPress={() => selectCustomer()}
    >
      <View className="flex flex-row items-center">
        <Text className="px-4 font-extrabold text-sm" style={{ fontSize: wp(4), color: typography }}>
          {cliente}
        </Text>
        <Text className="font-normal" style={{ fontSize: wp(4), color: typography, width: wp(60) }} numberOfLines={1}>
          {nombre}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

export default CustomersSearch