import { View } from 'react-native'

const Divider = ({ marginY }: { marginY?: number }) => {
  return (
    <View className='border-t-[0.5px] border-t-[#999999]' style={{ marginVertical: marginY }} />
  )
}

export default Divider