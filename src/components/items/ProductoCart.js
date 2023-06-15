import { View, Text, TouchableOpacity, Pressable, Image, Modal } from 'react-native'
import React, {useState} from 'react'
import Icon from 'react-native-vector-icons/AntDesign'

import globalStyles from '../../styles'

const ProductoCart = ({item}) => {
  const [ cantidad, setCantidad ] = useState(1)
  const [ modalVisible, setModalVisible ] = useState(false);

  const { descrip, precio1 } = item

  const decremento = () => {
    if (cantidad !== 1) {
        const total = cantidad - 1
        setCantidad(total)
    }
  }

  const incremento = () => {
    const total = cantidad + 1
    setCantidad(total)
  }

  return (
    <>
        <Pressable
          onLongPress={ () => setModalVisible(true) }
        >
          <View className='border border-gray-300 mb-2 rounded-2xl p-3'>

            <View className='flex-row'>

              {/* textos item */}
              <View className='basis-[70%]'>
                <Text 
                  className='color-black font-bold text-lg leading-6'
                  numberOfLines={2}
                >
                  {descrip}
                </Text>

                <Text className='font-bold text-lg color-[#bed03c]'>Bs. {precio1}</Text>
              </View>

              {/* botones */}
              <View className='basis-[30%] flex-row justify-center items-center'>
                <TouchableOpacity
                  className={globalStyles.btnInDc}
                  onPress={ () => decremento() }
                >
                  <Text className={globalStyles.txtBtnInDc}>-</Text>
                </TouchableOpacity>

                <Text className='color-black text-2xl mx-1'>{cantidad}</Text>

                <TouchableOpacity
                  className={globalStyles.btnInDc}
                  onPress={ () => incremento() }
                >
                  <Text className={globalStyles.txtBtnInDc}>+</Text>
                </TouchableOpacity>
              </View>

            </View>
          </View>
        </Pressable>

        <Modal
          visible={modalVisible}
          animationType='slide'
          transparent={true}
          onRequestClose={ () => setModalVisible(false) }
        >
          <View className='flex-1 justify-center items-center'
            style={{backgroundColor: 'rgba(0, 0, 0, 0.5)',}}
          >
            <View className='bg-white rounded-xl w-[92%] h-[65%]'>
              <TouchableOpacity
                className='pt-2 pl-2'
                onPress={ () => setModalVisible(false) }
              >
                <Icon name='close' size={30} />
              </TouchableOpacity>

              <View className='px-4'>
                <View className='border-b-[#D1D5DB] border-b mb-2 justify-center items-center'>
                  <Image
                      className='w-60 h-60'
                      source={require('../../assets/Acetaminofen.png')}
                  />
                </View>
                
                <View>
                  <Text 
                    className='color-black font-bold text-3xl mb-2'
                  >
                    {descrip}
                  </Text>

                  <Text className='font-bold text-3xl color-[#bed03c] mb-2'>Bs. {precio1}</Text>
                </View>
              </View>
            </View>
          </View>
        </Modal>
    </>
  )
}

export default ProductoCart