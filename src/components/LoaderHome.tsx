import { ScrollView, View, Text, TouchableOpacity, FlatList } from 'react-native'
import { theme, styles, globalStyles } from '../styles'
import { ArrowLeftOnRectangleIcon, ShoppingCartIcon } from 'react-native-heroicons/solid'
import { MagnifyingGlassIcon } from 'react-native-heroicons/mini'
import useInv from '../hooks/useInv'
import useLogin from '../hooks/useLogin'

const items = [1,2,3,4,5,6,7,8,9,10,11,12]

const LoaderHome = () => {
  const {type, icon} = useInv()
  const {myUser} = useLogin()

  return (
    <>
      {/* header (it doesn't work) */}
      <View className={`flex flex-row justify-between items-center py-3`}
        style={{ ...styles.shadowHeader, backgroundColor: theme.turquesaClaro }}
      >
        <View className='w-1/3 ml-4'>
          <TouchableOpacity>
            <ArrowLeftOnRectangleIcon size={30} color='white' />
          </TouchableOpacity>
        </View>

        <Text className='w-1/3 font-bold text-2xl text-white'>Inventario</Text>

        <View className='w-1/3 mr-4 flex flex-row gap-2 ml-5'>
          <View className=''>
            <TouchableOpacity>
              <MagnifyingGlassIcon size={30} color='white' />
            </TouchableOpacity>
          </View>
          <View className=''>
            <TouchableOpacity>
              <ShoppingCartIcon size={30} color='white' />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View className='bg-white px-3'>
        {/* user */}
        <View className='flex items-center'>
          <View className='mt-3 bg-white px-2 py-1 w-3/4 rounded-xl'
            style={styles.shadow}
          >
            <Text className='text-2xl font-bold text-center text-gray-700'>{myUser?.us_nombre ?? myUser?.nombre}</Text>
          </View>
        </View>

        {/* bar */}
        <View className='flex-row justify-between mt-4 mb-3 mx-3'>
          <Text className={`text-black text-xl font-bold`}>Productos</Text>

          <TouchableOpacity>
            {icon(type)}
          </TouchableOpacity>
        </View>
      </View>

      {/* items */}
      <View className={`bg-white flex-1 items-center justify-center`}>
        <FlatList
          data={items}
          numColumns={2}
          contentContainerStyle={{
            paddingBottom: 10,
            backgroundColor: 'white'
          }}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => String(item)}
          renderItem={({}) => {
            return (
              <View className='h-56 w-44 bg-green-200 mx-1.5 my-2.5 rounded-xl' style={{ backgroundColor: '#e5e5e5' }}></View>
            )
          }}
        />
      </View>
    </>
  )
}

export default LoaderHome