import { View } from 'react-native'
import useInv from '../hooks/useInv'
import useLogin from '../hooks/useLogin'
import IconCart from '../components/IconCart'
import IconSearchProducts from '../components/IconSearchProducts'
import IconProfile from '../components/IconProfile'
import IconItinerary from '../components/IconItinerary'
import IconHistory from './IconHistory'

const Footer = () => {
  const { flowControl } = useInv()
  const { themeColors: { primary, green }, myUser } = useLogin()

  return (
    <View className='flex flex-row justify-between items-center h-16' style={{ backgroundColor: primary }}>

      {/* left */}
      <View className='flex flex-row items-center gap-3 pl-3'>
        <View><IconProfile /></View>
        {(flowControl?.showItinerary || myUser.from === 'usuario-clipro' || 'scli') && flowControl?.showProducts ? (
          <View className='h-8 border-l-[0.8px] border-l-white' />
        ):null}
        {flowControl?.showItinerary && flowControl?.showProducts ? (
          <View><IconItinerary /></View>
        ):null}
        {flowControl?.showProducts ? (
          <View><IconHistory /></View>
        ):null}
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