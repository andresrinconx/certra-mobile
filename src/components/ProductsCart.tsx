import {useState} from 'react'
import { View, Text, Pressable, TouchableOpacity } from 'react-native'
import { MinusSmallIcon, PlusSmallIcon } from 'react-native-heroicons/outline'
import { theme, styles } from '../styles'
import useInv from '../hooks/useInv'
import ProductoInterface from '../interfaces/ProductoInterface'
import ModalProductCart from './modals/ModalProductCart'

const ProductsCart = ({item}: {item: ProductoInterface}) => {
  const [cantidad, setCantidad] = useState(1)

  const {setModalProduct} = useInv()
  const {descrip, precio1} = item

  // incremento y decremento
  const incremento = () => {
    const total = cantidad + 1
    setCantidad(total)
  }
  const decremento = () => {
    if (cantidad !== 1) {
      const total = cantidad - 1
      setCantidad(total)
    }
  }

  return (
    <>
      <Pressable onLongPress={() => setModalProduct(true)}>
        <View className='flex justify-center h-24 mr-[2px] ml-[1px] mb-2 mt-[1px]' style={styles.shadow}>
          <View className='flex-row justify-center items-center'>

            {/* textos item */}
            <View className='basis-[60%]'>
              <Text className={`text-black text-sm mb-1`} numberOfLines={2}>
                {descrip}
              </Text>
      
              <Text style={{color: theme.azul,}} className={`font-bold text-xl mb-2`}>
                Bs. {precio1}
              </Text>
            </View>

            {/* btns */}
            <View className='basis-[32%] flex-row items-center my-5'>
              <TouchableOpacity onPress={() => decremento()}
                style={{backgroundColor: theme.verde,}} 
                className='p-2 flex justify-center items-center rounded-full'
              >
                <MinusSmallIcon size={20} color='white' />
              </TouchableOpacity>
              
              <View className='w-[30%] flex justify-center items-center'>
                <Text className='text-2xl text-gray-700'>{cantidad}</Text>
              </View>

              <TouchableOpacity onPress={() => incremento()}
                style={{backgroundColor: theme.verde,}} 
                className='p-2 flex justify-center items-center rounded-full'
              >
                <PlusSmallIcon size={20} color='white' />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Pressable>

      <ModalProductCart item={item} />
    </>
  )
}

export default ProductsCart