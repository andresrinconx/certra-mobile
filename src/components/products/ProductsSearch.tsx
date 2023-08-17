import {useState, useEffect} from 'react'
import { View, Text, TouchableOpacity, Image, Pressable } from 'react-native'
import { styles, theme } from '../../styles'
import ProductoInterface from '../../interfaces/ProductoInterface'
import useInv from '../../hooks/useInv'
import {useNavigation} from '@react-navigation/native'
import { MinusSmallIcon, PlusSmallIcon } from 'react-native-heroicons/outline'

const ProductsSearch = ({product}: {product: ProductoInterface}) => {
  const [agregado, setAgregado] = useState(false)
  const [cantidad, setCantidad] = useState(1)

  const {descrip, precio1, image_url, id} = product
  const {setProducts, products} = useInv()
  const navigation = useNavigation()

  // product on cart
  useEffect(() => {
    const productOnCart = products.find(product => product.id === id && product.agregado === true)
    if(productOnCart !== undefined) {
      setAgregado(true)
      setCantidad(productOnCart.cantidad)
    }
  }, [])

  // update 'cantidad'
  useEffect(() => {
    const updatedProducts = products.map(product => {
      if (product.id === id && product.agregado === true) {
        return {...product, cantidad}
      } else {
        return {...product}
      }
    })
    setProducts(updatedProducts)
  }, [cantidad])
  
  const addToProducts = () => {
    if(!agregado) {
      setAgregado(true)
    }
    
    // is in grid
    const productInGrid = products.find(product => product.id === id)
    if(productInGrid !== undefined) {
      const updatedProducts = products.map(product => {
        if (product.id === id && product.agregado === false) {
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
    setCantidad(cantidad + 1)
  }
  const decrease = () => {
    if(cantidad > 1) {
      setCantidad(cantidad - 1)
    }
  }

  return (
    <TouchableOpacity onPress={() => navigation.navigate('Product', {...product, agregado, cantidad})} className='flex flex-row items-center h-32 mr-[2px] ml-[1px] mb-2 mt-[1px] p-3'
      style={styles.shadow}
    >
      <View className='flex flex-row'>
        {/* image */}
        <View className='basis-[35%] flex items-center justify-center'>
          {image_url === null ? (
            <Image className='w-24 h-24' resizeMode='cover'
              source={require('../../assets/Acetaminofen.png')} 
            />
          ) : (
            <Image className='w-24 h-24' resizeMode='contain' 
              source={{uri: `${image_url}`}}
            />
          )}
        </View>

        {/* info */}
        <View className='basis-[65%] border-l-[0.2px] border-l-gray-400 pl-2'>
          {/* texts */}
          <Text className='text-black text-sm mb-1' numberOfLines={2}>
            {descrip}
          </Text>

          <Text style={{color: theme.azul,}} className='font-bold text-lg mb-2'>
            Bs. {precio1}
          </Text>

          <View className='flex items-end'>
            {!agregado && (
              <TouchableOpacity onPress={() => addToProducts()} className='rounded-md w-32'
                style={{backgroundColor: theme.verde}}
              >
                <Text className='color-white text-center font-bold p-1 pb-1.5'>Agregar</Text>
              </TouchableOpacity>
            )}

            {agregado && (
              <View className='rounded-md mb-2 w-32' style={{backgroundColor: theme.verde}}>
                <View className='flex flex-row justify-between items-center p-1 px-4'>
                  <View>
                    <TouchableOpacity onPress={() => decrease()} className=''>
                      <MinusSmallIcon size={20} color='white' />
                    </TouchableOpacity>
                  </View>
    
                  <View>
                    <Text className='text-center text-lg -my-4 text-white font-bold'>{cantidad}</Text>
                  </View>
    
                  {/* <View className='w-[80px]'>
                    <TextInput className='text-center text-lg -my-4 text-white font-bold'
                      keyboardType='numeric'
                      value={String(cantidad)}
                      onChangeText={text => setCantidadLocal(Number(text))}
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
        
      </View>
    </TouchableOpacity>
  )
}

export default ProductsSearch