import { View, Image } from 'react-native'
import { theme } from '../../styles'

const LoaderLogoScreen = () => {
  return (
    <View className="flex-1 bg-blue-400">
      <View className='flex-1 justify-center items-center'>
        {/* <Image source={require('../../assets/user.png')} style={{width: 200, height: 200,}} /> */}
      </View>
    </View>
  )
}

export default LoaderLogoScreen