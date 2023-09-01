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

import { globalStyles, styles } from "../styles"

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
    <View className="flex-1">
      {/* header */}
      <View className="">
        <Image className="w-52 h-52" resizeMode="cover"
          source={require(`../assets/${flowControl?.showLogoCertra ? 'logo-certra.png' : 'logo-drocerca.png'}`)}
        />

        {flowControl?.showLogoLab && (
          <Image className="w-52 h-52" resizeMode="cover"
            source={require("../assets/logo-lab.png")}
          />
        )}
      </View>
      
      {/* content */}
      <View className="flex-1" style={{ backgroundColor: backgrund }}>
        {loaders.loadingSlectedCustomer ? (
          <View className="flex-1 flex-row items-center justify-center">
            <Loader />
          </View>
        ) : (
          <>
            <SelectCustomer />
            {flowControl?.showProducts && !flowControl?.showSelectResults ? (

              loaders.loadingProducts || products.length === 0 ? (
                <View className={`${globalStyles.container}`}>
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
                <View className={`${globalStyles.container}`}>
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
            ) : null}
          </>
        )}
      </View>

      {/* nav */}
      <View className="flex flex-row justify-between items-center py-3" style={{ backgroundColor: primary }}>
        <Text className="pl-3 font-bold text-2xl text-white">{myUser.from === 'usuario' ? 'Inventario' : myUser.from === 'usuario-clipro' ? 'Inventario-Clipro' : null}</Text>

        {/* icons */}
        <View className="mr-4 flex flex-row gap-3 ml-5">
          {flowControl?.showProducts && (<View><IconSearchProducts /></View>)}
          {flowControl?.showProducts && (<View><IconCart /></View>)}
          {(<View><IconLogOut /></View>)}
        </View>
      </View>

    </View>
    // <>
    //   {/* nav */}
    //   <View className={`flex flex-row justify-between items-center py-3`}
    //     style={{ ...styles.shadowHeader, backgroundColor: primary }}
    //   >
    //     <Text className="pl-3 font-bold text-2xl text-white">Inventario</Text>
    //     {/* icons */}
    //     <View className="mr-4 flex flex-row gap-3 ml-5">
    //       {flowControl?.showProducts && (<View><IconSearchProducts /></View>)}
    //       {flowControl?.showProducts && (<View><IconCart /></View>)}
    //       {(<View><IconLogOut /></View>)}
    //     </View>
    //   </View>

    //   {loaders.loadingSlectedCustomer ? (
    //     <View className="flex-1 flex-row items-center justify-center">
    //       <Loader />
    //     </View>
    //   ) : (
    //     <>
    //       <SelectCustomer />
    //       {flowControl?.showProducts && !flowControl?.showSelectResults ? (

    //         loaders.loadingProducts || products.length === 0 ? (
    //           <View className={`${globalStyles.container}`}>
    //             <View className="flex-1 justify-center items-center">
    //               <FlatList
    //                 ListHeaderComponent={() => (
    //                   <View className={`flex-row justify-between mb-3 mx-3 px-1 ${flowControl.showSelectCustomer ? "mt-0" : "mt-3"}`}>
    //                     <Text className="text-gray-700 text-xl font-bold w-full text-center">Productos</Text>
    //                   </View>
    //                 )}
    //                 data={items}
    //                 numColumns={2}
    //                 contentContainerStyle={{
    //                   paddingBottom: 10,
    //                 }}
    //                 showsVerticalScrollIndicator={false}
    //                 overScrollMode="never"
    //                 renderItem={({ item }) => {
    //                   return (
    //                     <LoaderProductsGrid key={item.id} />
    //                   )
    //                 }}
    //               />
    //             </View>
    //           </View>
    //         ) : (
    //           <View className={`${globalStyles.container}`}>
    //             <View className="flex-1 justify-center items-center">
    //               <FlatList
    //                 ListHeaderComponent={() => (
    //                   <View className={`flex-row justify-between mb-3 mx-3 px-1 ${flowControl.showSelectCustomer ? "mt-0" : "mt-3"}`}>
    //                     <Text className="text-gray-700 text-xl font-bold w-full text-center">Productos</Text>
    //                   </View>
    //                 )}
    //                 data={products}
    //                 numColumns={2}
    //                 contentContainerStyle={{
    //                   paddingBottom: 10,
    //                 }}
    //                 showsVerticalScrollIndicator={false}
    //                 overScrollMode="never"
    //                 renderItem={({ item }) => {
    //                   return (
    //                     <ProductsGrid key={item.id} product={item} />
    //                   )
    //                 }}
    //               />
    //             </View>
    //           </View>
    //         )
    //       ) : null}
    //     </>
    //   )}
    // </>
  )
}

export default Home