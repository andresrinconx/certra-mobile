import {useState} from 'react'
import { View, Text, Pressable, Modal, Image, TouchableOpacity } from 'react-native'
import { XMarkIcon, MinusSmallIcon, PlusSmallIcon } from 'react-native-heroicons/outline'
import { theme, styles } from '../styles'
import useInv from '../hooks/useInv'
import ProductoInterface from '../interfaces/ProductoInterface'

const ProductsCart = ({item}: {item: ProductoInterface}) => {
  const [cantidad, setCantidad] = useState(1)

  const {modalProduct, setModalProduct} = useInv()
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
                <Text className='text-2xl'>{cantidad}</Text>
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

      <Modal visible={modalProduct}
        animationType='slide'
        transparent={true}
        onRequestClose={() => setModalProduct(false)}
      >
        <View className='flex-1 justify-center items-center' style={{backgroundColor: 'rgba(0, 0, 0, 0.5)',}}>
          <View className='bg-white rounded-xl w-[92%] h-[60%]'>

            {/* close */}
            <TouchableOpacity onPress={() => setModalProduct(false)} className='absolute right-2 top-2'>
              <XMarkIcon size={35} color='black' />
            </TouchableOpacity>

            {/* content */}
            <View className='px-4 mt-8'>
              <View className='border-b-[#D1D5DB] border-b mb-2 justify-center items-center'>
                <Image source={require('../assets/Acetaminofen.png')} style={{width: 240, height: 240,}} />
              </View>
              
              <View>
                <Text className='text-black text-2xl mb-2'>{descrip}</Text>
                <Text style={{color: theme.azul,}} className='font-bold text-3xl'>Bs. {precio1}</Text>
              </View>
            </View>
          </View>
        </View>
      </Modal> 
    </>
  )
}

export default ProductsCart