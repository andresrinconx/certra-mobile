import { ActivityIndicator } from 'react-native'

const Loader = ({color, size}: {color?: string, size?: number}) => {
  return (
    <ActivityIndicator size={size ? size : "large"} color={`${color ? color : '#006283'}`} />
  )
}

export default Loader