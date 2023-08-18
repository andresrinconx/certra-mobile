import {useEffect, useState} from 'react'
import { View, Text, TouchableOpacity, Image, TextInput } from 'react-native'
import { ArrowSmallRightIcon } from 'react-native-heroicons/outline'
import {useNavigation, useRoute} from '@react-navigation/native'
import { theme, styles } from '../styles'
import { MinusSmallIcon, PlusSmallIcon } from 'react-native-heroicons/outline'
import ProductoInterface from '../interfaces/ProductoInterface'
import IconCart from '../components/icons/IconCart'
import useInv from '../hooks/useInv'

const Product = () => {
  const [product, setProduct] = useState<ProductoInterface>({descrip: '', precio1: 0, id: 0, image_url: '', cantidad: 1, agregado: false})
  const [localData, setLocalData] = useState({
    agregado: false,
    cantidad: 1
  })

  const {productsCart, increase, decrease, addToCart} = useInv()
  const navigation = useNavigation()
  const route = useRoute()

  useEffect(() => {
    setProduct(route.params as ProductoInterface)
  }, [route])

  // refresh data when cart change
  useEffect(() => {
    const productInCart = productsCart.find(productInCart => productInCart.id === product.id)
    if(productInCart !== undefined) { // product in cart
      setLocalData({...localData, agregado: productInCart.agregado, cantidad: productInCart.cantidad})
    } else {
      setLocalData({...localData, agregado: false, cantidad: 1})
    }
  }, [productsCart, product])

  return (
    <View className='flex-1'>
      {/* header */}
      <View className='flex flex-row justify-between items-center py-3'
        style={{...styles.shadowHeader, backgroundColor: theme.turquesaClaro}}
      >
        <View className='ml-4'>
          <TouchableOpacity onPress={() => {navigation.goBack()}}>
            <ArrowSmallRightIcon size={25} color='white' rotation={180} />
          </TouchableOpacity>
        </View>

        <Text className='font-bold text-center text-base text-white w-[60%]' numberOfLines={1}>
          {product?.descrip}
        </Text>

        <View className='mr-4'>
          <IconCart/>
        </View>
      </View>

      {/* img */}
      <View className='h-[35%] bg-white border-b-gray-300 border-b pb-5 justify-center items-center'>
        {product?.image_url === '' || product?.image_url === null ? (
          <Image className='w-52 h-52' resizeMode='cover'
            source={require('../assets/Acetaminofen.png')}
          />
        ) : (
          <Image className='w-52 h-52' resizeMode='contain' 
            source={{uri: `${product?.image_url}`}}
          />
        )}
      </View>
      
      {/* content */}
      <View className='h-full pt-3 bg-white px-3'>
        <Text className='text-xl font-bold text-gray-700'>{product?.descrip}</Text>
        <Text className='text-xl mt-3 font-bold' style={{color: theme.azulClaro,}}>Bs. {product?.precio1}</Text>
      </View>

      {/* add */}
      <View className='absolute bottom-0 w-full z-50 bg-white'>
        <View className='border-b border-b-gray-300' />

        <View className={`flex flex-row items-center ${product.agregado ? 'justify-between' : 'justify-center'} gap-5 py-4`}>
          {/* increase & decrease */}
          {localData.agregado && (
            <View className='w-[45%] pl-3'>
              <View className='flex flex-row justify-between rounded-xl' style={styles.shadow}>
                <View className='flex justify-center rounded-l-lg w-10' style={{backgroundColor: localData.cantidad === 1 ? '#eaeaea' : '#d8d8d8'}}>
                  <TouchableOpacity onPress={() => decrease(product.id)}
                    className='p-2 flex justify-center items-center py-2.5'
                    disabled={localData.cantidad === 1 ? true : false}
                  >
                    <MinusSmallIcon size={20} color='black' />
                  </TouchableOpacity>
                </View>
                
                <View className='flex flex-row justify-center items-center'>
                  <Text className='text-center text-xl text-black w-[80px]'>{localData.cantidad}</Text>
                  {/* <TextInput className='text-center text-base text-black w-[80px]'
                    keyboardType='numeric'
                    value={String(product.cantidad)}
                    // onChangeText={text => setCantidadLocal(Number(text))}
                  /> */}
                </View>

                <View className='flex justify-center rounded-r-lg w-10' style={{backgroundColor: '#d8d8d8'}}>
                  <TouchableOpacity onPress={() => increase(product.id)}
                    className='p-2 flex justify-center items-center py-2.5'
                  >
                    <PlusSmallIcon size={20} color='black' />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          {/* btn confirm */}
          <View className={`${!localData.agregado ? 'w-[90%] flex flex-row justify-center' : 'w-[45%] pr-3'}`}>
            <TouchableOpacity onPress={() => addToCart(product)} className='rounded-xl py-2 w-full' 
              style={{backgroundColor: localData.agregado ? '#d2ec92' : theme.verde}}
              disabled={false}
            >
              <Text className='color-white text-center font-bold text-xl'>{localData.agregado ? 'Agregado' : 'Agregar'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  )
}

export default Product