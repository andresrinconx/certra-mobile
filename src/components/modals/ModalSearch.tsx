import { useEffect, useRef, useState } from 'react'
import { View, Modal, ScrollView, TouchableOpacity, TextInput, Keyboard } from 'react-native'
import { ArrowSmallRightIcon } from 'react-native-heroicons/outline'
import {XMarkIcon} from 'react-native-heroicons/mini'
import ProductoInterface from '../../interfaces/ProductoInterface'
import ProductsSearch from '../products/ProductsSearch'
import { styles } from '../../styles'
import { items } from '../../utils/constants'
import LoaderProductsSearch from './../loaders/LoaderProductsSearch'
import useInv from '../../hooks/useInv'
import { fetchSinv } from '../../api/inv'

const ModalSearch = () => {
  const [value, setValue] = useState('')
  
  const {searchedProducts, loadingSearchedProducts, modalSearch, setModalSearch, setLoadingSearchedProducts, setSearchedProducts} = useInv()
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
  useEffect(() => {
    if(value === '') {
      setSearchedProducts([])
    }
  }, [value])

  const handleSearch = async (value: string) => {
    setValue(value)
    if(value.length > 2) {
      setLoadingSearchedProducts(true)
      // fetching...
      const data = await fetchSinv({searchTerm: value})
      setSearchedProducts(data)
      setLoadingSearchedProducts(false)
    } else {
      setSearchedProducts([])
    }
  }

  return (
    <Modal visible={modalSearch}
      onRequestClose={() => setModalSearch(false)}
    >
      <View>
        {/* searching */}
        <View className='flex flex-row items-center p-3'>
          <TouchableOpacity onPress={() => setModalSearch(false)} className='mr-2'>
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
            />
            {
              value
                && (
                <TouchableOpacity onPress={() => setValue('')} className='relative right-3'>
                  <XMarkIcon size={25} color='black' />
                </TouchableOpacity>
              )
            }
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
  )
}

export default ModalSearch