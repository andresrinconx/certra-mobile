import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native'
import React, {useState, useEffect} from 'react'
import LinearGradient from 'react-native-linear-gradient'
import Foundation from 'react-native-vector-icons/Foundation'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Icon from 'react-native-vector-icons/Feather'

import globalStyles from '../../styles'

const Login = ({navigation}) => {
  const [ usuario, setUsuario ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ usersData, setUsersData ] = useState([])
  const [ autenticado, setAutenticado ] = useState(false)

  useEffect(() => {
    const obtenerUsuarios = async () => {
      const url = 'http://192.168.88.201:4000/'
    
      try {
        const response = await fetch(url)
        const result = await response.json()
        setUsersData(result)
      } catch (error) {
        console.log(error)
      }
    }
    obtenerUsuarios()
  }, [])

  const autenticar = () => {
    const user = usersData.find(user => user.us_codigo === usuario && user.us_clave === password);

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

    setAutenticado(true)
    navigation.navigate('Inicio')
  }

  return (
    <>
    <LinearGradient
      colors={['#005D81', '#3E82A0']} // Colores del gradiente
      start={{ x: 0, y: 0 }} // Punto de inicio del gradiente (coordenadas entre 0 y 1)
      end={{ x: 0, y: 1 }} // Punto final del gradiente (coordenadas entre 0 y 1)
      style={{ flex: 1}} // Estilos para el componente
    >
      <View className='top-40 flex-1 items-center'>

        {/* icon */}
        <View>
          <Icon name='user' size={80} color='white'/>
        </View>

        {/* inputs */}
        <View className='top-10'>
          <View className={globalStyles.inputContainer}>
            <TextInput
              className='left-4 basis-[90%]'
              placeholder='Usuario'
              value={usuario}
              onChangeText={setUsuario}
            />
            <View className='right-2'>
              <AntDesign name='user' size={24}/>
            </View>
          </View>

          <View className={`${globalStyles.inputContainer} top-4`}>
            <TextInput
              className='left-4 basis-[90%]'
              secureTextEntry={true}
              placeholder='Contraseña'
              value={password}
              onChangeText={setPassword}
            />
              <View className='right-2'>
                <Foundation name='key' size={24}/>
              </View>
          </View>
        </View>

        <View className='top-24'>
          <TouchableOpacity className='bg-[#2794e8] p-4 rounded-3xl w-48'
            onPress={ () => autenticar() }
          >
            <Text className='color-white font-bold text-lg text-center'>Iniciar Sesion</Text>
          </TouchableOpacity>
        </View>
        
      </View>
    </LinearGradient>
    </>
  )
}

export default Login