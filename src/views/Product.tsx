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

  const {products, setProducts} = useInv()
  const navigation = useNavigation()
  const route = useRoute()

  useEffect(() => {
    setProduct(route.params as ProductoInterface)
  }, [route])

  // product on cart
  useEffect(() => {
    const productOnCart = products.find(item => item.id === product.id && product.agregado === true)
    if(productOnCart !== undefined) {
      setProduct({...product, agregado: true, cantidad: productOnCart.cantidad})
    } else {
      setProduct({...product, agregado: false, cantidad: 1})
    }
  }, [products])

  // update 'cantidad'
  useEffect(() => {
    const updatedProducts = products.map(item => {
      if (item.id === product.id && item.agregado === true) {
        return {...item, cantidad: product.cantidad}
      } else {
        return {...item}
      }
    })
    setProducts(updatedProducts)
  }, [product.cantidad])
  
  // actions
  const addToProducts = () => {
    if(!product.agregado) {
      setProduct({...product, agregado: true})
    }
    
    // is in grid
    const productInGrid = products.find(item => item.id === product.id)
    if(productInGrid !== undefined) {
      const updatedProducts = products.map(item => {
        if (item.id === product.id && product.agregado === false) {
          return {...product, agregado: true}
        } else {
          return {...product}
        }
      })
      setProducts(updatedProducts)
    } else {
      setProducts([...products, {
        ...product,
        agregado: true,
        cantidad: 1
      }])
    }
  }

  // increase & decrease
  const increase = () => {
    setProduct({...product, cantidad: product.cantidad + 1})
  }
  const decrease = () => {
    if(product.cantidad > 1) {
      setProduct({...product, cantidad: product.cantidad - 1})
    }
  }

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
          {product.agregado && (
            <View className='w-[45%] pl-3'>
              <View className='flex flex-row justify-between rounded-xl' style={styles.shadow}>
                <View className='flex justify-center rounded-l-lg w-10' style={{backgroundColor: product.cantidad === 1 ? '#eaeaea' : '#d8d8d8'}}>
                  <TouchableOpacity onPress={() => decrease()}
                    className='p-2 flex justify-center items-center py-2.5'
                    disabled={product.cantidad === 1 ? true : false}
                  >
                    <MinusSmallIcon size={20} color='black' />
                  </TouchableOpacity>
                </View>
                
                <View className='flex flex-row justify-center items-center'>
                  <Text className='text-center text-xl text-black w-[80px]'>{product.cantidad}</Text>
                  {/* <TextInput className='text-center text-base text-black w-[80px]'
                    keyboardType='numeric'
                    value={String(product.cantidad)}
                    // onChangeText={text => setCantidadLocal(Number(text))}
                  /> */}
                </View>

                <View className='flex justify-center rounded-r-lg w-10' style={{backgroundColor: '#d8d8d8'}}>
                  <TouchableOpacity onPress={() => increase()}
                    className='p-2 flex justify-center items-center py-2.5'
                  >
                    <PlusSmallIcon size={20} color='black' />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          {/* btn confirm */}
          <View className={`${!product.agregado ? 'w-[90%] flex flex-row justify-center' : 'w-[45%] pr-3'}`}>
            <TouchableOpacity onPress={() => addToProducts()} className='rounded-xl py-2 w-full' 
              style={{backgroundColor: product.agregado ? '#d2ec92' : theme.verde}}
              disabled={false}
            >
              <Text className='color-white text-center font-bold text-xl'>{product.agregado ? 'Agregado' : 'Agregar'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  )
}

export default Product