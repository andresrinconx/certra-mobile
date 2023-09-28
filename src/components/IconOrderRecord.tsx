import { useNavigation } from '@react-navigation/native'
import { TouchableOpacity, Text, Image } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { useDisclose, Actionsheet } from 'native-base'
import { CreditCardIcon } from 'react-native-heroicons/solid'
import useLogin from '../hooks/useLogin'

const IconOrderRecord = () => {
  const { isOpen, onOpen, onClose } = useDisclose()

  const navigation = useNavigation()
  const { themeColors: { background }, myUser } = useLogin()

  return (
    <>
      <TouchableOpacity onPress={() => {
        if (myUser.from === 'scli') {
          navigation.navigate('OrderRecord')
        } else {
          onOpen()
        }
      }} className='flex flex-col items-center'>
        <Image style={{ width: wp(6), height: wp(6) }} resizeMode='cover'
          source={require('../assets/history.png')}
        />
        <Text className='w-9 text-[8px] text-center text-white font-bold'>Historial</Text>
      </TouchableOpacity>

      {/* Action Sheet */}
      <Actionsheet isOpen={isOpen} onClose={onClose} size="full">
        <Actionsheet.Content style={{ backgroundColor: background }} height={wp(45)}>
          <Actionsheet.Item bgColor={background} 
            startIcon={<CreditCardIcon size={30} color='gray' />}
            onPress={() => navigation.navigate('OrderRecord')}
          >
            Delete
          </Actionsheet.Item>
          <Actionsheet.Item bgColor={background} 
            startIcon={<CreditCardIcon size={30} color='gray' />}
            onPress={() => ''}
          >
            Share
          </Actionsheet.Item>
        </Actionsheet.Content>
      </Actionsheet>
    </>
  )
}

export default IconOrderRecord