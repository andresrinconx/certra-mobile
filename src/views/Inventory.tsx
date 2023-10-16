import { useRef, useState } from 'react'
import { View, TouchableOpacity, TextInput, Keyboard, FlatList, Image } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { useNavigation } from '@react-navigation/native'
import { StatusBar } from 'react-native'
import { debounce } from 'lodash'
import useLogin from '../hooks/useLogin'
import { ProductInterface } from '../utils/interfaces'
import { fetchSearchedItems } from '../utils/api'
import { formatText } from '../utils/helpers'
import { ProductsSearch, IconCart } from '../components'

const Inventory = () => {
  const [searchedProducts, setSearchedProducts] = useState([])

  const { themeColors: { background, typography, primary, list }, myUser: { access: { customerAccess, labAccess, salespersonAccess }, clipro } } = useLogin()
  const navigation = useNavigation()
  const textInputRef = useRef<TextInput | null>(null)

  // -----------------------------------------------
  // SCREEN
  // -----------------------------------------------

  // hide keyboard
  const handleScroll = () => {
    // Cerrar el teclado
    Keyboard.dismiss()
  }

  // -----------------------------------------------
  // SEARCH
  // -----------------------------------------------
  const handleSearch = async (value: string) => {
    if (value.length > 2) {
      // search
      
      let data: ProductInterface[] = []

      // fetch data
      if (customerAccess || salespersonAccess) { // all products (scli & usuario)
        data = await fetchSearchedItems({ searchTerm: formatText(value), table: 'appSinv/search' })

      } else if(labAccess) { // products by lab (usuario-clipro)
        data = await fetchSearchedItems({ searchTerm: formatText(value), table: `appSinv/searchPp/${clipro}` })

      }

      setSearchedProducts(data)
    } else {
      // no search
      setSearchedProducts([])
    }
  }
  const handleTextDebounce = debounce(handleSearch, 400)

  return (
    <View className='flex-1 h-full' style={{ backgroundColor: background, paddingTop: 16 }}>
      <StatusBar backgroundColor={background} barStyle='dark-content' />

      {/* content */}
      <View className='h-6/6'>

        {/* arrow & input */}
        <View className='flex flex-row items-center px-3'>
          <TouchableOpacity onPress={() => {
            navigation.goBack()
          }}>
            <Image style={{ width: wp(8), height: wp(8) }} resizeMode='cover'
              source={require('../assets/back.png')}
            />
          </TouchableOpacity>

          <View className='rounded-lg mx-3' style={{ backgroundColor: list, width: wp(70) }}>
            <TextInput className='mx-3 text-base py-0' style={{ color: typography }}
              placeholder='Buscar Productos'
              placeholderTextColor={typography}
              ref={textInputRef}
              onChangeText={handleTextDebounce}
              selectionColor={primary}
              autoFocus
            />
          </View>

          <IconCart showText={false} blueCart={true} />
        </View>

        {/* results */}
        <View className='h-full mx-3 mb-16 mt-1'>
          {searchedProducts?.length > 0 && (
            <FlatList
              data={searchedProducts}
              numColumns={1}
              onScroll={handleScroll}
              keyboardShouldPersistTaps='handled'
              contentContainerStyle={{
                paddingBottom: 200,
                marginTop: 10
              }}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => {
                const { id } = item
                return (
                  <ProductsSearch key={id} product={item} />
                )
              }}
            />
          )}
        </View>
      </View>
    </View>
  )
}

export default Inventory