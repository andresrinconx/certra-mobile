import { View, TouchableOpacity, Text } from 'react-native'
import { ArrowLeftOnRectangleIcon } from 'react-native-heroicons/solid'
import { useNavigation } from '@react-navigation/native'
import useInv from '../../hooks/useInv'
import useLogin from '../../hooks/useLogin'
import { setDataStorage } from '../../utils/asyncStorage'

const IconLogOut = () => {
  const {setProductsCart, setFlowControl, setValueSearchCustomers} = useInv()
  const {setMyUser, setUser, setPassword, setLogin, setThemeColors} = useLogin()
  const navigation = useNavigation()
  
  const handleLogOut = async () => {
    // reset login and navigate
    setUser('')
    setPassword('')
    setLogin(false)
    navigation.navigate('Login')
    await setDataStorage('login', false)
    await setDataStorage('themeColors', {})
    await setDataStorage('myUser', {})
    await setDataStorage('productsCart', [])
    await setDataStorage('flowControl', {showProducts: false, showSelectCustomer: false, showSelectSearch: false, showSelectResults: false, showSelectLabel: false, selected: false,})

    // reset cart
    setProductsCart([])
    
    // reset flow
    setFlowControl({
      showProducts: false, 
      showSelectCustomer: false, 
      showSelectSearch: false, 
      showSelectResults: false, 
      showSelectLabel: false, 
      selected: false,
    })
    setMyUser({})
    setThemeColors({primary: ''})
    setValueSearchCustomers('')
  }

  return (
    <TouchableOpacity onPress={handleLogOut}>
      <View className='flex flex-row items-center gap-1'>
        <ArrowLeftOnRectangleIcon size={30} color='black' />
        <Text className='text-gray-700 font-bold text-xm'>Cerrar Sesión</Text>
      </View>
    </TouchableOpacity>
  )
}

export default IconLogOut