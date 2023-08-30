import { ActivityIndicator } from 'react-native'
import { theme } from '../../styles'

const Loader = ({color, size}: {color?: string, size?: number}) => {
  return (
    <ActivityIndicator size={size ? size : "large"} color={`${color ? color : theme.azul}`} />
  )
}

export default Loader