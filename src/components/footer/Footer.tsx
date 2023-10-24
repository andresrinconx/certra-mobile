import { View } from 'react-native'
import useLogin from '../../hooks/useLogin'
import { IconCart, IconSearchProducts, IconProfile, IconItinerary, IconOrderRecord } from '..'

const Footer = () => {
  const { themeColors: { primary }, myUser: { access: { salespersonAccess } } } = useLogin()

  return (
    <View className='flex flex-row justify-around items-center h-16' style={{ backgroundColor: primary }}>
      <View className='h-full flex flex-1 flex-col items-center justify-center'><IconProfile /></View>
      {salespersonAccess && (
        <View className='h-full flex flex-1 flex-col items-center justify-center'><IconItinerary /></View>
      )}
      <View className='h-full flex flex-1 flex-col items-center justify-center'><IconOrderRecord /></View>
      <View className='h-full flex flex-1 flex-col items-center justify-center'><IconSearchProducts /></View>
      <View className='h-full flex flex-1 flex-col items-center justify-center'><IconCart showText /></View>
    </View>
  )
}

export default Footer