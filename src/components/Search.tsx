import { useEffect, useRef, useCallback } from 'react'
import { View, ScrollView, TouchableOpacity, Modal, TextInput, BackHandler, AppState, AppStateStatus, Keyboard } from 'react-native'
import { MagnifyingGlassIcon } from 'react-native-heroicons/mini'
import { ArrowSmallRightIcon } from 'react-native-heroicons/outline'
import useInv from '../hooks/useInv'
import { debounce } from 'lodash'
import ProductoInterface from '../interfaces/ProductoInterface'
import { fetchSinv } from '../api/inv'
import ProductsSearch from './ProductsSearch'
import { styles } from '../styles'
import { items } from '../utils/constants'
import LoaderProductsSearch from './LoaderProductsSearch'

const Search = () => {
  const {modalSearch, setModalSearch, searchedProducts, setSearchedProducts, setLoadingSearchedProducts, loadingSearchedProducts} = useInv()
  const textInputRef = useRef<TextInput | null>(null) // hace referencia al input

  // SCREEN
  // show keyboard
  useEffect(() => {
    setTimeout(() => {
      if (modalSearch && textInputRef.current) {
        textInputRef.current.focus() // lo selecciona y enfoca
      }
    }, 100)
  }, [modalSearch])
  // hide keyboard
  const handleScroll = () => {
    // Cerrar el teclado
    Keyboard.dismiss()
  }

  // SEARCH
  const handleSearch = async (value: string) => {
    if(value.length > 2) {
      setLoadingSearchedProducts(true)
      // fetching...
      // fetchSinv({searchTerm: value})
        // .then((data: ProductoInterface[]) => setSearchedProducts(data))
      const data = await fetchSinv({searchTerm: value})
      setSearchedProducts(data)
      setLoadingSearchedProducts(false)
    } else {
      setSearchedProducts([])
    }
  }
  const handleTextDebounce = useCallback(debounce(handleSearch, 200), [])
  // useCallback ejecuta la funcion callback cada vez que se llame la funcion en si
      // puede tener un arreglo de dependencias al igual que useEffect
    // debounce retrasa la ejecucion de esa funcion un numero de milisegundos
  
  return (
    <>
      <TouchableOpacity onPress={() => {
        setModalSearch(true)
        setSearchedProducts([])
      }}>
        <View>
          <MagnifyingGlassIcon size={30} color='white' />
        </View>
      </TouchableOpacity>

      <Modal visible={modalSearch}
        onRequestClose={() => setModalSearch(false)}
      >
        <View className=''>
          {/* searching */}
          <View className='flex flex-row items-center p-3'>
            <TouchableOpacity onPress={() => setModalSearch(false)} className='mr-2'>
              <ArrowSmallRightIcon size={30} color='black' rotation={180} />
            </TouchableOpacity>
            <View className='w-80 rounded-full'
              style={styles.shadow}
            >
              <TextInput className='mx-4 text-base text-gray-700'
                placeholder='Buscar Inventario'
                placeholderTextColor='gray'
                ref={textInputRef}
                onChangeText={handleTextDebounce}
              />
            </View>
          </View>

          {/* results */}
          <ScrollView className='mx-3'
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: 10,}}
            overScrollMode='never'
            onScroll={handleScroll}
          >
            {searchedProducts?.length > 0
              && (
                loadingSearchedProducts
                  ? (
                  <View className='mb-20'>
                    {items.map((item) => {
                      return (
                        <LoaderProductsSearch key={item.id} />
                      )
                    })}
                  </View>
                ) : (
                  <View className='mb-20'>
                    {searchedProducts.map((product: ProductoInterface) => {
                      return (
                        <ProductsSearch key={product.id} product={product} />
                      )
                    })}
                  </View>
                )
              )
            }
          </ScrollView>
        </View>
      </Modal> 
    </>
  )
}

export default Search