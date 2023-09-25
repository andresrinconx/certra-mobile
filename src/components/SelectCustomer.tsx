import { useEffect, useRef, useState } from 'react'
import { View, Text, TextInput, Keyboard, FlatList, Image } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import UserFromScliInterface from '../interfaces/UserFromScliInterface'
import { formatText } from '../utils/helpers'
import useInv from '../hooks/useInv'
import useLogin from '../hooks/useLogin'
import CustomersSearch from './CustomersSearch'
import LabelCustomer from './LabelCustomer'

const SelectCustomer = () => {
  const [searchedCustomers, setSearchedCustomers] = useState<UserFromScliInterface[]>([])
  
  const { themeColors: { list, typography, primary }, myUser, usersFromScli } = useLogin()
  const { flowControl, setFlowControl } = useInv()
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
  const handleSearch = async (valueSearchCustomers: string) => {
    if (valueSearchCustomers?.length > 2) {
      // search

      setFlowControl({ 
        ...flowControl, 
        showSelectResults: true, 
        showProducts: false, 
        showSelectLabel: false, 
        showSelectCustomer: true,
        showSelectSearch: true,
        showLogoCertra: true,
        selected: false
      })

      // filter data
      const data = usersFromScli?.filter(
        (user: UserFromScliInterface) => 
          user.nombre.toLowerCase().includes(formatText(valueSearchCustomers.toLowerCase())) || // search by name
          user.cliente.toLowerCase().includes(valueSearchCustomers.toLowerCase()) // search by number
      )
      setSearchedCustomers(data)
    } else {
      // no search
      
      setSearchedCustomers([])
      if ('customer' in myUser) {

        // customer selected
        setFlowControl({ 
          ...flowControl, 
          showSelectResults: false, 
          showProducts: true, 
          showSelectLabel: true, 
          showSelectCustomer: true,
          showSelectSearch: true,
          showLogoCertra: true,
          selected: true,
        })
      } else { 

        // no customer selected
        setFlowControl({ 
          ...flowControl, 
          showSelectResults: false, 
          showProducts: false, 
          showSelectLabel: false, 
          showSelectCustomer: true,
          showSelectSearch: true,
          showLogoCertra: true,
          selected: false,
        })
      }
    }
  }

  return (
    <>
      {flowControl?.showSelectCustomer ? (

        <View className='mt-1'>

          {/* label */}
          {flowControl?.showSelectLabel && !flowControl?.showSelectResults && flowControl?.selected ? (
            <View className='mb-4'>
              <LabelCustomer
                name={myUser?.customer?.nombre}
              />
            </View>
          ) : null}

          {/* input */}
          {flowControl?.showSelectSearch ? (
            <View className='flex flex-row items-center'>
              <Image style={{ width: wp(10), height: wp(10) }} resizeMode='cover'
                source={require('../assets/drugstore-search.png')}
              />

              <View className='rounded-lg w-5/6 ml-3 py-0' style={{ backgroundColor: list }}>
                <TextInput className='w-full pl-3 py-0' style={{ fontSize: wp(4), color: typography }}
                  placeholder='Buscar un cliente'
                  placeholderTextColor={typography}
                  onChangeText={handleSearch}
                  selectionColor={primary}
                />
              </View>
            </View>
          ) : null}

          {/* results */}
          {flowControl?.showSelectResults ? (
            <View>
              {searchedCustomers?.length !== 0 ? (
                <FlatList
                  data={searchedCustomers}
                  numColumns={1}
                  onScroll={handleScroll}
                  keyboardShouldPersistTaps='handled'
                  contentContainerStyle={{
                    paddingBottom: 100,
                    marginTop: 15
                  }}
                  showsVerticalScrollIndicator={false}
                  renderItem={({ item }) => {
                    return (
                      <CustomersSearch key={item.rifci} customer={item} />
                    )
                  }}
                />
              ) : (
                <View className='flex flex-row items-center justify-center py-8'>
                  <Text className='text-xl w-full text-center' style={{ color: typography }}>No hay resultados</Text>
                </View>
              )}
            </View>
          ) : null}
        </View>
      ) : null}
    </>
  )
}

export default SelectCustomer