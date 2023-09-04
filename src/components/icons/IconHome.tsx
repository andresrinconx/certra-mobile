import { Text, TouchableOpacity, Image } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { widthPercentageToDP as wp } from "react-native-responsive-screen"

const IconHome = () => {
  const navigation = useNavigation()

  return (
    <TouchableOpacity onPress={() => navigation.navigate("Home")}>
      <Image style={{ width: wp(6), height: wp(6) }} resizeMode="cover"
        source={require("../../assets/home.png")}
      />
      <Text className="text-[8px] text-center text-white">Inicio</Text>
    </TouchableOpacity>
  )
}

export default IconHome