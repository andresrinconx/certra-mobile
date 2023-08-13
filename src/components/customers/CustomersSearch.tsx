import { Text, TouchableOpacity } from 'react-native'
import { styles } from '../../styles'
import UserFromScliInterface from '../../interfaces/UserFromScliInterface'
import useLogin from '../../hooks/useLogin'
import useInv from '../../hooks/useInv'

const CustomersSearch = ({customer}: {customer: UserFromScliInterface}) => {
  const {setMyUser, myUser} = useLogin()
  const {flowControl, setFlowControl, setCart, loaders, setLoaders, setValueSearchCustomers} = useInv()
  const {cliente, nombre} = customer

  return (
    <TouchableOpacity
      className='p-2 mx-1 mb-2'
      style={styles.shadow}
      onPress={() => {
        setLoaders({...loaders, loadingSlectedCustomer: true})
        setTimeout(() => {
          setMyUser({...myUser, customer})
          setCart([])
          setValueSearchCustomers('')
          setFlowControl({...flowControl, showSelectResults: false, showProducts: true, showSelectLabel: true, selected: true})
          setLoaders({...loaders, loadingSlectedCustomer: false})
        }, 100)
      }}
    >
      <Text className='text-black font-bold text-sm'>{cliente}</Text>
      <Text className='text-black text-base' numberOfLines={1}>{nombre}</Text>
    </TouchableOpacity>
  )
}

export default CustomersSearch