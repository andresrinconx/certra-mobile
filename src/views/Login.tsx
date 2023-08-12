import {useState, useEffect} from 'react'
import { View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import {EyeIcon, EyeSlashIcon, ExclamationTriangleIcon} from 'react-native-heroicons/mini'
import { theme } from '../styles'
import useLogin from '../hooks/useLogin'
import { useNavigation } from '@react-navigation/native'
import Loader from '../components/loaders/Loader'
import UserFromScliInterface from '../interfaces/UserFromScliInterface'
import UserFromUsuarioInterface from '../interfaces/UserFromUsuarioInterface'
import { setDataStorage } from '../utils/helpers'

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [incorrectCredentials, setIncorrectCredentials] = useState(false)
  const [requiredFields, setRequiredFields] = useState({
    user: false,
    password: false,
  })

  const {user, setUser, password, setPassword, login, loaders, setLoaders, firstTwoLetters, usersFromUsuario, usersFromScli, setMyUser, setLogin} = useLogin()
  const navigation = useNavigation()

  const auth = async () => {
    // required fields
    if (user === '' && password === '') {
      setRequiredFields({...requiredFields, user: true, password: true })
      setIncorrectCredentials(false)
      return
    } else if (user === '') {
      setRequiredFields({...requiredFields, user: true, password: false })
      setIncorrectCredentials(false)
      return
    } else if (password === '') {
      setRequiredFields({...requiredFields, user: false, password: true })
      setIncorrectCredentials(false)
      return
    } else {
      setRequiredFields({...requiredFields, user: false, password: false })
    }

    setLoaders({...loaders, loadingAuth: true})
    // find in the table 'Usuario'
    const userFromUsuario = usersFromUsuario.find((userDb: UserFromUsuarioInterface) => (userDb.us_codigo === user.toUpperCase() || userDb.us_codigo === user) && userDb.us_clave === password)
    if (userFromUsuario === undefined) {
      // find in the table 'Scli'
      const userFromScli = usersFromScli.find((userDb: UserFromScliInterface) => (userDb.cliente === user.toUpperCase() || userDb.clave === user) && userDb.clave === password)
      if (userFromScli === undefined) {
        // Incorrect Credentials
        setLoaders({...loaders, loadingAuth: false})
        setIncorrectCredentials(true)
        return
      } else { // success from Scli
        setIncorrectCredentials(false)
        const letters = firstTwoLetters(userFromScli.nombre)
        setMyUser({
          ...userFromScli, 
          letters, 
          from: 'scli'
        })
        await setDataStorage('login', true)
        await setDataStorage('myUser', {
          ...userFromScli, 
          letters, 
          from: 'scli'
        })
        setLoaders({...loaders, loadingAuth: false})
        setLogin(true)
      }
    } else { // success from Usuario
      setIncorrectCredentials(false)
      const letters = firstTwoLetters(userFromUsuario.us_nombre)
      setMyUser({
        ...userFromUsuario, 
        letters, 
        from: 'usuario'
      })
      await setDataStorage('login', true)
      await setDataStorage('myUser', {
        ...userFromUsuario, 
        letters,
        from: 'usuario'
      })
      setLoaders({...loaders, loadingAuth: false})
      setLogin(true)
    }
  }

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
      <View className='flex-1 items-center mt-20 mx-[6%]'>

        {/* Logo */}
        <View className='mb-16'>
          <Image source={require('../assets/user.png')} style={{width: 150, height: 150,}} />
        </View>

        {/* form */}
        <View className='flex-1 space-y-3'>
          {/* username */}
          <View className='space-y-1'>
            <View className='ml-2'>
              <Text className='text-gray-600 font-bold text-lg'>Usuario</Text>
            </View>

            <View className={`bg-white w-full rounded-2xl flex-row items-center ${requiredFields.user && 'border border-[#EF4444]'}`}>
              <TextInput className='text-xl text-black p-4 ml-1 w-full'
                placeholder='Escribe tu nombre de usuario'
                placeholderTextColor='#999'
                value={user}
                onChangeText={setUser}
              />
            </View>

            {requiredFields.user && (
              <View className='ml-2'>
                <Text className='text-red-500 text-base'>* Campo obligatorio</Text>
              </View>
            )}
          </View>

          {/* password */}
          <View className='space-y-1'>
            <View className='ml-2'>
              <Text className='text-gray-600 font-bold text-lg'>Contraseña</Text>
            </View>

            <View className={`bg-white w-full rounded-2xl flex-row items-center ${requiredFields.password && 'border border-[#EF4444]'}`}>
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

            {requiredFields.password && (
              <View className='ml-2'>
                <Text className='text-red-500 text-base'>* Campo obligatorio</Text>
              </View>
            )}
          </View>

          {/* Incorrect Credentials */}
          {incorrectCredentials && (
            <View className='relative top-5 flex flex-row items-center p-3 rounded-lg bg-[#fbeaea] border border-[#f10202]'>
              <View className='bg-[#f3c1c0] p-2 rounded-full'>
                <ExclamationTriangleIcon size={20} color='#a54e54' />
              </View>
              <Text className='text-base text-[#a54e54] ml-3'>Usuario no encontrado o contraseña incorrecta</Text>
            </View>
          )}

          {/* btn */}
          <View className='top-32'>
            <TouchableOpacity onPress={() => auth()} className='w-full p-3 rounded-full'
              style={{backgroundColor: theme.verde,}}
            >
              {!loaders.loadingAuth && (
                <Text className='text-white font-bold text-2xl text-center'>Iniciar Sesión</Text>
              )}

              {loaders.loadingAuth && (
                <View className=''>
                  <Loader color='white' />
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

      </View>
    </LinearGradient>
  )
}

export default Login