import {useEffect, useRef} from 'react'
import { View, Text, TextInput, TouchableOpacity, Keyboard, FlatList } from 'react-native'
import { styles, theme } from '../../styles'
import {XMarkIcon} from 'react-native-heroicons/mini'
import {UserIcon} from 'react-native-heroicons/outline'
import useInv from '../../hooks/useInv'
import { fetchSearchedItems } from '../../utils/api'
import { items } from '../../utils/constants'
import LoaderCustomersSearch from '../loaders/LoaderCustomersSearch'
import CustomersSearch from './CustomersSearch'
import useLogin from '../../hooks/useLogin'

const SelectCustomer = () => {
  const {searchedCustomers, setSearchedCustomers, loaders, setLoaders, flowControl, setFlowControl, valueSearchCustomers, setValueSearchCustomers} = useInv()
  const {myUser} = useLogin()
  const textInputRef = useRef<TextInput | null>(null)

  // SCREEN
  useEffect(() => {
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', removeInputFocus)
    return () => {
      keyboardDidHideListener.remove()
    }
  }, [])
  const removeInputFocus = () => {
    if (textInputRef.current) {
      textInputRef.current.blur()
    }
  }
  const handleScroll = () => {
    // Cerrar el teclado
    Keyboard.dismiss()
  }

  // SEARCH
  useEffect(() => {
    if(valueSearchCustomers === '') {
      setSearchedCustomers([])
    }
  }, [valueSearchCustomers])
  
  const handleSearch = async (valueSearchCustomers: string) => {
    setValueSearchCustomers(valueSearchCustomers)
    if(valueSearchCustomers.length > 2) {
      if(!flowControl.showSelectResults) {
        setFlowControl({...flowControl, showSelectResults: true})
      }
      setLoaders({...loaders, loadingSearchedItems: true})
      // fetching...
      const data = await fetchSearchedItems({searchTerm: valueSearchCustomers, table: 'scli'})
      setSearchedCustomers(data.message === undefined ? data : [])
      setLoaders({...loaders, loadingSearchedItems: false})
    } else {
      setFlowControl({...flowControl, showSelectResults: false})
      setSearchedCustomers([])
    }
  }

  return (
    <>
      {flowControl?.showSelectCustomer ? (

        <View className='mx-5 mt-5'>

          {/* label */}
          {flowControl?.showSelectLabel && (
            <View className='mb-3'>
              <Text className='text-gray-700 text-xl font-bold'>Cliente</Text>
              <Text className='text-gray-500 text-base'>{myUser?.customer?.nombre}</Text>
            </View>
          )}

          {/* input */}
          {flowControl?.showSelectSearch ? (
            <View className='w-full flex flex-row items-center justify-between rounded-md' style={styles.shadow}>
              <View className='flex flex-row items-center'>
                <View className='ml-3'>
                  <UserIcon size={20} color='gray' strokeWidth={2} />
                </View>

                <TextInput className='text-base text-gray-700 ml-1 w-72'
                  ref={textInputRef}
                  placeholder='Buscar un cliente'
                  placeholderTextColor='gray'
                  value={valueSearchCustomers}
                  onChangeText={handleSearch}
                  selectionColor={theme.turquesaClaro}
                />
              </View>

              {valueSearchCustomers != '' && (
                <TouchableOpacity className='relative right-3'
                  onPress={() => {
                    setValueSearchCustomers('')
                    setFlowControl({...flowControl, showSelectResults: false})
                  }}>
                  <XMarkIcon size={25} color='black' />
                </TouchableOpacity>
              )}
            </View>
          ):null}

          {/* results */}
          {flowControl?.showSelectResults ? (
            <View className={`bg-white mt-2 rounded-md px-3 pt-3 ${flowControl.showSelectLabel ? 'max-h-[78%]' : 'max-h-[87%]'}`}
              style={styles.shadow}
            >
              {/* loadingSearchedItems */}
              {loaders.loadingSearchedItems ? (
                <FlatList
                  data={items}
                  numColumns={1}
                  onScroll={handleScroll}
                  contentContainerStyle={{
                    paddingBottom: 5,
                  }}
                  showsVerticalScrollIndicator={false}
                  renderItem={({item}) => {
                    return (
                      <LoaderCustomersSearch key={item.id} />
                    )
                  }} 
                />
              ) : (
                searchedCustomers?.length === 0 ? (
                  <View className='flex flex-row items-center justify-center py-8 -mt-3'>
                    <Text className='text-xl text-gray-700 w-full text-center'>No hay resultados</Text>
                  </View>
                ) : (
                  <FlatList
                    data={searchedCustomers}
                    numColumns={1}
                    onScroll={handleScroll}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{
                      paddingBottom: 5,
                    }}
                    showsVerticalScrollIndicator={false}
                    renderItem={({item}) => {
                      return (
                        <CustomersSearch key={item.rifci} customer={item} />
                      )
                    }} 
                  />
                )
              )}
            </View>
          ):null}
        </View>
      ):null}
    </>
  )
}

export default SelectCustomer