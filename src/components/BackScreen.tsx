import { View, Text, TouchableOpacity, Image } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { useNavigation } from '@react-navigation/native'
import useLogin from '../hooks/useLogin'

const BackScreen = ({title}: {title: string}) => {

  const { themeColors: { typography } } = useLogin()
  const navigation = useNavigation()
  
  return (
    <View className='flex flex-row items-center gap-2 mt-2'>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Image style={{ width: wp(8), height: wp(8) }} resizeMode='cover'
          source={require('../assets/back.png')}
        />
      </TouchableOpacity>
      
      <Text className='font-bold' style={{ color: typography, fontSize: wp(4.5) }}>{title}</Text>
    </View>
  )
}

export default BackScreen