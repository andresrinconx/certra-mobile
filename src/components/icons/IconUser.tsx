import { View, Text, TouchableOpacity } from 'react-native'
import useInv from '../../hooks/useInv'
import useLogin from '../../hooks/useLogin'

const IconUser = () => {
  const {myUser} = useLogin()

  return (
    <View className='flex flex-row items-center justify-center w-8 h-8 rounded-full'>
      <Text className='text-center font-bold text-gray-700 text-base'>{'AR'}</Text>
    </View>
  )
}

export default IconUser