import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { ShoppingCartIcon } from 'react-native-heroicons/solid'
import { useNavigation } from '@react-navigation/native'

const CartIcon = ({cart}) => {
  const navigation = useNavigation()

  return (
    <TouchableOpacity onPressOut={() => navigation.navigate('Cart')}>
      <View>
        <ShoppingCartIcon size={30} color='white' />

        {cart.length > 0
          && (
            <View className='absolute -top-2 -right-2 bg-red-600 rounded-full w-5 h-5 justify-center items-center'>
              <Text className='color-white text-sm'>
                {cart.length}
              </Text>
            </View>
          )
        }

      </View>
    </TouchableOpacity>
  )
}

export default CartIcon