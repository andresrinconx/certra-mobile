import { Text, TouchableOpacity } from 'react-native'
import { styles } from '../../styles'
import UserFromScliInterface from '../../interfaces/UserFromScliInterface'
import useLogin from '../../hooks/useLogin'

const CustomersSearch = ({customer}: {customer: UserFromScliInterface}) => {
  const {setMyUser, myUser} = useLogin()
  const {cliente, nombre} = customer

  return (
    <TouchableOpacity onPress={() => setMyUser({...myUser, customer})} className='bg-blue-200 mb-3 p-2 mx-1' 
      style={styles.shadow}
    >
      <Text className='text-black font-bold text-sm'>{cliente}</Text>
      <Text className='text-black text-base' numberOfLines={1}>{nombre}</Text>
    </TouchableOpacity>
  )
}

export default CustomersSearch