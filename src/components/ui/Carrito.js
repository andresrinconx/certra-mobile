import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/FontAwesome'

const Carrito = ({navigation, carrito, itemsCarrito}) => {
  const goCart = () => {
    navigation.navigate('Cart')
  }

  return (
    <TouchableOpacity 
      onPressOut={ () => goCart() }
    >
      <View className='mr-2'>
        <Icon name="shopping-cart" size={24} color="#fff" />

        {carrito.length > 0
          && (
            <View className='absolute -top-2 -right-2 bg-red-600 rounded-full w-5 h-5 justify-center items-center'>
              <Text className='color-white text-sm'>
                {itemsCarrito}
              </Text>
            </View>
          )
        }

      </View>
    </TouchableOpacity>
  )
}

export default Carrito