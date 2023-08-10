import {useEffect} from 'react'
import { View, Text, TouchableOpacity, FlatList, BackHandler } from 'react-native'
import { globalStyles, theme, styles } from '../styles'
import useInv from '../hooks/useInv'
import useLogin from '../hooks/useLogin'
import IconCart from '../components/icons/IconCart'
import IconSearch from '../components/icons/IconSearch'
import LoaderProductsGrid from '../components/loaders/LoaderProductsGrid'
import { items } from '../utils/constants'
import ProductsViews from '../components/products/ProductsViews'
import IconUser from '../components/icons/IconUser'
import SelectCustomer from '../components/SelectCustomer'
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu'

const Home = () => {
  const {type, setType, products, icon, loadingProducts} = useInv()
  const {myUser} = useLogin()

  // mostrar datos si es usuario o si es scli
  // revisar

  // back HANDLER
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
        <Text className='pl-3 font-bold text-2xl text-white'>Inventario</Text>
        {/* icons */}
        <View className='mr-4 flex flex-row gap-3 ml-5'>
          <View><IconSearch/></View>
          <View><IconCart/></View>
          <Menu>
            <MenuTrigger style={{ backgroundColor: '#fff', borderRadius: 999 }}>
              <IconUser />
            </MenuTrigger>
            <MenuOptions customStyles={{optionsContainer: { width: '60%' }}}>
              <View className='flex flex-row items-center p-3 gap-3'>
                <View className='flex flex-row items-center justify-center w-8 h-8 rounded-full p-5' style={styles.shadow}>
                  <IconUser />
                </View>
                <Text className='font-bold text-gray-700 text-base'>{myUser?.us_nombre ?? myUser?.nombre}</Text>
              </View>
            </MenuOptions>
          </Menu>
        </View>
      </View>

      {/* user */}
      <View className='px-3'>
        <View className='flex items-center'>
          <View className='mt-3 bg-white px-2 py-1 w-3/4 rounded-xl'
            style={styles.shadow}
          >
            <Text className='text-2xl font-bold text-center text-gray-700'>{myUser?.us_nombre ?? myUser?.nombre}</Text>
          </View>
        </View>
      </View>

      {/* !!condition!! */}

      {/* Sel Customer */}
      <SelectCustomer />

      {/* bar */}
      <View className='flex-row justify-between mt-4 mb-3 mx-3 px-3'>
        <Text className={`text-black text-xl font-bold`}>Productos</Text>

        <TouchableOpacity onPress={() => setType(type === 'grid' ? 'list' : 'grid')}>
          {icon(type)}
        </TouchableOpacity>
      </View>

      {/* Products */}
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
              overScrollMode='never'
              renderItem={({item}) => {
                return (
                  <ProductsViews key={item.id} item={item} />
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