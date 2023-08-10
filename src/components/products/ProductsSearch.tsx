import {useState} from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { styles, theme } from '../../styles'
import ProductoInterface from '../../interfaces/ProductoInterface'
import useInv from '../../hooks/useInv'

const ProductsSearch = ({product}: {product: ProductoInterface}) => {
  const [disabledBtn, setDisabledBtn] = useState(false) // en este caso debe ser un state local, del componente
  
  const {descrip, precio1} = product
  const {setCart, cart} = useInv()

  // add to cart
  const handleAddToCart = () => {
    setCart([...cart, product])
    setDisabledBtn(true)
  }

  return (
    <View className='flex flex-row items-center h-16 mr-[2px] ml-[1px] mb-2 mt-[1px] p-3'
      style={styles.shadow}
    >

      {/* textos item */}
      <Text className={`text-black text-sm mb-1 basis-[60%] pr-2`} numberOfLines={2}>
        {descrip}
      </Text>

      <Text style={{color: theme.azul,}} className={`font-bold text-lg basis-[30%] pl-1.5`}>
        Bs. {precio1}
      </Text>

      {/* btn */}
      <View className='basis-[10%] flex flex-row justify-center items-center'>
        <TouchableOpacity onPress={handleAddToCart} className={`rounded-full p-5 mb-2 flex flex-row justify-center items-center`}
          style={{backgroundColor: disabledBtn ? 'rgba(0, 0, 0, 0.5)' : theme.verde,}}
          disabled={disabledBtn}
        >
          <Text className='absolute color-white text-3xl'>+</Text>
        </TouchableOpacity>  
      </View>
    </View>
  )
}

export default ProductsSearch