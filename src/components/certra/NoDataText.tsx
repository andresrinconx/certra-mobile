import { View, Text } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'

const NoDataText = ({ text }: { text: string }) => {
  return (
    <View className='flex flex-col items-center justify-center'>
      <Text className='font-extrabold text-center mt-6 text-typography' style={{ fontSize: wp(6) }}>
        {text}
      </Text>
    </View>
  )
}

export default NoDataText