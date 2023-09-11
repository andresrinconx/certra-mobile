import { useState, useEffect } from "react"
import { View, Text, TouchableOpacity, FlatList, Pressable } from "react-native"
import ProductoInterface from "../../interfaces/ProductoInterface"
import useInv from "../../hooks/useInv"
import { useNavigation } from "@react-navigation/native"
import { MinusSmallIcon, PlusSmallIcon, CheckIcon } from "react-native-heroicons/outline"
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen"
import useLogin from "../../hooks/useLogin"
import Loader from "../loaders/Loader"
import { disponibility } from "../../utils/constants"

const ProductsSearch = ({ product }: { product: ProductoInterface }) => {
  // theme
  const { themeColors: { typography, lightList, darkTurquoise, green, turquoise } } = useLogin()
  
  const [localData, setLocalData] = useState({
    agregado: false,
    cantidad: 1
  })
  const [loadingAddToCart, setLoadingAddToCart] = useState(false)
  const [loadingDecrease, setLoadingDecrease] = useState(false)
  const [loadingIncrease, setLoadingIncrease] = useState(false)
  const [loadingRemoveElement, setLoadingRemoveElement] = useState(false)

  const { descrip, precio1, id, merida, centro, oriente } = product
  const { productsCart, increase, decrease, addToCart, removeElement } = useInv()
  const navigation = useNavigation()

  // refresh data when cart change
  useEffect(() => {
    const productInCart = productsCart.find(productInCart => productInCart.id === id)
    if (productInCart !== undefined) { // product in cart
      setLocalData({ ...localData, agregado: productInCart.agregado, cantidad: productInCart.cantidad })
    } else {
      setLocalData({ ...localData, agregado: false, cantidad: 1 })
    }
  }, [productsCart])

  // actions
  const handleAddToCart = () => {
    setLoadingAddToCart(true)
    addToCart(product) // function
    setTimeout(() => {
      setLoadingAddToCart(false)
    }, 1000);
  }
  const handleDecrease = () => {
    setLoadingDecrease(true)
    decrease(id) // function
    setTimeout(() => {
      setLoadingDecrease(false)
    }, 1000);
  }
  const handleIncrease = () => {
    setLoadingIncrease(true)
    increase(id) // function
    setTimeout(() => {
      setLoadingIncrease(false)
    }, 1000);
  }
  const handleRemoveElement = () => {
    setLoadingRemoveElement(true)
    removeElement(id) // function
    setTimeout(() => {
      setLoadingRemoveElement(false)
    }, 1000);
  }

  return (
    <View className="flex flex-col mb-3 p-2 rounded-2xl" style={{ backgroundColor: lightList }}>

      {/* descrip */}
      <Pressable onPress={() => navigation.navigate("Product", { ...product })}>
        <Text style={{ fontSize: wp(4), color: typography }} className="font-bold" numberOfLines={1}>
          {descrip}
        </Text>
      </Pressable>

      {/* info */}
      <View className="flex flex-row items-center">

        {/* left info */}
        <View className="w-1/2 pr-2">

          {/* disponibility */}
          <View className="mb-2">
            <Text style={{ fontSize: hp(1.6), color: typography }} className="pb-0.5 font-bold">
              Disponibilidad:
            </Text>

            {/* sedes */}
            <View className="px-3">
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
                    <View key={id} className="flex flex-col items-center">
                      <Text style={{ fontSize: hp(1.5), color: darkTurquoise }} className="w-10 text-center font-bold">
                        {name}
                      </Text>

                      <Text style={{ fontSize: hp(1.6), color: typography }} className="text-center font-bold">
                        {
                          name === 'Mérida' ? parseInt(String(merida)) :
                            name === 'Centro' ? parseInt(String(centro)) :
                              name === 'Oriente' ? parseInt(String(oriente)) : null
                        }
                      </Text>
                    </View>
                  )
                }}
              />
            </View>
          </View>
        </View>

        {/* right info */}
        <View className="w-1/2 pl-2">

          {/* price */}
          <View className="my-2">
            <Text style={{ fontSize: hp(1.5), color: typography }} className="font-bold">
              Precio:
            </Text>

            <Text style={{ fontSize: hp(2.2), color: darkTurquoise }} className="font-bold">
              Bs. {precio1}
            </Text>
          </View>

          {/* ammount and added */}
          <View className="flex flex-row px-3 pt-2">
            {!localData.agregado && !loadingAddToCart ? (
              <TouchableOpacity onPress={handleAddToCart} className="flex flex-row items-center justify-center rounded-md h-7 w-full"
                style={{ backgroundColor: turquoise }}
              >
                <Text className="w-full text-center font-bold text-white">Agregar</Text>
              </TouchableOpacity>
            ):null}

            {!localData.agregado && loadingAddToCart ? (
              <View className="flex flex-row justify-center items-center rounded-md h-7 w-full" style={{ backgroundColor: turquoise }}>
                <Loader size={24} color="white" />
              </View>
            ):null}

            {localData.agregado && !loadingAddToCart ? (
              <View className="flex flex-row items-center justify-between w-full">

                {/* increase & decrease */}
                <View className="flex-1 flex-row items-center justify-around">
                  <View className="rounded-md" style={{ borderColor: turquoise, borderWidth: .5 }}>
                    <TouchableOpacity onPress={handleDecrease} className="p-0.5">
                      <MinusSmallIcon size={wp(4.5)} color={darkTurquoise} strokeWidth={3} />
                    </TouchableOpacity>
                  </View>

                  {/* loadingDecrease || loadingIncrease */}
                  {loadingDecrease || loadingIncrease ? (
                    <View className="flex flex-row justify-center items-center" style={{ width: wp(12) }}>
                      <Loader size={wp(4.5)} color={darkTurquoise} />
                    </View>
                  ) : (
                    <View style={{ width: wp(12) }}>
                      <Text className="text-center font-bold" style={{ color: darkTurquoise, fontSize: wp(4.5) }}>
                        {localData.cantidad}
                      </Text>
                    </View>
                  )}

                  <View className="rounded-md" style={{ borderColor: turquoise, borderWidth: .5 }}>
                    <TouchableOpacity onPress={handleIncrease} className="p-0.5">
                      <PlusSmallIcon size={17} color={darkTurquoise} strokeWidth={3} />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* added */}
                {localData.agregado && !loadingRemoveElement ? (
                  <View className="pl-5">
                    <TouchableOpacity onPress={handleRemoveElement} className="flex flex-row items-center justify-center rounded-md w-7 h-7"
                      style={{ backgroundColor: green }}
                    >
                      <CheckIcon size={20} color="white" strokeWidth={3} />
                    </TouchableOpacity>
                  </View>
                ):null}

                {localData.agregado && loadingRemoveElement ? (
                  <View className="flex flex-row justify-center items-center rounded-md h-7 w-7 ml-5" style={{ backgroundColor: green }}>
                    <Loader size={wp(4.5)} color="white" />
                  </View>
                ):null}
              </View>
              
            ):null}
          </View>
        </View>

      </View>

    </View>
  )
}

export default ProductsSearch