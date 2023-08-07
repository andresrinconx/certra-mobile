import React from 'react'
import { View, TouchableOpacity } from 'react-native'
import { ArrowLeftOnRectangleIcon } from 'react-native-heroicons/solid'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import useInv from '../hooks/useInv';

const LogOut = () => {
  const {setCart} = useInv()
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