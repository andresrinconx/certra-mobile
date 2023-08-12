import { View, Image } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { theme } from '../../styles'

const LoaderLogoScreen = () => {
  return (
    <LinearGradient
      colors={[`${theme.turquesaOscuro}`, `${theme.turquesaClaro}`]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 0.4 }}
      style={{ flex: 1 }}
    >
      <View className='flex-1 justify-center items-center'>
        <Image source={require('../../assets/user.png')} style={{width: 200, height: 200,}} />
      </View>
    </LinearGradient>
  )
}

export default LoaderLogoScreen