import { View, Text, Pressable, Image, TouchableOpacity } from 'react-native'
import React from 'react'

import globalStyles from '../../styles'

const Producto = ({
  item, 
  setCarrito, 
  carrito, 
  setItemsCarrito, 
  itemsCarrito,
  layout,
}) => {
  const { descrip, precio1 } = item

  const addToCart = () => {
    const total = itemsCarrito + 1
    setItemsCarrito(total)
    setCarrito([...carrito, item])
  }

  return (
    <>
      {layout === 1
        ? (
          <View className='basis-[49%] px-2 border border-[#c0c0c0] rounded-lg mb-4'>

              {/* img */}
            <View className='border-b-[#c0c0c0] border-b mb-2 justify-center items-center'>
              <Image
                className='w-32 h-32'
                source={require('../../assets/Acetaminofen.png')}
              />
            </View>
            
            {/* texts & btn */}
            <View>
              <Text 
                className='color-black font-bold text-[18px] mb-1'
                numberOfLines={2}
              >
                {descrip}
              </Text>

              <Text className='font-bold text-[18px] color-[#bed03c] mb-2'>Bs. {precio1}</Text>

              <TouchableOpacity
                className='bg-[#2794e8] rounded-md p-[5px] mb-2'
                onPress={ () => addToCart() }
              >
                <Text className='color-white text-center font-bold text-4'>Agregar</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : 
        <View className='border border-gray-300 mb-2 rounded-2xl p-3'>

          <View className='flex-row'>

            {/* textos item */}
            <View className='basis-[70%]'>
              <Text 
                className='color-black font-bold text-lg leading-6'
                numberOfLines={2}
              >
                {descrip}
              </Text>

              <Text className='font-bold text-lg color-[#bed03c]'>Bs. {precio1}</Text>
            </View>

            {/* btn */}
            <View className='basis-[30%] justify-center'>
              <TouchableOpacity
                className='bg-[#2794e8] rounded-md p-[5px] mb-2'
                onPress={ () => addToCart() }
              >
                <Text className='color-white text-center font-bold text-4'>Agregar</Text>
              </TouchableOpacity>  
            </View>
          </View>
        </View>
      }
    </>
  )
}

export default Producto