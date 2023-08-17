import {useState, useEffect} from 'react'
import { View, Text, Image, TouchableOpacity, TextInput, Pressable } from 'react-native'
import { styles, theme } from '../../styles'
import useInv from '../../hooks/useInv'
import {useNavigation} from '@react-navigation/native'
import { MinusSmallIcon, PlusSmallIcon } from 'react-native-heroicons/outline'
import ProductoInterface from '../../interfaces/ProductoInterface'

const ProductsGrid = ({item}: {item: ProductoInterface}) => {
  const [cantidadLocal, setCantidadLocal] = useState(1)

  const {increase, decrease, inputChange, addToCart} = useInv()
  const {descrip, precio1, cantidad, agregado, id, image_url} = item
  const navigation = useNavigation()

  // change cantidad (input)
  useEffect(() => {
    inputChange(id, cantidadLocal)
  }, [cantidadLocal])

  return (
    <Pressable onPress={() => navigation.navigate('Product', {...item})} className='w-[47.5%] mr-[10px] ml-[1px] mb-4 mt-[1px] px-2' style={styles.shadow}>
      {/* img */}
      <View className='border-b-gray-300 border-b mb-2 justify-center items-center'>
        {image_url === null ? (
          <Image className='w-32 h-32' resizeMode='cover'
            source={require('../../assets/Acetaminofen.png')} 
          />
        ) : (
          <Image className='w-32 h-32' resizeMode='contain' 
            source={{uri: `${image_url}`}}
          />
        )}
      </View>
      
      {/* texts & btn */}
      <View>
        <Text className={`text-black text-sm mb-1`} numberOfLines={2}>
          {descrip}
        </Text>

        <Text style={{color: theme.azul,}} className={`font-bold text-xl mb-2`}>
          Bs. {precio1}
        </Text>

        {!agregado && (
          <TouchableOpacity onPress={() => addToCart(id)} className={`rounded-md mb-2`}
            style={{backgroundColor: theme.verde}}
          >
            <Text className='color-white text-center font-bold p-1 pb-1.5'>Agregar</Text>
          </TouchableOpacity>
        )}

        {agregado && (
          <View className={`rounded-md mb-2`} style={{backgroundColor: theme.verde}}>
            <View className='flex flex-row justify-between items-center p-1 px-4'>
              <View>
                <TouchableOpacity onPress={() => decrease(id, cantidad)} className=''>
                  <MinusSmallIcon size={20} color='white' />
                </TouchableOpacity>
              </View>

              <View className='w-[80px]'>
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
                <TouchableOpacity onPress={() => increase(id, cantidad)} className=''>
                  <PlusSmallIcon size={20} color='white' />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </View>
    </Pressable>
  )
}

export default ProductsGrid