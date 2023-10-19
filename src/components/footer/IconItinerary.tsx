import { Text, Pressable, Image } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import useNavigation from '../../hooks/useNavigation'

const IconItinerary = () => {
  const navigation = useNavigation()

  return (
    <Pressable onPress={() => navigation.navigate('Itinerary')} className='w-full h-full flex flex-col items-center justify-center'>
      <Image style={{ width: wp(7), height: wp(7) }} resizeMode='cover'
        source={require('../../assets/itinerary.png')}
      />
      <Text className='w-9 text-[8px] text-center text-white font-normal'>Itinerario</Text>
    </Pressable>
  )
}

export default IconItinerary