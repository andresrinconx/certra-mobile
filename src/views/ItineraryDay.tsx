import { useEffect } from 'react'
import { View, Text, FlatList, StatusBar } from 'react-native'
import { useRoute } from '@react-navigation/native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { ItineraryEventInterface } from '../interfaces/ItineraryEventInterface'
import useLogin from '../hooks/useLogin'
import Logos from '../components/Logos'
import BackScreen from '../components/BackScreen'
import ItineraryDayEvent from '../components/ItineraryDayEvent'
import useInv from '../hooks/useInv'

const ItineraryDay = () => {
  const { params: { 
    month, 
    day, 
    dayInText, 
    events, 
    reasons
  } } = useRoute() as { params: { 
    month: string
    day: string
    dayInText: string
    events: ItineraryEventInterface[]
    reasons: []
  } }
  const { themeColors: { background, typography }, myUser } = useLogin()
  const { setReloadItinerary } = useInv()

  useEffect(() => {
    setReloadItinerary(false)
  }, [])

  return (
    <View className='flex-1 px-3 pt-6' style={{ backgroundColor: background }}>
      <StatusBar backgroundColor={background} barStyle='dark-content' />

      <Logos image={myUser?.image_url} />
      <BackScreen title={month} />

      {events?.length === 0 || !events ? (
        <View className='flex flex-col items-center justify-center'>
          <Text className='font-extrabold text-center mt-6' style={{ color: typography, fontSize: wp(6) }}>
            No hay eventos
          </Text>
        </View>
      ) : (
        <View className='pt-2'>
          <FlatList
            data={events}
            numColumns={1}
            contentContainerStyle={{
              paddingBottom: 135,
            }}
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => {
              return (
                <ItineraryDayEvent 
                  item={item}
                  day={day} 
                  dayInText={dayInText} 
                  reasons={reasons}
                />
              )
            }} 
          />
        </View>
      )}
    </View>
  )
}

export default ItineraryDay