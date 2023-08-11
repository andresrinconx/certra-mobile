import { View, Text } from 'react-native'
import { Menu, MenuOptions, MenuTrigger } from 'react-native-popup-menu'
import {ChevronDownIcon} from 'react-native-heroicons/mini'
import { styles } from '../styles'
import ModalSearch from './modals/ModalSearch'
import useInv from '../hooks/useInv'

const SelectCustomer = () => {
  const {setModalSearch, setSearchedProducts} = useInv()

  return (
    <View className='px-12 my-4'>
      <Menu>
        <MenuTrigger style={[styles.shadow, {borderRadius: 4, paddingVertical: 8}]} onPress={() => setModalSearch(true)}>
          <View className='flex flex-row items-center justify-center'>
            <Text className='text-xl'>Seleccionar un cliente</Text>
            <ChevronDownIcon size={25} color='black' />
          </View>
        </MenuTrigger>

        <MenuOptions customStyles={{optionsContainer: { width: '60%' }}}>
          <ModalSearch />
        </MenuOptions>
      </Menu>
    </View>
  )
}

export default SelectCustomer