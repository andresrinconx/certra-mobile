import { View, ScrollView, Text, TouchableOpacity, Alert } from 'react-native'
import React, {useState, useEffect} from 'react'
import { ArrowSmallRightIcon, TrashIcon } from 'react-native-heroicons/outline'
import { useNavigation } from '@react-navigation/native'

import { globalStyles, theme, styles } from '../styles'
import ProductsList from '../components/ProductsList'

const Cart = ({carrito, itemsCarrito, setCarrito}) => {
  const [cartList, setCartList] = useState(false)

  const navigation = useNavigation()

  // list
  useEffect(() => {
    setCartList(true)
  }, [])

  // vaciar carrito
  const clearCart = () => {
    Alert.alert(
      'Alerta',
      '¿Seguro que quieres eliminar todos los productos del carrito?',
      [
        { text: 'Cancelar', style: 'cancel',},
        { text: 'Aceptar', onPress: () => {
          setCarrito([])
        } },
      ]
    )
  }

  // pay
  const pay = () => {
    console.log('pagando...')    
  }

  return (
    <>
      {/* header */}
      <View className={`bg-[${theme.turquesaOscuro}] flex flex-row justify-between items-center py-3`}
        style={styles.shadowHeader}
      >
        <View className='ml-4'>
          <TouchableOpacity onPress={() => {navigation.goBack()}} className=''>
            <ArrowSmallRightIcon size={25} color='white' rotation={180} />
          </TouchableOpacity>
        </View>

        <Text className='font-bold text-2xl text-white mr-[40%]'>Carrito</Text>
      </View>

      {/* content */}
      <View className={`${globalStyles.container}`}>
        <View className='pb-16'>
          {carrito.length === 0
            ? (
              <Text className='text-center font-bold text-2xl mt-5'>No hay productos</Text>
            ) : (
              <>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{paddingBottom: 10,}}
                >
                  {/* items */}
                  <View className='flex-row items-center justify-between'>
                    <Text className='text-xl my-3'>
                      <Text className='font-bold'>{itemsCarrito} </Text>items
                    </Text>
                    
                    <TouchableOpacity onPress={() => clearCart()} className=''>
                      <TrashIcon size={30} color='black' />
                    </TouchableOpacity>
                  </View>

                  {carrito.map((item) => {
                    return (
                      <ProductsList
                        key={item.descrip}
                        item={item}
                        cartList={cartList}
                      />
                    )
                  })}
                </ScrollView>
              </>
            )
          }
        </View>

        {/* btn */}
        <View className='absolute bottom-3 w-full z-50'>
          <TouchableOpacity className={`bg-[${theme.azulClaro}] rounded-xl p-2`} onPress={ () => pay() }>
            <Text className='color-white text-center font-bold text-xl'>Ir a Pagar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  )
}

export default Cart