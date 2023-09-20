import { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { useNavigation } from '@react-navigation/native'
import { StatusBar } from 'react-native'
import useLogin from '../hooks/useLogin'
import { getMonthAndDays } from '../utils/helpers'
import { days } from '../utils/constants'
import Loader from '../components/Loader'
import Logos from '../components/Logos'
import BackScreen from '../components/BackScreen'

const Itinerary = () => {
  const [loadingItinerary, setLoadingItinerary] = useState(true)
  const [currentMonth, setCurrentMonth] = useState('')
  const [currentMonthDays, setCurrentMonthDays] = useState(0)

  const [itinerary, setItinerary] = useState([])
  const [squareDays, setSquareDays] = useState([])

  const { themeColors: { backgrund, typography, primary }, myUser } = useLogin()
  const navigation = useNavigation()

  // set data
  useEffect(() => {
    // days and month
    const currentDate = new Date()
    const dataMonthAndDays = getMonthAndDays(currentDate)

    setCurrentMonth(dataMonthAndDays.month)
    setCurrentMonthDays(dataMonthAndDays.days)

    // itinerary
    // setItinerary()
  }, [])

  // month (squares)
  useEffect(() => {
    const newSquareDays = []

    for (let i = 0; i < currentMonthDays; i++) {
      newSquareDays.push(
        <TouchableOpacity key={i} className=''
          onPress={() => navigation.navigate('ItineraryDay')}
        >
          <Text>Día {i + 1}</Text>
          <Text className=''>{}</Text>
        </TouchableOpacity>
      )
    }

    setSquareDays(newSquareDays)

    setLoadingItinerary(false)
  }, [currentMonthDays])

  return (
    <View className='flex-1 px-3' style={{ backgroundColor: backgrund }}>
      <StatusBar backgroundColor={backgrund} barStyle='dark-content' />

      <Logos image={myUser?.image_url} />
      <BackScreen title='Itinerario' />

      <View>
        {loadingItinerary ? (
          <View className='mt-5'>
            <Loader color={`${primary}`} />
          </View>
        ) : (
          <>
            {/* current month */}
            <View className='mt-2'>
              <Text className='text-center font-bold' style={{ color: typography, fontSize: wp(5) }}>
                {currentMonth}
              </Text>
            </View>

            {/* days view */}
            <View className='flex flex-row justify-center items-center mt-4'>
              {days.map((item) => {
                const { id, name } = item
                return (
                  <Text key={id} className='uppercase text-center' style={{ fontSize: wp(2.4), color: typography, width: wp(13.5) }}>
                    {name}
                  </Text>
                )
              })}
            </View>

            {/* square days view */}
            <View className=''>
              {squareDays}
            </View>
          </>
        )}
      </View>

    </View>
  )
}

export default Itinerary