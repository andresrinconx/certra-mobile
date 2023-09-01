import {useEffect, useState} from "react"
import { View, Text, Image, TouchableOpacity } from "react-native"
import useInv from "../hooks/useInv"
import { useNavigation } from "@react-navigation/native"
import useLogin from "../hooks/useLogin"
import { fetchUserData } from "../utils/api"

const Profile = () => {
  // theme
  const { themeColors: { typography, charge } } = useLogin()

  // state
  const [dataConfig, setDataConfig] = useState<any>({})

  const { flowControl } = useInv()
  const { myUser } = useLogin()
  const navigation = useNavigation()

  // data
  useEffect(() => {
    const getData = async () => {
      try {
        const res = await fetchUserData({ 
          table: `${myUser?.from === 'scli' ? 'scliU' : 'usuarioU'}`, 
          code: `${myUser?.from === 'scli' ? `${myUser?.cliente}` : `${myUser.clipro}`}`
        })
        setDataConfig(res)
      } catch (error) {
        console.log(error)
      }
    }
    getData()
  }, [])
  
  return (
    <View className="flex-1 px-6 pt-6">

      {/* logos */}
      <View className="flex-row justify-between">
        <Image className="w-36 h-16" resizeMode="contain"
          source={flowControl?.showLogoCertra ? require("../assets/logo-certra.png") : require("../assets/logo-drocerca.png")}
        />
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

          {/* name and code */}
          <View className="flex flex-col items-center">
            {!flowControl?.showLogoCertra && (
              <View className="">
                <Image className="w-32 h-32" resizeMode="cover"
                  source={require("../assets/drugstore.png")}
                />
              </View>
            )}

            <Text className="font-bold text-base mt-4" style={{ color: typography }}>
              {myUser.from === 'scli' ? myUser.nombre : myUser.us_nombre}
            </Text>

            <Text className="" style={{ color: typography }}>
              Código: {myUser?.customer ? myUser?.us_cliente : myUser?.cliente}
            </Text>
          </View>
          
          {/* fields */}
          <View className="mt-4 space-y-2">
            
            {/* rif */}
            <View className="flex flex-row justify-between items-center">
              <Text className="w-2/6 font-bold text-base" style={{ color: typography }}>RIF</Text>

              <View className="w-4/6 rounded-lg py-1" style={{ backgroundColor: charge, }}>
                <Text className="text-center" style={{ color: typography }}>
                  {myUser.from === 'scli' ? dataConfig?.rifci : dataConfig?.rif}
                </Text>
              </View>
            </View>

            {/* email */}
            <View className="flex flex-row justify-between items-center">
              <Text className="w-2/6 font-bold text-base" style={{ color: typography }}>Correo</Text>

              <View className="w-4/6 rounded-lg py-1" style={{ backgroundColor: charge, }}>
                <Text className="text-center" style={{ color: typography }}>
                  {myUser.from === 'scli' ? dataConfig?.email : dataConfig?.emailc}
                </Text>
              </View>
            </View>

            {/* phone */}
            <View className="flex flex-row justify-between items-center">
              <Text className="w-2/6 font-bold text-base" style={{ color: typography }}>Teléfono</Text>

              <View className="w-4/6 rounded-lg py-1" style={{ backgroundColor: charge, }}>
                <Text className="text-center" style={{ color: typography }}>
                  {myUser.from === 'scli' ? dataConfig?.telefono : dataConfig?.telefono}
                </Text>
              </View>
            </View>

            {/* anniversary */}
            <View className="flex flex-row justify-between items-center">
              <Text className="w-2/6 font-bold text-base" style={{ color: typography }}>Aniversario</Text>

              <View className="w-4/6 rounded-lg py-1" style={{ backgroundColor: charge, }}>
                <Text className="text-center" style={{ color: typography }}>
                  {myUser.from === 'scli' ? dataConfig?.aniversario : dataConfig?.aniversario}
                </Text>
              </View>
            </View>

            {/* address */}
            <View className="flex flex-row justify-between items-center">
              <Text className="w-2/6 font-bold text-base" style={{ color: typography }}>Ubicación</Text>

              <View className="w-4/6 rounded-lg py-1" style={{ backgroundColor: charge, }}>
                <Text className="text-center" style={{ color: typography }}>
                  {myUser.from === 'scli' ? dataConfig?.dire11 : dataConfig?.direc1}
                </Text>
              </View>
            </View>

          </View>

        </View>

        {/* extra info fields */}
        <View className="">
          
        </View>
      </View>
    </View>
  )
}

export default Profile