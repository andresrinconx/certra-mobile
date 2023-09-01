import { Text, TouchableOpacity, Image } from "react-native"
import { useNavigation } from "@react-navigation/native"

const IconHome = () => {
  const navigation = useNavigation()

  return (
    <TouchableOpacity onPress={() => navigation.navigate("Home")}>
      <Image className="w-6 h-6" resizeMode="cover"
        source={require("../../assets/home.png")}
      />
      <Text className="text-[8px] text-center text-white">Inicio</Text>
    </TouchableOpacity>
  )
}

export default IconHome