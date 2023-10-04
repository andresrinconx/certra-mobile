import { View, Text, Pressable, Image } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import useInv from '../hooks/useInv'
import useLogin from '../hooks/useLogin'

const IconCart = () => {
  const { themeColors: { green } } = useLogin()
  const { productsCart } = useInv()
  const navigation = useNavigation()

  return (
    <Pressable onPress={() => navigation.navigate('Cart')} className='w-full h-full flex flex-1 flex-col items-center justify-center'>
      <Image style={{ width: wp(7), height: wp(7) }} resizeMode='cover'
        source={require('../assets/cart.png')}
      />
      <Text className='w-8 text-[8px] text-center text-white font-bold'>Carrito</Text>

      {productsCart?.length > 0
        && (
          <View className='flex flex-row justify-center items-center absolute -top-1 -right-1 w-4 h-4 rounded-full'
            style={{ backgroundColor: green }}
          >
            <Text className='w-full text-center color-black text-[10px]'>
              {productsCart?.length}
            </Text>
          </View>
        )
      }
    </Pressable>
  )
}

export default IconCart