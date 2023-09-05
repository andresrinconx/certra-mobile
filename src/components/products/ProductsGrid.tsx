import {useState, useEffect} from "react"
import { View, Text, Image, TouchableOpacity, Pressable } from "react-native"
import { theme } from "../../styles"
import useInv from "../../hooks/useInv"
import {useNavigation} from "@react-navigation/native"
import { MinusSmallIcon, PlusSmallIcon } from "react-native-heroicons/outline"
import ProductoInterface from "../../interfaces/ProductoInterface"
import { widthPercentageToDP as wp } from "react-native-responsive-screen"
import useLogin from "../../hooks/useLogin"

const ProductsGrid = ({product}: {product: ProductoInterface}) => {
  // theme
  const { themeColors: { typography } } = useLogin()

  const [localData, setLocalData] = useState({
    agregado: false,
    cantidad: 1
  })

  const {increase, decrease, addToCart, productsCart} = useInv()
  const {descrip, precio1, id, image_url} = product
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
    <View className="h-64 mb-2 mr-2 p-2 rounded-2xl" style={{ backgroundColor: '#edf5f8', width: wp("42%") }}>
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
        <Text className="mt-2" style={{ fontSize: wp(4), color: typography }}>
          Precio:
        </Text>

        <Text style={{color: theme.azul,}} className={`font-bold text-xl mb-2`}>
          Bs. {precio1}
        </Text>

        {/* ammount and added */}
        {!localData.agregado && (
          <TouchableOpacity onPress={() => addToCart(product)} className={`rounded-md mb-2`}
            style={{backgroundColor: theme.verde}}
          >
            <Text className="color-white text-center font-bold p-1 pb-1.5">Agregar</Text>
          </TouchableOpacity>
        )}

        {localData.agregado && (
          <View className={`rounded-md mb-2`} style={{backgroundColor: theme.verde}}>
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