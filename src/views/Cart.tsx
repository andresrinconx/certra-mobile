import { View, Text, TouchableOpacity, FlatList, Image } from "react-native"
import { useNavigation } from "@react-navigation/native"
import useInv from "../hooks/useInv"
import ProductsCart from "../components/products/ProductsCart"
import useLogin from "../hooks/useLogin"
import { widthPercentageToDP as wp } from "react-native-responsive-screen"
import { StatusBar } from "expo-status-bar"

const Cart = () => {
  // theme
  const { themeColors: { typography, backgrund, processBtn, darkTurquoise, green } } = useLogin()

  const { productsCart, clearCart, subtotal, total, confirmOrder, flowControl } = useInv()
  const { myUser } = useLogin()
  const { image_url } = myUser
  const navigation = useNavigation()

  return (
    <View className="flex-1 px-3 pt-6" style={{ backgroundColor: backgrund }}>
      <StatusBar style="dark" />

      {/* logos */}
      <View className="flex-row justify-between">
        {flowControl?.showLogoCertra ? (
          <Image style={{ width: wp(32), height: wp(16) }} resizeMode="contain"
            source={require("../assets/logo-certra.png")}
          />
        ) : (
          <Image style={{ width: wp(40), height: wp(20) }} resizeMode="contain"
            source={require("../assets/logo-drocerca.png")}
          />
        )}

        <Image style={{ width: wp(40), height: wp(16) }} resizeMode="contain"
          source={{uri: `${image_url}`}}
        />
      </View>

      {/* back */}
      <View className="flex flex-row items-center justify-between gap-2 mt-2">
        <View className="flex flex-row items-center">
          <TouchableOpacity onPress={() => {navigation.goBack()}}>
            <Image style={{ width: wp(8), height: wp(8) }} resizeMode="cover"
              source={require("../assets/back.png")}
            />
          </TouchableOpacity>
          
          <Text className="font-bold pl-1" style={{ color: typography, fontSize: wp(4.5) }}>Carrito de compras</Text>
        </View>

        {productsCart.length !== 0 && (
          <View className="mr-4">
            <TouchableOpacity onPress={() => clearCart()}>
              <Image style={{ width: wp(8), height: wp(8) }} resizeMode="cover"
                source={require("../assets/trash-can.png")}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* customer */}
      {productsCart.length !== 0 && (
        <View className="mt-4">
          <Text className="font-extrabold" style={{ fontSize: wp(4.5), color: typography }}>Cliente</Text>
          <Text className="font-normal" style={{ fontSize: wp(4), color: typography }}>{myUser?.customer?.nombre}</Text>
        </View>
      )}

      {/* content */}
      <View className="flex-1">
        {productsCart.length === 0 ? (
          <Text className="font-extrabold text-center mt-6" style={{ color: typography, fontSize: wp(6) }}>
            No hay productos
          </Text>
        ) : (
          <View className="pb-36">
            <FlatList
              data={productsCart}
              numColumns={1}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ 
                paddingBottom: 20,
                marginTop: 15 
              }}
              overScrollMode="never"
              renderItem={({ item }) => {
                return (
                  <ProductsCart key={item.id} product={item} />
                )
              }}
            />
          </View>
        )}
      </View>

      {/* process */}
      <View className="pb-6 px-3">
        {productsCart.length !== 0 && (
          <View className="">
            <View className="flex flex-row justify-between">
              <Text className="font-semibold text-lg text-black">Subtotal:</Text>
              <Text style={{ color: darkTurquoise, }} className="font-semibold text-lg text-black">Bs. {subtotal}</Text>
            </View>

            <View className="flex flex-row justify-between">
              <Text className="font-bold text-xl mb-2 text-black">Total:</Text>
              <Text style={{ color: darkTurquoise, }} className="font-bold text-xl mb-2 text-black">Bs. {total}</Text>
            </View>
          </View>
        )}

        {/* btn confirm */}
        <TouchableOpacity onPress={() => confirmOrder(myUser)} className="rounded-xl py-3" 
          style={{ backgroundColor: `${productsCart.length === 0 ? processBtn : green}` }}
        >
          <Text className="text-center font-bold text-white" style={{ fontSize: wp(5) }}>
            Procesar pedido ({productsCart.length})
          </Text>
        </TouchableOpacity>
      </View>

    </View>
  )
}

export default Cart