import {useState, useEffect, useRef} from 'react'
import { View, Text, TextInput, ScrollView, TouchableOpacity, Keyboard } from 'react-native'
import { styles } from '../styles'
import {XMarkIcon} from 'react-native-heroicons/mini'
import { MagnifyingGlassIcon } from 'react-native-heroicons/mini'
import useInv from '../hooks/useInv'
import { fetchSearchedItems } from '../api/inv'
import { items } from '../utils/constants'
import LoaderCustomersSearch from './loaders/LoaderCustomersSearch'
import UserFromScliInterface from '../interfaces/UserFromScliInterface'
import CustomersSearch from './customers/CustomersSearch'
import useLogin from '../hooks/useLogin'

const SelectCustomer = () => {
  const [value, setValue] = useState('')
  const {searchedCustomers, setSearchedCustomers, loadingSearchedItems, setLoadingSearchedItems, flowControl, setFlowControl} = useInv()
  const {myUser} = useLogin()
  const textInputRef = useRef<TextInput | null>(null)

  // SCREEN
  // useEffect(() => {
  //   if(value.length > 0) {
  //     setFlowControl({...flowControl, showSelectResults: true})
  //   }
  // }, [value])
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
    // setFlowControl({...flowControl, showSelectResults: false})
  }
  const handleScroll = () => {
    // Cerrar el teclado
    Keyboard.dismiss()
  }

  // SEARCH
  useEffect(() => {
    if(value === '') {
      setSearchedCustomers([])
    }
  }, [value])
  const handleSearch = async (value: string) => {
    setValue(value)
    if(value.length > 2) {
      setFlowControl({...flowControl, showSelectResults: true})
      setLoadingSearchedItems(true)
      // fetching...
      const data = await fetchSearchedItems({searchTerm: value, table: 'scli'})
      setSearchedCustomers(data.message === undefined ? data : [])
      setLoadingSearchedItems(false)
    } else {
      setSearchedCustomers([])
    }
  }

  return (
    <>
      {flowControl.showSelectCustomer ? (

        <View className='mx-5 mt-5'>
          {/* search */}
          {flowControl.showSelectLabel && (
            <View className='mb-3'>
              <Text className='text-gray-700 text-xl font-bold'>Cliente</Text>
              <Text className='text-gray-500 text-base'>{myUser.customer.nombre}</Text>
            </View>
          )}
          {flowControl.showSelectSearch ? (
            <View className='w-full flex flex-row items-center justify-between rounded-md' style={styles.shadow}>
              <View className='flex flex-row items-center'>
                <View className='ml-3'>
                  <MagnifyingGlassIcon size={20} color='gray' />
                </View>

                <TextInput className='text-base text-gray-700 ml-1 w-72'
                  ref={textInputRef}
                  placeholder='Buscar un cliente'
                  placeholderTextColor='gray'
                  value={value}
                  onChangeText={handleSearch}
                />
              </View>

              {value != '' && (
                <TouchableOpacity onPress={() => setValue('')} className='relative right-3'>
                  <XMarkIcon size={25} color='black' />
                </TouchableOpacity>
              )}
            </View>
          ):null}

          {/* results */}
          {flowControl.showSelectResults ? (
            <ScrollView className='bg-white mt-2 max-h-[80%] rounded-md p-3' 
              style={styles.shadow}
              showsVerticalScrollIndicator={false}
              onScroll={handleScroll}
            >
              {/* loadingSearchedItems */}
              {loadingSearchedItems ? (
                <View className='mb-5'> 
                  {items.map((item) => {
                    return (
                      <LoaderCustomersSearch key={item.id} />
                    )
                  })}
                </View>
              ) : (
                searchedCustomers?.length === 0 ? (
                  <View className='flex flex-row items-center justify-center py-6'>
                    <Text className='text-2xl text-gray-700'>No hay resultados</Text>
                  </View>
                ) : (
                  <View className='mb-5'>
                    {searchedCustomers.map((customer: UserFromScliInterface) => {
                      return (
                        <CustomersSearch key={customer.cliente} customer={customer} setValue={setValue} />
                      )
                    })}
                  </View>
                )
              )}
            </ScrollView>
          ):null}
        </View>
      ):null}
    </>
  )
}

export default SelectCustomer