import { View, Text, TextInput, TouchableOpacity, Alert, Image } from 'react-native'
import React, {useState, useEffect} from 'react'
import { useNavigation } from '@react-navigation/native'
import LinearGradient from 'react-native-linear-gradient'
import { KeyIcon, UserIcon } from 'react-native-heroicons/outline'

import { globalStyles, theme } from '../styles'
import AsyncStorage from '@react-native-async-storage/async-storage'

const Login = () => {
  const [usuario, setUsuario] = useState('')
  const [password, setPassword] = useState('')
  const [users, setUsers] = useState([])

  const navigation = useNavigation()

  // obtener usuarios db
  useEffect(() => {
    const getUsers = async () => {
      const url = 'http://192.168.88.235:4000/'
    
      try {
        const response = await fetch(url)
        const result = await response.json()
        setUsers(result)
      } catch (error) {
        console.log(error)
      }
    }
    getUsers()
  }, [])

  // autenticar usuario
  const auth = async () => {
    // campos obligatorios
    if([usuario, password].includes('')) {
      Alert.alert(
        'Error',
        'Todos los campos son obligatorios',
        [
          { text: 'OK' },
        ]
      )
      return
    }

    // encontrar en la db
    const user = users.find(user => user.us_codigo === usuario && user.us_clave === password);
    if (user === undefined) {
      Alert.alert(
        'Error',
        'Usuario y contraseña incorrectos',
        [
          { text: 'OK' },
        ]
      )
      return
    }

    await AsyncStorage.setItem('login', JSON.stringify(true))
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
            <TextInput className='text-xl p-4 ml-3 w-[85%]'
              placeholder='Usuario'
              value={usuario}
              onChangeText={setUsuario}
            />
            <View className='absolute right-4'>
              <UserIcon size={25} color='black' />
            </View>
          </View>

          <View className='bg-white w-[340px] rounded-full flex-row items-center'>
            <TextInput className='text-xl p-4 ml-3 w-[85%]'
              secureTextEntry={true}
              placeholder='Contraseña'
              value={password}
              onChangeText={setPassword}
            />
            <View className='absolute right-4'>
              <KeyIcon size={25} color='black' />
            </View>
          </View>

          <TouchableOpacity onPress={() => auth()} className={`w-[340px] top-8 p-3 rounded-full`}
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