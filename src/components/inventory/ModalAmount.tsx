import { useState, useRef } from 'react'
import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import { Modal } from 'native-base'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import useLogin from '../../hooks/useLogin'
import useCertra from '../../hooks/useCertra'
import { ProductCartInterface } from '../../utils/interfaces'

const ModalAmount = ({
  stateModal,
  setStateModal,
  codigo,
  amount,
  maxAmount
}: {
  stateModal: boolean, 
  setStateModal: (value: boolean) => void
  codigo: string
  amount: number
  maxAmount: number
}) => {
  const [amountInput, setAmountInput] = useState('')
  const [disableAcept, setDisableAcept] = useState(true)

  const { themeColors: { list, turquoise, typography, primary, green, processBtn } } = useLogin()
  const { productsCart, setProductsCart, addToCart } = useCertra()
  const initialRef = useRef(null)

  return (
    <Modal isOpen={stateModal} initialFocusRef={initialRef}>
      <Modal.Content style={{ width: wp(89), paddingHorizontal: 25, paddingVertical: 20, borderRadius: 25 }}>

        <Text className='text-center mb-3' style={{ fontSize: wp(5), color: typography }}>Cantidad</Text>

        {/* input */}
        <View className='w-full rounded-xl mb-4' style={{ backgroundColor: list }}>
          <TextInput className='h-12 text-center rounded-xl' style={{ color: turquoise, fontSize: wp(5) }}
            keyboardType='numeric'
            onChangeText={text => {
              if (Number(text) < 1 || Number(text) > maxAmount) { // no acept
                setDisableAcept(true)
              } else if ( 
                // igual, mayor o menor (y no es cero)
                amount === Number(text) || 
                amount < Number(text) || 
                amount > Number(text) && Number(text) !== 0
              ) {
                setDisableAcept(false)
                setAmountInput(text.replace(/-/g, ''))
              }
            }}
            selectionColor={primary}
          />
        </View>
        
        {/* btns */}
        <View className='flex flex-row items-center justify-between'>
          <View style={{ backgroundColor: green }} className='flex justify-center w-[48%] rounded-xl'>
            <TouchableOpacity onPress={() => {
              setStateModal(false)
              setDisableAcept(true)
              setAmountInput(String(amount))
            }}>
              <Text style={{ fontSize: wp(4.5) }} className='py-2 text-center font-bold text-white'>
                Cancelar
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ backgroundColor: `${disableAcept ? processBtn : green}` }} className='flex justify-center w-[48%] rounded-xl'>
            <TouchableOpacity disabled={disableAcept} onPress={() => {
              // not in cart (add)
              const productInCart = productsCart.find((product) => product.codigo === codigo)
              if (!productInCart) {
                addToCart(codigo, Number(amountInput))
                setStateModal(false)
                setDisableAcept(true)
                return
              }

              // in cart (update)
              const updatedProductsCart = productsCart.map(item => {
                if (item.codigo === codigo) {
                  return { ...item, amount: Number(amountInput) }
                } else {
                  return { ...item }
                }
              })
              setProductsCart(updatedProductsCart as ProductCartInterface[])
              setStateModal(false)
              setDisableAcept(true)
            }}>
              <Text style={{ fontSize: wp(4.5) }} className='py-2 text-center font-bold text-white'>
                Aceptar
              </Text>
            </TouchableOpacity>
          </View>
        </View>

      </Modal.Content>
    </Modal>
  )
}

export default ModalAmount