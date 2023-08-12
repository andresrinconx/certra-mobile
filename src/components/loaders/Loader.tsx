import { ActivityIndicator } from 'react-native'
import { theme } from '../../styles'

const Loader = ({color}: {color?: string}) => {
  return (
    <ActivityIndicator size='large' color={`${color ? color : theme.azul}`} />
  )
}

export default Loader