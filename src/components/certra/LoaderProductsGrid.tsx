import { View } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'

const LoaderProductsGrid = () => {
  return (
    <View className='h-56 mb-2 mr-2 rounded-2xl bg-charge' style={{ width: wp('45.5%') }} />
  )
}

export default LoaderProductsGrid