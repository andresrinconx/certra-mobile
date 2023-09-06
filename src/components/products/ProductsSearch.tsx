import { useState, useEffect } from "react"
import { View, Text, TouchableOpacity, Image, Pressable } from "react-native"
import ProductoInterface from "../../interfaces/ProductoInterface"
import useInv from "../../hooks/useInv"
import { useNavigation } from "@react-navigation/native"
import { MinusSmallIcon, PlusSmallIcon } from "react-native-heroicons/outline"
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen"
import useLogin from "../../hooks/useLogin"

const ProductsSearch = ({ product }: { product: ProductoInterface }) => {
  // theme
  const { themeColors: { typography, lightList, darkTurquoise, green, turquoise } } = useLogin()
  
  const [localData, setLocalData] = useState({
    agregado: false,
    cantidad: 1
  })

  const { descrip, precio1, image_url, id } = product
  const { productsCart, increase, decrease, addToCart } = useInv()
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
        <View className="w-1/2">

          {/* price */}
          <Text style={{ color: darkTurquoise, }} className="font-bold text-lg mb-2">
            Bs. {precio1}
          </Text>
        </View>

        {/* right info */}
        <View className="w-1/2">

          {/* price */}
          <View className="my-2">
            <Text style={{ fontSize: hp(1.5), color: typography }}>
              Precio:
            </Text>

            <Text style={{ fontSize: hp(2.2), color: darkTurquoise }} className="font-bold">
              Bs. {precio1}
            </Text>
          </View>

          {/* ammount and added */}
          <View className="">
            {!localData.agregado && (
              <TouchableOpacity onPress={() => addToCart(product)} className="rounded-md w-32"
                style={{ backgroundColor: green }}
              >
                <Text className="color-white text-center font-bold p-1 pb-1.5">Agregar</Text>
              </TouchableOpacity>
            )}

            {localData.agregado && (
              <View className="rounded-md mb-2 w-32" style={{ backgroundColor: green }}>
                <View className="flex flex-row justify-between items-center p-1 px-4">
                  <View>
                    <TouchableOpacity onPress={() => decrease(id)} className="">
                      <MinusSmallIcon size={20} color="white" />
                    </TouchableOpacity>
                  </View>

                  <View>
                    <Text className="text-center text-lg -my-4 text-white font-bold">{localData.cantidad}</Text>
                  </View>

                  <View>
                    <TouchableOpacity onPress={() => increase(id)} className="">
                      <PlusSmallIcon size={20} color="white" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          </View>
        </View>

      </View>

    </View>
  )
}

export default ProductsSearch