import { View, Image } from 'react-native'
import useInv from '../hooks/useInv'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'

const Logos = ({image}: {image: URL}) => {
  const { flowControl } = useInv()

  return (
    <View className="flex-row justify-between">
      {flowControl?.showLogoCertra ? (
        <Image style={{ width: wp(32), height: wp(16) }} resizeMode="contain"
          source={require("../assets/logo-certra.png")}
        />
      ) : (
        <Image style={{ width: wp(40), height: wp(20) }} resizeMode="contain"
          source={require("../assets/logo-drocerca.png")}
        />
      )}

      <Image style={{ width: wp(40), height: wp(16) }} resizeMode="contain"
        source={{uri: `${image}`}}
      />
    </View>
  )
}

export default Logos