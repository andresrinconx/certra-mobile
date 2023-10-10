import { useState, useRef } from 'react'
import { View, TouchableOpacity, Text, Image } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { AlertDialog, Button } from 'native-base'
import { setDataStorage } from '../../utils/asyncStorage'
import useInv from '../../hooks/useInv'
import useLogin from '../../hooks/useLogin'
import { Loader } from '..'

const IconLogOut = () => {
  const [alertLogOut, setAlertLogOut] = useState(false)

  const { themeColors: { darkTurquoise, typography }, setMyUser, setUser, setPassword, setThemeColors } = useLogin()
  const { setProductsCart, setProducts, setLoaders, loaders, setCurrentPage, setLoadingProductsGrid } = useInv()
  const cancelRef = useRef(null)
  const navigation = useNavigation()

  const onCloseAlertClearCart = () => setAlertLogOut(false)

  const logOut = async () => {
    setLoaders({ ...loaders, loadingLogOut: true })

    // reset login
    setUser('')
    setPassword('')

    // reset products
    setProductsCart([])

    // reset loaders
    setLoaders({
      ...loaders, 
      loadingLogOut: false,
      loadingProducts: false,
      loadingSlectedCustomer: false,
      loadingConfirmOrder: false,
    })
    setLoadingProductsGrid(true)

    // reset storage
    await setDataStorage('login', false)
    await setDataStorage('themeColors', {})
    await setDataStorage('myUser', {})
    await setDataStorage('productsCart', [])
    await setDataStorage('linealDiscount', '0')
    await setDataStorage('themeColors', {
      primary: '',
      background: '',
      charge: '',
      list: '',
      turquoise: '',
      darkTurquoise: '',
      green: '',
      blue: '',
      icon: '',
      typography: '',
      processBtn: '',
    })

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
    setThemeColors({
      primary: '',
      background: '',
      charge: '',
      list: '',
      lightList: '',
      turquoise: '',
      darkTurquoise: '',
      green: '',
      blue: '',
      icon: '',
      typography: '',
      processBtn: '',
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
          <Text className='text-lg text-white font-bold'>Salir</Text>
        </View>
      </TouchableOpacity>

      {/* alert log out */}
      <AlertDialog leastDestructiveRef={cancelRef} isOpen={alertLogOut} onClose={onCloseAlertClearCart}>
        <AlertDialog.Content>
          <AlertDialog.CloseButton />
          <AlertDialog.Header>¿Deseas cerrar sesión?</AlertDialog.Header>

          <AlertDialog.Body>
            <Text className='font-normal' style={{ color: typography }}>
              Se eliminarán todos los productos de tu carrito.
            </Text>
          </AlertDialog.Body>

          <AlertDialog.Footer>
            <Button.Group space={2}>
              <Button variant='unstyled' colorScheme='coolGray' onPress={onCloseAlertClearCart} ref={cancelRef}>
                Cancelar
              </Button>
              <Button color={darkTurquoise} onPress={() => logOut()}>
                {loaders.loadingLogOut ? (
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