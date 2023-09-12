import { View, TouchableOpacity, Image } from "react-native"
import useInv from "../hooks/useInv"
import { useNavigation } from "@react-navigation/native"
import { widthPercentageToDP as wp } from "react-native-responsive-screen"

const IconSearchProducts = () => {
  const { setSearchedProducts } = useInv()
  const navigation = useNavigation()

  return (
    <TouchableOpacity onPress={() => {
      navigation.navigate("Search")
      setSearchedProducts(null)
    }}>
      <View>
        <Image style={{ width: wp(7), height: wp(7) }} resizeMode="cover"
          source={require("../assets/search.png")}
        />
      </View>
    </TouchableOpacity>
  )
}

export default IconSearchProducts