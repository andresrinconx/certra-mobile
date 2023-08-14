import {useState, useEffect} from 'react'
import { View, Text, Image, TouchableOpacity, TextInput } from 'react-native'
import { styles, theme } from '../../styles'
import useInv from '../../hooks/useInv'
import { MinusSmallIcon, PlusSmallIcon } from 'react-native-heroicons/outline'
import ProductoInterface from '../../interfaces/ProductoInterface'

const ProductsViews = ({item}: {item: ProductoInterface}) => {
  const {type, products, setProducts} = useInv()
  const {descrip, precio1, cantidad, agregado, id} = item

  // add to cart
  const handleAddToCart = () => {
    const updatedProducts = products.map(product => {
      if (product.id === id || product.agregado === true) {
        return {...product, agregado: true}
      } else {
        return {...product, agregado: false}
      }
    })
    setProducts(updatedProducts)
  }

  // increase & decrease
  const increase = () => {
    const updatedProducts = products.map(product => {
      if (product.id === id && product.agregado === true) {
        return {...product, cantidad: cantidad + 1}
      } else {
        return {...product}
      }
    })
    setProducts(updatedProducts)
  }
  const decrease = () => {
    const updatedProducts = products.map(product => {
      if (product.id === id && product.agregado === true && product.cantidad > 1) {
        return {...product, cantidad: cantidad - 1}
      } else if(product.id === id && product.agregado === true && product.cantidad === 1) {
        return {...product, agregado: false}
      } else {
        return {...product}
      }
    })
    setProducts(updatedProducts)
  }

  // cantidad (warn)
  const setCantidad = () => {
    console.log(cantidad)
    // const updatedProducts = products.map(product => {
    //   if (product.id === id && product.agregado === true) {
    //     return {...product, cantidad}
    //   } else {
    //     return {...product}
    //   }
    // })
    // setProducts(updatedProducts)
  }

  return (
    <>
      {type === 'grid'
        ? (
          <View className='w-[47.5%] mr-[10px] ml-[1px] mb-4 mt-[1px] px-2' style={styles.shadow}>
            {/* img */}
            <View className='border-b-[#c0c0c0] border-b mb-2 justify-center items-center'>
              <Image className='w-32 h-32' source={require('../../assets/Acetaminofen.png')} />
            </View>
            
            {/* texts & btn */}
            <View>
              <Text className={`text-black text-sm mb-1`} numberOfLines={2}>
                {descrip}
              </Text>
    
              <Text style={{color: theme.azul,}} className={`font-bold text-xl mb-2`}>
                Bs. {precio1}
              </Text>

              {!agregado && (
                <TouchableOpacity onPress={handleAddToCart} className={`rounded-md mb-2`}
                  style={{backgroundColor: theme.verde}}
                >
                  <Text className='color-white text-center font-bold p-1 pb-1.5'>Agregar</Text>
                </TouchableOpacity>
              )}

              {agregado && (
                <View className={`rounded-md mb-2`} style={{backgroundColor: theme.verde}}>
                  <View className='flex flex-row justify-between items-center p-1 px-4'>
                    <View>
                      <TouchableOpacity onPress={() => decrease()} className=''>
                        <MinusSmallIcon size={20} color='white' />
                      </TouchableOpacity>
                    </View>

                    <View>
                      <Text className='text-white text-center font-bold text-lg -my-4'>{cantidad}</Text>
                    </View>

                    {/* <View>
                      <TextInput className='text-center text-lg -my-4 text-white font-bold'
                        keyboardType='numeric'
                        value={String(cantidad)}
                        onChangeText={setCantidad}
                      />
                    </View> */}

                    <View>
                      <TouchableOpacity onPress={() => increase()} className=''>
                        <PlusSmallIcon size={20} color='white' />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )}
            </View>
          </View>
      ) : (
        <View style={styles.shadow} className='flex justify-center h-24 mr-[2px] ml-[1px] mb-2 mt-[1px] p-3'>
          <View className='flex-row'>
    
            {/* textos item */}
            <View className='basis-[65%]'>
              <Text className={`text-black text-sm mb-1`} numberOfLines={2}>
                {descrip}
              </Text>
      
              <Text style={{color: theme.azul,}} className={`font-bold text-xl`}>
                Bs. {precio1}
              </Text>
            </View>
    
            {/* btn */}
            <View className='basis-[35%] justify-center items-center'>
              <TouchableOpacity onPress={handleAddToCart} className={`rounded-md p-[10px] w-24 mb-2`}
                style={{backgroundColor: agregado ? 'rgba(0, 0, 0, 0.5)' : theme.verde,}}
                disabled={agregado}
              >
                <Text className='color-white text-center font-bold text-4'>{agregado ? 'Agregado' : 'Agregar'}</Text>
              </TouchableOpacity>  
            </View>
          </View>
        </View>
      )
      }
    </>
  )
}

export default ProductsViews