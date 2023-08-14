import {useState} from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import { styles, theme } from '../../styles'
import useInv from '../../hooks/useInv'
import ProductoInterface from '../../interfaces/ProductoInterface'

const ProductsViews = ({item}: {item: ProductoInterface}) => {
  // const [disabledBtn, setDisabledBtn] = useState(false) // en este caso debe ser un state local, del componente
  
  const {type, products, setProducts} = useInv()
  const {descrip, precio1, cantidad, agregado, id} = item

  // add to cart
  const handleAddToCart = () => {
    const updatedProducts = products.map(product => {
      if (product.id === id || product.agregado === true) {
        return { ...product, agregado: true }
      } else {
        return { ...product, agregado: false }
      }
    })
    setProducts(updatedProducts)
  }

  return (
    <>
      {type === 'grid'
        ? (
          <View className='w-[47.5%] mr-[10px] ml-[1px] mb-4 mt-[1px] px-2'
            style={styles.shadow}
          >
            {/* img */}
            <View className='border-b-[#c0c0c0] border-b mb-2 justify-center items-center'>
              <Image className='w-32 h-32' source={require('../../assets/Acetaminofen.png')} />
            </View>
            
            {/* texts & btn */}
            <View>
              <Text className={`text-black text-sm mb-1`} numberOfLines={2}>
                {descrip}
              </Text>
    
              <Text style={{color: theme.azul,}} className={`font-bold text-xl mb-2`}>
                Bs. {precio1}
              </Text>
    
              <TouchableOpacity onPress={handleAddToCart} className={`rounded-md p-[5px] mb-2`}
                style={{backgroundColor: agregado ? 'rgba(0, 0, 0, 0.5)' : theme.verde,}}
                disabled={agregado}
              >
                <Text className='color-white text-center font-bold text-4'>{agregado ? 'Agregado' : 'Agregar'}</Text>
              </TouchableOpacity>  
            </View>
          </View>
      ) : (
        <View style={styles.shadow} className='flex justify-center h-24 mr-[2px] ml-[1px] mb-2 mt-[1px] p-3'>
          <View className='flex-row'>
    
            {/* textos item */}
            <View className='basis-[65%]'>
              <Text className={`text-black text-sm mb-1`} numberOfLines={2}>
                {descrip}
              </Text>
      
              <Text style={{color: theme.azul,}} className={`font-bold text-xl`}>
                Bs. {precio1}
              </Text>
            </View>
    
            {/* btn */}
            <View className='basis-[35%] justify-center items-center'>
              <TouchableOpacity onPress={handleAddToCart} className={`rounded-md p-[10px] w-24 mb-2`}
                style={{backgroundColor: agregado ? 'rgba(0, 0, 0, 0.5)' : theme.verde,}}
                disabled={agregado}
              >
                <Text className='color-white text-center font-bold text-4'>{agregado ? 'Agregado' : 'Agregar'}</Text>
              </TouchableOpacity>  
            </View>
          </View>
        </View>
      )
      }
    </>
  )
}

export default ProductsViews