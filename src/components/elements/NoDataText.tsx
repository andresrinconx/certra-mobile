import { View, Text } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import useLogin from '../../hooks/useLogin'

const NoDataText = ({ text }: { text: string }) => {
  const { themeColors: { typography } } = useLogin()

  return (
    <View className='flex flex-col items-center justify-center'>
      <Text className='font-extrabold text-center mt-6' style={{ color: typography, fontSize: wp(6) }}>
        {text}
      </Text>
    </View>
  )
}

export default NoDataText