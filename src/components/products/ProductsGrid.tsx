import {useState, useEffect} from "react"
import { View, Text, Image, TouchableOpacity, Pressable, FlatList } from "react-native"
import useInv from "../../hooks/useInv"
import {useNavigation} from "@react-navigation/native"
import { MinusSmallIcon, PlusSmallIcon } from "react-native-heroicons/outline"
import ProductoInterface from "../../interfaces/ProductoInterface"
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen"
import useLogin from "../../hooks/useLogin"
import { disponibility } from "../../utils/constants"

const ProductsGrid = ({product}: {product: ProductoInterface}) => {
  // theme
  const { themeColors: { typography, lightList, darkTurquoise, green } } = useLogin()

  const [localData, setLocalData] = useState({
    agregado: false,
    cantidad: 1
  })

  const {increase, decrease, addToCart, productsCart} = useInv()
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
    <View className="h-80 mb-2 mr-2 p-2 rounded-2xl" style={{ backgroundColor: lightList, width: wp("45.5%") }}>
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
          <Text style={{ fontSize: wp(4), color: typography }} 
            numberOfLines={2}
          >
            {descrip}
          </Text>
        </Pressable>
        
        {/* price */}
        <View className="my-2">
          <Text style={{ fontSize: wp(3), color: typography }}>
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
                    <Text style={{ fontSize: hp(1.6), color: darkTurquoise }} className="w-10">
                      {name}
                    </Text>

                    <Text style={{ fontSize: hp(1.6), color: typography }}>
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
        {!localData.agregado && (
          <TouchableOpacity onPress={() => addToCart(product)} className={`rounded-md mb-2`}
            style={{ backgroundColor: green }}
          >
            <Text className="color-white text-center font-bold p-1 pb-1.5">Agregar</Text>
          </TouchableOpacity>
        )}

        {localData.agregado && (
          <View className={`rounded-md mb-2`} style={{ backgroundColor: green }}>
            <View className="flex flex-row justify-between items-center p-1 px-4">
              <View>
                <TouchableOpacity onPress={() => decrease(id)} className="">
                  <MinusSmallIcon size={20} color="white" />
                </TouchableOpacity>
              </View>

              <View className="w-[80px]">
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
  )
}

export default ProductsGrid