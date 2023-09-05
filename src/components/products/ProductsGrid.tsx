import {useState, useEffect} from "react"
import { View, Text, Image, TouchableOpacity, Pressable, FlatList } from "react-native"
import useInv from "../../hooks/useInv"
import {useNavigation} from "@react-navigation/native"
import { MinusSmallIcon, PlusSmallIcon, CheckIcon } from "react-native-heroicons/outline"
import ProductoInterface from "../../interfaces/ProductoInterface"
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen"
import useLogin from "../../hooks/useLogin"
import { disponibility } from "../../utils/constants"

const ProductsGrid = ({product}: {product: ProductoInterface}) => {
  // theme
  const { themeColors: { typography, lightList, darkTurquoise, green, turquoise } } = useLogin()

  const [localData, setLocalData] = useState({
    agregado: false,
    cantidad: 1
  })

  const {increase, decrease, addToCart, productsCart, removeElement} = useInv()
  const {descrip, precio1, id, image_url, merida, centro, oriente} = product
  const navigation = useNavigation()

  // refresh data when cart change
  useEffect(() => {
    const productInCart = productsCart.find(productInCart => productInCart.id === id)
    if(productInCart !== undefined) { // product in cart
      setLocalData({...localData, agregado: productInCart.agregado, cantidad: productInCart.cantidad})
    } else {
      setLocalData({...localData, agregado: false, cantidad: 1})
    }
  }, [productsCart])

  // className="h-56 mb-2 mr-2 rounded-2xl" style={{ backgroundColor: charge, width: wp("42%") }}

  return (
    <View className="h-[98%] mb-3 mr-2 p-2 rounded-2xl" style={{ backgroundColor: lightList, width: wp("45.5%") }}>
      {/* img */}
      <Pressable onPress={() => navigation.navigate("Product", {...product})} className="mb-2 justify-center items-center">
        {image_url === null ? (
          <Image style={{ width: wp(32), height: wp(32) }} resizeMode="contain"
            source={require("../../assets/no-image.png")} 
          />
        ) : (
          <Image style={{ width: wp(32), height: wp(32) }} resizeMode="contain" 
            source={{uri: `${image_url}`}}
          />
        )}
      </Pressable>
      
      {/* texts & btn */}
      <View>

        {/* descrip */}
        <Pressable onPress={() => navigation.navigate("Product", {...product})}>
          <Text style={{ fontSize: wp(4), color: typography }} className="font-bold"
            numberOfLines={2}
          >
            {descrip}
          </Text>
        </Pressable>
        
        {/* price */}
        <View className="my-2">
          <Text style={{ fontSize: hp(1.5), color: typography }}>
            Precio:
          </Text>

          <Text style={{ fontSize: hp(2.2), color: darkTurquoise }} className="font-bold">
            Bs. {precio1}
          </Text>
        </View>

        {/* disponibility */}
        <View className="mb-2">
          <Text style={{ fontSize: hp(1.6), color: typography }} className="pb-0.5">
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
              renderItem={({item: {id, name}}) => {
                return (
                  <View key={id} className="flex flex-col items-center">
                    <Text style={{ fontSize: hp(1.6), color: darkTurquoise }} className="w-10 text-center">
                      {name}
                    </Text>

                    <Text style={{ fontSize: hp(1.6), color: typography }} className="text-center">
                      {
                        name === 'Mérida' ? parseInt(String(merida)) : 
                        name === 'Centro' ? parseInt(String(centro)) :
                        name === 'Oriente' ? parseInt(String(oriente)):null
                      }
                    </Text>
                  </View>
                )
              }} 
            />
          </View>
        </View>

        {/* ammount and added */}
        <View className="flex flex-row">
          {!localData.agregado && (
            <TouchableOpacity onPress={() => addToCart(product)} className="flex flex-row items-center justify-center rounded-md h-7 w-full"
              style={{ backgroundColor: turquoise }}
            >
              <Text className="w-full text-center font-bold text-white">Agregar</Text>
            </TouchableOpacity>
          )}

          {localData.agregado && (
            <View className="flex flex-row items-center justify-between w-full">

              {/* increase & decrease */}
              <View className="flex-1 flex-row items-center justify-around">
                <View className="rounded-md" style={{ borderColor: turquoise, borderWidth: .5 }}>
                  <TouchableOpacity onPress={() => decrease(id)} className="p-0.5">
                    <MinusSmallIcon size={17} color={darkTurquoise} strokeWidth={3} />
                  </TouchableOpacity>
                </View>

                <View style={{ width: wp(12) }}>
                  <Text className="text-center text-lg font-bold" style={{ color: darkTurquoise }}>
                    {localData.cantidad}
                  </Text>
                </View>

                <View className="rounded-md" style={{ borderColor: turquoise, borderWidth: .5 }}>
                  <TouchableOpacity onPress={() => increase(id)} className="p-0.5">
                    <PlusSmallIcon size={17} color={darkTurquoise} strokeWidth={3} />
                  </TouchableOpacity>
                </View>
              </View>

              {/* added */}
              <View>
                <TouchableOpacity onPress={() => removeElement(id)} className="flex flex-row items-center justify-center rounded-md w-7 h-7"
                  style={{ backgroundColor: green }}
                >
                  <CheckIcon size={20} color="white" strokeWidth={3} />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>
    </View>
  )
}

export default ProductsGrid