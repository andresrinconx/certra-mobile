import { ActivityIndicator } from 'react-native'
import { theme } from '../styles'

const LoaderHome = () => {
  return (
    <ActivityIndicator size='large' color={theme.azul} />
  )
}

export default LoaderHome