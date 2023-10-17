import { useState } from 'react'
import { Pressable, Image, Text } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import useLogin from '../../hooks/useLogin'
import useNavigation from '../../hooks/useNavigation'
import { ModalInfo } from '..'

const IconInventory = () => {
  const [modalSelectCustomer, setModalSelectCustomer] = useState(false)
  
  const { myUser: { access: { labAccess, salespersonAccess }, customer } } = useLogin()
  const navigation = useNavigation()

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
        <Text className='w-9 text-[8px] text-center text-white font-bold'>Productos</Text>
      </Pressable>

      <ModalInfo 
        stateModal={modalSelectCustomer} 
        setStateModal={setModalSelectCustomer}
        message='Debes seleccionar un cliente para continuar.'
        cancelButtonText='Cancelar'
        aceptButtonText='Aceptar'
        onPressAcept={() => navigation.navigate('Customer')}
      />
    </>
  )
}

export default IconInventory