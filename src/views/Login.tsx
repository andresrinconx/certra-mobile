import {useState, useEffect} from 'react'
import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import {EyeIcon, EyeSlashIcon} from 'react-native-heroicons/mini'
import { theme } from '../styles'
import useLogin from '../hooks/useLogin'
import { useNavigation } from '@react-navigation/native'

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const {user, setUser, password, setPassword, auth, login} = useLogin()
  const navigation = useNavigation()

  useEffect(() => {
    if(login) {
      navigation.navigate('Home')
    }
  }, [login])

  return (
    <LinearGradient
      colors={[`${theme.turquesaClaro}`, '#fff']}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
      <View className='flex-1 items-center mt-28 mx-7'>

        {/* Inicia Sesión */}
        <View className=''>
          <Text className='font-bold text-white text-4xl'>Iniciar Sesión</Text>
        </View>

        <View className='space-y-3 top-28'>
          {/* username */}
          <View className='space-y-1'>
            <View className='ml-2'>
              <Text className='text-gray-600 font-bold text-lg'>Usuario</Text>
            </View>

            <View className='bg-white w-full rounded-2xl flex-row items-center'>
              <TextInput className='text-xl text-black p-4 ml-1 w-full'
                placeholder='Escribe tu nombre de usuario'
                placeholderTextColor='#999'
                value={user}
                onChangeText={setUser}
              />
            </View>
          </View>

          {/* password */}
          <View className='space-y-1'>
            <View className='ml-2'>
              <Text className='text-gray-600 font-bold text-lg'>Contraseña</Text>
            </View>

            <View className='bg-white w-full rounded-2xl flex-row items-center'>
              <TextInput className='text-xl text-black p-4 ml-1 w-full'
                secureTextEntry={!showPassword}
                placeholder='Ingresa tu contraseña'
                placeholderTextColor='#999'
                value={password}
                onChangeText={setPassword}
              />
              {!showPassword && (
                <TouchableOpacity onPress={() => setShowPassword(true)} className='absolute right-4'>
                  <EyeIcon size={25} color='#999' />
                </TouchableOpacity>
              )}

              {showPassword && (
                <TouchableOpacity onPress={() => setShowPassword(false)} className='absolute right-4'>
                  <EyeSlashIcon size={25} color='#999' />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* btn */}
          <View className='top-32'>
            <TouchableOpacity onPress={() => auth()} className='w-full p-3 rounded-full'
              style={{backgroundColor: theme.verde,}}
            >
              <Text className='text-white font-bold text-2xl text-center'>Iniciar Sesión</Text>
            </TouchableOpacity>
          </View>
        </View>

      </View>
    </LinearGradient>
  )
}

export default Login