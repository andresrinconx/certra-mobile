import { useState } from 'react'
import { Pressable, Image, Text } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { useNavigation, useLogin } from '../../hooks'
import { ModalInfo } from '..'

const IconSearchProducts = () => {
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

          navigation.navigate('SearchProducts')
        }}
      >
        <Image style={{ width: wp(7), height: wp(7) }} resizeMode='cover'
          source={require('../../assets/search.png')}
        />
        <Text className='text-[9.5px] text-center font-normal text-white'>Productos</Text>
      </Pressable>

      <ModalInfo 
        stateModal={modalSelectCustomer} 
        setStateModal={setModalSelectCustomer}
        message='Debes seleccionar un cliente para continuar.'
        cancelButtonText='Cancelar'
        aceptButtonText='Aceptar'
        onPressAcept={() => navigation.navigate('SearchCustomer')}
      />
    </>
  )
}

export default IconSearchProducts