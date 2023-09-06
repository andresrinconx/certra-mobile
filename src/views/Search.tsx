import { useCallback, useEffect, useRef, useState } from "react"
import { View, TouchableOpacity, TextInput, Keyboard, FlatList, Image } from "react-native"
import { XMarkIcon } from "react-native-heroicons/mini"
import ProductsSearch from "../components/products/ProductsSearch"
import { styles, theme } from "../styles"
import { items } from "../utils/constants"
import LoaderProductsSearch from "../components/loaders/LoaderProductsSearch"
import useInv from "../hooks/useInv"
import { fetchSearchedItems } from "../utils/api"
import { useNavigation } from "@react-navigation/native"
import { StatusBar } from "expo-status-bar"
import { widthPercentageToDP as wp } from "react-native-responsive-screen"
import useLogin from "../hooks/useLogin"
import { debounce } from "lodash"
import { formatText } from "../utils/helpers"

const Search = () => {
  // theme
  const { themeColors: { backgrund, typography, primary, list } } = useLogin()

  const [value, setValue] = useState("")

  const { searchedProducts, loaders, setLoaders, setSearchedProducts } = useInv()
  const navigation = useNavigation()
  const textInputRef = useRef<TextInput | null>(null)

  // SCREEN
  // show keyboard
  useEffect(() => {
    setTimeout(() => {
      if (textInputRef.current) {
        textInputRef.current.focus()
      }
    }, 300)
  }, [])
  // hide keyboard
  const handleScroll = () => {
    // Cerrar el teclado
    Keyboard.dismiss()
  }

  // SEARCH
  useEffect(() => {
    if (value === "") {
      setSearchedProducts([])
    }
  }, [value])

  const handleSearch = async (value: string) => {
    setValue(value)
    if (value.length > 2) {
      setLoaders({ ...loaders, loadingSearchedItems: true })
      // fetching...
      const data = await fetchSearchedItems({ searchTerm: formatText(value), table: "search" }) // search = sinv
      setSearchedProducts(data)
      setLoaders({ ...loaders, loadingSearchedItems: false })
    } else {
      setSearchedProducts([])
    }
  }

  const handleTextDebounce = useCallback(debounce(handleSearch, 600), [])

  return (
    <View className="flex-1 pt-10" style={{ backgroundColor: backgrund }}>
      <StatusBar style="dark" />

      {/* arrow & input */}
      <View className="flex flex-row items-center px-3">
        <TouchableOpacity onPress={() => {navigation.goBack()}}>
          <Image style={{ width: wp(8), height: wp(8) }} resizeMode="cover"
            source={require("../assets/back.png")}
          />
        </TouchableOpacity>

        <View className="rounded-lg w-5/6 ml-3" style={{ backgroundColor: list }}>
          <TextInput className="mx-4 text-base" style={{ color: typography }}
            placeholder="Buscar Inventario"
            placeholderTextColor={typography}
            ref={textInputRef}
            onChangeText={handleTextDebounce}
            selectionColor={primary}
          />
        </View>
      </View>

      {/* results */}
      <View className="h-full mx-3 mb-16">
        {loaders.loadingSearchedItems ? (
          <FlatList
            data={items}
            numColumns={1}
            onScroll={handleScroll}
            contentContainerStyle={{
              paddingBottom: 20,
              marginTop: 15
            }}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              return (
                <LoaderProductsSearch key={item.id} />
              )
            }}
          />
        ) : (
          searchedProducts?.length > 0 && (
            <FlatList
              data={searchedProducts}
              numColumns={1}
              onScroll={handleScroll}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{
                paddingBottom: 20,
                marginTop: 15
              }}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => {
                return (
                  <ProductsSearch key={item.id} product={item} />
                )
              }}
            />
          )
        )}
      </View>
    </View>
  )
}

export default Search