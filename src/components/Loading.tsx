import { ActivityIndicator} from 'react-native'
import { theme } from '../styles'

const Loading = () => {
  return (
    <ActivityIndicator size='large' color={theme.azul} />
  )
}

export default Loading