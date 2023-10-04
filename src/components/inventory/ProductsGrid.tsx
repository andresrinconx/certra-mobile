import { useState, useEffect, memo } from 'react'
import { View, Text, Image, TouchableOpacity, Pressable, FlatList } from 'react-native'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { MinusSmallIcon, PlusSmallIcon, CheckIcon, PlusIcon } from 'react-native-heroicons/outline'
import { useNavigation } from '@react-navigation/native'
import { ProductInterface } from '../../utils/interfaces'
import { disponibility } from '../../utils/constants'
import useInv from '../../hooks/useInv'
import useLogin from '../../hooks/useLogin'
import ModalSelectCustomer from '../elements/ModalSelectCustomer'

const ProductsGrid = ({ product }: { product: ProductInterface }) => {
  const [added, setAdded] = useState(false)
  const [amount, setAmount] = useState(1)
  const [touch, setTouch] = useState(false)
  const [maxAmount, setMaxAmount] = useState(0)

  const [modalSelectCustomer, setModalSelectCustomer] = useState(false)

  const { themeColors: { typography, lightList, darkTurquoise, green, turquoise, processBtn }, myUser: { deposito, access: { labAccess, salespersonAccess }, customer } } = useLogin()
  const { addToCart, productsCart, removeElement } = useInv()
  const { descrip, precio1, image_url, merida, centro, oriente, codigo } = product
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

  // Add or remove element from cart
  useEffect(() => {
    if (added && touch) {
      if (!productsCart.find(productInCart => productInCart.codigo === codigo)) {
        setTouch(false)
        addToCart(codigo, amount)
      }
    } else if(!added && touch) {
      if (productsCart.find(productInCart => productInCart.codigo === codigo)) {
        setTouch(false)
        removeElement(codigo)
      }
    }
  }, [added])

  // Handle actions
  const handleAddToCart = () => {
    if ((labAccess || salespersonAccess) && !customer) {
      setModalSelectCustomer(true)
      return
    }

    setAdded(true)
    setTouch(true)
  }
  const handleDecrease = () => {
    if (amount > 1) {
      setAmount(amount - 1)
    }
  }
  const handleIncrease = () => {
    if (amount < maxAmount) {
      setAmount(amount + 1)
    }
  }
  const handleRemoveElement = () => {
    setAdded(false)
    setAmount(1)
    setTouch(true)
  }

  return (
    <>
      <View className='h-[98%] mb-3 mr-2 p-2 rounded-2xl' style={{ backgroundColor: lightList, width: wp('45.5%') }}>

        {/* remove element icon */}
        {added && (
          <Pressable className='absolute top-0 right-0 z-50' 
            style={{ width: wp(12), height: wp(12) }}
            onPress={handleRemoveElement}
          >
            <View className='absolute top-0 right-0 flex flex-col justify-center items-center rounded-tr-2xl rounded-bl-2xl' 
              style={{ width: wp(10), height: wp(10), backgroundColor: turquoise }}
            >
              <Image style={{ width: wp(3), height: hp(3) }} resizeMode='cover'
                source={require('../../assets/white-trash-can.png')}
              />
            </View>
          </Pressable>
        )}

        {/* content */}
        <View>

          {/* img */}
          <Pressable onPress={() => navigation.navigate('Product', { ...product })} className='mb-2 justify-center items-center'>
            {image_url === null ? (
              <Image style={{ width: wp(32), height: wp(32) }} resizeMode='contain'
                source={require('../../assets/no-image.png')}
              />
            ) : (
              <Image style={{ width: wp(32), height: wp(32) }} resizeMode='contain'
                source={{ uri: `${image_url}` }}
              />
            )}
          </Pressable>

          {/* texts & btn */}
          <View>

            {/* descrip */}
            <Pressable onPress={() => navigation.navigate('Product', { ...product })}>
              <Text style={{ fontSize: wp(4), color: typography }} className='font-bold' numberOfLines={2}>
                {descrip}
              </Text>
            </Pressable>

            {/* price */}
            <View className='my-2 '>
              <Text style={{ fontSize: hp(1.5), color: typography }} className='font-bold'>
                Precio:
              </Text>

              <Text style={{ fontSize: hp(2.2), color: darkTurquoise }} className='font-bold'>
                Bs. {precio1}
              </Text>
            </View>

            {/* disponibility */}
            <View className='mb-2'>
              <Text style={{ fontSize: hp(1.6), color: typography }} className='pb-0.5 font-bold'>
                Disponibilidad:
              </Text>

              {/* sedes */}
              <View>
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

            {/* amount and added */}
            <View className='flex flex-row items-center justify-between w-full'>

              <View className='flex-1 flex-row items-center justify-around'>

                {/* decrease */}
                <View className='rounded-md' style={{ borderColor: turquoise, borderWidth: .5 }}>
                  <TouchableOpacity onPress={handleDecrease} className='p-0.5'>
                    <MinusSmallIcon size={wp(4.5)} color={darkTurquoise} strokeWidth={3} />
                  </TouchableOpacity>
                </View>

                {/* amount */}
                <View style={{ width: wp(12) }}>
                  <Text className='text-center font-bold' style={{ color: darkTurquoise, fontSize: wp(4.5) }}>
                    {amount}
                  </Text>
                </View>

                {/* increase */}
                <View className='rounded-md' style={{ borderColor: turquoise, borderWidth: .5 }}>
                  <TouchableOpacity onPress={handleIncrease} className='p-0.5'>
                    <PlusSmallIcon size={17} color={darkTurquoise} strokeWidth={3} />
                  </TouchableOpacity>
                </View>
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

      <ModalSelectCustomer 
        stateModal={modalSelectCustomer} setStateModal={setModalSelectCustomer}
      />
    </>
  )
}

export default memo(ProductsGrid)