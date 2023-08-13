import { View, TouchableOpacity } from 'react-native'
import { MagnifyingGlassIcon } from 'react-native-heroicons/mini'
import useInv from '../../hooks/useInv'
import ModalSearchProducts from '../modals/ModalSearchProducts'

const IconSearchProducts = () => {
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

      <ModalSearchProducts />
    </>
  )
}

export default IconSearchProducts