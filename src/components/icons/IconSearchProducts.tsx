import { View, TouchableOpacity } from 'react-native'
import { MagnifyingGlassIcon } from 'react-native-heroicons/mini'
import useInv from '../../hooks/useInv'
import {useNavigation} from '@react-navigation/native'

const IconSearchProducts = () => {
  const {setSearchedProducts} = useInv()
  const navigation = useNavigation()
  
  return (
    <>
      <TouchableOpacity onPress={() => {
        navigation.navigate('Search')
        setSearchedProducts([])
      }}>
        <View>
          <MagnifyingGlassIcon size={30} color='white' />
        </View>
      </TouchableOpacity>
    </>
  )
}

export default IconSearchProducts