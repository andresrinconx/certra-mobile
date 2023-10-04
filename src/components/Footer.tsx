import { View } from 'react-native'
import useLogin from '../hooks/useLogin'
import IconCart from '../components/IconCart'
import IconSearchProducts from '../components/IconSearchProducts'
import IconProfile from '../components/IconProfile'
import IconItinerary from '../components/IconItinerary'
import IconOrderRecord from './IconOrderRecord'

const Footer = () => {
  const { themeColors: { primary }, myUser } = useLogin()

  return (
    <View className='flex flex-row justify-around items-center h-16' style={{ backgroundColor: primary }}>
      <View className='h-full flex flex-1 flex-col items-center justify-center'><IconProfile /></View>
      {myUser.from === 'usuario' && (
        <View className='h-full flex flex-1 flex-col items-center justify-center'><IconItinerary /></View>
      )}
      <View className='h-full flex flex-1 flex-col items-center justify-center'><IconOrderRecord /></View>
      <View className='h-full flex flex-1 flex-col items-center justify-center'><IconSearchProducts /></View>
      <View className='h-full flex flex-1 flex-col items-center justify-center'><IconCart /></View>
    </View>
  )
}

export default Footer