import { useState, useEffect } from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import useLogin from '../hooks/useLogin'
import { StatusBar } from 'expo-status-bar'
import useInv from '../hooks/useInv'
import { widthPercentageToDP as wp } from "react-native-responsive-screen"
import { useNavigation } from '@react-navigation/native'
import { getMonthAndDays } from '../utils/helpers'

const Itinerary = () => {
  // theme
  const { themeColors: { backgrund, typography } } = useLogin()

  // state
  const [currentMonth, setCurrentMonth] = useState("")
  const [currentMonthDays, setCurrentMonthDays] = useState(0)
  const [squareDays, setSetsquareDays] = useState([])

  const { flowControl } = useInv()
  const { myUser } = useLogin()
  const navigation = useNavigation()

  // set data
  useEffect(() => {
    const currentDate = new Date();
    const dataMonthAndDays = getMonthAndDays(currentDate);

    setCurrentMonth(dataMonthAndDays.month)
    setCurrentMonthDays(dataMonthAndDays.days)
  }, [])

  // month (squares)
  useEffect(() => {
    const newSquareDays = [];

    for (let i = 0; i < currentMonthDays; i++) {
      newSquareDays.push(<Text key={i}>Día {i + 1}</Text>);
    }

    setSetsquareDays(newSquareDays);
  }, [currentMonthDays])

  return (
    <View className="flex-1 px-3 pt-6" style={{ backgroundColor: backgrund }}>
      <StatusBar style="dark" />

      {/* logos */}
      <View className="flex-row justify-between">
        {flowControl?.showLogoCertra ? (
          <Image style={{ width: wp(32), height: wp(16) }} resizeMode="contain"
            source={require("../assets/logo-certra.png")}
          />
        ) : (
          <Image style={{ width: wp(40), height: wp(20) }} resizeMode="contain"
            source={require("../assets/logo-drocerca.png")}
          />
        )}

        <Image style={{ width: wp(40), height: wp(16) }} resizeMode="contain"
          source={{ uri: `${myUser?.image_url}` }}
        />
      </View>

      {/* back */}
      <View className="flex flex-row items-center justify-between mt-2">
        <View className="flex flex-row items-center gap-2">
          <TouchableOpacity onPress={() => { navigation.goBack() }}>
            <Image style={{ width: wp(8), height: wp(8) }} resizeMode="cover"
              source={require("../assets/back.png")}
            />
          </TouchableOpacity>

          <Text className="font-bold" style={{ color: typography, fontSize: wp(4.5) }}>Itinerario</Text>
        </View>

        <Text className="font-bold" style={{ color: typography, fontSize: wp(5) }}>
          {currentMonth}
        </Text>
      </View>

      {/* calendar */}
      <View className="">
        {squareDays}
      </View>

    </View>
  )
}

export default Itinerary