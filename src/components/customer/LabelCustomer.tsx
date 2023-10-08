import { View, Text } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import useLogin from '../../hooks/useLogin'

const LabelCustomer = ({name}: {name: string}) => {
  const { themeColors: { typography } } = useLogin()

  return (
    <View>
      <Text className='font-extrabold' style={{ fontSize: wp(4.5), color: typography }}>Cliente</Text>
      <Text className='font-normal' style={{ fontSize: wp(4), color: typography }}>{name}</Text>
    </View>
  )
}

export default LabelCustomer