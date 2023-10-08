import { View, Text, TouchableOpacity } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { useNavigation } from '@react-navigation/native'
import { Modal } from 'native-base'
import useLogin from '../../hooks/useLogin'

const ModalSelectCustomer = ({ stateModal, setStateModal }: { stateModal: boolean, setStateModal: (value: boolean) => void }) => {
  const { themeColors: { typography, turquoise } } = useLogin()
  const navigation = useNavigation()

  return (
    <Modal isOpen={stateModal} onClose={() => setStateModal(false)}>
      <Modal.Content style={{ width: 320, paddingHorizontal: 25, paddingVertical: 20, borderRadius: 5 }}>
        <View className='flex flex-col'>
          <Text className='pb-8' style={{ fontSize: wp(4), color: typography }}>Debes seleccionar un cliente para continuar.</Text>
          
          <View className='flex flex-row justify-end gap-x-5'>
            <TouchableOpacity onPress={() => {
              setStateModal(false)
              navigation.navigate('Customer')
            }}>
              <Text className='font-semibold' style={{ fontSize: wp(4), color: turquoise }}>Aceptar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setStateModal(false)}>
              <Text className='font-semibold' style={{ fontSize: wp(4), color: turquoise }}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal.Content>
    </Modal>
  )
}

export default ModalSelectCustomer