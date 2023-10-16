import { Text, TouchableOpacity, View } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { UserFromScliInterface } from '../../utils/interfaces'
import useNavigation from '../../hooks/useNavigation'
import useLogin from '../../hooks/useLogin'
import useInv from '../../hooks/useInv'

const CustomersSearch = ({ customer }: { customer: UserFromScliInterface }) => {
  const { themeColors: { charge, typography }, setMyUser, myUser } = useLogin()
  const { setProductsCart, setloadingSelectCustomer, setLoadingProductsGrid, setProducts, setCurrentPage } = useInv()
  const { cliente, nombre } = customer
  const navigation = useNavigation()

  // select customer
  const selectCustomer = () => {
    setloadingSelectCustomer(true)
    // user
    setMyUser({ ...myUser, customer })

    // products & cart
    setProductsCart([])
    setProducts([])
    setCurrentPage(1)
    navigation.navigate('Home')
    setLoadingProductsGrid(true)

    setTimeout(() => {
      setloadingSelectCustomer(false)
    }, 500)
  }

  return (
    <TouchableOpacity className='flex flex-col justify-center h-12 mb-4 rounded-xl' style={{ backgroundColor: charge }}
      onPress={() => selectCustomer()}
    >
      <View className='flex flex-row items-center'>
        <Text className='px-4 font-extrabold text-sm' style={{ fontSize: wp(4), color: typography }}>
          {cliente}
        </Text>
        <Text className='font-normal' style={{ fontSize: wp(4), color: typography, width: wp(60) }} numberOfLines={1}>
          {nombre}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

export default CustomersSearch