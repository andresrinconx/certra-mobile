import {useState, useEffect} from 'react'
import { View, Text, TouchableOpacity, Image, Pressable } from 'react-native'
import { styles, theme } from '../../styles'
import ProductoInterface from '../../interfaces/ProductoInterface'
import useInv from '../../hooks/useInv'
import {useNavigation} from '@react-navigation/native'
import { MinusSmallIcon, PlusSmallIcon } from 'react-native-heroicons/outline'

const ProductsSearch = ({product}: {product: ProductoInterface}) => {
  const [localData, setLocalData] = useState({
    agregado: false,
    cantidad: 1
  })

  const {descrip, precio1, image_url, id} = product
  const {productsCart, increase, decrease, addToCart} = useInv()
  const navigation = useNavigation()

  // refresh data when cart change
  useEffect(() => {
    const productInCart = productsCart.find(productInCart => productInCart.id === id)
    if(productInCart !== undefined) { // product in cart
      setLocalData({...localData, agregado: productInCart.agregado, cantidad: productInCart.cantidad})
    } else {
      setLocalData({...localData, agregado: false, cantidad: 1})
    }
  }, [productsCart])

  return (
    <View className='flex flex-row items-center h-32 mr-[2px] ml-[1px] mb-2 mt-[1px] p-3'
      style={styles.shadow}
    >
      <View className='flex flex-row'>
        {/* image */}
        <Pressable onPress={() => navigation.navigate('Product', {...product})} className='basis-[35%] flex items-center justify-center'>
          {image_url === null ? (
            <Image className='w-24 h-24' resizeMode='cover'
              source={require('../../assets/no-image.png')} 
            />
          ) : (
            <Image className='w-24 h-24' resizeMode='contain' 
              source={{uri: `${image_url}`}}
            />
          )}
        </Pressable>

        {/* info */}
        <View className='basis-[65%] border-l-[0.2px] border-l-gray-400 pl-2'>
          {/* texts */}

          <Pressable onPress={() => navigation.navigate('Product', {...product})}>
            <Text className='text-black text-sm mb-1' numberOfLines={2}>
              {descrip}
            </Text>
          </Pressable>

          <Text style={{color: theme.azul,}} className='font-bold text-lg mb-2'>
            Bs. {precio1}
          </Text>

          <View className='flex items-end'>
            {!localData.agregado && (
              <TouchableOpacity onPress={() => addToCart(product)} className='rounded-md w-32'
                style={{backgroundColor: theme.verde}}
              >
                <Text className='color-white text-center font-bold p-1 pb-1.5'>Agregar</Text>
              </TouchableOpacity>
            )}

            {localData.agregado && (
              <View className='rounded-md mb-2 w-32' style={{backgroundColor: theme.verde}}>
                <View className='flex flex-row justify-between items-center p-1 px-4'>
                  <View>
                    <TouchableOpacity onPress={() => decrease(id)} className=''>
                      <MinusSmallIcon size={20} color='white' />
                    </TouchableOpacity>
                  </View>
    
                  <View>
                    <Text className='text-center text-lg -my-4 text-white font-bold'>{localData.cantidad}</Text>
                  </View>
    
                  {/* <View className='w-[80px]'>
                    <TextInput className='text-center text-lg -my-4 text-white font-bold'
                      keyboardType='numeric'
                      value={String(cantidad)}
                      onChangeText={text => setCantidadLocal(Number(text))}
                    />
                  </View> */}
    
                  <View>
                    <TouchableOpacity onPress={() => increase(id)} className=''>
                      <PlusSmallIcon size={20} color='white' />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          </View>
        </View>
        
      </View>
    </View>
  )
}

export default ProductsSearch