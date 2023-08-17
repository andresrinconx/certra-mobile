import {useEffect, useState} from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'
import { ArrowSmallRightIcon } from 'react-native-heroicons/outline'
import {useNavigation, useRoute} from '@react-navigation/native'
import { theme, styles } from '../styles'
import ProductoInterface from '../interfaces/ProductoInterface'
import IconCart from '../components/icons/IconCart'

const Product = () => {
  const [product, setProduct] = useState<ProductoInterface>({
    descrip: '',
    precio1: 0,
    id: 0,
    image_url: '',
    cantidad: 1,
    agregado: false
  })

  const navigation = useNavigation()
  const route = useRoute()

  useEffect(() => {
    setProduct(route.params as ProductoInterface)
  }, [route])

  return (
    <View>
      {/* header */}
      <View className='flex flex-row justify-between items-center py-3 mb-4'
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

      {/* content */}
      <View className=''>
        {/* img */}
        <View className='border-b-gray-300 border-b mb-2 pb-5 justify-center items-center'>
          {product?.image_url === null ? (
            <Image className='w-32 h-32' resizeMode='cover'
              source={require('../assets/Acetaminofen.png')} 
            />
          ) : (
            <Image className='w-52 h-52' resizeMode='contain' 
              source={{uri: `${product?.image_url}`}}
            />
          )}
        </View>
      </View>
    </View>
  )
}

export default Product