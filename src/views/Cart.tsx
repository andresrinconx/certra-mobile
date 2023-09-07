import { useEffect, useState, useRef } from "react"
import { View, Text, TouchableOpacity, FlatList, Image } from "react-native"
import { useNavigation } from "@react-navigation/native"
import useInv from "../hooks/useInv"
import ProductsCart from "../components/products/ProductsCart"
import useLogin from "../hooks/useLogin"
import { widthPercentageToDP as wp } from "react-native-responsive-screen"
import { StatusBar } from "expo-status-bar"
import Loader from "../components/loaders/Loader"
import { AlertDialog, Button } from "native-base"

const Cart = () => {
  // theme
  const { themeColors: { typography, backgrund, processBtn, darkTurquoise, green, icon, primary } } = useLogin()

  const [loadingCart, setLoadingCart] = useState(true)
  const [alertClearCart, setAlertClearCart] = useState(false)

  const cancelRef = useRef(null);

  const { productsCart, subtotal, total, confirmOrder, flowControl, setProductsCart } = useInv()
  const { myUser } = useLogin()
  const { image_url } = myUser
  const navigation = useNavigation()

  useEffect(() => {
    const load = () => {
      setTimeout(() => {
        setLoadingCart(false)
      }, 200);
    }
    load()
  }, [])

  const clearCart = () => {
    setAlertClearCart(false)

    // clear
    const updatedProducts = productsCart.filter(item => item.agregado !== true)
    setProductsCart(updatedProducts)
  };
  const onClose = () => setAlertClearCart(false);

  return (
    <>
      <View className="flex-1 px-3 pt-6" style={{ backgroundColor: backgrund }}>
        <StatusBar style="dark" />

        {/* content */}
        <View className="h-full">
          
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
              <View>
                <TouchableOpacity onPress={() => setAlertClearCart(true)}>
                  <Image style={{ width: wp(8), height: wp(8) }} resizeMode="cover"
                    source={require("../assets/trash-can.png")}
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* customer */}
          {productsCart.length !== 0 && myUser?.customer?.nombre ? (
            <View className="mt-4 pb-2">
              <Text className="font-extrabold" style={{ fontSize: wp(4.5), color: typography }}>Cliente</Text>
              <Text className="font-normal" style={{ fontSize: wp(4), color: typography }}>{myUser?.customer?.nombre}</Text>
            </View>
          ):null}

          {/* products */}
          {loadingCart ? (
            <View className="mt-10">
              <Loader color={`${primary}`} />
            </View>
          ) : (
            <View className="flex-1">
              {productsCart.length === 0 && !loadingCart ? (
                <Text className="font-extrabold text-center mt-6" style={{ color: typography, fontSize: wp(6) }}>
                  No hay productos
                </Text>
              ) : (
                <FlatList
                  data={productsCart}
                  numColumns={1}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ 
                    paddingBottom: 200,
                    marginTop: 15 
                  }}
                  overScrollMode="never"
                  renderItem={({ item }) => {
                    return (
                      <ProductsCart key={item.id} product={item} />
                    )
                  }}
                />
              )}
            </View>
          )}
        </View>

      </View>

      {/* process order */}
      <View className="flex flex-col justify-center h-32 w-[100%] bottom-1.5 absolute border-t-[0.5px] border-t-[#999999]">
        <View className="flex flex-col justify-center h-full w-[92%]"
          style={{ backgroundColor: backgrund, borderTopColor: icon, marginLeft: 16 }}
        >
          {productsCart.length !== 0 && (
            <View className="px-2">
              {/* subtotal & total */}
              <View className="flex flex-row justify-between">
                <Text style={{ fontSize: wp(4.5), color: typography }} className="font-semibold">
                  Subtotal:
                </Text>
                <Text style={{ fontSize: wp(4.5), color: typography, }} className="font-semibold">
                  Bs. {subtotal}
                </Text>
              </View>

              <View className="flex flex-row justify-between">
                <Text style={{ fontSize: wp(5), color: typography }} className="mb-2 font-extrabold">
                  Total:
                </Text>
                <Text style={{ fontSize: wp(5), color: darkTurquoise, }} className="font-extrabold mb-2">
                  Bs. {total}
                </Text>
              </View>
            </View>
          )}

          {/* btn confirm */}
          <TouchableOpacity onPress={() => confirmOrder(myUser)} className="rounded-xl py-3" 
            style={{ backgroundColor: `${productsCart.length === 0 ? processBtn : green}` }}
            disabled={productsCart.length === 0 ? true : false}
          >
            <Text className="text-center font-bold text-white" style={{ fontSize: wp(5) }}>
              Procesar pedido {productsCart.length === 0 ? '' : `(${productsCart.length})`}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* alerta */}
      <AlertDialog leastDestructiveRef={cancelRef} isOpen={alertClearCart} onClose={onClose}>
        <AlertDialog.Content>
          <AlertDialog.CloseButton />
          <AlertDialog.Header>Delete Customer</AlertDialog.Header>
          <AlertDialog.Body>
            This will remove all data relating to Alex. This action cannot be
            reversed. Deleted data can not be recovered.
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Button.Group space={2}>
              <Button variant="unstyled" colorScheme="coolGray" onPress={onClose} ref={cancelRef}>
                Cancel
              </Button>
              <Button colorScheme="danger" onPress={() => clearCart()}>
                Delete
              </Button>
            </Button.Group>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    </>
  )
}

export default Cart