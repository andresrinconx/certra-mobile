import { useEffect } from "react"
import { View, Text, FlatList, BackHandler, Image, Keyboard } from "react-native"
import IconCart from "../components/icons/IconCart"
import IconLogOut from "../components/icons/IconLogOut"
import IconSearchProducts from "../components/icons/IconSearchProducts"
import LoaderProductsGrid from "../components/loaders/LoaderProductsGrid"
import ProductsGrid from "../components/products/ProductsGrid"
import SelectCustomer from "../components/customers/SelectCustomer"
import Loader from "../components/loaders/Loader"
import useLogin from "../hooks/useLogin"
import useInv from "../hooks/useInv"
import { items } from "../utils/constants"
import { widthPercentageToDP as wp } from "react-native-responsive-screen"
import IconProfile from "../components/icons/IconProfile"
import { StatusBar } from "expo-status-bar"
import IconItinerary from "../components/icons/IconItinerary"

const Home = () => {
  // theme & styles
  const { themeColors: { primary, backgrund, green, typography } } = useLogin()

  const { products, loaders, getProducts, flowControl } = useInv()
  const { myUser: { image_url } } = useLogin()

  // SCREEN
  // back HANDLER
  useEffect(() => {
    const backAction = () => {
      BackHandler.exitApp()
      return true
    }

    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction)
  }, [])
  // hide keyboard
  const handleScroll = () => {
    // Cerrar el teclado
    Keyboard.dismiss()
  }

  // download products if not exist
  useEffect(() => {
    if (products?.length === 0) {
      getProducts()
    }
  }, [])

  return (
    <>
      <View className="flex-1" style={{ backgroundColor: backgrund }}>
        <StatusBar style="dark" />

        {/* content */} 
        <View className="flex-1 px-3 pt-6">

          {/* logos */}
          <View className="flex-row justify-between">
            {flowControl?.showLogoCertra ? (
              <Image style={{ width: wp(32), height: wp(16) }} resizeMode="contain"
                source={require("../assets/logo-certra.png")}
              />
            ) : (
              <Image style={{ width: wp(40), height: wp(20) }} resizeMode="contain"
                source={require("../assets/logo-drocerca.png")}
              />
            )}

            <Image style={{ width: wp(40), height: wp(16) }} resizeMode="contain"
              source={{uri: `${image_url}`}}
            />
          </View>
          
          {/* customers and products */}
          <View className="flex-1">
            {loaders.loadingSlectedCustomer ? (
              <View className="flex-1 flex-row items-center justify-center">
                <Loader />
              </View>
            ) : (
              <>
                <SelectCustomer />
                {flowControl?.showProducts && !flowControl?.showSelectResults ? (

                  loaders.loadingProducts ? (
                    <View className="h-full">
                      <View className="flex-1 justify-center items-center">
                        <FlatList
                          data={items}
                          numColumns={2}
                          contentContainerStyle={{
                            paddingBottom: 135,
                            marginTop: 15
                          }}
                          showsVerticalScrollIndicator={false}
                          overScrollMode="never"
                          renderItem={({ item }) => {
                            return (
                              <LoaderProductsGrid key={item.id} />
                            )
                          }}
                        />
                      </View>
                    </View>
                  ) : (
                    <View className="h-full">
                      <View className="flex-1 justify-center">
                        <FlatList
                          ListHeaderComponent={() => (
                            <View className="mb-2">
                              <Text className="font-bold" style={{ fontSize: wp(4.5), color: typography }}>
                                Productos
                              </Text>
                            </View>
                          )}
                          data={products}
                          onScroll={handleScroll}
                          numColumns={2}
                          contentContainerStyle={{
                            paddingBottom: 200,
                            marginTop: 15
                          }}
                          showsVerticalScrollIndicator={false}
                          overScrollMode="never"
                          renderItem={({ item }) => {
                            return (
                              <ProductsGrid key={item.id} product={item} />
                            )
                          }}
                        />
                      </View>
                    </View>
                  )
                ):null}
              </>
            )}
          </View>
        </View>

      </View>

      {/* footer */}
      <View className="flex flex-row justify-between items-center h-16" style={{ backgroundColor: primary }}>

        {/* main */}
        <View className="flex flex-row items-center gap-3 pl-3">
          <View><IconProfile /></View>
          {flowControl?.showItinerary && flowControl?.showProducts ? (
            <View className="h-8 border-l-[0.8px] border-l-white" />
          ):null}
          {flowControl?.showItinerary && flowControl?.showProducts ? (
            <View><IconItinerary /></View>
          ):null}
        </View>

        {/* other */}
        <View className="flex flex-row items-center h-full">
          {flowControl?.showProducts && (<View><IconSearchProducts /></View>)}
          {flowControl?.showProducts && (<View className="ml-2"><IconCart /></View>)}

          <View className="h-full w-20 flex justify-center items-center ml-5" style={{ backgroundColor: green }}>
            <IconLogOut />
          </View>
        </View>

      </View>
    </>
  )
}

export default Home