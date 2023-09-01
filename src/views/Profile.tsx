import { View, Text, Image, TouchableOpacity } from "react-native"
import React from "react"
import useInv from "../hooks/useInv"
import { useNavigation } from "@react-navigation/native"
import useLogin from "../hooks/useLogin"

const Profile = () => {
  // theme
  const { themeColors: {typography} } = useLogin()

  const { flowControl } = useInv()
  const navigation = useNavigation()
  
  return (
    <View className="flex-1 px-6 pt-6">

      {/* logos */}
      <View className="flex-row justify-between">
        <Image className="w-36 h-16" resizeMode="contain"
          source={flowControl?.showLogoCertra ? require("../assets/logo-certra.png") : require("../assets/logo-drocerca.png")}
        />

        {flowControl?.showLogoLab && (
          <Image className="w-36 h-16" resizeMode="contain"
            source={require("../assets/logo-drocerca.png")}
          />
        )}
      </View>

      {/* back */}
      <View className="flex flex-row items-center gap-2 mt-2">
        <TouchableOpacity onPress={() => {navigation.goBack()}}>
          <Image className="w-8 h-8" resizeMode="cover"
            source={require("../assets/back.png")}
          />
        </TouchableOpacity>
        
        <Text className="font-bold text-base" style={{ color: typography, }}>Mi Perfil</Text>
      </View>
      
      {/* info */}
      <View className="">
        
        {/* main info */}
        <View className="">
          
        </View>

        {/* extra info */}
        <View className="">
          
        </View>
      </View>
    </View>
  )
}

export default Profile