import { View, Text, TouchableOpacity, FlatList} from 'react-native'
import { ArrowSmallRightIcon, TrashIcon } from 'react-native-heroicons/outline'
import { useNavigation } from '@react-navigation/native'
import { globalStyles, theme, styles } from '../styles'
import useInv from '../hooks/useInv'
import ProductsCart from '../components/products/ProductsCart'

const Cart = () => {
  const {productsCart, clearCart} = useInv()
  const navigation = useNavigation()

  return (
    <>
      {/* header */}
      <View className={`flex flex-row justify-between items-center py-3 mb-4`}
        style={{...styles.shadowHeader, backgroundColor: theme.turquesaClaro}}
      >
        <View className='ml-4'>
          <TouchableOpacity onPress={() => {navigation.goBack()}}>
            <ArrowSmallRightIcon size={25} color='white' rotation={180} />
          </TouchableOpacity>
        </View>

        <Text className='font-bold text-2xl text-white pl-3'>Carrito</Text>

        <View className='mr-4'>
          <TouchableOpacity onPress={() => clearCart()} className=''>
            <TrashIcon size={30} color='white' strokeWidth={1.8} />
          </TouchableOpacity>
        </View>
      </View>

      {/* content */}
      <View className='flex-1 mx-2'>
        <View className=''>
          {productsCart.length === 0 ? (
            <Text className='text-center font-bold text-2xl mt-5 text-gray-700'>No hay productos</Text>
          ) : (
            <View className='pb-36 max-h-[102.5%]'>
              <FlatList
                data={productsCart}
                numColumns={1}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingBottom: 10}}
                overScrollMode='never'
                renderItem={({item}) => {
                  return (
                    <ProductsCart key={item.id} item={item} />
                  )
                }} 
              />
            </View>
          )}
        </View>
      </View>

      <View className='absolute bottom-3 w-full z-50 bg-white'>
        <View className='border-b border-b-gray-300' />

        <View className='px-2'>
          {/* subtotal & total */}
          <View className='flex pt-3 pb-1 px-3'>
            <View className='flex flex-row justify-between'>
              <Text className='font-semibold text-lg text-black'>Subtotal:</Text>
              <Text style={{color: theme.azul,}} className='font-semibold text-lg text-black'>Bs. {'10.000'}</Text>
            </View>

            <View className='flex flex-row justify-between'>
              <Text className='font-bold text-xl mb-2 text-black'>Total:</Text>
              <Text style={{color: theme.azul,}} className='font-bold text-xl mb-2 text-black'>Bs. {'10.000'}</Text>
            </View>
          </View>

          {/* btn confirm */}
          <TouchableOpacity onPress={() => ''} className='rounded-xl py-3' style={{backgroundColor: theme.verde}}>
            <Text className='color-white text-center font-bold text-xl'>Confirmar pedido ({productsCart.length} {productsCart.length === 1 ? 'producto' : 'productos'})</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  )
}

export default Cart