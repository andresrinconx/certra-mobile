import { View, Text, TouchableOpacity } from 'react-native'
import ProductoInterface from '../../interfaces/ProductoInterface'
import useInv from '../../hooks/useInv'
import {ArrowUpLeftIcon, MagnifyingGlassCircleIcon} from 'react-native-heroicons/mini'
import {useNavigation} from '@react-navigation/native'

const ProductsSearch = ({product}: {product: ProductoInterface}) => {
  const {descrip} = product
  const navigation = useNavigation()

  return (
    <TouchableOpacity className='flex flex-row items-center justify-between mb-5 px-2'
      onPress={() => navigation.navigate('Product', { product })}
    >
      <View className='flex flex-row items-center gap-2 basis-[80%]'>
        <MagnifyingGlassCircleIcon size={40} color='lightgray' />
        <Text className='text-black text-base' numberOfLines={1}>{descrip}</Text>
      </View>
      <View>
        <ArrowUpLeftIcon size={20} color='black' />
      </View>
    </TouchableOpacity>
  )
}

export default ProductsSearch