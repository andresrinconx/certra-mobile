import { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, Image, ScrollView, FlatList, Pressable } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { CheckIcon, MinusSmallIcon, PlusSmallIcon, PlusIcon } from 'react-native-heroicons/outline'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { StatusBar } from 'react-native'
import ProductoInterface from '../interfaces/ProductoInterface'
import useInv from '../hooks/useInv'
import useLogin from '../hooks/useLogin'
import { disponibility } from '../utils/constants'
import IconCart from '../components/IconCart'
import Loader from '../components/Loader'

const Product = () => {
  const [added, setAdded] = useState(false)
  const [ammount, setAmmount] = useState(1)
  const [touch, setTouch] = useState(false)
  const [maxAmmount, setMaxAmmount] = useState(0)
  const [loadingProduct, setLoadingProduct] = useState(true)

  const { themeColors: { background, typography, turquoise, lightList, darkTurquoise, green, primary, processBtn }, myUser: { deposito } } = useLogin()
  const { productsCart, addToCart, removeElement } = useInv()
  const navigation = useNavigation()
  const { params: { descrip, precio1, codigo, image_url, merida, centro, oriente } } = useRoute() as { params: ProductoInterface }

  // Get max ammount
  useEffect(() => {
    if (maxAmmount === 0) {
      if (merida || centro || oriente) {
        if (deposito) {
          if (deposito === 'MERIDA') {
            setMaxAmmount(parseInt(String(merida)) + parseInt(String(centro)))
          } else if (deposito === 'CARACAS') {
            setMaxAmmount(parseInt(String(merida)) + parseInt(String(centro)) + parseInt(String(oriente)))
          } else if (deposito === 'ORIENTE') {
            setMaxAmmount(parseInt(String(centro)) + parseInt(String(oriente)))
          }
        } else {
          setMaxAmmount(parseInt(String(merida)) + parseInt(String(centro)) + parseInt(String(oriente)))
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
      setAmmount(productInCart.ammount)
      setLoadingProduct(false)
    } else {

      // product not in cart
      setAdded(false)
      setAmmount(1)
      setLoadingProduct(false)
    }
  }, [productsCart])

  // Add or remove element from cart
  useEffect(() => {
    if (added && touch) {
      if (!productsCart.find(productInCart => productInCart.codigo === codigo)) {
        setTouch(false)
        addToCart(codigo, ammount)
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
    setAdded(true)
    setTouch(true)
  }
  const handleDecrease = () => {
    if (ammount > 1) {
      setAmmount(ammount - 1)
    }
  }
  const handleIncrease = () => {
    if (ammount < maxAmmount) {
      setAmmount(ammount + 1)
    }
  }
  const handleRemoveElement = () => {
    setAdded(false)
    setAmmount(1)
    setTouch(true)
  }

  return (
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

        <View className='mr-4 p-3 rounded-2xl' style={{ backgroundColor: turquoise }}>
          <IconCart />
        </View>
      </View>
      
      <View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 100,}}
          overScrollMode='never'
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
              Bs. {precio1}
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
                    <View key={id} className='flex flex-col items-center mt-1'
                      style={{ width: wp(25) }}
                    >
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
                }}
              />
            </View>
          </View>
        </ScrollView>

      </View>

      {/* ammount and added */}
      {loadingProduct ? (
        <View className="flex flex-row items-center justify-center absolute bottom-2 h-16" style={{ width: wp("60%"), marginLeft: wp(20) }}>
          <Loader color={`${primary}`} />
        </View>
      ) : (
        <View className="flex flex-row items-center justify-between absolute bottom-2 h-16" style={{ width: wp("70%"), marginLeft: wp(16) }}>

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

            {/* ammount */}
            <View style={{ width: wp(20) }}>
              <Text className='text-center font-bold' style={{ color: darkTurquoise, fontSize: wp(6) }}>
                {ammount}
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
                style={{ backgroundColor: darkTurquoise }}
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
    </View>
  )
}

export default Product