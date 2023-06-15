import { View, ScrollView, Text, TouchableOpacity } from 'react-native'
import React from 'react'

import globalStyles from '../../styles'
import ProductoCart from '../items/ProductoCart'

const Cart = ({carrito, itemsCarrito}) => {
  const pay = () => {
    console.log('pagando...')    
  }

  return (
    <View className={globalStyles.main}>
      <View className={`${globalStyles.contenedor}`}>
        
        {carrito.length === 0
          ? (
            <Text className={globalStyles.noProductos}>No hay productos</Text>
          ) : (
            <>
              <Text className={globalStyles.texto}>{itemsCarrito} items</Text>

              <ScrollView 
                className='h-[89%] max-h-[89%] mb-4'
                showsVerticalScrollIndicator={false}
              >
                {
                  carrito.map( item => (
                    <ProductoCart
                      key={item.descrip}
                      item={item}
                    />
                  ))
                }
              </ScrollView>

              <TouchableOpacity
                className='bg-[#2794e8] rounded-lg p-2'
                onPress={ () => pay() }
              >
                <Text className='color-white text-center font-bold text-lg'>Ir a Pagar</Text>
              </TouchableOpacity>
            </>
          )
        }

      </View>
    </View>
  )
}

export default Cart