import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { KeyIcon, UserIcon } from 'react-native-heroicons/outline'
import { globalStyles, theme } from '../styles'
import useLogin from '../hooks/useLogin'
import { useNavigation } from '@react-navigation/native'

const Login = () => {
  const {user, setUser, password, setPassword, auth} = useLogin()
  const navigation = useNavigation()

  const handleSubmit = () => {
    auth()
    navigation.navigate('Home')
  }

  return (
    <LinearGradient
      colors={[`${theme.turquesaOscuro}`, `${theme.turquesaClaro}`]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 0.4 }}
      style={{ flex: 1 }}
    >
      <View className={`${globalStyles.container} items-center justify-center -top-12`}>

        {/* icon */}
        <View>
          <Image source={require('../assets/user.png')} style={{width: 150, height: 150,}} />
        </View>

        {/* inputs */}
        <View className='top-14 space-y-2'>
          <View className='bg-white w-[340px] rounded-full flex-row items-center'>
            <TextInput className='text-xl text-black p-4 ml-3 w-[85%]'
              placeholder='Usuario'
              placeholderTextColor='#999'
              value={user}
              onChangeText={setUser}
            />
            <View className='absolute right-4'>
              <UserIcon size={25} color='black' />
            </View>
          </View>

          <View className='bg-white w-[340px] rounded-full flex-row items-center'>
            <TextInput className='text-xl text-black p-4 ml-3 w-[85%]'
              secureTextEntry={true}
              placeholder='Contraseña'
              placeholderTextColor='#999'
              value={password}
              onChangeText={setPassword}
            />
            <View className='absolute right-4'>
              <KeyIcon size={25} color='black' />
            </View>
          </View>

          <TouchableOpacity onPress={handleSubmit} className={`w-[340px] top-8 p-3 rounded-full`}
            style={{backgroundColor: theme.verde,}}
          >
            <Text className='text-white font-bold text-2xl text-center'>Iniciar Sesión</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  )
}

export default Login