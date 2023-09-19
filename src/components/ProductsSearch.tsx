import { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, FlatList, Pressable } from 'react-native'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { MinusSmallIcon, PlusSmallIcon, CheckIcon, PlusIcon } from 'react-native-heroicons/outline'
import { useNavigation } from '@react-navigation/native'
import { disponibility } from '../utils/constants'
import ProductoInterface from '../interfaces/ProductoInterface'
import useInv from '../hooks/useInv'
import useLogin from '../hooks/useLogin'

const ProductsSearch = ({ product }: { product: ProductoInterface }) => {
  const [added, setAdded] = useState(false)
  const [ammount, setAmmount] = useState(1)
  
  const { themeColors: { typography, lightList, darkTurquoise, green, turquoise } } = useLogin()
  const { descrip, precio1, merida, centro, oriente, codigo } = product
  const { productsCart, addToCart, removeElement } = useInv()
  const navigation = useNavigation()

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
    } else {

      // product not in cart
      setAdded(false)
      setAmmount(1)
    }
  }, [productsCart])

  // Add or remove element from cart
  // useEffect(() => {
  //   if (added) {
  //     addToCart(codigo, ammount)
  //   } else {
  //     removeElement(codigo)
  //   }
  // }, [added])

  // Handle actions
  const handleAddToCart = () => {
    setAdded(true)
  }
  const handleDecrease = () => {
    if (ammount > 1) {
      setAmmount(ammount - 1)
    }
  }
  const handleIncrease = () => {
    setAmmount(ammount + 1)
  }
  const handleRemoveElement = () => {
    setAdded(false)
    setAmmount(1)
  }

  return (
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
                }}
              />
            </View>
          </View>
        </View>

        {/* right info */}
        <View className='w-1/2 pl-2'>

          {/* price */}
          <View className='my-2'>
            <Text style={{ fontSize: hp(1.5), color: typography }} className='font-bold'>
              Precio:
            </Text>

            <Text style={{ fontSize: hp(2.2), color: darkTurquoise }} className='font-bold'>
              Bs. {precio1}
            </Text>
          </View>

          {/* ammount and added */}
          <View className='flex flex-row items-center justify-between w-full'>

            <View className='flex-1 flex-row items-center justify-around'>

              {/* decrease */}
              <View className='rounded-md' style={{ borderColor: turquoise, borderWidth: .5 }}>
                <TouchableOpacity onPress={handleDecrease} className='p-0.5'>
                  <MinusSmallIcon size={wp(4.5)} color={darkTurquoise} strokeWidth={3} />
                </TouchableOpacity>
              </View>

              {/* ammount */}
              <View style={{ width: wp(12) }}>
                <Text className='text-center font-bold' style={{ color: darkTurquoise, fontSize: wp(4.5) }}>
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
            <View className='pl-5'>
              {!added ? (
                <TouchableOpacity onPress={handleAddToCart} className='flex flex-row items-center justify-center rounded-md w-7 h-7'
                  style={{ backgroundColor: darkTurquoise }}
                >
                  <PlusIcon size={25} color='white' strokeWidth={2} />
                </TouchableOpacity>
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
  )
}

export default ProductsSearch