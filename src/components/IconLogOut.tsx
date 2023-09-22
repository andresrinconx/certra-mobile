import { useState, useRef } from 'react'
import { View, TouchableOpacity, Text, Image } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { AlertDialog, Button } from 'native-base'
import { setDataStorage } from '../utils/asyncStorage'
import useInv from '../hooks/useInv'
import useLogin from '../hooks/useLogin'
import Loader from './Loader'

const IconLogOut = () => {
  const [alertLogOut, setAlertLogOut] = useState(false)

  const { themeColors: { darkTurquoise, typography }, setMyUser, setUser, setPassword, setLogin, setThemeColors } = useLogin()
  const { setProductsCart, setFlowControl, setProducts, setLoaders, loaders, setCurrentPage } = useInv()
  const cancelRef = useRef(null)
  const navigation = useNavigation()

  const onCloseAlertClearCart = () => setAlertLogOut(false)

  const logOut = async () => {
    setLoaders({ ...loaders, loadingLogOut: true })

    // reset login and navigate
    setUser('')
    setPassword('')
    setLogin(false)

    // redirect
    setTimeout(() => {
      navigation.navigate('Login')

      // reset alert
      setAlertLogOut(false)
    }, 2000)

    await setDataStorage('login', false)
    await setDataStorage('themeColors', {})
    await setDataStorage('myUser', {})
    await setDataStorage('productsCart', [])
    await setDataStorage('flowControl', {
      showProducts: false,
      showSelectCustomer: false,
      showSelectSearch: false,
      showSelectResults: false,
      showSelectLabel: false,
      showLogoCertra: false,
      showItinerary: false,
      selected: false,
    })
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

    setTimeout(() => {
      // reset products
      setProductsCart([])
      setProducts([])
      setCurrentPage(1)
  
      // reset flow
      setFlowControl({
        showProducts: false,
        showSelectCustomer: false,
        showSelectSearch: false,
        showSelectResults: false,
        showSelectLabel: false,
        showLogoCertra: false,
        showItinerary: false,
        selected: false,
      })
      setMyUser({})
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
  
      setLoaders({
        ...loaders, 
        loadingLogOut: false,
        loadingProducts: false,
        loadingSlectedCustomer: false,
        loadingConfirmOrder: false,
      })
    }, 2000)
  }

  return (
    <>
      <TouchableOpacity onPress={() => setAlertLogOut(true)}>
        <View className='flex flex-row items-center gap-2'>
          <Image style={{ width: wp(6), height: wp(6) }} resizeMode='cover'
            source={require('../assets/leave.png')}
          />
          <Text className='text-sm w-8 text-white font-bold'>Salir</Text>
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