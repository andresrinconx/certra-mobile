import { View, Text } from 'react-native'
import useLogin from '../../hooks/useLogin'

const IconUser = () => {
  const {myUser} = useLogin()

  return (
    <View className='flex flex-row items-center justify-center w-8 h-8 rounded-full'>
      <Text className='text-center font-bold text-gray-700 text-base'>{myUser.letters}</Text>
    </View>
  )
}

export default IconUser