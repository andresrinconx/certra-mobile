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
      <View className={`flex flex-row justify-between items-center py-3`}
        style={{...styles.shadowHeader, backgroundColor: theme.turquesaClaro}}
      >
        <View className='ml-4'>
          <TouchableOpacity onPress={() => {navigation.goBack()}}>
            <ArrowSmallRightIcon size={25} color='white' rotation={180} />
          </TouchableOpacity>
        </View>

        <Text className='font-bold text-2xl text-white mr-[40%]'>Carrito</Text>
      </View>

      {/* content */}
      <View className={`${globalStyles.container}`}>
        <View className='pb-16'>
          {productsCart.length === 0 ? (
            <Text className='text-center font-bold text-2xl mt-5 text-gray-700'>No hay productos</Text>
          ) : (
            <>
              <View className='pb-10 max-h-[102.5%]'>
                {/* items and trash */}
                <View className='flex-row items-center justify-between px-2'>
                  <Text className='text-xl my-3 text-gray-700'>
                    <Text className='font-bold'>{productsCart.length} {productsCart.length == 1 ? 'producto' : 'productos'}</Text>
                  </Text>
                  
                  <TouchableOpacity onPress={() => clearCart()} className=''>
                    <TrashIcon size={30} color='black' />
                  </TouchableOpacity>
                </View>

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
            </>
          )}
        </View>

        {/* btn pay */}
        <View className='absolute bottom-3 w-full z-50'>
          <TouchableOpacity onPress={() => ''} className='rounded-xl p-2'
            style={{backgroundColor: theme.verde,}}
          >
            <Text className='color-white text-center font-bold text-xl'>Confirmar pedido</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  )
}

export default Cart