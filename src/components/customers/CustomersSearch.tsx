import { Text, TouchableOpacity } from 'react-native'
import { styles } from '../../styles'
import UserFromScliInterface from '../../interfaces/UserFromScliInterface'
import useLogin from '../../hooks/useLogin'
import useInv from '../../hooks/useInv'

const CustomersSearch = ({customer, setValue}: {customer: UserFromScliInterface, setValue: (value: string) => void}) => {
  const {setMyUser, myUser} = useLogin()
  const {flowControl, setFlowControl, setCart} = useInv()
  const {cliente, nombre} = customer

  return (
    <TouchableOpacity 
      className='bg-blue-200 mb-3 p-2 mx-1'
      style={styles.shadow}
      onPress={() => {
        // loader
        setMyUser({...myUser, customer})
        setCart([])
        setValue('')
        setTimeout(() => {
          setFlowControl({...flowControl, showSelectResults: false, showProducts: true, showSelectLabel: true,})
        }, 100);
        // loader
      }}
    >
      <Text className='text-black font-bold text-sm'>{cliente}</Text>
      <Text className='text-black text-base' numberOfLines={1}>{nombre}</Text>
    </TouchableOpacity>
  )
}

export default CustomersSearch