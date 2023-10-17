import { View, Text } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import useLogin from '../../hooks/useLogin'

const Bonus = ({ bonicant, bonifica }: { bonicant: string, bonifica: string }) => {
  const { themeColors: { turquoise } } = useLogin()

  return (
    <>
      {Number(bonicant) > 0 && (
        <View className='flex flex-row justify-between rounded-sm px-1 py-0.5 mb-1' style={{ backgroundColor: turquoise }}>
          <Text className='font-medium text-white' style={{ fontSize: wp(2.5) }}>Bonificación: {Number(bonicant)}x{Number(bonifica)}.</Text>
        </View>
      )}
    </>
  )
}

export default Bonus