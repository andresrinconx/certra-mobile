import { View } from 'react-native'
import useLogin from '../../hooks/useLogin'
import IconCart from './IconCart'
import IconInventory from './IconInventory'
import IconProfile from './IconProfile'
import IconItinerary from './IconItinerary'
import IconOrderRecord from './IconOrderRecord'

const Footer = () => {
  const { themeColors: { primary }, myUser: { access: { salespersonAccess } } } = useLogin()

  return (
    <View className='flex flex-row justify-around items-center h-16' style={{ backgroundColor: primary }}>
      <View className='h-full flex flex-1 flex-col items-center justify-center'><IconProfile /></View>
      {salespersonAccess && (
        <View className='h-full flex flex-1 flex-col items-center justify-center'><IconItinerary /></View>
      )}
      <View className='h-full flex flex-1 flex-col items-center justify-center'><IconOrderRecord /></View>
      <View className='h-full flex flex-1 flex-col items-center justify-center'><IconInventory /></View>
      <View className='h-full flex flex-1 flex-col items-center justify-center'><IconCart showText /></View>
    </View>
  )
}

export default Footer