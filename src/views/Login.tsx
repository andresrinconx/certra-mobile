import { useState, useEffect, useRef } from 'react'
import { View, Text, TextInput, TouchableOpacity, Image, Keyboard, FlatList, Linking } from 'react-native'
import { EyeIcon, EyeSlashIcon } from 'react-native-heroicons/mini'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { useNavigation } from '@react-navigation/native'
import { StatusBar } from 'react-native'
import UserFromScliInterface from '../interfaces/UserFromScliInterface'
import UserFromUsuarioInterface from '../interfaces/UserFromUsuarioInterface'
import useLogin from '../hooks/useLogin'
import { pallete } from '../utils/pallete'
import { setDataStorage } from '../utils/asyncStorage'
import { socialMedia } from '../utils/constants'
import Loader from '../components/Loader'

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [incorrectCredentials, setIncorrectCredentials] = useState(false)
  const [requiredFields, setRequiredFields] = useState({
    user: false,
    password: false,
  })

  const { user, setUser, password, setPassword, login, loaders, setLoaders, usersFromUsuario, usersFromScli, setMyUser, setLogin, setThemeColors, checkLocationPermission } = useLogin()
  const navigation = useNavigation()
  const textInputRefUser = useRef<TextInput | null>(null)
  const textInputRefPassword = useRef<TextInput | null>(null)

  // Location Permission
  useEffect(() => {
    checkLocationPermission()
  }, [])
  
  // -----------------------------------------------
  // SCREEN
  // -----------------------------------------------

  // Go home
  useEffect(() => {
    if (login) {
      navigation.navigate('Home')
    }
  }, [login])
  
  // Input
  useEffect(() => {
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', removeInputFocus)
    return () => {
      keyboardDidHideListener.remove()
    }
  }, [])
  const removeInputFocus = () => {
    if (textInputRefUser.current) {
      textInputRefUser.current.blur()
    }
    if (textInputRefPassword.current) {
      textInputRefPassword.current.blur()
    }
  }

  // -----------------------------------------------
  // AUTH
  // -----------------------------------------------

  const auth = async () => {
    // required fields
    if (user === '' && password === '') {
      setRequiredFields({ ...requiredFields, user: true, password: true })
      setIncorrectCredentials(false)
      return
    } else if (user === '') {
      setRequiredFields({ ...requiredFields, user: true, password: false })
      setIncorrectCredentials(false)
      return
    } else if (password === '') {
      setRequiredFields({ ...requiredFields, user: false, password: true })
      setIncorrectCredentials(false)
      return
    } else {
      setRequiredFields({ ...requiredFields, user: false, password: false })
    }

    setLoaders({ ...loaders, loadingAuth: true })
    setIncorrectCredentials(false)

    // find in the table 'Usuario'
    const userFromUsuario = usersFromUsuario?.find((userDb: UserFromUsuarioInterface) =>
      (userDb.us_codigo === user.toUpperCase().trim() || userDb.us_codigo === user.trim()) && userDb.us_clave === password)

    if (userFromUsuario === undefined) {

      // find in the table 'Scli'
      const userFromScli = usersFromScli?.find((userDb: UserFromScliInterface) =>
        ('W' + userDb.cliente === user.toUpperCase().trim() || 'W' + userDb.clave === user.trim()) && userDb.clave === password)

      if (userFromScli === undefined) {

        // Incorrect Credentials
        setTimeout(() => {
          setLoaders({ ...loaders, loadingAuth: false })
          setIncorrectCredentials(true)
        }, 1000)
        return
      } else {

        // Success from Scli
        setIncorrectCredentials(false)
        setMyUser({
          ...userFromScli,
          from: 'scli',
        })
        await setDataStorage('themeColors', { ...pallete[1] }) // 1 = Scli
        await setDataStorage('login', true)
        await setDataStorage('myUser', {
          ...userFromScli,
          from: 'scli',
        })
        setThemeColors({ ...pallete[1] }) // 1 = Scli
        setLogin(true)
        setTimeout(() => {
          setLoaders({ ...loaders, loadingAuth: false })
        }, 1500)
        setShowPassword(false)
      }
    } else {

      // Success from Usuario
      setIncorrectCredentials(false)
      if (userFromUsuario.clipro !== '') { // Success with clipro
        setMyUser({
          ...userFromUsuario,
          from: 'usuario-clipro',
        })
      } else {
        setMyUser({
          ...userFromUsuario,
          from: 'usuario',
        })
      }
      await setDataStorage('themeColors', { ...pallete[0] }) // 0 = Usuario
      await setDataStorage('login', true)

      if (userFromUsuario.clipro !== '') { // Success with clipro
        await setDataStorage('myUser', {
          ...userFromUsuario,
          from: 'usuario-clipro',
        })
      } else {
        await setDataStorage('myUser', {
          ...userFromUsuario,
          from: 'usuario',
        })
      }

      setThemeColors({ ...pallete[0] }) // 0 = Usuario
      setLogin(true)
      setTimeout(() => {
        setLoaders({ ...loaders, loadingAuth: false })
      }, 1500)
      setShowPassword(false)
    }
  }

  return (
    <View className='flex-1 relative'>
      <StatusBar translucent={true} backgroundColor='transparent' barStyle='light-content' />

      <Image className='absolute w-full h-full' resizeMode='cover'
        source={require('../assets/background.png')}
      />

      {/* form & logos */}
      <View className='flex flex-1'>

        {/* logo drocerca */}
        <View className='flex flex-row justify-center h-1/6 pt-10'>
          <Image resizeMode='contain' style={{ width: wp(90), height: wp(20) }}
            source={require('../assets/logo-drocerca.png')}
          />
        </View>

        {/* form */}
        <View className='h-4/6 flex flex-col items-center'>
          <View className='w-5/6 absolute bottom-0 space-y-3'>

            {/* username */}
            <View>
              <View className='flex-row items-center rounded-2xl py-2 bg-white'>
                <TextInput className='w-full pl-5' style={{ fontSize: wp(4.5), color: '#666666' }}
                  ref={textInputRefUser}
                  placeholder='Usuario'
                  placeholderTextColor='#999999'
                  value={user}
                  onChangeText={setUser}
                  selectionColor='#006283'
                />
              </View>

              {requiredFields.user && (
                <View className='pl-4 pt-1'>
                  <Text className='text-white font-bold' style={{ fontSize: wp(4) }}>* Campo obligatorio</Text>
                </View>
              )}
            </View>

            {/* password */}
            <View>
              <View className='flex-row items-center rounded-2xl py-2 bg-white'>
                <TextInput className='w-full pl-5' style={{ fontSize: wp(4.5), color: '#666666' }}
                  ref={textInputRefPassword}
                  secureTextEntry={!showPassword}
                  placeholder='Contraseña'
                  placeholderTextColor='#999999'
                  value={password}
                  onChangeText={setPassword}
                  selectionColor='#006283'
                />
                {!showPassword && (
                  <TouchableOpacity onPress={() => setShowPassword(true)} className='absolute right-4'>
                    <EyeIcon size={30} color='#B3B3B3' />
                  </TouchableOpacity>
                )}
                {showPassword && (
                  <TouchableOpacity onPress={() => setShowPassword(false)} className='absolute right-4'>
                    <EyeSlashIcon size={30} color='#B3B3B3' />
                  </TouchableOpacity>
                )}
              </View>

              {requiredFields.password && (
                <View className='pl-4 pt-1'>
                  <Text className='text-white font-bold' style={{ fontSize: wp(4) }}>* Campo obligatorio</Text>
                </View>
              )}
            </View>

            {/* Incorrect Credentials */}
            {incorrectCredentials && (
              <View className='pr-4'>
                <Text className='text-white font-bold text-right' style={{ fontSize: wp(4.5) }}>* Datos incorrectos</Text>
              </View>
            )}

            {/* sign in */}
            <View className='flex flex-col items-center justify-center'>
              <TouchableOpacity onPress={() => auth()} className='flex flex-col justify-center items-center rounded-xl p-1.5 w-36'
                style={{ backgroundColor: '#92BF1E' }}
              >
                {!loaders.loadingAuth && (
                  <View className='flex flex-col items-center justify-center h-6'>
                    <Text className='font-medium text-center' style={{ fontSize: wp(4.5), color: 'black' }}>
                      Iniciar Sesión
                    </Text>
                  </View>
                )}

                {loaders.loadingAuth && (
                  <View className='flex flex-col items-center justify-center h-6'>
                    <Loader color='white' size={24} />
                  </View>
                )}
              </TouchableOpacity>
            </View>

          </View>
        </View>

        {/* social media */}
        <View className='h-1/6 flex justify-center items-center pt-8 space-x-5'>
          <FlatList
            data={socialMedia}
            numColumns={1}
            horizontal={true}
            showsVerticalScrollIndicator={false}
            renderItem={({item: {url, image, id}}) => {
              let isLast = socialMedia.length === id
              let noMargin = `${isLast ? 'mr-0' : 'mr-3'}`
              return (
                <TouchableOpacity key={id} onPress={() => { Linking.openURL(`${url}`) }} 
                  className={`${noMargin}`}
                >
                  <Image style={{ width: wp(8), height: wp(8) }} resizeMode='cover'
                    source={image}
                  />
                </TouchableOpacity>
              )
            }} 
          />
        </View>

      </View>
    </View>
  )
}

export default Login