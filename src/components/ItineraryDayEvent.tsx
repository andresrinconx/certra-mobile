import { useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { PresenceTransition } from 'native-base'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { ChevronDownIcon } from 'react-native-heroicons/mini'
import useLogin from '../hooks/useLogin'

const ItineraryDayEvent = ({ 
  day, 
  dayOfWeekInText, 
  cliente, 
  direccion,
}: { 
  day: string
  dayOfWeekInText: string 
  cliente: string
  direccion: string
}) => {
  const [openDetails, setOpenDetails] = useState(false)

  const { themeColors: { typography, turquoise } } = useLogin()

  return (
    <View className='flex flex-col'>

      {/* day & descrip */}
      <View className='flex flex-row items-center justify-between'>
        <View className='flex flex-col items-center mb-2' style={{ width: wp(10) }}>
          <Text className='-mb-2 text-sm lowercase' style={{ color: typography }}>{dayOfWeekInText.substring(0, 4)}</Text>
          <Text className='text-lg' style={{ color: typography }}>{day}</Text>
        </View>

        <TouchableOpacity className='flex-row' onPress={() => setOpenDetails(!openDetails)}>
          <View className='p-1.5 rounded-lg' style={{ backgroundColor: turquoise, width: wp(83) }}>
            <Text className='font-normal text-white'>{cliente}</Text>
          </View>

          <View className='flex flex-row justify-center items-center absolute right-1 top-1.5'>
            <ChevronDownIcon size={18} color='white' />
          </View>
        </TouchableOpacity>
      </View>

      {/* details */}
      <View className='flex flex-row items-center justify-between'>
        <View style={{ width: wp(10) }} />

        {openDetails && (
          <PresenceTransition visible={openDetails} initial={{
            opacity: 0
          }} animate={{
            opacity: 1,
            transition: {
              duration: 250
            }
          }}>
            {/* address */}
            <View className='pl-2' style={{ width: wp(83) }}>
              <Text className='text-base font-bold' style={{ color: typography }}>Dirección</Text>
              <Text className='text-base font-normal' style={{ color: typography }}>{direccion}</Text>
            </View>

            {/* more details */}
            <View className=''>
              
            </View>
          </PresenceTransition>
        )}
      </View>
    </View>
  )
}

export default ItineraryDayEvent