import React from 'react'
import { View, TouchableOpacity } from 'react-native'
import { ArrowLeftOnRectangleIcon } from 'react-native-heroicons/solid'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage';

const LogOut = ({setCart}) => {
  const navigation = useNavigation()
  
  const logOut = async () => {
    await AsyncStorage.setItem('login', JSON.stringify(false))
    setCart([])
    navigation.navigate('Login')
  }

  return (
    <TouchableOpacity onPressOut={() => logOut()}>
      <View>
        <ArrowLeftOnRectangleIcon size={30} color='white' />
      </View>
    </TouchableOpacity>
  )
}

export default LogOut