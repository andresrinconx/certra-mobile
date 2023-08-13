import {useEffect, useRef} from 'react'
import { View, Text, TouchableOpacity, FlatList, BackHandler } from 'react-native'
import { globalStyles, theme, styles } from '../styles'
import useInv from '../hooks/useInv'
import useLogin from '../hooks/useLogin'
import IconCart from '../components/icons/IconCart'
import IconSearchProducts from '../components/icons/IconSearchProducts'
import LoaderProductsGrid from '../components/loaders/LoaderProductsGrid'
import { items } from '../utils/constants'
import ProductsViews from '../components/products/ProductsViews'
import IconUser from '../components/icons/IconUser'
import SelectCustomer from '../components/customers/SelectCustomer'
import { Menu, MenuOptions, MenuTrigger, MenuProvider } from 'react-native-popup-menu'
import IconLogOut from '../components/icons/IconLogOut'
import Loader from '../components/loaders/Loader'

const Home = () => {
  const {type, setType, products, icon, loaders, flowControl, setFlowControl} = useInv()
  const {myUser} = useLogin()
  const userMenuRef = useRef<Menu>(null)

  // flowControl
  useEffect(() => {
    if(!flowControl?.selected) { // is not selected
      if(myUser.from === 'usuario') {
        setFlowControl({...flowControl, showProducts: false, showSelectCustomer: true, showSelectSearch: true})
      } else { // myUser.from === 'scli'
        setFlowControl({...flowControl, showProducts: true, showSelectCustomer: false})
      }
    }
  }, [myUser])
  
  // SCREEN
  // close User Menu
  const closeUserMenu = () => {
    if (userMenuRef.current) {
      userMenuRef.current.close()
    }
  }
  // back HANDLER
  useEffect(() => {
    const backAction = () => {
      BackHandler.exitApp()
      return true
    }

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction)
  }, [])

  return (
    <MenuProvider>
      {/* header */}
      <View className={`flex flex-row justify-between items-center py-3`}
        style={{ ...styles.shadowHeader, backgroundColor: theme.turquesaClaro }}
      >
        <Text className='pl-3 font-bold text-2xl text-white'>Inventario</Text>
        {/* icons */}
        <View className='mr-4 flex flex-row gap-3 ml-5'>
          {flowControl?.showProducts && (<View><IconSearchProducts/></View>)}
          {flowControl?.showProducts && (<View><IconCart/></View>)}

          <Menu ref={userMenuRef}>
            <MenuTrigger style={{ backgroundColor: '#fff', borderRadius: 999 }}>
              <IconUser />
            </MenuTrigger>

            <MenuOptions customStyles={{optionsContainer: { width: '60%' }}}>
              <View className='flex flex-row items-center gap-3 w-full top-3 -right-3'>
                <View className='flex flex-row items-center justify-center w-8 h-8 rounded-full p-5' style={styles.shadow}>
                  <IconUser />
                </View>
                <Text className='w-40 font-bold text-gray-700 text-base'>{myUser?.us_nombre ?? myUser?.nombre}</Text>
              </View>

              <View className='px-3 mt-5 py-3 flex flex-row justify-end border-t border-t-slate-300'>
                <IconLogOut closeUserMenu={closeUserMenu} />
              </View>
            </MenuOptions>
          </Menu>
        </View>
      </View>

      {loaders.loadingSlectedCustomer ? (
        <View className='flex-1 flex-row items-center justify-center'>
          <Loader />
        </View>
      ) : (
        <>
          <SelectCustomer />
          {flowControl?.showProducts && !flowControl?.showSelectResults ? (
            <>
              <View className='flex-row justify-between mt-4 mb-3 mx-3 px-1'>
                <Text className={`text-gray-700 text-xl font-bold`}>Productos</Text>
    
                <TouchableOpacity onPress={() => setType(type === 'grid' ? 'list' : 'grid')}>
                  {icon(type)}
                </TouchableOpacity>
              </View>
    
              {loaders.loadingProducts ? (
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
          ):null}
        </>
      )}
    </MenuProvider>
  )
}

export default Home