import { useEffect } from "react"
import { View, Text, FlatList, BackHandler, Image } from "react-native"
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
import { utilities } from "../utils/styles"

import { globalStyles } from "../styles"
import IconProfile from "../components/icons/IconProfile"
import IconHome from "../components/icons/IconHome"

const Home = () => {
  // theme & styles
  const { themeColors: { primary, backgrund, charge, list, turquoise, darkTurquoise, green, blue, icon, typography, processBtn } } = useLogin()
  const { } = utilities

  const { products, loaders, flowControl } = useInv()
  const { myUser } = useLogin()

  // back HANDLER
  useEffect(() => {
    const backAction = () => {
      BackHandler.exitApp()
      return true
    }

    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction)
  }, [])

  return (
    <>
      <View className="flex-1" style={{ backgroundColor: backgrund }}>

        {/* content */}
        <View className="flex-1 px-6 pt-6">

          {/* logos */}
          <View className="flex-row justify-between">
            <Image className="w-48 h-16" resizeMode="contain"
              source={flowControl?.showLogoCertra ? require("../assets/logo-certra.png") : require("../assets/logo-drocerca.png")}
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

                  loaders.loadingProducts || products.length === 0 ? (
                    <View className="">
                      <View className="flex-1 justify-center items-center">
                        <FlatList
                          ListHeaderComponent={() => (
                            <View className={`flex-row justify-between mb-3 mx-3 px-1 ${flowControl.showSelectCustomer ? "mt-0" : "mt-3"}`}>
                              <Text className="text-gray-700 text-xl font-bold w-full text-center">Productos</Text>
                            </View>
                          )}
                          data={items}
                          numColumns={2}
                          contentContainerStyle={{
                            paddingBottom: 10,
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
                    <View className="">
                      <View className="flex-1 justify-center items-center">
                        <FlatList
                          ListHeaderComponent={() => (
                            <View className={`flex-row justify-between mb-3 mx-3 px-1 ${flowControl.showSelectCustomer ? "mt-0" : "mt-3"}`}>
                              <Text className="text-gray-700 text-xl font-bold w-full text-center">Productos</Text>
                            </View>
                          )}
                          data={products}
                          numColumns={2}
                          contentContainerStyle={{
                            paddingBottom: 10,
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
        <View className="flex flex-row items-center gap-4 pl-5">
          <View><IconHome /></View>
          {flowControl?.showProducts && (<View className="h-8 border-l-[0.8px] border-l-white" />)}
          {flowControl?.showProducts && (<View><IconProfile /></View>)}
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