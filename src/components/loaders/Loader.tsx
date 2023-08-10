import { ActivityIndicator } from 'react-native'
import { theme } from '../../styles'

const Loader = () => {
  return (
    <ActivityIndicator size='large' color={theme.azul} />
  )
}

export default Loader