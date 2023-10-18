import { useEffect } from 'react'
import { View, FlatList, StatusBar, SafeAreaView } from 'react-native'
import { useRoute } from '@react-navigation/native'
import { ItineraryEventInterface } from '../utils/interfaces'
import useLogin from '../hooks/useLogin'
import useCertra from '../hooks/useCertra'
import { Logos, BackScreen, ItineraryDayEvent, NoDataText } from '../components'

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
  const { setReloadItinerary } = useCertra()

  useEffect(() => {
    setReloadItinerary(false)
  }, [])

  return (
    <SafeAreaView className='flex-1 px-3 pt-6' style={{ backgroundColor: background }}>
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
    </SafeAreaView>
  )
}

export default ItineraryDay