import {useRef} from 'react'
import { View, Text } from 'react-native'
import { Menu, MenuOptions, MenuTrigger, MenuProvider } from 'react-native-popup-menu'
import {ChevronDownIcon} from 'react-native-heroicons/mini'
import { styles } from '../styles'

const SelectCustomer = () => {
  return (
    <View className='px-12 my-4'>
      <Menu>
        <MenuTrigger style={[styles.shadow, {borderRadius: 4, paddingVertical: 8}]}>
          <View className='flex flex-row items-center justify-center'>
            <Text className='text-xl'>Seleccionar un cliente</Text>
            <ChevronDownIcon size={25} color='black' />
          </View>
        </MenuTrigger>

        <MenuOptions customStyles={{optionsContainer: { width: '60%' }}}>
          <View className=''>
            <Text className=''>hola</Text>
          </View>
        </MenuOptions>
      </Menu>
    </View>
  )
}

export default SelectCustomer