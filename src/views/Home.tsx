import {useEffect} from 'react'
import { View, Text, TouchableOpacity, FlatList, BackHandler } from 'react-native'
import { globalStyles, theme, styles } from '../styles'
import ProductsList from '../components/ProductsList'
import useInv from '../hooks/useInv'
import useLogin from '../hooks/useLogin'
import GoToCart from '../components/GoToCart'
import { useNavigation } from '@react-navigation/native'
import LogOut from '../components/LogOut'
import Search from '../components/Search'
import LoaderProductsGrid from '../components/LoaderProductsGrid'
import { items } from '../utils/constants'

const Home = () => {
  const {type, setType, products, icon, loadingProducts} = useInv()
  const {myUser} = useLogin()
  const navigation = useNavigation()

  useEffect(() => {
    const backAction = () => {
      BackHandler.exitApp()
      return true
    }

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction)
  }, [])

  return (
    <>
      {/* header */}
      <View className={`flex flex-row justify-between items-center py-3`}
        style={{ ...styles.shadowHeader, backgroundColor: theme.turquesaClaro }}
      >
        <View className='w-1/3 ml-4'>
          <TouchableOpacity>
            <LogOut />
          </TouchableOpacity>
        </View>

        <Text className='w-1/3 font-bold text-2xl text-white'>Inventario</Text>

        <View className='w-1/3 mr-4 flex flex-row gap-2 ml-5'>
          <View className=''>
            <TouchableOpacity onPress={() => {navigation.goBack()}}>
              <Search />
            </TouchableOpacity>
          </View>
          <View className=''>
            <TouchableOpacity onPress={() => {navigation.goBack()}}>
              <GoToCart />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View className='px-3'>
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

          <TouchableOpacity onPress={() => setType(type === 'grid' ? 'list' : 'grid')}>
            {icon(type)}
          </TouchableOpacity>
        </View>
      </View>

      {/* Grid || List */}
      {loadingProducts
        ? (
          <View className={`${globalStyles.container}`}>
            <View className='flex-1 justify-center items-center'>
              <FlatList
                data={items}
                numColumns={2}
                contentContainerStyle={{
                  paddingBottom: 10,
                }}
                showsVerticalScrollIndicator={false}
                // keyExtractor={(item) => item.id}
                overScrollMode='never'
                renderItem={({item}) => {
                  return (
                    <LoaderProductsGrid key={item.id} />
                  )
                }} 
              />
            </View>
          </View>
      ) : (
        <View className={`${globalStyles.container}`}>
          <View className='flex-1 justify-center items-center'>
            <FlatList
              data={products}
              key={type === 'grid' ? 'grid' : 'list'}
              numColumns={type === 'grid' ? 2 : 1}
              contentContainerStyle={{
                paddingBottom: 10,
              }}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item) => item.descrip}
              overScrollMode='never'
              renderItem={({item}) => {
                return (
                  <ProductsList key={item.descrip} item={item} />
                )
              }} 
            />
          </View>
        </View>
      )}
    </>
  )
}

export default Home