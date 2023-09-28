import { useState, useEffect } from 'react'
import { View, Text, StatusBar, FlatList, TouchableOpacity, Image } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { Modal } from 'native-base'
import { XMarkIcon } from 'react-native-heroicons/outline'
import useLogin from '../hooks/useLogin'
import { fetchLastItemsLab, fetchLastItemsScli } from '../utils/api'
import { orderRecordCols } from '../utils/constants'
import BackScreen from '../components/BackScreen'
import Logos from '../components/Logos'
import Loader from '../components/Loader'
import { OrderRecordItemInterface } from '../interfaces/OrderRecordItemInterface'

const OrderRecord = () => {
  const [loadingOrderRecord, setLoadingOrderRecord] = useState(true)
  const [lastItems, setLastItems] = useState([])
  const [selectedItem, setSelectedItem] = useState({})

  const [modalOlderOnes, setModalOlderOnes] = useState(false)
  const [modalDetails, setModalDetails] = useState(false)

  const { themeColors: { background, primary, typography, list, green, lightList, turquoise }, myUser } = useLogin()

  // Get last items
  useEffect(() => {
    const getLastItems = async () => {
      try {
        let data

        if (myUser.from === 'scli') {
          data = await fetchLastItemsScli(myUser.cliente)
        } else {
          data = await fetchLastItemsLab({ clipro: myUser?.clipro, code: myUser?.us_codigo })
        }
        
        if (data) {
          setLastItems(data)
          setLoadingOrderRecord(false)
        }
      } catch (error) {
        console.log(error)
      }
    }
    getLastItems()
  }, [])

  // Show details
  const handleDetails = (item: OrderRecordItemInterface) => {
    setSelectedItem(item)
    setModalDetails(true)
  }

  // Filter range
  const filter = () => {
    
  }

  return (
    <>
      <View className='flex-1 px-3 pt-6' style={{ backgroundColor: background }}>
        <StatusBar backgroundColor={background} barStyle='dark-content' />

        <Logos image={myUser?.image_url} />
        <BackScreen title='Historial' />

        <View>
          {loadingOrderRecord ? (
            <View className='mt-5'>
              <Loader color={`${primary}`} />
            </View>
          ) : (
            <View>
              
              {/* table header */}
              <View className='flex flex-row justify-center items-center mt-4'>
                {orderRecordCols[myUser.from === 'scli' ? 0 : 1].map((item) => {
                  const { id, size, name } = item
                  return (
                    <Text key={id} className='text-center' 
                      style={{ fontSize: wp(2.4), color: typography, width: wp(size) }}
                    >{name}</Text>
                  )
                })}
              </View>

              {/* content */}
              <View className='mt-1'>
                <FlatList
                  data={lastItems}
                  numColumns={1}
                  contentContainerStyle={{ paddingBottom: wp(3) }}
                  showsVerticalScrollIndicator={false}
                  renderItem={({item, index}) => {
                    const { numero, fecha, subTotal, iva, importe, unidades, total } = item
                    let isPair = index % 2 === 0
                    let isLast = index === lastItems.length - 1
                    return (
                      <>
                        {myUser.from === 'scli' ? (
                          <View key={numero} className='flex flex-row justify-center items-center mb-[1px]' 
                            style={{ 
                              backgroundColor: !isPair ? background : list, 
                              height: wp(14),
                              borderTopRightRadius: index === 0 ? wp(5) : 0,
                              borderTopLeftRadius: index === 0 ? wp(5) : 0, 
                              borderBottomRightRadius: isLast ? wp(5) : 0,
                              borderBottomLeftRadius: isLast ? wp(5) : 0,
                            }}
                          >
                            <Text className='text-center' style={{ color: typography, width: wp(13.5), fontSize: wp(2.6) }}>{numero}</Text>
                            <Text className='text-center' style={{ color: typography, width: wp(13.5), fontSize: wp(2.6) }}>{fecha}</Text>
                            <Text className='text-center' style={{ color: typography, width: wp(13.5), fontSize: wp(2.6) }}>{subTotal}</Text>
                            <Text className='text-center' style={{ color: typography, width: wp(13.5), fontSize: wp(2.6) }}>{iva}</Text>
                            <Text className='text-center' style={{ color: typography, width: wp(13.5), fontSize: wp(2.6) }}>{importe ?? total}</Text>
                            <Text className='text-center' style={{ color: typography, width: wp(13.5), fontSize: wp(2.6) }}>{unidades}</Text>
                            <TouchableOpacity className='flex flex-col justify-center items-center' 
                              onPress={() => handleDetails(item)}
                              style={{ 
                                width: wp(13.5), 
                                height: '100%', 
                                backgroundColor: green,
                                borderTopRightRadius: index === 0 ? wp(5) : 0,
                                borderBottomRightRadius: isLast ? wp(5) : 0,
                              }}
                            >
                              <Image style={{ width: wp(7), height: wp(7) }} resizeMode='cover'
                                source={require('../assets/search.png')}
                              />
                            </TouchableOpacity>
                          </View>
                        ) : (
                          <View className=''>
                            
                          </View>
                        )}
                      </>
                    )
                  }} 
                />
              </View>

              {/* older ones */}
              <View className='rounded-xl py-3' style={{ backgroundColor: turquoise}}>
                <TouchableOpacity onPress={() => setModalOlderOnes(true)}>
                  <Text className='text-center font-bold text-white' style={{ fontSize: wp(5) }}>
                    Ver más antiguos
                  </Text>
                </TouchableOpacity>
              </View>

            </View>
          )}
        </View>
      </View>

      {/* modal details */}
      <Modal isOpen={modalDetails} onClose={() => setModalDetails(false)} animationPreset='fade'>
        <Modal.Content style={{ width: 360, minHeight: 350, maxHeight: 800, backgroundColor: lightList }}>

          {/* header */}
          <View className='flex flex-row items-center justify-between' style={{ height: wp(16), backgroundColor: list }}>
            <View className=''>
              
            </View>

            <TouchableOpacity className='flex flex-row items-center justify-center' 
              onPress={() => setModalDetails(false)}
              style={{ height: wp(16), width: wp(16), backgroundColor: green }}
            >
              <XMarkIcon size={wp(10)} color='white' />
            </TouchableOpacity>
          </View>

          {/* columns */}
          <View className=''>
            
          </View>

          {/* content */}
          <View className=''>
            
          </View>

        </Modal.Content>
      </Modal>

      {/* modal older ones */}
      <Modal isOpen={modalOlderOnes} onClose={() => setModalOlderOnes(false)}>
        <Modal.Content style={{ width: 360, paddingHorizontal: 25, paddingVertical: 20, borderRadius: 25 }}>

          <Text className='font-normal mb-3' style={{ fontSize: wp(4.3), color: typography }}>
            Indique un rango de fecha que desea consultar
          </Text>

          {/* range */}
          <View className='flex flex-row items-center justify-between mb-3'>
            <View className='w-[48%] flex flex-col'>
              <Text className='font-bold mb-0.5' style={{ fontSize: wp(3.5), color: typography }}>Desde</Text>

              <View className='flex flex-row items-center rounded-lg pl-2' style={{ backgroundColor: lightList, height: wp(10) }}>
                <Image style={{ width: wp(6), height: wp(6) }} resizeMode='cover'
                  source={require('../assets/calendar.png')}
                />
                <Text className='font-normal pl-2' style={{ fontSize: wp(3.5), color: typography }}>
                  aaaa-mm-dd
                </Text>
              </View>
            </View>

            <View className='w-[48%] flex flex-col'>
              <Text className='font-bold mb-0.5' style={{ fontSize: wp(3.5), color: typography }}>Hasta</Text>

              <View className='flex flex-row items-center rounded-lg pl-2' style={{ backgroundColor: lightList, height: wp(10) }}>
                <Image style={{ width: wp(6), height: wp(6) }} resizeMode='cover'
                  source={require('../assets/calendar.png')}
                />
                <Text className='font-normal pl-2' style={{ fontSize: wp(3.5), color: typography }}>
                  aaaa-mm-dd
                </Text>
              </View>
            </View>
          </View>
          
          {/* filter btn */}
          <View className='flex flex-row items-center justify-between'>
            <View style={{ backgroundColor: green }} className='flex justify-center w-full rounded-xl'>
              <TouchableOpacity onPress={() => filter()}>
                <Text style={{ fontSize: wp(4.5) }} className='py-2 text-center font-bold text-white'>
                  Filtrar
                </Text>
              </TouchableOpacity>
            </View>
          </View>

        </Modal.Content>
      </Modal>
    </>
  )
}

export default OrderRecord