import { useState } from 'react'
import { View, Text, Pressable, Image } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import useCertra from '../../hooks/useCertra'
import useLogin from '../../hooks/useLogin'
import useNavigation from '../../hooks/useNavigation'
import { ModalInfo } from '..'

const IconCart = ({ showText, blueCart }: { showText?: boolean, blueCart?: boolean }) => {
  const [modalSelectCustomer, setModalSelectCustomer] = useState(false)

  const { themeColors: { green }, myUser: { access: { labAccess, salespersonAccess }, customer } } = useLogin()
  const { productsCart } = useCertra()
  const navigation = useNavigation()

  return (
    <>
      <Pressable className={`${showText ? 'w-full h-full flex flex-1 flex-col items-center justify-center' : ''}`}
        onPress={() => {
          if ((labAccess || salespersonAccess) && !customer) {
            setModalSelectCustomer(true)
            return
          }

          navigation.navigate('Cart')
        }}
      >
        <View>
          <Image style={{ width: wp(7), height: wp(7) }} resizeMode='cover'
            source={blueCart ? require('../../assets/cart-blue.png') : require('../../assets/cart.png')}
          />
          {productsCart?.length > 0
            && (
              <View className='flex flex-row justify-center items-center absolute -top-1 -right-1 w-4 h-4 rounded-full'
                style={{ backgroundColor: green }}
              >
                <Text className='w-full text-center color-black text-[10px]'>
                  {productsCart?.length}
                </Text>
              </View>
            )
          }
        </View>
        {showText && (
          <Text className='w-8 text-[8px] text-center text-white font-normal'>Carrito</Text>
        )}
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

export default IconCart