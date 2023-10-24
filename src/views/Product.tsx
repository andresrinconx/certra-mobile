import { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, Image, ScrollView, FlatList, Pressable, SafeAreaView } from 'react-native'
import { useRoute } from '@react-navigation/native'
import { CheckIcon, PlusIcon } from 'react-native-heroicons/outline'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { StatusBar } from 'react-native'
import { themeColors } from '../../tailwind.config'
import { ProductInterface } from '../utils/interfaces'
import { fetchDatasheet } from '../utils/api'
import { currency, valitadeDateInRange } from '../utils/helpers'
import { disponibility } from '../utils/constants'
import { useCertra, useLogin, useNavigation } from '../hooks'
import { IconCart, Loader, ModalInfo, ModalAmount, DataField, TextImage, Divider } from '../components'
 
const Product = () => {
  const [added, setAdded] = useState(false)
  const [amount, setAmount] = useState(1)
  const [maxAmount, setMaxAmount] = useState(0)
  const [datasheet, setDatasheet] = useState([])
  
  const [openAmountModal, setOpenAmountModal] = useState(false)
  const [loadingDatasheet, setLoadingDatasheet] = useState(true)
  const [loadingProduct, setLoadingProduct] = useState(true)
  const [modalSelectCustomer, setModalSelectCustomer] = useState(false)

  const { background } = themeColors
  const { myUser: { deposito, access: { labAccess, salespersonAccess }, customer } } = useLogin()
  const { productsCart, addToCart, removeElement } = useCertra()
  const { params: { descrip, codigo, image_url, merida, centro, oriente, base1, iva, bonicant, bonifica, fdesde, fhasta } } = useRoute() as { params: ProductInterface }
  const navigation = useNavigation()

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

  // Handle actions
  const handleAddToCart = () => {
    if ((labAccess || salespersonAccess) && !customer) {
      setModalSelectCustomer(true)
      return
    }
    addToCart(codigo, amount)

    setAdded(true)
  }
  const handleRemoveElement = () => {
    setAdded(false)
    setAmount(1)
    removeElement(codigo)
  }

  return (
    <>
      <SafeAreaView className='flex-1 px-3 pt-6 bg-background'>
        <StatusBar backgroundColor={background} barStyle='dark-content' />
        
        {/* back and cart */}
        <View className='flex flex-row items-center justify-between gap-2 my-3'>
          <TouchableOpacity onPress={() => {navigation.goBack()}}>
            <Image style={{ width: wp(8), height: wp(8) }} resizeMode='cover'
              source={require('../assets/back.png')}
            />
          </TouchableOpacity>
          
          <Text className='max-w-[70%] font-bold text-typography' style={{ fontSize: wp(4.5) }}
            numberOfLines={1}
          >
            {descrip}
          </Text>

          <View className='w-12 h-12 flex flex-row items-center justify-center mr-4 rounded-2xl bg-turquoise'>
            <IconCart />
          </View>
        </View>
        
        <View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: 180,}}
          >
            {/* img */}
            <View className='justify-center items-center rounded-3xl bg-lightList'
              style={{ height: hp(30) }}
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
              <Text className='font-bold text-typography' style={{ fontSize: wp(5.5) }}>
                {descrip}
              </Text>
            </View>

            {Number(bonicant) > 0 && valitadeDateInRange(new Date(`${fdesde}`), new Date(`${fhasta}`)) ? (
              <View className='flex flex-row justify-between rounded-md px-1 py-1 mt-1.5 bg-turquoise' style={{ width: wp(75) }}>
                <Text className='font-medium text-white' style={{ fontSize: wp(4) }}>Bonificación: {Number(bonicant)}x{Number(bonifica)}.</Text>
              </View>
            ):null}

            {/* price */}
            <View className='mt-3 mb-5'>
              <Text style={{ fontSize: hp(2.5) }} className='font-medium text-typography'>
                Precio:
              </Text>

              <View className='flex flex-row items-center gap-x-4'>
                <Text className='font-bold text-darkTurquoise' style={{ fontSize: hp(3) }}>
                  {currency(base1)}
                </Text>

                {Number(iva) > 0 && (
                  <Text className='font-normal text-turquoise' style={{ fontSize: hp(2.5) }}>
                    IVA {currency((base1 * (iva as number)) / 100)}
                  </Text>
                )}
              </View>
            </View>

            {/* disponibility */}
            <View className='mb-2'>
              <Text style={{ fontSize: hp(2.5) }} className='pb-2 font-medium text-typography'>
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
                            <Text style={{ fontSize: hp(2.5) }} className='w-24 text-center font-medium text-darkTurquoise'>
                              {name === 'Oriente' ? '' : name}
                            </Text>

                            <Text style={{ fontSize: hp(2.6) }} className='text-center font-medium text-typography'>
                              {
                                name === 'Mérida' ? parseInt(String(merida)) :
                                name === 'Centro' ? parseInt(String(centro)) : null
                              }
                            </Text>
                          </View>
                        ) : 
                          deposito === 'CARACAS' ? (
                            <View key={id} className='flex flex-col items-center'>
                              <Text style={{ fontSize: hp(2.5) }} className='w-24 text-center font-medium text-darkTurquoise'>
                                {name}
                              </Text>

                              <Text style={{ fontSize: hp(2.6) }} className='text-center font-medium text-typography'>
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
                                <Text style={{ fontSize: hp(2.5) }} className='w-24 text-center font-medium text-darkTurquoise'>
                                  {name === 'Mérida' ? '' : name}
                                </Text>

                                <Text style={{ fontSize: hp(2.6) }} className='text-center font-medium text-typography'>
                                  {
                                    name === 'Centro' ? parseInt(String(centro)) :
                                    name === 'Oriente' ? parseInt(String(oriente)) : null
                                  }
                                </Text>
                              </View>
                            ) : (
                              <View key={id} className='flex flex-col items-center'>
                                <Text style={{ fontSize: hp(2.5) }} className='w-24 text-center font-medium text-darkTurquoise'>
                                  {name}
                                </Text>

                                <Text style={{ fontSize: hp(2.6) }} className='text-center font-medium text-typography'>
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
            <View>
              <Divider marginY={5} />
              <TextImage
                image={require('../assets/ficha.png')}
                text='Ficha Técnica:'
              />

              {loadingDatasheet ? (
                <View className='mt-5'>
                  <Loader />
                </View>
              ) : (
                <View className='px-5 pt-5'>
                  {datasheet?.map((item) => {
                    return (
                      <DataField
                        key={item[0]}
                        label={String(item[0]).split('_').join('. ')}
                        value={item[1]}
                      />
                    )
                  })}
                </View>
              )}
            </View>
          </ScrollView>

        </View>
      </SafeAreaView>

      {/* amount and added */}
      {loadingProduct ? (
        <View className='flex flex-row items-center justify-center w-full absolute bottom-0 h-20'>
          <Loader />
        </View>
      ) : (
        <View className='flex flex-row items-center justify-center w-full px-14 absolute bottom-0 h-20 bg-background'>

          {/* remove */}
          <View>
            <Pressable onPress={handleRemoveElement} className={`flex flex-row items-center justify-center rounded-md w-10 h-10 ${added ? 'bg-turquoise' : 'bg-processBtn'}`}
              disabled={added ? false : true}
            >
              <Image style={{ width: wp(4), height: hp(4) }} resizeMode='cover'
                source={require('../assets/white-trash-can.png')}
              />
            </Pressable>
          </View>

          <View className='flex-1 flex-row items-center justify-center mx-6'>

            <View style={{ width: wp(35), borderWidth: .5 }} className='rounded-md border-turquoise'>
              <TouchableOpacity onPress={() => {
                if ((labAccess || salespersonAccess) && !customer) {
                  setModalSelectCustomer(true)
                  return
                }

                setOpenAmountModal(true)
              }}>
                <Text style={{ fontSize: wp(6) }} className='text-center text-darkTurquoise'>
                  {amount}
                </Text>
              </TouchableOpacity>
            </View>
            
          </View>

          {/* add & added */}
          <View>
            {!added ? (
              <Pressable onPress={handleAddToCart} className={`flex flex-row items-center justify-center rounded-md w-10 h-10 ${maxAmount === 0 ? 'bg-processBtn' : 'bg-darkTurquoise'}`}
                disabled={maxAmount === 0}
              >
                <PlusIcon size={wp(8)} color='white' strokeWidth={4} />
              </Pressable>
            ) : (
              <View className='flex flex-row items-center justify-center rounded-md w-10 h-10 bg-green'>
                <CheckIcon size={wp(8)} color='white' strokeWidth={4} />
              </View>
            )}
          </View>

        </View>
      )}

      <ModalAmount
        stateModal={openAmountModal}
        setStateModal={setOpenAmountModal}
        codigo={codigo}
        amount={amount}
        maxAmount={maxAmount}
      />

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