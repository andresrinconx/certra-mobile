import { useNavigation } from '@react-navigation/native'
import { Pressable, Text, Image } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import useInv from '../../hooks/useInv'

const IconOrderRecord = () => {
  const navigation = useNavigation()
  const { setLookAtPharmacy } = useInv()

  return (
    <Pressable onPress={() => {
      setLookAtPharmacy(true)
      navigation.navigate('OrderRecord')
    }} className='w-full h-full flex flex-col items-center justify-center'>
      <Image style={{ width: wp(7), height: wp(7) }} resizeMode='cover'
        source={require('../../assets/history.png')}
      />
      <Text className='w-9 text-[8px] text-center text-white font-bold'>Historial</Text>
    </Pressable>
  )
}

export default IconOrderRecord