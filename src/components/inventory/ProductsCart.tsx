import { useState, useEffect, useRef } from 'react'
import { View, Text, TouchableOpacity, FlatList, Pressable, TextInput } from 'react-native'
import { XMarkIcon } from 'react-native-heroicons/outline'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { AlertDialog, Button, Modal } from 'native-base'
import { useNavigation } from '@react-navigation/native'
import { disponibility } from '../../utils/constants'
import { ProductInterface } from '../../utils/interfaces'
import useInv from '../../hooks/useInv'
import useLogin from '../../hooks/useLogin'
import { twoDecimalsPrice } from '../../utils/helpers'
import { setDataStorage } from '../../utils/asyncStorage'
import ModalInfo from '../elements/ModalInfo'

const ProductsCart = ({ product }: { product: ProductInterface }) => {
  const [added, setAdded] = useState(true)
  const [amount, setAmount] = useState(1)
  const [amountInput, setAmountInput] = useState('')
  const [maxAmount, setMaxAmount] = useState(0)
  const [touch, setTouch] = useState(false)

  const [discount, setDiscount] = useState(0)
  const [discountInput, setDiscountInput] = useState('')
  
  const [alertRemoveElement, setAlertRemoveElement] = useState(false)
  const [openAmountModal, setOpenAmountModal] = useState(false)
  const [openDiscountModal, setOpenDiscountModal] = useState(false)
  const [disableAcept, setDisableAcept] = useState(false)
  const [modalInfo, setModalInfo] = useState(false)
  
  const { themeColors: { typography, lightList, darkTurquoise, green, turquoise, icon, primary, list, processBtn }, myUser: { deposito, access: { labAccess } } } = useLogin()
  const { removeElement, productsCart, setProductsCart } = useInv()
  const { descrip, precio1, codigo, centro, merida, oriente, base1 } = product
  const cancelRef = useRef(null)
  const initialRef = useRef(null)
  const navigation = useNavigation()

  const onCloseAlertRemoveElement = () => setAlertRemoveElement(false)

  // -----------------------------------------------
  // ACTIONS
  // -----------------------------------------------

  // Get max amount
  useEffect(() => {
    if (maxAmount === 0) {
      if (merida || centro || oriente) {
        if (deposito) {
          if (deposito === 'MERIDA') {
            setMaxAmount(parseInt(String(merida)) + parseInt(String(centro)))
          } else if (deposito === 'CARACAS') {
            setMaxAmount(parseInt(String(merida)) + parseInt(String(centro)) + parseInt(String(oriente)))
          } else if (deposito === 'ORIENTE') {
            setMaxAmount(parseInt(String(centro)) + parseInt(String(oriente)))
          }
        } else {
          setMaxAmount(parseInt(String(merida)) + parseInt(String(centro)) + parseInt(String(oriente)))
        }
      }
    }
  }, [])

  // Refresh data when cart change
  useEffect(() => {
    const productInCart = productsCart.find(productInCart => productInCart.codigo === codigo)
    if (productInCart !== undefined) { 

      // product in cart
      setAdded(true)
      setAmount(productInCart.amount)
      setAmountInput(String(productInCart.amount))
      setDiscount(Number(productInCart.discount))
      setDiscountInput('')
    } else {

      // product not in cart
      setAdded(false)
      setAmount(1)
      setAmountInput(String(1))
      setDiscount(0)
      setDiscountInput(String(0))
    }
  }, [productsCart])

  // Add or remove element from cart
  useEffect(() => {
    if(!added && touch) {
      if (productsCart.find(productInCart => productInCart.codigo === codigo)) {
        setTouch(false)
        removeElement(codigo)
      }
    }
  }, [added])

  // -----------------------------------------------
  // AMOUNT
  // -----------------------------------------------

  // Change amount
  useEffect(() => {
    const productInCart = productsCart.find(item => item.codigo === codigo)

    if (productInCart) {
      if ( 
        // NaN, 0, or higher than maxAmount
        Number(amountInput) < 1 ||
        Number(amountInput) > maxAmount
      ) {
        setDisableAcept(true)
      } else if ( 
        // igual, mayor o menor (y no es cero)
        productInCart.amount === Number(amountInput) || 
        productInCart.amount < Number(amountInput) || 
        productInCart.amount > Number(amountInput) && Number(amountInput) !== 0
      ) {
        setDisableAcept(false)
      }
    }
  }, [amountInput])
  
  // Btn acept
  const acept = () => {
    const updatedProductsCart = productsCart.map(item => {
      if (item.codigo === codigo) {
        const cleanCantidad = parseInt(String(amountInput).replace(/-/g, ''))

        return { ...item, amount: cleanCantidad }
      } else {
        return { ...item }
      }
    })
    setProductsCart(updatedProductsCart)
    setOpenAmountModal(false)
  }

  // -----------------------------------------------
  // DISCOUNT
  // -----------------------------------------------

  useEffect(() => {
    const productInCart = productsCart.find(item => item.codigo === codigo)

    if (productInCart) {
      if (Number(discountInput) < 0 || Number(discountInput) > 99) {
        setDisableAcept(true)
      } else {
        setDisableAcept(false)
      }
    }
  }, [discountInput])

  const aceptDiscount = () => {
    const updatedProductsCart = productsCart.map(item => {
      if (item.codigo === codigo) {
        const cleanDiscount = parseInt(String(discountInput).replace(/-/g, ''))

        return { ...item, discount: isNaN(cleanDiscount) ? '0' : String(cleanDiscount) }
      } else {
        return { ...item }
      }
    })
    setProductsCart(updatedProductsCart)
    setOpenDiscountModal(false)
    if (Number(discountInput) >= 20) {
      setModalInfo(true)
    }
  }

  // -----------------------------------------------
  // HANDLERS
  // -----------------------------------------------

  const handleRemoveElement = async () => {
    if (productsCart?.length === 1) {
      await setDataStorage('linealDiscount', '0')
      setProductsCart([])
    }

    setAdded(false)
    setAmount(1)
    setTouch(true)
    setAlertRemoveElement(false)
  }

  return (
    <>
      {added && (
        <View className='flex flex-col mb-3 p-2 rounded-2xl' style={{ backgroundColor: lightList }}>

          {/* descrip & remove */}
          <View className='flex flex-row items-center justify-between'>
            
            {/* descrip */}
            <Pressable onPress={() => navigation.navigate('Product', { ...product })}>
              <Text style={{ fontSize: wp(4), color: typography, width: wp(70) }} className='font-bold' numberOfLines={1}>
                {descrip}
              </Text>
            </Pressable>

            <View className='pl-5'>
              <TouchableOpacity onPress={() => setAlertRemoveElement(true)} className='flex flex-row items-center justify-center rounded-md w-7 h-7'>
                <XMarkIcon size={20} color={icon} strokeWidth={3} />
              </TouchableOpacity>
            </View>
          </View>

          {/* info */}
          <View className='flex flex-row justify-center'>

            {/* left info */}
            <View className='w-1/2 pr-2 my-2'>

              {/* disponibility */}
              <View className='mb-2'>
                <Text style={{ fontSize: hp(1.6), color: typography }} className='pb-0.5 font-bold'>
                  Disponibilidad:
                </Text>

                {/* sedes */}
                <View className='px-3'>
                  <FlatList
                    data={disponibility}
                    horizontal={true}
                    contentContainerStyle={{
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item: { id, name } }) => {
                      return (
                        <>
                          {deposito === 'MERIDA' ? (
                            <View key={id} className='flex flex-col items-center'>
                              <Text style={{ fontSize: hp(1.5), color: darkTurquoise }} className='w-10 text-center font-bold'>
                                {name === 'Oriente' ? '' : name}
                              </Text>

                              <Text style={{ fontSize: hp(1.6), color: typography }} className='text-center font-bold'>
                                {
                                  name === 'Mérida' ? parseInt(String(merida)) :
                                  name === 'Centro' ? parseInt(String(centro)) : null
                                }
                              </Text>
                            </View>
                          ) : 
                            deposito === 'CARACAS' ? (
                              <View key={id} className='flex flex-col items-center'>
                                <Text style={{ fontSize: hp(1.5), color: darkTurquoise }} className='w-10 text-center font-bold'>
                                  {name}
                                </Text>

                                <Text style={{ fontSize: hp(1.6), color: typography }} className='text-center font-bold'>
                                  {
                                    name === 'Mérida' ? parseInt(String(merida)) :
                                    name === 'Centro' ? parseInt(String(centro)) :
                                    name === 'Oriente' ? parseInt(String(oriente)) : null
                                  }
                                </Text>
                              </View>
                            ) : (
                              deposito === 'ORIENTE' ? (
                                <View key={id} className='flex flex-col items-center'>
                                  <Text style={{ fontSize: hp(1.5), color: darkTurquoise }} className='w-10 text-center font-bold'>
                                    {name === 'Mérida' ? '' : name}
                                  </Text>

                                  <Text style={{ fontSize: hp(1.6), color: typography }} className='text-center font-bold'>
                                    {
                                      name === 'Centro' ? parseInt(String(centro)) :
                                      name === 'Oriente' ? parseInt(String(oriente)) : null
                                    }
                                  </Text>
                                </View>
                              ) : (
                                <View key={id} className='flex flex-col items-center'>
                                  <Text style={{ fontSize: hp(1.5), color: darkTurquoise }} className='w-10 text-center font-bold'>
                                    {name}
                                  </Text>

                                  <Text style={{ fontSize: hp(1.6), color: typography }} className='text-center font-bold'>
                                    {
                                      name === 'Mérida' ? parseInt(String(merida)) :
                                      name === 'Centro' ? parseInt(String(centro)) :
                                      name === 'Oriente' ? parseInt(String(oriente)) : null
                                    }
                                  </Text>
                                </View>
                              )
                            )
                          }
                        </>
                      )
                    }}
                  />
                </View>
              </View>
            </View>

            {/* right info */}
            <View className='w-1/2 pl-2'>

              {/* price */}
              <View className='flex flex-row justify-between items-center my-2'>

                {/* normal price */}
                <View>
                  <Text style={{ fontSize: hp(1.5), color: typography }} className='font-bold'>
                    Precio:
                  </Text>

                  <Text style={{ fontSize: hp(1.8), color: darkTurquoise }} className='font-bold'>
                    Bs. {twoDecimalsPrice(Number(precio1))}
                  </Text>
                </View>

                {/* discount price */}
                <View>
                  <Text style={{ fontSize: hp(1.5), color: typography }} className='font-bold'>
                    Con desc.:
                  </Text>

                  <Text style={{ fontSize: hp(1.8), color: darkTurquoise }} className='font-bold'>
                    Bs. {twoDecimalsPrice(precio1 - ((base1 * discount) / 100))}
                  </Text>
                </View>
              </View>

              {/* amount and discount */}
              <View className='flex flex-row items-center w-full'
                style={{ justifyContent: !labAccess ? 'center' : 'space-between' }}
              >

                {/* amount */}
                <View>
                  <Text className='font-bold' style={{ fontSize: hp(1.5), color: typography }}>Cantidad</Text>

                  <View style={{ width: wp(!labAccess ? 28 : 18), borderColor: turquoise, borderWidth: .5 }} className='rounded-md'>
                    <TouchableOpacity onPress={() => setOpenAmountModal(true)}>
                      <Text style={{ color: darkTurquoise, fontSize: wp(4.5) }} className='text-center'>
                        {amount}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                
                {/* dcto labs */}
                {labAccess && (
                  <View>
                    <Text className='font-bold' style={{ fontSize: hp(1.5), color: typography }}>Dcto. Labs.</Text>
                    
                    <View style={{ width: wp(18), borderColor: turquoise, borderWidth: .5 }} className='rounded-md'>
                      <TouchableOpacity onPress={() => setOpenDiscountModal(true)}>
                        <Text style={{ color: darkTurquoise, fontSize: wp(4.5) }} className='text-center'>
                          {discount}%
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}

              </View>
            </View>

          {/* info */}
          </View>

        </View>
      )}

      {/* modal amount */}
      <Modal isOpen={openAmountModal} initialFocusRef={initialRef}>
        <Modal.Content style={{ width: 350, paddingHorizontal: 25, paddingVertical: 20, borderRadius: 25 }}>

          <Text className='text-center mb-3' style={{ fontSize: wp(5), color: typography }}>Cantidad</Text>

          {/* input */}
          <View className='w-full rounded-xl mb-4' style={{ backgroundColor: list }}>
            <TextInput className='h-12 text-center rounded-xl' style={{ color: turquoise, fontSize: wp(5) }}
              keyboardType='numeric'
              value={String(amountInput)}
              onChangeText={text => setAmountInput(text)}
              selectionColor={primary}
              autoFocus
            />
          </View>
          
          {/* btns */}
          <View className='flex flex-row items-center justify-between'>
            <View style={{ backgroundColor: green }} className='flex justify-center w-[48%] rounded-xl'>
              <TouchableOpacity onPress={() => {
                setOpenAmountModal(false)
                setAmountInput(String(amount))
              }}>
                <Text style={{ fontSize: wp(4.5) }} className='py-2 text-center font-bold text-white'>
                  Cancelar
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{ backgroundColor: `${disableAcept ? processBtn : green}` }} className='flex justify-center w-[48%] rounded-xl'>
              <TouchableOpacity onPress={() => acept()} disabled={disableAcept}>
                <Text style={{ fontSize: wp(4.5) }} className='py-2 text-center font-bold text-white'>
                  Aceptar
                </Text>
              </TouchableOpacity>
            </View>
          </View>

        </Modal.Content>
      </Modal>

      {/* modal discount */}
      <Modal isOpen={openDiscountModal} initialFocusRef={initialRef}>
        <Modal.Content style={{ width: 350, paddingHorizontal: 25, paddingVertical: 20, borderRadius: 25 }}>

          <Text className='text-center mb-3' style={{ fontSize: wp(5), color: typography }}>Descuento</Text>

          {/* input */}
          <View className='w-full rounded-xl mb-4' style={{ backgroundColor: list }}>
            <TextInput className='h-12 text-center rounded-xl' style={{ color: turquoise, fontSize: wp(5) }}
              keyboardType='numeric'
              value={String(discountInput)}
              onChangeText={text => setDiscountInput(text)}
              selectionColor={primary}
              autoFocus
            />
          </View>
          
          {/* btns */}
          <View className='flex flex-row items-center justify-between'>
            <View style={{ backgroundColor: green }} className='flex justify-center w-[48%] rounded-xl'>
              <TouchableOpacity onPress={() => setOpenDiscountModal(false)}>
                <Text style={{ fontSize: wp(4.5) }} className='py-2 text-center font-bold text-white'>
                  Cancelar
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{ backgroundColor: `${disableAcept ? processBtn : green}` }} className='flex justify-center w-[48%] rounded-xl'>
              <TouchableOpacity onPress={() => aceptDiscount()} disabled={disableAcept}>
                <Text style={{ fontSize: wp(4.5) }} className='py-2 text-center font-bold text-white'>
                  Aceptar
                </Text>
              </TouchableOpacity>
            </View>
          </View>

        </Modal.Content>
      </Modal>

      {/* alert clear cart */}
      <AlertDialog leastDestructiveRef={cancelRef} isOpen={alertRemoveElement} onClose={onCloseAlertRemoveElement}>
        <AlertDialog.Content>
          <AlertDialog.CloseButton />
          <AlertDialog.Header>Eliminar producto</AlertDialog.Header>
          <AlertDialog.Body>
            <Text className='font-normal' style={{ color: typography }}>
              ¿Estás seguro que deseas eliminar este producto del carrito?
            </Text>
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Button.Group space={2}>
              <Button variant='unstyled' colorScheme='coolGray' onPress={onCloseAlertRemoveElement} ref={cancelRef}>
                Cancelar
              </Button>
              <Button color={darkTurquoise} onPress={handleRemoveElement}>
                Aceptar
              </Button>
            </Button.Group>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>

      {/* modal info */}
      <ModalInfo 
        stateModal={modalInfo} 
        setStateModal={setModalInfo}
        message='¡Alerta! Estás aplicando un descuento mayor al 20%'
        aceptButtonText='Aceptar'
      />
    </>
  )
}

export default ProductsCart