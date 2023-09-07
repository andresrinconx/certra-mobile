import { useEffect, useState } from "react"
import { View, Text, TouchableOpacity, Image, ScrollView, FlatList } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { theme, styles } from "../styles"
import { MinusSmallIcon, PlusSmallIcon } from "react-native-heroicons/outline"
import ProductoInterface from "../interfaces/ProductoInterface"
import IconCart from "../components/icons/IconCart"
import useInv from "../hooks/useInv"
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen"
import { StatusBar } from "expo-status-bar"
import useLogin from "../hooks/useLogin"
import { disponibility } from "../utils/constants"

const Product = () => {
  // theme
  const { themeColors: { backgrund, typography, turquoise, lightList, darkTurquoise, green } } = useLogin()

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

  const { productsCart, increase, decrease, addToCart } = useInv()
  const navigation = useNavigation()
  const route = useRoute()

  useEffect(() => {
    setProduct(route.params as ProductoInterface)
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

  return (
    <>
      
      <View className="flex-1 px-3 pt-6" style={{ backgroundColor: backgrund }}>
        <StatusBar style="dark" />

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

          <View className={`mr-4 p-3 rounded-2xl bg-[${turquoise}]`}>
            <IconCart />
          </View>
        </View>

        {/* content */}
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
            <Text style={{ fontSize: hp(2), color: typography }} className="font-bold">
              Precio:
            </Text>
            <Text className="font-bold" style={{ fontSize: hp(3), color: darkTurquoise }}>
              Bs. {product?.precio1}
            </Text>
          </View>

          {/* disponibility */}
          <View className="mb-2">
            <Text style={{ fontSize: hp(2.5), color: typography }} className="pb-2 font-bold">
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
                      <Text style={{ fontSize: hp(2.5), color: darkTurquoise }} className="w-24 text-center font-semibold">
                        {name}
                      </Text>

                      <Text style={{ fontSize: hp(2.6), color: typography }} className="text-center font-semibold">
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

      {/* add */}
      <View className="absolute bottom-0 w-full" style={{ backgroundColor: backgrund }}>
        <View className={`flex flex-row items-center ${product.agregado ? "justify-between" : "justify-center"} gap-5 py-4`}>

          {/* increase & decrease */}
          {localData.agregado && (
            <View className="w-[45%] pl-3">
              <View className="flex flex-row justify-between rounded-xl" style={styles.shadow}>
                <View className="flex justify-center rounded-l-lg w-10" style={{ backgroundColor: localData.cantidad === 1 ? "#eaeaea" : "#d8d8d8" }}>
                  <TouchableOpacity onPress={() => decrease(product.id)}
                    className="p-2 flex justify-center items-center py-2.5"
                    disabled={localData.cantidad === 1 ? true : false}
                  >
                    <MinusSmallIcon size={20} color="black" />
                  </TouchableOpacity>
                </View>

                <View className="flex flex-row justify-center items-center">
                  <Text className="text-center text-xl text-black w-[80px]">{localData.cantidad}</Text>
                </View>

                <View className="flex justify-center rounded-r-lg w-10" style={{ backgroundColor: "#d8d8d8" }}>
                  <TouchableOpacity onPress={() => increase(product.id)}
                    className="p-2 flex justify-center items-center py-2.5"
                  >
                    <PlusSmallIcon size={20} color="black" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          {/* btn confirm */}
          <View className={`${!localData.agregado ? "w-[90%] flex flex-row justify-center" : "w-[45%] pr-3"}`}>
            <TouchableOpacity onPress={() => addToCart(product)} className="rounded-xl py-2 w-full"
              style={{ backgroundColor: localData.agregado ? green : turquoise }}
              disabled={localData.agregado ? true : false}
            >
              <Text className="text-center font-bold text-white"
                style={{ fontSize: wp(5.5) }}
              >
                {localData.agregado ? "Agregado" : "Agregar"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  )
}

export default Product