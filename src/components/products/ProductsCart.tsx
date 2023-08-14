import {useState, useEffect} from 'react'
import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import { MinusSmallIcon, PlusSmallIcon } from 'react-native-heroicons/outline'
import { theme, styles } from '../../styles'
import useInv from '../../hooks/useInv'
import ProductoInterface from '../../interfaces/ProductoInterface'

const ProductsCart = ({item}: {item: ProductoInterface}) => {
  const [cantidadLocal, setCantidadLocal] = useState(1)

  const {increase, decrease, inputChange} = useInv()
  const {descrip, precio1, id, cantidad} = item

  // change cantidad (input)
  useEffect(() => {
    inputChange(id, cantidadLocal)
  }, [cantidadLocal])

  return (
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
          <TouchableOpacity onPress={() => decrease(id, cantidad)}
            style={{backgroundColor: theme.verde,}} 
            className='p-2 flex justify-center items-center rounded-full'
          >
            <MinusSmallIcon size={20} color='white' />
          </TouchableOpacity>
          
          <View className=''>
            <TextInput className='text-center text-2xl text-black px-4'
              keyboardType='numeric'
              value={String(cantidad)}
              onChangeText={text => setCantidadLocal(Number(text))}
            />
          </View>

          <TouchableOpacity onPress={() => increase(id, cantidad)}
            style={{backgroundColor: theme.verde,}} 
            className='p-2 flex justify-center items-center rounded-full'
          >
            <PlusSmallIcon size={20} color='white' />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default ProductsCart