import { Text, TouchableOpacity, Image } from "react-native"
import { useNavigation } from "@react-navigation/native"

const IconProfile = () => {
  const navigation = useNavigation()

  return (
    <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
      <Image className="w-6 h-6" resizeMode="cover"
        source={require("../../assets/profile.png")}
      />
      <Text className="text-[8px] text-center text-white">Perfil</Text>
    </TouchableOpacity>
  )
}

export default IconProfile