import { View, ActivityIndicator} from 'react-native'
import React from 'react'
import { theme } from '../styles'

const Loading = () => {
  return (
    <ActivityIndicator size='large' color={theme.azul} />
  )
}

export default Loading