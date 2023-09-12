import { useEffect, useState } from "react"
import { View, Text, TouchableOpacity, Image, ScrollView, FlatList } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { theme, styles } from "../styles"
import { CheckIcon, MinusSmallIcon, PlusSmallIcon } from "react-native-heroicons/outline"
import ProductoInterface from "../interfaces/ProductoInterface"
import IconCart from "../components/icons/IconCart"
import useInv from "../hooks/useInv"
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen"
import { StatusBar } from "native-base"
import useLogin from "../hooks/useLogin"
import { disponibility } from "../utils/constants"
import Loader from "../components/loaders/Loader"

const Product = () => {
  // theme
  const { themeColors: { backgrund, typography, turquoise, lightList, darkTurquoise, green, primary } } = useLogin()

  const [product, setProduct] = useState<ProductoInterface>({
    descrip: "",
    precio1: 0,
    codigo: "",
    id: 0,
    image_url: "",
    cantidad: 1,
    agregado: false,
    base1: 1,
    merida: 0,
    centro: 0,
    oriente: 0,
  })
  const [localData, setLocalData] = useState({
    agregado: false,
    cantidad: 1
  })
  const [loadingProduct, setLoadingProduct] = useState(true)

  const [loadingAddToCart, setLoadingAddToCart] = useState(false)
  const [loadingDecrease, setLoadingDecrease] = useState(false)
  const [loadingIncrease, setLoadingIncrease] = useState(false)
  const [loadingRemoveElement, setLoadingRemoveElement] = useState(false)

  const { productsCart, increase, decrease, addToCart, removeElement } = useInv()
  const navigation = useNavigation()
  const route = useRoute()

  useEffect(() => {
    setProduct(route.params as ProductoInterface)

    setTimeout(() => {
      setLoadingProduct(false)
    }, 500);
  }, [route])

  // refresh data when cart change
  useEffect(() => {
    const productInCart = productsCart.find(productInCart => productInCart.id === product.id)
    if (productInCart !== undefined) { // product in cart
      setLocalData({ ...localData, agregado: productInCart.agregado, cantidad: productInCart.cantidad })
    } else {
      setLocalData({ ...localData, agregado: false, cantidad: 1 })
    }
  }, [productsCart, product])

  // actions
  const handleAddToCart = () => {
    setLoadingAddToCart(true)

    addToCart(product) // function
    setTimeout(() => {
      setLoadingAddToCart(false)
    }, 500);
  }
  const handleDecrease = () => {
    setLoadingDecrease(true)
    decrease(product?.id) // function
    setTimeout(() => {
      setLoadingDecrease(false)
    }, 1000);
  }
  const handleIncrease = () => {
    setLoadingIncrease(true)
    increase(product?.id) // function
    setTimeout(() => {
      setLoadingIncrease(false)
    }, 1000);
  }
  const handleRemoveElement = () => {
    setLoadingRemoveElement(true)
    removeElement(product?.id) // function
    setTimeout(() => {
      setLoadingRemoveElement(false)
    }, 1000);
  }

  return (
    <View className="flex-1 px-3 pt-6" style={{ backgroundColor: backgrund }}>
      <StatusBar barStyle="dark-content" />
        
      {/* back and cart */}
      <View className="flex flex-row items-center justify-between gap-2 my-3">
        <TouchableOpacity onPress={() => {navigation.goBack()}}>
          <Image style={{ width: wp(8), height: wp(8) }} resizeMode="cover"
            source={require("../assets/back.png")}
          />
        </TouchableOpacity>
        
        <Text className="max-w-[70%] font-bold" style={{ color: typography, fontSize: wp(4.5) }}
          numberOfLines={1}
        >
          {product?.descrip}
        </Text>

        <View className="mr-4 p-3 rounded-2xl" style={{ backgroundColor: turquoise }}>
          <IconCart />
        </View>
      </View>
      
      <View className="">
        {loadingProduct ? (
          <View className="mt-10">
            <Loader color={`${primary}`} />
          </View>
        ) : (
          <>
            <View>
              <ScrollView className=""
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingBottom: 100,}}
                overScrollMode="never"
              >
                {/* img */}
                <View className="justify-center items-center rounded-3xl"
                  style={{ backgroundColor: lightList, height: hp(30) }}
                >
                  {product?.image_url === "" || product?.image_url === null ? (
                    <Image style={{ width: wp(55), height: wp(55) }} resizeMode="contain"
                      source={require("../assets/no-image.png")}
                    />
                  ) : (
                    <Image style={{ width: wp(55), height: wp(55) }} resizeMode="contain"
                      source={{ uri: `${product?.image_url}` }}
                    />
                  )}
                </View>

                {/* descrip */}
                <View className="pt-3">
                  <Text className="font-bold" style={{ fontSize: wp(5.5), color: typography }}>
                    {product?.descrip}
                  </Text>
                </View>

                {/* price */}
                <View className="mt-3 mb-5">
                  <Text style={{ fontSize: hp(2.5), color: typography }} className="font-medium">
                    Precio:
                  </Text>
                  <Text className="font-bold" style={{ fontSize: hp(3), color: darkTurquoise }}>
                    Bs. {product?.precio1}
                  </Text>
                </View>

                {/* disponibility */}
                <View className="mb-2">
                  <Text style={{ fontSize: hp(2.5), color: typography }} className="pb-2 font-medium">
                    Disponibilidad:
                  </Text>

                  {/* sedes */}
                  <View>
                    <FlatList
                      data={disponibility}
                      horizontal={true}
                      contentContainerStyle={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                      showsVerticalScrollIndicator={false}
                      renderItem={({ item: { id, name } }) => {
                        return (
                          <View key={id} className="flex flex-col items-center"
                            style={{ width: wp(30) }}
                          >
                            <Text style={{ fontSize: hp(2.5), color: darkTurquoise }} className="w-24 text-center font-medium">
                              {name}
                            </Text>

                            <Text style={{ fontSize: hp(2.6), color: typography }} className="text-center font-medium">
                              {
                                name === 'Mérida' ? parseInt(String(product?.merida)) :
                                  name === 'Centro' ? parseInt(String(product?.centro)) :
                                    name === 'Oriente' ? parseInt(String(product?.oriente)) : null
                              }
                            </Text>
                          </View>
                        )
                      }}
                    />
                  </View>
                </View>
              </ScrollView>

            </View>
          </>
        )}

      </View>

      {/* ammount and added */}
      {!loadingProduct && (
        <View className="absolute bottom-0 h-16" style={{ width: wp("80%"), marginLeft: wp(10) }}>
          {!localData.agregado && !loadingAddToCart ? (
            <TouchableOpacity onPress={handleAddToCart} className="flex flex-row items-center justify-center rounded-xl h-12 w-full"
              style={{ backgroundColor: turquoise }}
            >
              <Text className="w-full text-center font-bold text-white" style={{ fontSize: wp(5) }}>Agregar</Text>
            </TouchableOpacity>
          ):null}

          {!localData.agregado && loadingAddToCart ? (
            <View className="flex flex-row justify-center items-center rounded-xl h-12 w-full" style={{ backgroundColor: turquoise }}>
              <Loader size={wp(8)} color="white" />
            </View>
          ):null} 

          {localData.agregado && !loadingAddToCart ? (
            <View className="flex flex-row items-center justify-between" style={{ width: wp("80%") }}>

              {/* increase & decrease */}
              <View className="flex-1 flex-row items-center justify-around">
                <View className="rounded-md" style={{ borderColor: turquoise, borderWidth: .5 }}>
                  <TouchableOpacity onPress={handleDecrease} className="p-2">
                    <MinusSmallIcon size={wp(4.5)} color={darkTurquoise} strokeWidth={3} />
                  </TouchableOpacity>
                </View>

                {/* loadingDecrease || loadingIncrease */}
                {loadingDecrease || loadingIncrease ? (
                  <View className="flex flex-row justify-center items-center" style={{ width: wp(12) }}>
                    <Loader size={wp(8)} color={darkTurquoise} />
                  </View>
                ) : (
                  <View style={{ width: wp(12) }}>
                    <Text className="text-center font-bold" style={{ color: darkTurquoise, fontSize: wp(6) }}>
                      {localData.cantidad}
                    </Text>
                  </View>
                )}

                <View className="rounded-md" style={{ borderColor: turquoise, borderWidth: .5 }}>
                  <TouchableOpacity onPress={handleIncrease} className="p-2">
                    <PlusSmallIcon size={17} color={darkTurquoise} strokeWidth={3} />
                  </TouchableOpacity>
                </View>
              </View>

              {/* added */}
              {localData.agregado && !loadingRemoveElement ? (
                <View className="pl-5">
                  <TouchableOpacity onPress={handleRemoveElement} className="flex flex-row items-center justify-center rounded-md w-10 h-10"
                    style={{ backgroundColor: green }}
                  >
                    <CheckIcon size={wp(8)} color="white" strokeWidth={3} />
                  </TouchableOpacity>
                </View>
              ):null}

              {localData.agregado && loadingRemoveElement ? (
                <View className="flex flex-row justify-center items-center rounded-md h-10 w-10 ml-5" style={{ backgroundColor: green }}>
                  <Loader size={wp(8)} color="white" />
                </View>
              ):null}
            </View>
            
          ):null}
        </View>
      )}
    </View>
  )
}

export default Product