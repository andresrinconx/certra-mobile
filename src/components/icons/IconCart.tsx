import { View, Text, TouchableOpacity, Image } from "react-native"
import { useNavigation } from "@react-navigation/native"
import useInv from "../../hooks/useInv"
import useLogin from "../../hooks/useLogin"

const IconCart = () => {
  // theme
  const { themeColors: { green } } = useLogin()

  const { productsCart } = useInv()
  const navigation = useNavigation()

  return (
    <TouchableOpacity onPress={() => navigation.navigate("Cart")}>
      <Image className="w-7 h-7" resizeMode="cover"
        source={require("../../assets/cart.png")}
      />

      {productsCart.length > 0
        && (
          <View className="flex flex-row justify-center items-center absolute -top-1 -right-1 w-4 h-4 rounded-full"
            style={{ backgroundColor: green, }}
          >
            <Text className="w-full text-center color-black text-[10px]">
              {productsCart.length}
            </Text>
          </View>
        )
      }
    </TouchableOpacity>
  )
}

export default IconCart