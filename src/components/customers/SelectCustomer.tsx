import { useEffect, useRef, useCallback } from "react"
import { View, Text, TextInput, TouchableOpacity, Keyboard, FlatList, Image } from "react-native"
import { XMarkIcon } from "react-native-heroicons/mini"
import useInv from "../../hooks/useInv"
import { fetchSearchedItems } from "../../utils/api"
import { items } from "../../utils/constants"
import LoaderCustomersSearch from "../loaders/LoaderCustomersSearch"
import CustomersSearch from "./CustomersSearch"
import useLogin from "../../hooks/useLogin"
import { widthPercentageToDP as wp } from "react-native-responsive-screen"
import { debounce } from "lodash"
import { formatText } from "../../utils/helpers"

const SelectCustomer = () => {
  // theme & styles
  const { themeColors: { list, typography, primary } } = useLogin()

  const { searchedCustomers, setSearchedCustomers, loaders, setLoaders, flowControl, setFlowControl, valueSearchCustomers, setValueSearchCustomers, getProducts } = useInv()
  const { myUser } = useLogin()
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
  useEffect(() => {
    if (valueSearchCustomers === "") {
      setSearchedCustomers([])
    }
  }, [valueSearchCustomers])

  const handleSearch = async (valueSearchCustomers: string) => {
    setValueSearchCustomers(valueSearchCustomers)
    if (valueSearchCustomers?.length > 2) {

      setFlowControl({ 
        ...flowControl, 
        showSelectResults: true, 
        showProducts: false, 
        showSelectLabel: false, 
        showSelectCustomer: true,
        showSelectSearch: true,
        showLogoCertra: true 
      })
      setLoaders({ ...loaders, loadingSearchedItems: true })

      // fetching...
      const data = await fetchSearchedItems({ searchTerm: formatText(valueSearchCustomers), table: "searchCli" }) // searchCli = scli
      setSearchedCustomers(data?.length !== 0 ? data : [])
      setLoaders({ ...loaders, loadingSearchedItems: false })
    } else if (valueSearchCustomers.length === 2) {
      if (myUser.customer === undefined) {
        // no customer selected
        getProducts()
        setFlowControl({ 
          ...flowControl, 
          showSelectResults: false, 
          showProducts: false, 
          showSelectLabel: false, 
          showSelectCustomer: true,
          showSelectSearch: true,
          showLogoCertra: true 
        })
        setSearchedCustomers([])
      } else { 
        // customer selected
        getProducts()
        setFlowControl({ 
          ...flowControl, 
          showSelectResults: false, 
          showProducts: true, 
          showSelectLabel: true, 
          showSelectCustomer: true,
          showSelectSearch: true,
          showLogoCertra: true 
        })
        setSearchedCustomers([])
      }
    } else if (valueSearchCustomers.length < 2) {
      if (myUser.customer === undefined) {
        // no customer selected
        getProducts()
        setFlowControl({ 
          ...flowControl, 
          showSelectResults: false, 
          showProducts: false, 
          showSelectLabel: false, 
          showSelectCustomer: true,
          showSelectSearch: true,
          showLogoCertra: true 
        })
        setSearchedCustomers([])
      } else { 
        // customer selected
        getProducts()
        setFlowControl({ 
          ...flowControl, 
          showSelectResults: false, 
          showProducts: true, 
          showSelectLabel: true, 
          showSelectCustomer: true,
          showSelectSearch: true,
          showLogoCertra: true 
        })
        setSearchedCustomers([])
      }
    }
  }

  const handleTextDebounce = useCallback(debounce(handleSearch, 600), [])

  return (
    <>
      {flowControl?.showSelectCustomer ? (

        <View className="mt-3">

          {/* label */}
          {flowControl?.showSelectLabel && !flowControl?.showSelectResults ? (
            <View className="mb-4">
              <Text className="font-extrabold" style={{ fontSize: wp(4.5), color: typography }}>Cliente</Text>
              <Text className="font-normal" style={{ fontSize: wp(4), color: typography }}>{myUser?.customer?.nombre}</Text>
            </View>
          ) : null}

          {/* input */}
          {flowControl?.showSelectSearch ? (
            <View className="flex flex-row items-center">
              <Image style={{ width: wp(10), height: wp(10) }} resizeMode="cover"
                source={require("../../assets/drugstore-search.png")}
              />

              <View className="rounded-lg w-5/6 ml-3" style={{ backgroundColor: list }}>
                <TextInput className="w-full pl-3" style={{ color: typography }}
                  placeholder="Buscar un cliente"
                  placeholderTextColor={typography}
                  onChangeText={handleTextDebounce}
                  selectionColor={primary}
                />
              </View>
            </View>
          ) : null}

          {/* results */}
          {flowControl?.showSelectResults ? (
            <View>
              {loaders.loadingSearchedItems ? (
                <FlatList
                  data={items}
                  numColumns={1}
                  onScroll={handleScroll}
                  contentContainerStyle={{
                    paddingBottom: 5,
                    marginTop: 15
                  }}
                  showsVerticalScrollIndicator={false}
                  renderItem={({ item }) => {
                    return (
                      <LoaderCustomersSearch key={item.id} />
                    )
                  }}
                />
              ) : (
                searchedCustomers?.length === 0 ? (
                  <View className="flex flex-row items-center justify-center py-8">
                    <Text className="text-xl w-full text-center" style={{ color: typography }}>No hay resultados</Text>
                  </View>
                ) : (
                  <FlatList
                    data={searchedCustomers}
                    numColumns={1}
                    onScroll={handleScroll}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{
                      paddingBottom: 5,
                      marginTop: 15
                    }}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => {
                      return (
                        <CustomersSearch key={item.rifci} customer={item} />
                      )
                    }}
                  />
                )
              )}
            </View>
          ) : null}
        </View>
      ) : null}
    </>
  )
}

export default SelectCustomer