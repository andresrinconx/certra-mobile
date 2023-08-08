import { useEffect, useRef, useCallback } from 'react'
import { View, Text, TouchableOpacity, Modal, TextInput } from 'react-native'
import { MagnifyingGlassIcon } from 'react-native-heroicons/mini'
import { ArrowSmallRightIcon } from 'react-native-heroicons/outline'
import useInv from '../hooks/useInv'

const Search = () => {
  const {search, modalSearch, setModalSearch, searchedProducts, setSearchedProducts} = useInv()
  const textInputRef = useRef<TextInput | null>(null) // hace referencia al input

  // show keyboard
  useEffect(() => {
    setTimeout(() => {
      if (modalSearch && textInputRef.current) {
        textInputRef.current.focus() // lo selecciona y enfoca
      }
    }, 100)
  }, [modalSearch])

  const handleSearch = async (value) => {
    // fetch locations
    if(value.length > 2) {
      fetchLocations({searchTerm: value}).then(data => {setLocations(data)})
    }
  }

  const handleTextDebounce = useCallback(debounce(handleSearch, 1200), [])
  // useCallback ejecuta la funcion callback cada vez que se llame la funcion en si
      // puede tener un arreglo de dependencias al igual que useEffect
    // debounce retrasa la ejecucion de esa funcion un numero de milisegundos
  
  return (
    <>
      <TouchableOpacity onPress={() => search()}>
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
            <View className='w-80 bg-gray-200 rounded-full'>
              <TextInput className='mx-4 text-base'
                placeholder='Buscar Inventario'
                ref={textInputRef}
                onChangeText={handleTextDebounce}
              />
            </View>
          </View>

          {/* results */}
          <View className='mx-3'>
            <Text className=''>Resultados</Text>
          </View>
        </View>
      </Modal> 
    </>
  )
}

export default Search