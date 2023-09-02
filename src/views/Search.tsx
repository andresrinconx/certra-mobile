import { useEffect, useRef, useState } from 'react'
import { View, TouchableOpacity, TextInput, Keyboard, FlatList } from 'react-native'
import { ArrowSmallRightIcon } from 'react-native-heroicons/outline'
import {XMarkIcon} from 'react-native-heroicons/mini'
import ProductsSearch from '../components/products/ProductsSearch'
import { styles, theme } from '../styles'
import { items } from '../utils/constants'
import LoaderProductsSearch from '../components/loaders/LoaderProductsSearch'
import useInv from '../hooks/useInv'
import { fetchSearchedItems } from '../utils/api'
import { useNavigation } from '@react-navigation/native'

const Search = () => {
  const [value, setValue] = useState('')
  
  const {searchedProducts, loaders, setLoaders, setSearchedProducts} = useInv()
  const navigation = useNavigation()
  const textInputRef = useRef<TextInput | null>(null)

  // SCREEN
  // show keyboard
  useEffect(() => {
    setTimeout(() => {
      if (textInputRef.current) {
        textInputRef.current.focus()
      }
    }, 300)
  }, [])
  // hide keyboard
  const handleScroll = () => {
    // Cerrar el teclado
    Keyboard.dismiss()
  }

  // SEARCH
  useEffect(() => {
    if(value === '') {
      setSearchedProducts([])
    }
  }, [value])

  const handleSearch = async (value: string) => {
    setValue(value)
    if(value.length > 2) {
      setLoaders({...loaders, loadingSearchedItems: true})
      // fetching...
      const data = await fetchSearchedItems({searchTerm: value, table: 'search'}) // search = sinv
      setSearchedProducts(data)
      setLoaders({...loaders, loadingSearchedItems: false})
    } else {
      setSearchedProducts([])
    }
  }

  return (
    <View className='flex-1 bg-white'>
      {/* arrow & input */}
      <View className='flex flex-row items-center p-3'>
        <TouchableOpacity className='mr-2' onPress={() => {
          navigation.goBack()
          setValue('')
        }}>
          <ArrowSmallRightIcon size={30} color='black' rotation={180} />
        </TouchableOpacity>
        <View className='w-80 flex flex-row items-center justify-between rounded-full'
          style={styles.shadow}
        >
          <TextInput className='mx-4 text-base text-gray-700'
            placeholder='Buscar Inventario'
            placeholderTextColor='gray'
            ref={textInputRef}
            value={value}
            onChangeText={handleSearch}
            selectionColor={theme.turquesaClaro}
          />
          {value && (
            <TouchableOpacity onPress={() => setValue('')} className='relative right-3'>
              <XMarkIcon size={25} color='black' />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* results */}
      <View className='mx-3 mb-16'>
        {loaders.loadingSearchedItems ? (
          <FlatList
            data={items}
            numColumns={1}
            onScroll={handleScroll}
            contentContainerStyle={{
              paddingBottom: 20,
            }}
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => {
              return (
                <LoaderProductsSearch key={item.id} />
              )
            }} 
          />
        ) : (
          searchedProducts?.length > 0 && (
            <FlatList
              data={searchedProducts}
              numColumns={1}
              onScroll={handleScroll}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{
                paddingBottom: 20,
              }}
              showsVerticalScrollIndicator={false}
              renderItem={({item}) => {
                return (
                  <ProductsSearch key={item.id} product={item} />
                )
              }} 
            />
          )
        )}
      </View>
    </View>
  )
}

export default Search