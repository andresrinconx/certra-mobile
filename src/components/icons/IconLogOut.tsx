import { View, TouchableOpacity, Text } from 'react-native'
import { ArrowLeftOnRectangleIcon } from 'react-native-heroicons/solid'
import { useNavigation } from '@react-navigation/native'
import useInv from '../../hooks/useInv'
import useLogin from '../../hooks/useLogin'
import { setDataStorage } from '../../utils/helpers'

const IconLogOut = ({closeUserMenu}: {closeUserMenu: () => void}) => {
  const {setCart, setFlowControl} = useInv()
  const {setMyUser, setUser, setPassword, setLogin} = useLogin()
  const navigation = useNavigation()
  
  const handleLogOut = async () => {
    closeUserMenu()
    setUser('')
    setPassword('')
    setLogin(false)
    navigation.navigate('Login')
    await setDataStorage('login', false)
    await setDataStorage('myUser', {})
    await setDataStorage('cart', [])
    // await setDataStorage('flowControl', {showProducts: false, showSelectCustomer: false, showSelectSearch: false, showSelectResults: false, showSelectLabel: false, selected: false,})
    setCart([])
    setFlowControl({
      showProducts: false, 
      showSelectCustomer: false, 
      showSelectSearch: false, 
      showSelectResults: false, 
      showSelectLabel: false, 
      selected: false,
    })
    setMyUser({})
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