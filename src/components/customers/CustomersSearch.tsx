import { Text, TouchableOpacity } from 'react-native'
import { styles } from '../../styles'
import UserFromScliInterface from '../../interfaces/UserFromScliInterface'
import useLogin from '../../hooks/useLogin'
import useInv from '../../hooks/useInv'

const CustomersSearch = ({customer}: {customer: UserFromScliInterface}) => {
  const {setMyUser, myUser} = useLogin()
  const {flowControl, setFlowControl, setProductsCart, loaders, setLoaders, setValueSearchCustomers, products, setProducts} = useInv()
  const {cliente, nombre} = customer

  // select customer
  const selectCustomer = () => {
    setLoaders({...loaders, loadingSlectedCustomer: true})
    setTimeout(() => {
      // user
      setMyUser({...myUser, customer})

      // products & cart
      setProductsCart([])

      // flow & reset
      setValueSearchCustomers('')
      setFlowControl({...flowControl, showSelectResults: false, showProducts: true, showSelectLabel: true, selected: true})
      setLoaders({...loaders, loadingSlectedCustomer: false})
    }, 100)
  }

  return (
    <TouchableOpacity
      className='p-2 mx-1 mb-2'
      style={styles.shadow}
      onPress={() => selectCustomer()}
    >
      <Text className='text-black font-bold text-sm'>{cliente}</Text>
      <Text className='text-black text-base' numberOfLines={1}>{nombre}</Text>
    </TouchableOpacity>
  )
}

export default CustomersSearch