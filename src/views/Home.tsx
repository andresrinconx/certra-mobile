import { useEffect } from "react"
import { View, BackHandler } from "react-native"
import IconCart from "../components/IconCart"
import IconLogOut from "../components/IconLogOut"
import IconSearchProducts from "../components/IconSearchProducts"
import SelectCustomer from "../components/SelectCustomer"
import Loader from "../components/Loader"
import useLogin from "../hooks/useLogin"
import useInv from "../hooks/useInv"
import IconProfile from "../components/IconProfile"
import { StatusBar } from "expo-status-bar"
import IconItinerary from "../components/IconItinerary"
import Logos from "../components/Logos"
import Products from "../components/Products"

const Home = () => {
  // theme
  const { themeColors: { primary, backgrund, green } } = useLogin()
  
  const { products, loaders, getProducts, flowControl } = useInv()
  const { myUser: { image_url } } = useLogin()
  
  // ACTIONS
  // get products
  useEffect(() => {
    if (products?.length === 0) {
      getProducts()
    }
  }, [])

  // SCREEN
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
        <StatusBar style="dark" />

        {/* content */}
        <View className="flex-1 px-3 pt-6">
          <Logos image={image_url} />
          
          {/* customers and products */}
          <View className="flex-1">
            {loaders.loadingSlectedCustomer ? (
              <View className="flex-1 flex-row items-center justify-center">
                <Loader />
              </View>
            ) : (
              <>
                <SelectCustomer />
                <Products />
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