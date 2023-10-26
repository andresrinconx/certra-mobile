import { Text, Pressable, Image } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { useNavigation } from '../../hooks'

const IconProfile = () => {
  const navigation = useNavigation()

  return (
    <Pressable onPress={() => navigation.navigate('Profile')} className='w-full h-full flex flex-col items-center justify-center'>
      <Image style={{ width: wp(7), height: wp(7) }} resizeMode='cover'
        source={require('../../assets/profile.png')}
      />
      <Text className='text-[9.5px] text-center font-normal text-white'>Perfil</Text>
    </Pressable>
  )
}

export default IconProfile