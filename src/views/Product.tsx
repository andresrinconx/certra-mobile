import { View, Text, TouchableOpacity } from 'react-native'
import { ArrowSmallRightIcon } from 'react-native-heroicons/outline'
import {useNavigation, useRoute} from '@react-navigation/native'
import { theme, styles } from '../styles'

const Product = () => {
  const navigation = useNavigation()
  

  return (
    <View>
      {/* header */}
      <View className='flex flex-row justify-between items-center py-3 mb-4'
        style={{...styles.shadowHeader, backgroundColor: theme.turquesaClaro}}
      >
        <View className='ml-4'>
          <TouchableOpacity onPress={() => {navigation.goBack()}}>
            <ArrowSmallRightIcon size={25} color='white' rotation={180} />
          </TouchableOpacity>
        </View>

        <Text className='font-bold text-2xl text-white pr-[37%]'>Producto</Text>
      </View>
    </View>
  )
}

export default Product