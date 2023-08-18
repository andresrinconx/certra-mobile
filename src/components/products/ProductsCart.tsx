import {useState, useEffect} from 'react'
import { View, Text, TextInput, TouchableOpacity, Image, Modal } from 'react-native'
import { MinusSmallIcon, PlusSmallIcon, TrashIcon } from 'react-native-heroicons/outline'
import { theme, styles } from '../../styles'
import useInv from '../../hooks/useInv'
import ProductoInterface from '../../interfaces/ProductoInterface'

const ProductsCart = ({product}: {product: ProductoInterface}) => {
  const [localData, setLocalData] = useState({
    agregado: false,
    cantidad: ''
  })

  const {increase, decrease, removeElement, productsCart, setProductsCart} = useInv()
  const {descrip, precio1, cantidad, id, image_url} = product

  // refresh data when cart change
  useEffect(() => {
    const productInCart = productsCart.find(productInCart => productInCart.id === id)
    if(productInCart !== undefined) { // product in cart
      setLocalData({...localData, agregado: productInCart.agregado, cantidad: String(productInCart.cantidad)})
    } else {
      setLocalData({...localData, agregado: false, cantidad: String(1)})
    }
  }, [productsCart])

  useEffect(() => {
    const productInCart = productsCart.find(item => item.id === id)
    
    if(productInCart !== undefined) {
      if((productInCart.cantidad === Number(localData.cantidad) || productInCart.cantidad < Number(localData.cantidad) || productInCart.cantidad > Number(localData.cantidad) && Number(localData.cantidad) !== 0)) { // igual, mayor o menor (y no es cero)

        // actualizar la cantidad
        const updatedProductsCart = productsCart.map(item => item.id === id ? {...item, cantidad: Number(localData.cantidad)} : {...item})
        setProductsCart(updatedProductsCart)
      } else if(Number(localData.cantidad) === 0) { // cero
        console.log('cero')
      }
    }
  }, [localData.cantidad])

  return (
    <>
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
          <View className='basis-[65%] pr-5 border-l-[0.2px] border-l-gray-400 pl-2'>
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
                  <TouchableOpacity onPress={() => decrease(id)}
                    className='p-2 flex justify-center items-center'
                    disabled={cantidad === 1 ? true : false}
                  >
                    <MinusSmallIcon size={20} color='black' />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity className='flex flex-row justify-center items-center'>
                  <Text className='text-center text-base text-black w-[65px]'>{cantidad}</Text>
                </TouchableOpacity>
                
                {/* <View className='flex flex-row justify-center items-center'>
                  <TextInput className='text-center text-base text-black w-[80px]'
                    keyboardType='numeric'
                    value={String(cantidad)}
                    onChangeText={text => setCantidadLocal(Number(text))}
                  />
                </View> */}

                <View className='flex justify-center rounded-r-lg w-10' style={{backgroundColor: '#d8d8d8'}}>
                  <TouchableOpacity onPress={() => increase(id)}
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

      {/* modal */}
      <Modal
        visible={true}
        animationType='slide'
        transparent={true}
        
      >
        <View className='absolute bg-white w-[95%] h-48 left-2.5 right-2.5 bottom-2 rounded-2xl'
          style={styles.shadow}
        >
          <Text className='text-2xl text-center text-black mt-3 pb-3 border-b-[0.5px] border-gray-500'>Cantidad</Text>

          <View className='rounded-full mx-4 mt-3' style={{backgroundColor: '#f2f2f2',}}>
            <TextInput className='h-12 w-full pl-5 text-xl rounded-full'
              keyboardType='numeric'
              autoFocus
              value={String(localData.cantidad)}
              onChangeText={text => setLocalData({...localData, cantidad: text})}
            />
          </View>

          <View className='flex flex-row items-center justify-between mx-4 mt-4'>
            <TouchableOpacity onPress={() => ''} className='flex justify-center w-[48%] h-12 rounded-full border-[0.2px] border-gray-400'
              style={{backgroundColor: '#f7f7f7'}}
            >
              <Text className='text-center text-base uppercase text-blue-500'>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => ''} className='flex justify-center w-[48%] h-12 rounded-full border-[0.2px] border-gray-400'
              style={{backgroundColor: '#f7f7f7'}}
            >
              <Text className='text-center text-base uppercase text-blue-500'>Aceptar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  )
}

export default ProductsCart