import { View } from 'react-native'
import useInv from '../hooks/useInv'
import useLogin from '../hooks/useLogin'
import IconCart from '../components/IconCart'
import IconLogOut from '../components/IconLogOut'
import IconSearchProducts from '../components/IconSearchProducts'
import IconProfile from '../components/IconProfile'
import IconItinerary from '../components/IconItinerary'

const Footer = () => {
  const { flowControl } = useInv()
  const { themeColors: { primary, green } } = useLogin()

  return (
    <View className='flex flex-row justify-between items-center h-16' style={{ backgroundColor: primary }}>

      {/* left */}
      <View className='flex flex-row items-center gap-3 pl-3'>
        <View><IconProfile /></View>
        {flowControl?.showItinerary && flowControl?.showProducts ? (
          <View className='h-8 border-l-[0.8px] border-l-white' />
        ):null}
        {flowControl?.showItinerary && flowControl?.showProducts ? (
          <View><IconItinerary /></View>
        ):null}
      </View>

      {/* right */}
      <View className='flex flex-row items-center h-full'>
        {flowControl?.showProducts && (<View><IconSearchProducts /></View>)}
        {flowControl?.showProducts && (<View className='ml-2'><IconCart /></View>)}

        <View className='h-full w-20 flex justify-center items-center ml-5' style={{ backgroundColor: green }}>
          <IconLogOut />
        </View>
      </View>

    </View>
  )
}

export default Footer