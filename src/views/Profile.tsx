import {useEffect, useState} from "react"
import { View, Text, Image, ScrollView } from "react-native"
import useInv from "../hooks/useInv"
import { useNavigation } from "@react-navigation/native"
import useLogin from "../hooks/useLogin"
import { fetchUserData } from "../utils/api"
import { widthPercentageToDP as wp } from "react-native-responsive-screen"
import { StatusBar } from "expo-status-bar"
import Loader from "../components/Loader"
import Logos from "../components/Logos"
import BackScreen from "../components/BackScreen"

const Profile = () => {
  // theme
  const { themeColors: { typography, charge, primary, backgrund } } = useLogin()

  // state
  const [dataConfig, setDataConfig] = useState<any>({})
  const [loadingProfile, setLoadingProfile] = useState(false)

  const { flowControl } = useInv()
  const { myUser } = useLogin()
  const navigation = useNavigation()

  // data
  useEffect(() => {
    const getData = async () => {
      try {
        setLoadingProfile(true)

        const res = await fetchUserData({ 
          table: `${myUser?.from === 'scli' ? 'scliU' : 'usuarioU'}`, 
          code: `${myUser?.from === 'scli' ? `${myUser?.cliente}` : `${myUser.clipro}`}`
        })
        setDataConfig(res)

        if (res) {
          setLoadingProfile(false)
        }
        
      } catch (error) {
        console.log(error)
      }
    }
    getData()
  }, [])
  
  return (
    <View className="flex-1 px-3 pt-6" style={{ backgroundColor: backgrund }}>
      <StatusBar style="dark" />

      <Logos image={myUser?.image_url} />
      <BackScreen title="Mi perfil" />
      
      {/* info */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 20,}}
        overScrollMode="never"
      >
        {loadingProfile ? (
          <View className="mt-10">
            <Loader color={`${primary}`} />
          </View>
        ) : (
        <View className="px-3">
          
          {/* main info */}
          <View>

            {/* name and code */}
            <View className="flex flex-col items-center">
              {!flowControl?.showLogoCertra && (
                <View>
                  <Image style={{ width: wp(32), height: wp(32) }} resizeMode="cover"
                    source={require("../assets/drugstore.png")}
                  />
                </View>
              )}

              <Text className="w-56 font-extrabold text-center mt-4" style={{ color: typography, fontSize: wp(4.5) }}>
                {myUser.from === 'scli' ? dataConfig?.nombre : dataConfig?.nombre}
              </Text>

              <Text className="w-28 font-normal" style={{ color: typography, fontSize: wp(4) }}>
                Codigo: {myUser.from === 'scli' ? dataConfig?.cliente : dataConfig?.proveed}
              </Text>
            </View>
            
            {/* fields */}
            <View className="mt-4 space-y-4">
              
              {/* rif */}
              <View className="flex flex-row justify-between items-center">
                <Text className="w-2/6 font-bold" style={{ color: typography, fontSize: wp(4.5) }}>RIF</Text>

                <View className="w-4/6 rounded-lg py-2 px-1" style={{ backgroundColor: charge }}>
                  <Text className="text-center" style={{ color: typography }}>
                    {myUser.from === 'scli' ? dataConfig?.rifci : dataConfig?.rif}
                  </Text>
                </View>
              </View>

              {/* email */}
              <View className="flex flex-row justify-between items-center">
                <Text className="w-2/6 font-bold" style={{ color: typography, fontSize: wp(4.5) }}>Correo</Text>

                <View className="w-4/6 rounded-lg py-2 px-1" style={{ backgroundColor: charge, }}>
                  <Text className="text-center" style={{ color: typography }}>
                    {myUser.from === 'scli' ? dataConfig?.email : dataConfig?.emailc}
                  </Text>
                </View>
              </View>

              {/* phone */}
              <View className="flex flex-row justify-between items-center">
                <Text className="w-2/6 font-bold" style={{ color: typography, fontSize: wp(4.5) }}>Teléfono</Text>

                <View className="w-4/6 rounded-lg py-2 px-1" style={{ backgroundColor: charge, }}>
                  <Text className="text-center" style={{ color: typography }}>
                    {myUser.from === 'scli' ? dataConfig?.telefono : dataConfig?.telefono}
                  </Text>
                </View>
              </View>

              {/* anniversary */}
              <View className="flex flex-row justify-between items-center">
                <Text className="w-2/6 font-bold" style={{ color: typography, fontSize: wp(4.5) }}>Aniversario</Text>

                <View className="w-4/6 rounded-lg py-2 px-1" style={{ backgroundColor: charge, }}>
                  <Text className="text-center" style={{ color: typography }}>
                    {myUser.from === 'scli' ? dataConfig?.aniversario : dataConfig?.aniversario}
                  </Text>
                </View>
              </View>

              {/* address */}
              <View className="flex flex-row justify-between items-center">
                <Text className="w-2/6 font-bold" style={{ color: typography, fontSize: wp(4.5) }}>Ubicación</Text>

                <View className="w-4/6 rounded-lg py-2 px-1" style={{ backgroundColor: charge, }}>
                  <Text className="text-center" style={{ color: typography }}>
                    {myUser.from === 'scli' ? dataConfig?.dire11 : dataConfig?.direc1}
                  </Text>
                </View>
              </View>

            </View>
          </View>

          {/* extra info fields */}
          <View>

            {/* representant */}
            <View className="flex flex-col items-center">
              <Text className="font-extrabold mt-6" style={{ color: typography, fontSize: wp(4.5) }}>
                Datos del representante
              </Text>
            </View>

            {/* fields */}
            <View className="mt-4 space-y-4">
              
              {/* name */}
              <View className="flex flex-row justify-between items-center">
                <Text className="w-2/6 font-bold" style={{ color: typography, fontSize: wp(4.5) }}>Nombre</Text>

                <View className="w-4/6 rounded-lg py-2 px-1" style={{ backgroundColor: charge }}>
                  <Text className="text-center" style={{ color: typography }}>
                    {myUser.from === 'scli' ? dataConfig?.contacto : dataConfig?.us_nombre}
                  </Text>
                </View>
              </View>

              {/* phone */}
              <View className="flex flex-row justify-between items-center">
                <Text className="w-2/6 font-bold" style={{ color: typography, fontSize: wp(4.5) }}>Teléfono</Text>

                <View className="w-4/6 rounded-lg py-2 px-1" style={{ backgroundColor: charge, }}>
                  <Text className="text-center" style={{ color: typography }}>
                    {myUser.from === 'scli' ? dataConfig?.telefon2 : dataConfig?.telefon2}
                  </Text>
                </View>
              </View>
            </View>

          </View>
        </View>
        )}
        
      </ScrollView>
    </View>
  )
}

export default Profile