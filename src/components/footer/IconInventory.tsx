import { useState } from 'react'
import { Pressable, Image, Text } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import ModalSelectCustomer from '../elements/ModalSelectCustomer'
import useLogin from '../../hooks/useLogin'

const IconInventory = () => {
  const [modalSelectCustomer, setModalSelectCustomer] = useState(false)

  const navigation = useNavigation()
  const { myUser: { access: { labAccess, salespersonAccess }, customer } } = useLogin()

  return (
    <>
      <Pressable className='w-full h-full flex flex-col items-center justify-center'
        onPress={() => {
          if ((labAccess || salespersonAccess) && !customer) {
            setModalSelectCustomer(true)
            return
          }

          navigation.navigate('Inventory')
        }}
      >
        <Image style={{ width: wp(7), height: wp(7) }} resizeMode='cover'
          source={require('../../assets/inventory.png')}
        />
        <Text className='w-9 text-[8px] text-center text-white font-bold'>Inventario</Text>
      </Pressable>

      <ModalSelectCustomer 
        stateModal={modalSelectCustomer} setStateModal={setModalSelectCustomer}
      />
    </>
  )
}

export default IconInventory