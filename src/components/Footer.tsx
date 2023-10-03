import { View } from 'react-native'
import useInv from '../hooks/useInv'
import useLogin from '../hooks/useLogin'
import IconCart from '../components/IconCart'
import IconSearchProducts from '../components/IconSearchProducts'
import IconProfile from '../components/IconProfile'
import IconItinerary from '../components/IconItinerary'
import IconOrderRecord from './IconOrderRecord'

const Footer = () => {
  const { flowControl } = useInv()
  const { themeColors: { primary }, myUser } = useLogin()

  return (
    <View className='flex flex-row justify-between items-center h-16' style={{ backgroundColor: primary }}>

      {/* left */}
      <View className='flex flex-row items-center gap-3 pl-3'>
        <View><IconProfile /></View>
        <View className='h-8 border-l-[0.8px] border-l-white' />
        {myUser.from === 'usuario' ? (
          <View><IconItinerary /></View>
        ):null}
        <View><IconOrderRecord /></View>
      </View>

      {/* right */}
      <View className='flex flex-row items-center h-full pr-3'>
        {flowControl?.showProducts && (<View><IconSearchProducts /></View>)}
        {flowControl?.showProducts && (<View className='ml-2'><IconCart /></View>)}
      </View>

    </View>
  )
}

export default Footer