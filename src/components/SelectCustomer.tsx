import { useEffect, useRef } from "react"
import { View, Text, TextInput, Keyboard, FlatList, Image } from "react-native"
import useInv from "../hooks/useInv"
import CustomersSearch from "./CustomersSearch"
import useLogin from "../hooks/useLogin"
import { widthPercentageToDP as wp } from "react-native-responsive-screen"
import { formatText } from "../utils/helpers"
import LabelCustomer from "./LabelCustomer"
import UserFromScliInterface from "../interfaces/UserFromScliInterface"

const SelectCustomer = () => {
  // theme & styles
  const { themeColors: { list, typography, primary } } = useLogin()

  const { searchedCustomers, setSearchedCustomers, flowControl, setFlowControl } = useInv()
  const { myUser, usersFromScli } = useLogin()
  const textInputRef = useRef<TextInput | null>(null)

  // SCREEN
  useEffect(() => {
    const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", removeInputFocus)
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
    if (valueSearchCustomers.length > 2) {
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

      // fetching...
      const data = usersFromScli?.filter(
        (user: UserFromScliInterface) => 
          user.nombre.toLowerCase()
            .includes(formatText(valueSearchCustomers.toLowerCase())) ||
          user.cliente.toLowerCase()
          .includes(valueSearchCustomers.toLowerCase())
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

        <View className="mt-3">

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
            <View className="flex flex-row items-center">
              <Image style={{ width: wp(10), height: wp(10) }} resizeMode="cover"
                source={require("../assets/drugstore-search.png")}
              />

              <View className="rounded-lg w-5/6 ml-3" style={{ backgroundColor: list }}>
                <TextInput className="w-full pl-3" style={{ color: typography, fontSize: wp(4), fontWeight: '200' }}
                  placeholder="Buscar un cliente"
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
                  keyboardShouldPersistTaps="handled"
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
                <View className="flex flex-row items-center justify-center py-8">
                  <Text className="text-xl w-full text-center" style={{ color: typography }}>No hay resultados</Text>
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