import { useState, useRef } from 'react'
import { View, TouchableOpacity, Text, Image } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { AlertDialog, Button } from 'native-base'
import { themeColors } from '../../../tailwind.config'
import { setDataStorage } from '../../utils/asyncStorage'
import { useCertra, useLogin, useNavigation } from '../../hooks'
import { Loader } from '..'

const IconLogOut = () => {
  const [loadingLogOut, setLoadingLogOut] = useState(false)
  const [alertLogOut, setAlertLogOut] = useState(false)

  const { darkTurquoise } = themeColors
  const { setMyUser, setLogin } = useLogin()
  const { setProductsCart, setProducts, setCurrentPage, setLoadingProductsGrid, setLoadingSelectCustomer, setLoadingProducts } = useCertra()
  const cancelRef = useRef(null)
  const navigation = useNavigation()

  const onCloseAlertClearCart = () => setAlertLogOut(false)

  const logOut = async () => {
    setLoadingLogOut(true)
    setLogin(false)

    // reset products
    setProductsCart([])

    // reset loaders
    setLoadingProductsGrid(true)
    setLoadingSelectCustomer(false)
    setLoadingProducts(true)

    // reset storage
    await setDataStorage('login', false)
    await setDataStorage('myUser', {})
    await setDataStorage('productsCart', [])
    await setDataStorage('linealDiscount', '0')

    // go login
    navigation.navigate('Login')
    setAlertLogOut(false)

    setMyUser({
      access: {
        customerAccess: false,
        labAccess: false,
        salespersonAccess: false
      }
    })

    setProducts([])
    setCurrentPage(1)
  }

  return (
    <>
      <TouchableOpacity onPress={() => setAlertLogOut(true)} className='w-full flex flex-row justify-center items-center'>
        <View className='flex flex-row items-center gap-2'>
          <Image style={{ width: wp(6), height: wp(6) }} resizeMode='cover'
            source={require('../../assets/leave.png')}
          />
          <Text className='text-lg font-bold text-white'>Salir</Text>
        </View>
      </TouchableOpacity>

      {/* alert log out */}
      <AlertDialog leastDestructiveRef={cancelRef} isOpen={alertLogOut} onClose={onCloseAlertClearCart}>
        <AlertDialog.Content>
          <AlertDialog.CloseButton />
          <AlertDialog.Header>¿Deseas cerrar sesión?</AlertDialog.Header>

          <AlertDialog.Body>
            <Text className='font-normal text-typography'>
              Se eliminarán todos los productos de tu carrito.
            </Text>
          </AlertDialog.Body>

          <AlertDialog.Footer>
            <Button.Group space={2}>
              <Button variant='unstyled' colorScheme='coolGray' onPress={onCloseAlertClearCart} ref={cancelRef}>
                Cancelar
              </Button>
              <Button color={darkTurquoise} onPress={() => logOut()}>
                {loadingLogOut ? (
                  <View className='flex flex-row justify-center items-center w-20'>
                    <Loader color='white' size={wp(4)} />
                  </View>
                ) : (
                  <Text className='font-normal text-white'>Cerrar sesión</Text>
                )}
              </Button>
            </Button.Group>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    </>
  )
}

export default IconLogOut