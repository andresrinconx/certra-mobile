import { View, TouchableOpacity, Image } from "react-native"
import useInv from "../../hooks/useInv"
import { useNavigation } from "@react-navigation/native"

const IconSearchProducts = () => {
  const { setSearchedProducts } = useInv()
  const navigation = useNavigation()

  return (
    <TouchableOpacity onPress={() => {
      navigation.navigate("Search")
      setSearchedProducts([])
    }}>
      <View>
        <Image className="w-7 h-7" resizeMode="cover"
          source={require("../../assets/search.png")}
        />
      </View>
    </TouchableOpacity>
  )
}

export default IconSearchProducts