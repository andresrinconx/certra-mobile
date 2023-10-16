import { useState } from 'react'
import { Pressable, Text, Image } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import useInv from '../../hooks/useInv'
import useLogin from '../../hooks/useLogin'
import useNavigation from '../../hooks/useNavigation'
import { ModalInfo } from '..'

const IconOrderRecord = () => {
  const [modalSelectCustomer, setModalSelectCustomer] = useState(false)

  const navigation = useNavigation()
  const { myUser: { access: { labAccess, salespersonAccess }, customer } } = useLogin()
  const { setLookAtPharmacy } = useInv()

  return (
    <>
      <Pressable onPress={() => {
        if ((labAccess || salespersonAccess) && !customer) {
          setModalSelectCustomer(true)
        } else if ((labAccess || salespersonAccess) && customer) {
          setLookAtPharmacy(true)
          navigation.navigate('OrderRecord')
        } else {
          navigation.navigate('OrderRecord')
        }
      }} className='w-full h-full flex flex-col items-center justify-center'>
        <Image style={{ width: wp(7), height: wp(7) }} resizeMode='cover'
          source={require('../../assets/history.png')}
        />
        <Text className='w-9 text-[8px] text-center text-white font-bold'>Historial</Text>
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

export default IconOrderRecord