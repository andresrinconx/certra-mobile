import { useNavigation } from '@react-navigation/native'
import { TouchableOpacity, Text, Image, TouchableHighlight, View } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { useDisclose, Actionsheet } from 'native-base'
import { CreditCardIcon } from 'react-native-heroicons/solid'
import useLogin from '../hooks/useLogin'

const IconOrderRecord = () => {
  const { isOpen, onOpen, onClose } = useDisclose()

  const navigation = useNavigation()
  const { themeColors: { background, typography }, myUser } = useLogin()

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
          <TouchableHighlight onPress={() => ''} className='w-full h-16'
            style={{ backgroundColor: background }}
            underlayColor='#e0e0e0'
          >
            <View className='flex flex-row w-full items-center h-16 pl-3'>
              <CreditCardIcon size={30} color='gray' />
              <Text className='w-full pl-3' style={{ fontSize: wp(4), color: typography }}>Hola</Text>
            </View>
          </TouchableHighlight>

          <TouchableHighlight onPress={() => ''} className='w-full h-16'
            style={{ backgroundColor: background }}
            underlayColor='#e0e0e0'
          >
            <View className='flex flex-row w-full items-center h-16 pl-3'>
              <CreditCardIcon size={30} color='gray' />
              <Text className='w-full pl-3' style={{ fontSize: wp(4), color: typography }}>Hola</Text>
            </View>
          </TouchableHighlight>
        </Actionsheet.Content>
      </Actionsheet>
    </>
  )
}

export default IconOrderRecord