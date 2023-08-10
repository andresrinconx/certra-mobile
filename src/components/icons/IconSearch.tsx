import { View, TouchableOpacity } from 'react-native'
import { MagnifyingGlassIcon } from 'react-native-heroicons/mini'
import useInv from '../../hooks/useInv'
import ModalSearch from '../modals/ModalSearch'

const IconSearch = () => {
  const {setModalSearch, setSearchedProducts} = useInv()
  
  return (
    <>
      <TouchableOpacity onPress={() => {
        setModalSearch(true)
        setSearchedProducts([])
      }}>
        <View>
          <MagnifyingGlassIcon size={30} color='white' />
        </View>
      </TouchableOpacity>

      <ModalSearch />
    </>
  )
}

export default IconSearch