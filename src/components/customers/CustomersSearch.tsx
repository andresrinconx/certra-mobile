import { View, Text, TouchableOpacity } from 'react-native'
import { styles } from '../../styles'
import useInv from '../../hooks/useInv'
import UserFromScliInterface from '../../interfaces/UserFromScliInterface'

const CustomersSearch = ({customer}: {customer: UserFromScliInterface}) => {
  const {cliente} = customer

  return (
    <TouchableOpacity className='bg-red-400'
      style={styles.shadow}
    >
      <Text className='text-black'>{cliente}</Text>
    </TouchableOpacity>
  )
}

export default CustomersSearch