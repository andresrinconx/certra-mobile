import {useState, useEffect, useRef} from 'react'
import { View, Text, TextInput, ScrollView, TouchableOpacity, Keyboard } from 'react-native'
import { styles, theme } from '../styles'
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
      {flowControl.showSelectCustomer ? (

        <View className='mx-5 mt-5'>
          {/* search */}
          {flowControl.showSelectLabel && (
            <View className='mb-3'>
              <Text className='text-gray-700 text-xl font-bold'>Cliente</Text>
              <Text className='text-gray-500 text-base'>{myUser?.customer?.nombre}</Text>
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
          {flowControl.showSelectResults ? (
            <ScrollView className='bg-white mt-2 max-h-[80%] rounded-md p-3' 
              style={styles.shadow}
              showsVerticalScrollIndicator={false}
              onScroll={handleScroll}
              keyboardShouldPersistTaps="handled"
            >
              {/* loadingSearchedItems */}
              {loaders.loadingSearchedItems ? (
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
                        <CustomersSearch key={customer.cliente} customer={customer} />
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