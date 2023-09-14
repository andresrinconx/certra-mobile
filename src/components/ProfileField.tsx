import { View, Text } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import useLogin from '../hooks/useLogin'

const ProfileField = ({label, value}: {label: string, value: string}) => {
  const { themeColors: { typography, charge } } = useLogin()

  return (
    <View className='flex flex-row justify-between items-center mb-3'>
      {/* label */}
      <Text className='w-2/6 font-bold' style={{ color: typography, fontSize: wp(4.5) }}>{label}</Text>

      {/* value */}
      <View className='w-4/6 rounded-lg py-2 px-1' style={{ backgroundColor: charge }}>
        <Text className='text-center' style={{ color: typography }}>
          {value}
        </Text>
      </View>
    </View>
  )
}

export default ProfileField