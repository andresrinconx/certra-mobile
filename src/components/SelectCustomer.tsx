import {useState, useEffect} from 'react'
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

const SelectCustomer = () => {
  const [value, setValue] = useState('')
  const {searchedCustomers, setSearchedCustomers, loadingSearchedItems, setLoadingSearchedItems} = useInv()

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
    <View className='mx-5'>
      {/* searching */}
      <View className='w-full flex flex-row items-center justify-between rounded-md mt-5' style={styles.shadow}>
        <View className='flex flex-row items-center'>
          <View className='ml-3'>
            <MagnifyingGlassIcon size={20} color='gray' />
          </View>

          <TextInput className='text-base text-gray-700 ml-1'
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

      {/* results */}
      <ScrollView className='bg-white mt-2 max-h-[83%] rounded-md p-3' 
        style={styles.shadow}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
      >
        {searchedCustomers?.length !== 0 ? (
          loadingSearchedItems ? (
            <View className='mb-5'> 
              {items.map((item) => {
                return (
                  <LoaderCustomersSearch key={item.id} />
                )
              })}
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
        ) : (
          <View className='flex flex-row items-center justify-center py-6'>
            <Text className='text-2xl text-gray-700'>No hay resultados</Text>
          </View>
        )}
      </ScrollView>
    </View>
  )
}

export default SelectCustomer