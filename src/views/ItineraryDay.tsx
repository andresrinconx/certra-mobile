import { View, Text, FlatList, StatusBar } from 'react-native'
import { useRoute } from '@react-navigation/native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { ItineraryEventInterface } from '../interfaces/ItineraryEventInterface'
import useLogin from '../hooks/useLogin'
import Logos from '../components/Logos'
import BackScreen from '../components/BackScreen'
import ItineraryDayEvent from '../components/ItineraryDayEvent'

const ItineraryDay = () => {

  const { params: { month, day, dayOfWeekInText, events } } = useRoute() as { params: { month: string, day: string, dayOfWeekInText: string, events: ItineraryEventInterface[] } }
  const { themeColors: { backgrund, typography }, myUser } = useLogin()

  return (
    <View className='flex-1 px-3 pt-6' style={{ backgroundColor: backgrund }}>
      <StatusBar backgroundColor={backgrund} barStyle='dark-content' />

      <Logos image={myUser?.image_url} />
      <BackScreen title={month} />

      {events?.length === 0 ? (
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
            showsVerticalScrollIndicator={false}
            renderItem={({item: {cliente}}) => {
              return (
                <ItineraryDayEvent day={day} cliente={cliente} dayOfWeekInText={dayOfWeekInText} />
              )
            }} 
          />
        </View>
      )}
    </View>
  )
}

export default ItineraryDay