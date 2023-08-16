import {useState, useEffect} from 'react'
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native'
import { MinusSmallIcon, PlusSmallIcon, TrashIcon } from 'react-native-heroicons/outline'
import { theme, styles } from '../../styles'
import useInv from '../../hooks/useInv'
import ProductoInterface from '../../interfaces/ProductoInterface'

const ProductsCart = ({item}: {item: ProductoInterface}) => {
  const [cantidadLocal, setCantidadLocal] = useState(1)

  const {increase, decrease, inputChange, removeElement} = useInv()
  const {descrip, precio1, id, cantidad, image_url} = item

  // change cantidad (input)
  useEffect(() => {
    inputChange(id, cantidadLocal)
  }, [cantidadLocal])

  return (
    <View className='flex justify-center items-center h-32 mr-[2px] ml-[1px] mb-2 mt-[1px]' style={styles.shadow}>
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
        <View className='basis-[65%] pr-5'>
          {/* texts */}
          <Text className='text-black text-sm mb-1' numberOfLines={1}>
            {descrip}
          </Text>
  
          <Text style={{color: theme.azul,}} className='font-bold text-lg mb-2'>
            Bs. {precio1}
          </Text>

          {/* btns */}
          <View className='flex flex-row justify-between h-10'>

            {/* increase & decrease */}
            <View className='flex flex-row justify-between rounded-xl' style={styles.shadow}>
              <View className='flex justify-center rounded-l-lg w-10' style={{backgroundColor: cantidad === 1 ? '#eaeaea' : '#d8d8d8'}}>
                <TouchableOpacity onPress={() => decrease(id, cantidad)}
                  className='p-2 flex justify-center items-center'
                  disabled={cantidad === 1 ? true : false}
                >
                  <MinusSmallIcon size={20} color='black' />
                </TouchableOpacity>
              </View>
              
              <View className='flex flex-row justify-center items-center'>
                <TextInput className='text-center text-base text-black w-[80px]'
                  keyboardType='numeric'
                  value={String(cantidad)}
                  onChangeText={text => setCantidadLocal(Number(text))}
                />
              </View>

              <View className='flex justify-center rounded-r-lg w-10' style={{backgroundColor: '#d8d8d8'}}>
                <TouchableOpacity onPress={() => increase(id, cantidad)}
                  className='p-2 flex justify-center items-center'
                >
                  <PlusSmallIcon size={20} color='black' />
                </TouchableOpacity>
              </View>
            </View>

            {/* delete */}
            <TouchableOpacity onPress={() => removeElement(id)} 
              className='h-full flex justify-center px-3 p-2 rounded-lg ml-ml-4 mb-2'
              style={styles.shadow}
            >
              <TrashIcon size={30} color='gray' />
            </TouchableOpacity>
          </View>
        </View>

      </View>
    </View>
  )
}

export default ProductsCart