import { View, TouchableOpacity } from 'react-native'
import { ArrowLeftOnRectangleIcon } from 'react-native-heroicons/solid'
import { useNavigation } from '@react-navigation/native'
import useInv from '../hooks/useInv';
import useLogin from '../hooks/useLogin';

const LogOut = () => {
  const {setCart} = useInv()
  const {logOut} = useLogin()
  const navigation = useNavigation()
  
  const handleLogOut = () => {
    logOut()
    setCart([])
    navigation.navigate('Home')
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