import { useState, useEffect, useRef } from 'react'
import { View, Text, TextInput, TouchableOpacity, Image, Keyboard, FlatList, Linking } from 'react-native'
import { EyeIcon, EyeSlashIcon } from 'react-native-heroicons/mini'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { StatusBar } from 'react-native'
import { themeColors } from '../../tailwind.config'
import { setDataStorage } from '../utils/asyncStorage'
import { fetchLogin } from '../utils/api'
import { socialMedia } from '../utils/constants'
import { useCertra, useLogin, useNavigation } from '../hooks'
import { Loader } from '../components'

const Login = () => {
  const [user, setUser] = useState('')
  const [password, setPassword] = useState('')

  const [showPassword, setShowPassword] = useState(false)
  const [incorrectCredentials, setIncorrectCredentials] = useState(false)
  const [requiredFields, setRequiredFields] = useState({
    user: false,
    password: false,
  })

  const { icon } = themeColors
  const { loadingAuth, setLoadingAuth, setMyUser, setLogin, checkLocationPermission } = useLogin()
  const { getProducts } = useCertra()
  const navigation = useNavigation()
  const textInputRefUser = useRef<TextInput | null>(null)
  const textInputRefPassword = useRef<TextInput | null>(null)

  // Start login
  useEffect(() => {
    checkLocationPermission()
  }, [])
  
  // -----------------------------------------------
  // SCREEN
  // -----------------------------------------------
  
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

    setLoadingAuth(true)
    setIncorrectCredentials(false)

    // api call
    const res = await fetchLogin({ usuario: user, password })
    const dataUser = res[0]

    if (res?.message) { // incorrect credentials
      setLoadingAuth(false)
      setIncorrectCredentials(true)
    } else { 
      setIncorrectCredentials(false)

      setMyUser({
        ...dataUser,
        access: {
          customerAccess: dataUser?.cliente ? true : false,
          labAccess: dataUser?.clipro ? true : false,
          salespersonAccess: dataUser?.clipro === '' ? true : false
        }
      })
      
      await setDataStorage('myUser', {
        ...dataUser,
        access: {
          customerAccess: dataUser?.cliente ? true : false,
          labAccess: dataUser?.clipro ? true : false,
          salespersonAccess: dataUser?.clipro === '' ? true : false
        }
      })
      await setDataStorage('login', true)
      
      setLogin(true)
      setLoadingAuth(false)
      setShowPassword(false)
      getProducts()
      navigation.navigate('Home')
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
                <TextInput className='w-full pl-5 text-typography' style={{ fontSize: wp(4.5) }}
                  ref={textInputRefUser}
                  placeholder='Usuario'
                  placeholderTextColor='#999999'
                  value={user}
                  onChangeText={setUser}
                />
              </View>

              {requiredFields.user && (
                <View className='pl-4 pt-1'>
                  <Text className='font-bold text-white' style={{ fontSize: wp(4) }}>* Campo obligatorio</Text>
                </View>
              )}
            </View>

            {/* password */}
            <View>
              <View className='flex-row items-center rounded-2xl py-2 bg-white'>
                <TextInput className='w-full pl-5 text-typography' style={{ fontSize: wp(4.5) }}
                  ref={textInputRefPassword}
                  secureTextEntry={!showPassword}
                  placeholder='Contraseña'
                  placeholderTextColor='#999999'
                  value={password}
                  onChangeText={setPassword}
                />
                {!showPassword && (
                  <TouchableOpacity onPress={() => setShowPassword(true)} className='absolute right-4'>
                    <EyeIcon size={30} color={icon} />
                  </TouchableOpacity>
                )}
                {showPassword && (
                  <TouchableOpacity onPress={() => setShowPassword(false)} className='absolute right-4'>
                    <EyeSlashIcon size={30} color={icon} />
                  </TouchableOpacity>
                )}
              </View>

              {requiredFields.password && (
                <View className='pl-4 pt-1'>
                  <Text className='font-bold text-white' style={{ fontSize: wp(4) }}>* Campo obligatorio</Text>
                </View>
              )}
            </View>

            {/* Incorrect Credentials */}
            {incorrectCredentials && (
              <View className='pr-4'>
                <Text className='font-bold text-right text-white' style={{ fontSize: wp(4.5) }}>* Datos incorrectos</Text>
              </View>
            )}

            {/* sign in */}
            <View className='flex flex-col items-center justify-center'>
              <TouchableOpacity onPress={() => auth()} className='flex flex-col justify-center items-center rounded-xl p-1.5 w-36 bg-green'>
                {!loadingAuth && (
                  <View className='flex flex-col items-center justify-center h-6'>
                    <Text className='font-medium text-center text-black' style={{ fontSize: wp(4.5) }}>
                      Iniciar Sesión
                    </Text>
                  </View>
                )}

                {loadingAuth && (
                  <View className='flex flex-col items-center justify-center h-6'>
                    <Loader color='white' size={24} />
                  </View>
                )}
              </TouchableOpacity>
            </View>

          </View>
        </View>

        {/* social media */}
        <View className='flex justify-center items-center pt-8 space-x-5'>
          <FlatList
            data={socialMedia}
            numColumns={1}
            horizontal={true}
            showsVerticalScrollIndicator={false}
            renderItem={({item: {url, image, id}}) => {
              const isLast = socialMedia.length === id
              const noMargin = `${isLast ? 'mr-0' : 'mr-3'}`
              return (
                <TouchableOpacity key={id} onPress={() => { Linking.openURL(`${url}`) }} 
                  style={{ width: wp(8), height: wp(10) }}
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