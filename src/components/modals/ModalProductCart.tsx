import { View, Text, Modal, Image, TouchableOpacity } from 'react-native'
import { XMarkIcon } from 'react-native-heroicons/outline'
import useInv from '../../hooks/useInv'
import { theme } from '../../styles'
import ProductoInterface from '../../interfaces/ProductoInterface'

const ModalProductCart = ({item}: {item: ProductoInterface}) => {
  const {modalProduct, setModalProduct} = useInv()
  const {descrip, precio1} = item

  return (
    <Modal visible={modalProduct}
      animationType='slide'
      transparent={true}
      onRequestClose={() => setModalProduct(false)}
    >
      <View className='flex-1 justify-center items-center' style={{backgroundColor: 'rgba(0, 0, 0, 0.5)',}}>
        <View className='bg-white rounded-xl w-[92%] h-[60%]'>

          {/* close */}
          <TouchableOpacity onPress={() => setModalProduct(false)} className='absolute right-2 top-2'>
            <XMarkIcon size={35} color='black' />
          </TouchableOpacity>

          {/* content */}
          <View className='px-4 mt-8'>
            <View className='border-b-[#D1D5DB] border-b mb-2 justify-center items-center'>
              <Image source={require('../../assets/Acetaminofen.png')} style={{width: 240, height: 240,}} />
            </View>
            
            <View>
              <Text className='text-black text-2xl mb-2'>{descrip}</Text>
              <Text style={{color: theme.azul,}} className='font-bold text-3xl'>Bs. {precio1}</Text>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  )
}

export default ModalProductCart