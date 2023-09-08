import { useState, useEffect } from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import useLogin from '../hooks/useLogin'
import { StatusBar } from 'expo-status-bar'
import useInv from '../hooks/useInv'
import { widthPercentageToDP as wp } from "react-native-responsive-screen"
import { useNavigation } from '@react-navigation/native'
import { getMonthAndDays } from '../utils/helpers'
import { days } from '../utils/constants'
import Loader from '../components/loaders/Loader'

const Itinerary = () => {
  // theme
  const { themeColors: { backgrund, typography, primary } } = useLogin()

  // state
  const [loadingItinerary, setLoadingItinerary] = useState(true)
  const [currentMonth, setCurrentMonth] = useState("")
  const [currentMonthDays, setCurrentMonthDays] = useState(0)

  const [itinerary, setItinerary] = useState([])
  const [squareDays, setSetsquareDays] = useState([])

  const { flowControl } = useInv()
  const { myUser } = useLogin()
  const navigation = useNavigation()

  // set data
  useEffect(() => {
    // days and month
    const currentDate = new Date();
    const dataMonthAndDays = getMonthAndDays(currentDate);

    setCurrentMonth(dataMonthAndDays.month)
    setCurrentMonthDays(dataMonthAndDays.days)

    // itinerary
    // setItinerary()
  }, [])

  // month (squares)
  useEffect(() => {
    const newSquareDays = [];

    for (let i = 0; i < currentMonthDays; i++) {
      newSquareDays.push(
        <TouchableOpacity key={i} className=""
          onPress={() => navigation.navigate("ItineraryDay")}
        >
          <Text>Día {i + 1}</Text>
          <Text className="">{}</Text>
        </TouchableOpacity>
      );
    };

    setSetsquareDays(newSquareDays);

    setLoadingItinerary(false)
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
      <View className="flex flex-row items-center gap-2 mt-2">
        <TouchableOpacity onPress={() => { navigation.goBack() }}>
          <Image style={{ width: wp(8), height: wp(8) }} resizeMode="cover"
            source={require("../assets/back.png")}
          />
        </TouchableOpacity>

        <Text className="font-bold" style={{ color: typography, fontSize: wp(4.5) }}>Itinerario</Text>
      </View>

      <View className="">
        {loadingItinerary ? (
          <View className="mt-5">
            <Loader color={`${primary}`} />
          </View>
        ) : (
          <>
            {/* current month */}
            <View className="mt-2">
              <Text className="text-center font-bold" style={{ color: typography, fontSize: wp(5) }}>
                {currentMonth}
              </Text>
            </View>

            {/* days view */}
            <View className="flex flex-row justify-center items-center mt-4">
              {days.map((item) => {
                const { id, name } = item;
                return (
                  <Text key={id} className="uppercase text-center" style={{ fontSize: wp(2.4), color: typography, width: wp(13.5) }}>
                    {name}
                  </Text>
                )
              })}
            </View>

            {/* square days view */}
            <View className="">
              {squareDays}
            </View>
          </>
        )}
      </View>

    </View>
  )
}

export default Itinerary