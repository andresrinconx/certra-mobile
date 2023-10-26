import { Text, TouchableOpacity, View } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { UserFromScliInterface } from '../../utils/interfaces'
import { useCertra, useLogin, useNavigation } from '../../hooks'

const CustomerSearch = ({ customer }: { customer: UserFromScliInterface }) => {
  const { setMyUser, myUser } = useLogin()
  const { setProductsCart, setLoadingSelectCustomer, setLoadingProductsGrid, setProducts, setCurrentPage } = useCertra()
  const { cliente, nombre } = customer
  const navigation = useNavigation()

  // select customer
  const selectCustomer = () => {
    setLoadingSelectCustomer(true)
    // user
    setMyUser({ ...myUser, customer })

    // products & cart
    setProductsCart([])
    setProducts([])
    setCurrentPage(1)
    navigation.navigate('Home')
    setLoadingProductsGrid(true)

    setTimeout(() => {
      setLoadingSelectCustomer(false)
    }, 500)
  }

  return (
    <TouchableOpacity className='flex flex-col justify-center h-12 mb-4 rounded-xl bg-charge'
      onPress={() => selectCustomer()}
    >
      <View className='flex flex-row items-center'>
        <Text className='px-4 font-extrabold text-sm text-typography' style={{ fontSize: wp(4) }}>
          {cliente}
        </Text>
        <Text className='font-normal text-typography' style={{ fontSize: wp(4), width: wp(60) }} numberOfLines={1}>
          {nombre}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

export default CustomerSearch