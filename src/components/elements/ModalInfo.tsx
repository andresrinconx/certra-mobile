import { View, Text, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Modal } from 'native-base';

const ModalInfo = ({
  stateModal, 
  setStateModal,
  message,
  cancelButtonText,
  aceptButtonText,
  onPressAcept
}: { 
  stateModal: boolean, 
  setStateModal: (value: boolean) => void
  message: string,
  cancelButtonText?: string
  aceptButtonText?: string
  onPressAcept?: () => void
}) => {
  return (
    <Modal isOpen={stateModal} onClose={() => setStateModal(false)}>
      <Modal.Content style={{ width: wp(80), paddingHorizontal: 25, paddingVertical: 20, borderRadius: 5 }}>
        <View className='flex flex-col'>
          <Text className='pb-8 text-typography' style={{ fontSize: wp(4) }}>{message}</Text>
          
          <View className='flex flex-row justify-end gap-x-5'>
            {aceptButtonText && (
              <TouchableOpacity onPress={() => {
                setStateModal(false);
                if (onPressAcept) {
                  onPressAcept();
                }
              }}>
                <Text className='font-semibold text-turquoise' style={{ fontSize: wp(4) }}>{aceptButtonText}</Text>
              </TouchableOpacity>
            )}
            {cancelButtonText && (
              <TouchableOpacity onPress={() => setStateModal(false)}>
                <Text className='font-semibold text-turquoise' style={{ fontSize: wp(4) }}>{cancelButtonText ?? 'Cancelar'}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal.Content>
    </Modal>
  );
};

export default ModalInfo;