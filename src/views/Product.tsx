import { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, Image, ScrollView, FlatList, Pressable } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { CheckIcon, MinusSmallIcon, PlusSmallIcon, PlusIcon } from 'react-native-heroicons/outline'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { StatusBar } from 'react-native'
import { ProductInterface } from '../utils/interfaces'
import useInv from '../hooks/useInv'
import useLogin from '../hooks/useLogin'
import { fetchDatasheet } from '../utils/api'
import { disponibility } from '../utils/constants'
import { twoDecimalsPrice } from '../utils/helpers'
import { IconCart, Loader, ModalInfo, ProfileField } from '../components'
 
const Product = () => {
  const [added, setAdded] = useState(false)
  const [amount, setAmount] = useState(1)
  const [touch, setTouch] = useState(false)
  const [maxAmount, setMaxAmount] = useState(0)
  const [datasheet, setDatasheet] = useState([])
  
  const [loadingDatasheet, setLoadingDatasheet] = useState(true)
  const [loadingProduct, setLoadingProduct] = useState(true)

  const [modalSelectCustomer, setModalSelectCustomer] = useState(false)

  const { themeColors: { background, typography, turquoise, lightList, darkTurquoise, green, primary, processBtn }, myUser: { deposito, access: { labAccess, salespersonAccess }, customer } } = useLogin()
  const { productsCart, addToCart, removeElement } = useInv()
  const navigation = useNavigation()
  const { params: { descrip, precio1, codigo, image_url, merida, centro, oriente } } = useRoute() as { params: ProductInterface }

  // Get datahseet
  useEffect(() => {
    const getDatasheet = async () => {
      const data = await fetchDatasheet(codigo)
      const datasheet = Object.entries(data[0])
      setDatasheet(datasheet as [])
      setLoadingDatasheet(false)
    }
    getDatasheet()
  }, [])

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
      setLoadingProduct(false)
    } else {

      // product not in cart
      setAdded(false)
      setAmount(1)
      setLoadingProduct(false)
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
      <View className='flex-1 px-3 pt-6' style={{ backgroundColor: background }}>
        <StatusBar backgroundColor={background} barStyle='dark-content' />
        
        {/* back and cart */}
        <View className='flex flex-row items-center justify-between gap-2 my-3'>
          <TouchableOpacity onPress={() => {navigation.goBack()}}>
            <Image style={{ width: wp(8), height: wp(8) }} resizeMode='cover'
              source={require('../assets/back.png')}
            />
          </TouchableOpacity>
          
          <Text className='max-w-[70%] font-bold' style={{ color: typography, fontSize: wp(4.5) }}
            numberOfLines={1}
          >
            {descrip}
          </Text>

          <View className='w-12 h-12 flex flex-row items-center justify-center mr-4 rounded-2xl' style={{ backgroundColor: turquoise }}>
            <IconCart />
          </View>
        </View>
        
        <View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: 180,}}
          >
            {/* img */}
            <View className='justify-center items-center rounded-3xl'
              style={{ backgroundColor: lightList, height: hp(30) }}
            >
              {image_url === '' || image_url === null ? (
                <Image style={{ width: wp(55), height: wp(55) }} resizeMode='contain'
                  source={require('../assets/no-image.png')}
                />
              ) : (
                <Image style={{ width: wp(55), height: wp(55) }} resizeMode='contain'
                  source={{ uri: `${image_url}` }}
                />
              )}
            </View>

            {/* descrip */}
            <View className='pt-3'>
              <Text className='font-bold' style={{ fontSize: wp(5.5), color: typography }}>
                {descrip}
              </Text>
            </View>

            {/* price */}
            <View className='mt-3 mb-5'>
              <Text style={{ fontSize: hp(2.5), color: typography }} className='font-medium'>
                Precio:
              </Text>
              <Text className='font-bold' style={{ fontSize: hp(3), color: darkTurquoise }}>
                Bs. {twoDecimalsPrice(Number(precio1))}
              </Text>
            </View>

            {/* disponibility */}
            <View className='mb-2'>
              <Text style={{ fontSize: hp(2.5), color: typography }} className='pb-2 font-medium'>
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
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  showsVerticalScrollIndicator={false}
                  renderItem={({ item: { id, name } }) => {
                    return (
                      <>
                        {deposito === 'MERIDA' ? (
                          <View key={id} className='flex flex-col items-center'>
                            <Text style={{ fontSize: hp(2.5), color: darkTurquoise }} className='w-24 text-center font-medium'>
                              {name === 'Oriente' ? '' : name}
                            </Text>

                            <Text style={{ fontSize: hp(2.6), color: typography }} className='text-center font-medium'>
                              {
                                name === 'Mérida' ? parseInt(String(merida)) :
                                name === 'Centro' ? parseInt(String(centro)) : null
                              }
                            </Text>
                          </View>
                        ) : 
                          deposito === 'CARACAS' ? (
                            <View key={id} className='flex flex-col items-center'>
                              <Text style={{ fontSize: hp(2.5), color: darkTurquoise }} className='w-24 text-center font-medium'>
                                {name}
                              </Text>

                              <Text style={{ fontSize: hp(2.6), color: typography }} className='text-center font-medium'>
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
                                <Text style={{ fontSize: hp(2.5), color: darkTurquoise }} className='w-24 text-center font-medium'>
                                  {name === 'Mérida' ? '' : name}
                                </Text>

                                <Text style={{ fontSize: hp(2.6), color: typography }} className='text-center font-medium'>
                                  {
                                    name === 'Centro' ? parseInt(String(centro)) :
                                    name === 'Oriente' ? parseInt(String(oriente)) : null
                                  }
                                </Text>
                              </View>
                            ) : (
                              <View key={id} className='flex flex-col items-center'>
                                <Text style={{ fontSize: hp(2.5), color: darkTurquoise }} className='w-24 text-center font-medium'>
                                  {name}
                                </Text>

                                <Text style={{ fontSize: hp(2.6), color: typography }} className='text-center font-medium'>
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

            {/* datasheet */}
            <View className='mt-5 pt-5 border-t-[0.5px] border-t-[#999999]'>
              <View className='flex flex-row items-center gap-x-2 mb-5'>
                <Image style={{ width: wp(7), height: wp(7) }} resizeMode='contain'
                  source={require('../assets/ficha.png')}
                />
                <Text style={{ fontSize: hp(2.5), color: typography }} className='font-medium'>
                  Ficha Técnica:
                </Text>
              </View>

              {loadingDatasheet ? (
                <View className='mt-5'>
                  <Loader color={`${primary}`} />
                </View>
              ) : (
                <View className='px-5'>
                  {datasheet.map((item) => {
                    return (
                      <ProfileField
                        key={item[0]}
                        label={String(item[0]).split('_').join(' ')}
                        value={item[1]}
                      />
                    )
                  })}
                </View>
              )}
            </View>
          </ScrollView>

        </View>
      </View>

      {/* amount and added */}
      {loadingProduct ? (
        <View className='flex flex-row items-center justify-center w-full absolute bottom-0 h-20'>
          <Loader color={`${primary}`} />
        </View>
      ) : (
        <View className='flex flex-row items-center justify-center w-full px-14 absolute bottom-0 h-20' style={{ backgroundColor: background }}>

          {/* remove */}
          <View>
            <Pressable onPress={handleRemoveElement} className='flex flex-row items-center justify-center rounded-md w-10 h-10'
              style={{ backgroundColor: added ? turquoise : processBtn }}
              disabled={added ? false : true}
            >
              <Image style={{ width: wp(4), height: hp(4) }} resizeMode='cover'
                source={require('../assets/white-trash-can.png')}
              />
            </Pressable>
          </View>

          <View className='flex-1 flex-row items-center justify-between mx-6'>

            {/* decrease */}
            <View className='rounded-md' style={{ borderColor: turquoise, borderWidth: .5 }}>
              <TouchableOpacity onPress={handleDecrease} className='p-0.5'>
                <MinusSmallIcon size={wp(4.5)} color={darkTurquoise} strokeWidth={3} />
              </TouchableOpacity>
            </View>

            {/* amount */}
            <View style={{ width: wp(20) }}>
              <Text className='text-center font-bold' style={{ color: darkTurquoise, fontSize: wp(6) }}>
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
          <View>
            {!added ? (
              <Pressable onPress={handleAddToCart} className='flex flex-row items-center justify-center rounded-md w-10 h-10'
                style={{ backgroundColor: maxAmount === 0 ? processBtn : darkTurquoise }}
                disabled={maxAmount === 0}
              >
                <PlusIcon size={wp(8)} color='white' strokeWidth={4} />
              </Pressable>
            ) : (
              <View className='flex flex-row items-center justify-center rounded-md w-10 h-10'
                style={{ backgroundColor: green }}
              >
                <CheckIcon size={wp(8)} color='white' strokeWidth={4} />
              </View>
            )}
          </View>

        </View>
      )}

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

export default Product