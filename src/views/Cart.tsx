import { View, ScrollView, Text, TouchableOpacity, BackHandler} from 'react-native'
import { ArrowSmallRightIcon, TrashIcon } from 'react-native-heroicons/outline'
import { useNavigation } from '@react-navigation/native'
import { globalStyles, theme, styles } from '../styles'
import useInv from '../hooks/useInv'
import ProductsCart from '../components/ProductsCart'

const Cart = () => {
  const {cart, clearCart, pay} = useInv()
  const navigation = useNavigation()

  return (
    <>
      {/* header */}
      <View className={`flex flex-row justify-between items-center py-3`}
        style={{ ...styles.shadowHeader, backgroundColor: theme.turquesaClaro }}
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
          {cart.length === 0
            ? (
              <Text className='text-center font-bold text-2xl mt-5 text-gray-700'>No hay productos</Text>
            ) : (
              <>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{paddingBottom: 10,}}
                  overScrollMode='never'
                >
                  {/* items and trash */}
                  <View className='flex-row items-center justify-between'>
                    <Text className='text-xl my-3 text-gray-700'>
                      <Text className='font-bold'>{cart.length} {cart.length == 1 ? 'item' : 'items'}</Text>
                    </Text>
                    
                    <TouchableOpacity onPress={() => clearCart()} className=''>
                      <TrashIcon size={30} color='black' />
                    </TouchableOpacity>
                  </View>

                  {cart.map((item) => {
                    return (
                      <ProductsCart key={item.id} item={item} />
                    )
                  })}
                </ScrollView>
              </>
            )
          }
        </View>

        {/* btn pay */}
        <View className='absolute bottom-3 w-full z-50'>
          <TouchableOpacity onPress={() => pay()} className='rounded-xl p-2'
            style={{backgroundColor: theme.verde,}}
          >
            <Text className='color-white text-center font-bold text-xl'>Ir a Pagar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  )
}

export default Cart