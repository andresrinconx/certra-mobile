import { Modal as ModalNativeBase } from 'native-base'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'

const Modal = ({ 
  children, 
  bgColor, 
  width,
  minHeight,
  maxHeight,
  borderRadius,
  openModal, 
  setOpenModal 
}: { 
  children: React.ReactNode, 
  bgColor: string, 
  width?: number
  minHeight?: number,
  maxHeight?: number,
  borderRadius?: number,
  openModal: boolean, 
  setOpenModal: (openModal: boolean) => void 
}) => {
  return (
    <ModalNativeBase isOpen={openModal} onClose={() => setOpenModal(false)} animationPreset='fade'>
      <ModalNativeBase.Content style={{ 
        marginBottom: 0,
        backgroundColor: bgColor, 
        width: width ? wp(width) : wp(95), 
        minHeight: minHeight ? wp(minHeight) : wp(127), 
        maxHeight: maxHeight ? wp(maxHeight) : wp(127), 
        borderRadius: borderRadius ? borderRadius : 10,
      }}>
        {children}
      </ModalNativeBase.Content>
    </ModalNativeBase>
  )
}

export default Modal