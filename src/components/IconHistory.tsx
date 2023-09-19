import { TouchableOpacity, Text, Image } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'

const IconHistory = () => {
  return (
    <TouchableOpacity onPress={() => ""} className='flex flex-col items-center'>
      <Image style={{ width: wp(6), height: wp(6) }} resizeMode='cover'
        source={require('../assets/history.png')}
      />
      <Text className='w-9 text-[8px] text-center text-white font-bold'>Historial</Text>
    </TouchableOpacity>
  )
}

export default IconHistory