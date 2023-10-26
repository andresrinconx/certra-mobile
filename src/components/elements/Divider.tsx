import { View } from 'react-native'

const Divider = ({ marginY }: { marginY?: number }) => {
  return (
    <View className='border-t-[0.5px] border-t-placeholder' style={{ marginVertical: marginY }} />
  )
}

export default Divider