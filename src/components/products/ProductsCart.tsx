import { useState, useEffect } from "react"
import { View, Text, TextInput, TouchableOpacity, FlatList, Modal, Pressable } from "react-native"
import { theme, styles } from "../../styles"
import { MinusSmallIcon, PlusSmallIcon, XMarkIcon } from "react-native-heroicons/outline"
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen"
import useInv from "../../hooks/useInv"
import ProductoInterface from "../../interfaces/ProductoInterface"
import { useNavigation } from "@react-navigation/native"
import useLogin from "../../hooks/useLogin"
import Loader from "../loaders/Loader"
import { disponibility } from "../../utils/constants"

const ProductsCart = ({ product }: { product: ProductoInterface }) => {
  // theme
  const { themeColors: { typography, lightList, darkTurquoise, green, turquoise, icon } } = useLogin()
  
  const [openModal, setOpenModal] = useState(false)
  const [disableAcept, setDisableAcept] = useState(false)
  const [localData, setLocalData] = useState({
    agregado: false,
    cantidad: ""
  })
  const [loadingDecrease, setLoadingDecrease] = useState(false)
  const [loadingIncrease, setLoadingIncrease] = useState(false)
  const [loadingRemoveElement, setLoadingRemoveElement] = useState(false)

  const { increase, decrease, removeElement, productsCart, setProductsCart } = useInv()
  const { descrip, precio1, id, cantidad, centro, merida, oriente } = product
  const navigation = useNavigation()

  // refresh data when cart change
  useEffect(() => {
    const productInCart = productsCart.find(productInCart => productInCart.id === id)
    if (productInCart !== undefined) { // product in cart
      setLocalData({ ...localData, agregado: productInCart.agregado, cantidad: String(productInCart.cantidad) })
    } else {
      setLocalData({ ...localData, agregado: false, cantidad: String(1) })
    }
  }, [productsCart])

  // change "cantidad" (input)
  useEffect(() => {
    const productInCart = productsCart.find(item => item.id === id)

    // btns
    if (productInCart !== undefined) {
      if ((productInCart.cantidad === Number(localData.cantidad) || productInCart.cantidad < Number(localData.cantidad) || productInCart.cantidad > Number(localData.cantidad) && Number(localData.cantidad) !== 0)) { // igual, mayor o menor (y no es cero)
        setDisableAcept(false)
      } else if (Number(localData.cantidad) === 0 || Number(localData.cantidad) < 0) { // cero o NaN
        setDisableAcept(true)
      }
    }
  }, [localData.cantidad])
  const acept = () => {
    const updatedProductsCart = productsCart.map(item => {
      if (item.id === id) {
        const cleanCantidad = parseFloat(localData.cantidad.replace(/-/g, ""))

        return { ...item, cantidad: cleanCantidad }
      } else {
        return { ...item }
      }
    })
    setProductsCart(updatedProductsCart)
    setOpenModal(false)
  }

  // actions
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
    <>
      <View className="flex flex-col mb-3 p-2 rounded-2xl" style={{ backgroundColor: lightList }}>

        {/* descrip & remove */}
        <View className="flex flex-row items-center justify-between">
          
          {/* descrip */}
          <Pressable onPress={() => navigation.navigate("Product", { ...product })}>
            <Text style={{ fontSize: wp(4), color: typography }} className="font-bold max-w-[85%]" numberOfLines={1}>
              {descrip}
            </Text>
          </Pressable>

          {localData.agregado && !loadingRemoveElement ? (
            <View className="pl-5">
              <TouchableOpacity onPress={handleRemoveElement} className="flex flex-row items-center justify-center rounded-md w-7 h-7">
                <XMarkIcon size={20} color={icon} strokeWidth={3} />
              </TouchableOpacity>
            </View>
          ):null}
        </View>

        {/* info */}
        <View className="flex flex-row items-center">

          {/* left info */}
          <View className="w-1/2 pr-2">

            {/* disponibility */}
            <View className="mb-2">
              <Text style={{ fontSize: hp(1.6), color: typography }} className="pb-0.5">
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
                        <Text style={{ fontSize: hp(1.6), color: darkTurquoise }} className="w-10 text-center">
                          {name}
                        </Text>

                        <Text style={{ fontSize: hp(1.6), color: typography }} className="text-center">
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
              <Text style={{ fontSize: hp(1.5), color: typography }}>
                Precio:
              </Text>

              <Text style={{ fontSize: hp(2.2), color: darkTurquoise }} className="font-bold">
                Bs. {precio1}
              </Text>
            </View>

            {/* ammount and added */}
            <View className="flex flex-row px-3 pt-2 pb-2">
              {localData.agregado && !loadingRemoveElement ? (
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
                      // <TouchableOpacity onPress={() => setOpenModal(true)} className='flex flex-row justify-center items-center'>
                      //   <Text className='text-center text-base text-black w-[65px]'>{cantidad}</Text>
                      // </TouchableOpacity>
                    )}

                    <View className="rounded-md" style={{ borderColor: turquoise, borderWidth: .5 }}>
                      <TouchableOpacity onPress={handleIncrease} className="p-0.5">
                        <PlusSmallIcon size={17} color={darkTurquoise} strokeWidth={3} />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* added */}
                  {localData.agregado && loadingRemoveElement ? (
                    <View className="flex flex-row justify-center items-center rounded-md h-7 w-7 ml-5" style={{ backgroundColor: green }}>
                      <Loader size={wp(4.5)} color="white" />
                    </View>
                  ):null}
                </View>
                
              ):null}
            </View>
          </View>

        {/* info */}
        </View>

      </View>

      {/* modal input */}
      <Modal
        visible={openModal}
        animationType="fade"
        transparent={true}
      >
        <View className="flex-1" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <View className="absolute bg-white w-[95%] h-48 left-2.5 right-2.5 bottom-2 rounded-2xl"
            style={[styles.shadow]}
          >
            <Text className="text-2xl text-center text-black mt-3 pb-3 border-b-[0.5px] border-gray-500">Cantidad</Text>

            <View className="rounded-full mx-4 mt-3" style={{ backgroundColor: "#f2f2f2", }}>
              <TextInput className="h-12 w-full pl-5 text-xl rounded-full text-gray-700"
                keyboardType="numeric"
                value={String(localData.cantidad)}
                onChangeText={text => setLocalData({ ...localData, cantidad: text })}
                autoFocus
                selectionColor={theme.turquesaClaro}
              />
            </View>

            <View className="flex flex-row items-center justify-between mx-4 mt-4">
              <TouchableOpacity onPress={() => setOpenModal(false)} className="flex justify-center w-[48%] h-12 rounded-full border-[0.2px] border-gray-400"
                style={{ backgroundColor: "#f7f7f7" }}
              >
                <Text className="text-center text-base uppercase text-blue-500">Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => acept()} className="flex justify-center w-[48%] h-12 rounded-full border-[0.2px] border-gray-400"
                style={{ backgroundColor: "#f7f7f7" }}
                disabled={disableAcept}
              >
                <Text className={`text-center text-base uppercase ${disableAcept ? "text-blue-200" : "text-blue-500"}`}>Aceptar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  )
}

export default ProductsCart