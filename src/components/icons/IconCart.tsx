import { View, Text, TouchableOpacity } from 'react-native'
import { ShoppingCartIcon } from 'react-native-heroicons/solid'
import { useNavigation } from '@react-navigation/native'
import useInv from '../../hooks/useInv'

const IconCart = () => {
  const {productsCart, setProductsCart} = useInv()
  const navigation = useNavigation()

  return (
    <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
      <View>
        <ShoppingCartIcon size={30} color='white' />

        {productsCart.length > 0
          && (
            <View className='absolute -top-2 -right-2 bg-red-600 rounded-full w-5 h-5 justify-center items-center'>
              <Text className='color-white text-xs'>
                {productsCart.length}
              </Text>
            </View>
          )
        }
      </View>
    </TouchableOpacity>
  )
}

export default IconCart