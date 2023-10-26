import { useState, useRef } from 'react'
import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import { Modal } from 'native-base'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { ProductCartInterface } from '../../utils/interfaces'
import { useCertra } from '../../hooks'
import { themeColors } from '../../../tailwind.config'

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

  const { darkTurquoise } = themeColors
  const { productsCart, setProductsCart, addToCart } = useCertra()
  const initialRef = useRef(null)

  return (
    <Modal isOpen={stateModal} initialFocusRef={initialRef}>
      <Modal.Content style={{ width: wp(89), paddingHorizontal: 25, paddingVertical: 20, borderRadius: 25 }}>

        <Text className='text-center mb-3 text-typography' style={{ fontSize: wp(5) }}>Cantidad</Text>

        {/* input */}
        <View className='w-full rounded-xl mb-4 bg-list'>
          <TextInput className='h-12 text-center rounded-xl text-turquoise' style={{ fontSize: wp(5) }}
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
            selectionColor={darkTurquoise}
          />
        </View>
        
        {/* btns */}
        <View className='flex flex-row items-center justify-between'>
          <View className='flex justify-center w-[48%] rounded-xl bg-green'>
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

          <View className={`flex justify-center w-[48%] rounded-xl ${disableAcept ? 'bg-processBtn' : 'bg-green'}`}>
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