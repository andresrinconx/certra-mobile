import { useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { PresenceTransition, Center } from 'native-base'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import useLogin from '../hooks/useLogin'

const ItineraryDayEvent = ({ cliente, day, dayOfWeekInText }: { cliente: string, day: string, dayOfWeekInText: string }) => {

  const [openDetails, setOpenDetails] = useState(false)

  const { themeColors: { typography, turquoise } } = useLogin()

  return (
    <View className='flex flex-col'>
      {/* day & descrip */}
      <View className='flex flex-row items-center justify-between mb-2'>
        <View className='flex flex-col items-center' style={{ width: wp(10) }}>
          <Text className='-mb-2 text-sm lowercase' style={{ color: typography }}>{dayOfWeekInText.substring(0, 4)}</Text>
          <Text className='text-lg' style={{ color: typography }}>{day}</Text>
        </View>

        <TouchableOpacity className='p-1.5 rounded-lg' style={{ backgroundColor: turquoise, width: wp(83) }}
          onPress={() => setOpenDetails(!openDetails)}
        >
          <Text className='font-normal text-white'>{cliente}</Text>
        </TouchableOpacity>
      </View>

      {/* details */}
      <View className='flex flex-row items-center justify-between'>
        <View style={{ width: wp(10) }} />

        <PresenceTransition visible={openDetails} initial={{
          opacity: 0,
          scale: 0
        }} animate={{
          opacity: 1,
          scale: 1,
          transition: {
            duration: 250
          }
        }}>
          <View className=''>
            <Text className='text-gray-700'>Hola</Text>
          </View>
        </PresenceTransition>
      </View>
    </View>
  )
}

export default ItineraryDayEvent