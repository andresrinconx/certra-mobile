import { useState } from 'react'
import { View, Text, StatusBar, TouchableOpacity, Image, TextInput, FlatList, Keyboard, SafeAreaView } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { themeColors } from '../../tailwind.config'
import { UserFromScliInterface } from '../utils/interfaces'
import { formatText } from '../utils/helpers'
import { useLogin, useNavigation } from '../hooks'
import { CustomerSearch } from '../components'

const Customer = () => {
  const [searchedCustomers, setSearchedCustomers] = useState<UserFromScliInterface[]>([])

  const { background, typography, darkTurquoise } = themeColors
  const { allCustomers } = useLogin()
  const navigation = useNavigation()

  // SCREEN
  const handleScroll = () => {
    // Cerrar el teclado
    Keyboard.dismiss()
  }

  // Search
  const handleSearch = async (valueSearchCustomers: string) => {
    if (valueSearchCustomers?.length > 2) {
      // filter data
      const data = allCustomers?.filter(
        (user: UserFromScliInterface) => 
          user.nombre.toLowerCase().includes(formatText(valueSearchCustomers.toLowerCase())) || // search by name
          user.cliente.toLowerCase().includes(valueSearchCustomers.toLowerCase()) // search by number
      )
      setSearchedCustomers(data)
    } else {
      // no search
      setSearchedCustomers([])
    }
  }

  return (
    <SafeAreaView className='flex-1 px-2.5 pt-10 bg-background'>
      <StatusBar backgroundColor={background} barStyle='dark-content' />

      {/* search */}
      <View className='flex flex-row items-center'>
        <TouchableOpacity onPress={() => {
          navigation.goBack()
        }}>
          <Image style={{ width: wp(8), height: wp(8) }} resizeMode='cover'
            source={require('../assets/back.png')}
          />
        </TouchableOpacity>

        <View className='rounded-lg ml-3 py-0 bg-list' style={{ width: wp(80) }}>
          <TextInput className='w-full pl-3 py-0 text-typography' style={{ fontSize: wp(4) }}
            placeholder='Buscar un cliente'
            placeholderTextColor={typography}
            onChangeText={handleSearch}
            selectionColor={darkTurquoise}
            autoFocus
          />
        </View>
      </View>

      {/* results */}
      {searchedCustomers?.length > 0 && (
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
                  <CustomerSearch key={item.rifci} customer={item} />
                )
              }}
            />
          ) : (
            <View className='flex flex-row items-center justify-center py-8'>
              <Text className='text-xl w-full text-center text-typography'>No hay resultados</Text>
            </View>
          )}
        </View>
      )}
    </SafeAreaView>
  )
}

export default Customer