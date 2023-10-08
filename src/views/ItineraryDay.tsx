import { useEffect } from 'react'
import { View, FlatList, StatusBar } from 'react-native'
import { useRoute } from '@react-navigation/native'
import { ItineraryEventInterface } from '../utils/interfaces'
import useLogin from '../hooks/useLogin'
import Logos from '../components/elements/Logos'
import BackScreen from '../components/elements/BackScreen'
import ItineraryDayEvent from '../components/itinerary/ItineraryDayEvent'
import useInv from '../hooks/useInv'
import NoDataText from '../components/elements/NoDataText'

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
  const { themeColors: { background }, myUser } = useLogin()
  const { setReloadItinerary } = useInv()

  useEffect(() => {
    setReloadItinerary(false)
  }, [])

  return (
    <View className='flex-1 px-3 pt-6' style={{ backgroundColor: background }}>
      <StatusBar backgroundColor={background} barStyle='dark-content' />

      <Logos image={myUser?.image_url as URL} />
      <BackScreen title={month} />

      {events?.length === 0 || !events ? (
        <NoDataText 
          text='No hay eventos para este día' 
        />
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