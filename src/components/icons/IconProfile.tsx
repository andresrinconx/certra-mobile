import { Text, TouchableOpacity, Image } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { widthPercentageToDP as wp } from "react-native-responsive-screen"

const IconProfile = () => {
  const navigation = useNavigation()

  return (
    <TouchableOpacity onPress={() => navigation.navigate("Profile")} className="flex flex-col items-center">
      <Image style={{ width: wp(6), height: wp(6) }} resizeMode="cover"
        source={require("../../assets/profile.png")}
      />
      <Text className="w-9 text-[8px] text-center text-white font-bold">Perfil</Text>
    </TouchableOpacity>
  )
}

export default IconProfile