import { View, TouchableOpacity } from 'react-native'
import { ArrowLeftOnRectangleIcon } from 'react-native-heroicons/solid'
import { useNavigation } from '@react-navigation/native'
import useInv from '../../hooks/useInv'
import useLogin from '../../hooks/useLogin'
import { setDataStorage } from '../../utils/helpers'

const IconLogOut = () => {
  const {setCart} = useInv()
  const {setMyUser, setUser, setPassword, setLogin} = useLogin()
  const navigation = useNavigation()
  
  const handleLogOut = async () => {
    setUser('')
    setPassword('')
    setLogin(false)
    navigation.navigate('Login')
    await setDataStorage('login', false)
    await setDataStorage('myUser', {})
    setCart([])
    setMyUser({})
  }

  return (
    <TouchableOpacity onPressOut={handleLogOut}>
      <View>
        <ArrowLeftOnRectangleIcon size={30} color='white' />
      </View>
    </TouchableOpacity>
  )
}

export default IconLogOut