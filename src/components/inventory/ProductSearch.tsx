import { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, FlatList, Pressable } from 'react-native'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { CheckIcon, PlusIcon } from 'react-native-heroicons/outline'
import { disponibility } from '../../utils/constants'
import { ProductInterface } from '../../utils/interfaces'
import { currency } from '../../utils/helpers'
import useCertra from '../../hooks/useCertra'
import useLogin from '../../hooks/useLogin'
import useNavigation from '../../hooks/useNavigation'
import ModalAmount from './ModalAmount'

const ProductSearch = ({ product }: { product: ProductInterface }) => {
  const [added, setAdded] = useState(false)
  const [amount, setAmount] = useState(1)
  const [maxAmount, setMaxAmount] = useState(0)

  const [openAmountModal, setOpenAmountModal] = useState(false)
  
  const { themeColors: { typography, lightList, darkTurquoise, green, turquoise, processBtn }, myUser: { deposito } } = useLogin()
  const { descrip, precio1, merida, centro, oriente, codigo, base1, iva } = product
  const { productsCart, addToCart } = useCertra()
  const navigation = useNavigation()

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

  // -----------------------------------------------
  // ACTIONS
  // -----------------------------------------------

  // Refresh data when cart change
  useEffect(() => {
    const productInCart = productsCart.find(productInCart => productInCart.codigo === codigo)
    if (productInCart !== undefined) { 

      // product in cart
      setAdded(true)
      setAmount(productInCart.amount)
    } else {

      // product not in cart
      setAdded(false)
      setAmount(1)
    }
  }, [productsCart])

  // Handle actions
  const handleAddToCart = () => {
    setAdded(true)
    addToCart(codigo, amount)
  }

  return (
    <>
      <View className='flex flex-col mb-3 p-2 rounded-2xl' style={{ backgroundColor: lightList }}>

        {/* descrip */}
        <Pressable onPress={() => navigation.navigate('Product', { ...product })}>
          <Text style={{ fontSize: wp(4), color: typography }} className='font-bold' numberOfLines={1}>
            {descrip}
          </Text>
        </Pressable>

        {/* info */}
        <View className='flex flex-row items-center'>

          {/* left info */}
          <View className='w-1/2 pr-2 -mt-4'>

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
            <View className='relative'>
              <View className='my-2'>
                <Text style={{ fontSize: hp(1.5), color: typography }} className='font-bold'>
                  Precio:
                </Text>

                <Text style={{ fontSize: hp(2.2), color: darkTurquoise }} className='font-bold'>
                  {currency(precio1)}
                </Text>
              </View>
              
              {Number(iva) > 0 && (
                <Text className='absolute right-5 top-2.5' style={{ fontSize: hp(1.5), color: turquoise }}>
                  IVA {currency((base1 * (iva as number)) / 100)}
                </Text>
              )}
            </View>

            {/* amount and added */}
            <View className='flex flex-row items-center justify-end w-full'>

              <View style={{ width: wp(20), borderColor: turquoise, borderWidth: .5 }} className='rounded-md'>
                <TouchableOpacity onPress={() => setOpenAmountModal(true)}>
                  <Text style={{ color: darkTurquoise, fontSize: wp(4.5) }} className='text-center'>
                    {amount}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* add & added */}
              <View className='pl-5'>
                {!added ? (
                  <Pressable onPress={handleAddToCart} className='flex flex-row items-center justify-center rounded-md w-7 h-7'
                    style={{ backgroundColor: maxAmount === 0 ? processBtn : darkTurquoise }}
                    disabled={maxAmount === 0}
                  >
                    <PlusIcon size={25} color='white' strokeWidth={2} />
                  </Pressable>
                ) : (
                  <View className='flex flex-row items-center justify-center rounded-md w-7 h-7'
                    style={{ backgroundColor: green }}
                  >
                    <CheckIcon size={20} color='white' strokeWidth={3} />
                  </View>
                )}
              </View>

            </View>
          </View>

        </View>

      </View>
      
      <ModalAmount
        stateModal={openAmountModal}
        setStateModal={setOpenAmountModal}
        codigo={codigo}
        amount={amount}
        maxAmount={maxAmount}
      />
    </>
  )
}

export default ProductSearch