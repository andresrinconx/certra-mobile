import { View, TouchableOpacity } from 'react-native'
import { ArrowLeftOnRectangleIcon } from 'react-native-heroicons/solid'
import { useNavigation } from '@react-navigation/native'
import useInv from '../hooks/useInv'
import useLogin from '../hooks/useLogin'
import { setDataStorage } from '../utils/helpers'

const LogOut = () => {
  const {setCart} = useInv()
  const {logOut, setMyUser} = useLogin()
  const navigation = useNavigation()
  
  const handleLogOut = async () => {
    logOut()
    setCart([])
    navigation.navigate('Login')
    setMyUser({})
    await setDataStorage('login', false)
    await setDataStorage('myUser', {})
  }

  return (
    <TouchableOpacity onPressOut={handleLogOut}>
      <View>
        <ArrowLeftOnRectangleIcon size={30} color='white' />
      </View>
    </TouchableOpacity>
  )
}

export default LogOut