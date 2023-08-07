import { View, Text, TouchableOpacity, FlatList } from 'react-native'
import { globalStyles, styles } from '../styles'
import Loading from '../components/Loading'
import ProductsList from '../components/ProductsList'
import useInv from '../hooks/useInv'
import useLogin from '../hooks/useLogin'

const Home = () => {
  const {type, setType, productos, loading, icon} = useInv()
  const {myUser} = useLogin()
  const {us_codigo} = myUser

  return (
    <View className={`${globalStyles.container}`}>
      {/* user */}
      <View className='flex items-center'>
        <View className='mt-3 bg-white px-2 py-1 w-2/4 rounded-xl'
          style={styles.shadow}
        >
          <Text className='text-xl text-center'>Hola
            <Text className='text-2xl font-bold'>{' '}{us_codigo}</Text>
          </Text>
        </View>
      </View>

      {/* bar */}
      <View className='flex-row justify-between mt-4 mb-3 mx-3'>
        <Text className={`text-black text-xl font-bold`}>Productos</Text>

        <TouchableOpacity onPress={() => setType(type === 'grid' ? 'list' : 'grid')}>
          {icon(type)}
        </TouchableOpacity>
      </View>

      {/* Grid || List */}
      <View className='flex-1 justify-center items-center'>
        {loading
          ? (
            <Loading />
          ) : (
            <FlatList
              data={productos}
              key={type === 'grid' ? 'grid' : 'list'}
              numColumns={type === 'grid' ? 2 : 1}
              contentContainerStyle={{
                paddingBottom: 10,
              }}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item) => item.descrip}
              renderItem={({item}) => {
                return (
                  <ProductsList key={item.descrip} item={item} />
                )
              }} 
            />
          )
        }
      </View>
    </View>
  )
}

export default Home