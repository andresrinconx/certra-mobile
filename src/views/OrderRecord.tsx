import { useState, useEffect } from 'react'
import { View, Text, StatusBar, FlatList, TouchableOpacity, Image } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { Modal, useToast, Switch } from 'native-base'
import { XMarkIcon } from 'react-native-heroicons/outline'
import DatePicker from 'react-native-date-picker'
import RNFetchBlob from 'rn-fetch-blob'
import { OrderRecordItemInterface } from '../utils/interfaces'
import useLogin from '../hooks/useLogin'
import useInv from '../hooks/useInv'
import { fetchLastItemsLab, fetchLastItemsLabScli, fetchLastItemsSalesperson, fetchLastItemsSalespersonScli, fetchLastItemsScli, fetchRangeScli } from '../utils/api'
import { getDate, getDateWithoutHyphen } from '../utils/helpers'
import { orderRecordCols } from '../utils/constants'
import Loader from '../components/elements/Loader'
import BackScreen from '../components/elements/BackScreen'
import Logos from '../components/elements/Logos'
import NoDataText from '../components/elements/NoDataText'

const OrderRecord = () => {
  const [loadingOrderRecord, setLoadingOrderRecord] = useState(true)
  const [lastItems, setLastItems] = useState([])
  const [selectedItem, setSelectedItem] = useState<any>({})

  const [dollarCurrency, setDollarCurrency] = useState(false)
  const [modalDetails, setModalDetails] = useState(false)
  const [modalOlderOnes, setModalOlderOnes] = useState(false)

  const [openDatePickerFrom, setOpenDatePickerFrom] = useState(false)
  const [dateFrom, setDateFrom] = useState(new Date())
  const [openDatePickerTo, setOpenDatePickerTo] = useState(false)
  const [dateTo, setDateTo] = useState(new Date())

  const { themeColors: { background, primary, typography, list, green, lightList, turquoise }, myUser: { access: { customerAccess, labAccess, salespersonAccess }, us_codigo, clipro, cliente, customer, image_url } } = useLogin()
  const { lookAtPharmacy } = useInv()
  const toast = useToast()
  const id = 'toast'

  // Date from
  useEffect(() => {
    const currentDate = new Date()
    currentDate.setMonth(currentDate.getMonth() - 1)
    setDateFrom(currentDate)
  }, [])

  // Get last items
  useEffect(() => {
    const getLastItems = async () => {
      try {
        let data

        if (customerAccess) {
          data = await fetchLastItemsScli(cliente as string)
        } else if (labAccess) {
          if (lookAtPharmacy) {
            data = await fetchLastItemsLabScli({ code: us_codigo as string, customer: String(customer?.cliente) })
          } else {
            data = await fetchLastItemsLab({ clipro: clipro as string, code: us_codigo as string })
          }
        } else if (salespersonAccess) {
          if (lookAtPharmacy) {
            data = await fetchLastItemsSalespersonScli({ code: us_codigo as string, customer: String(customer?.cliente) })
          } else {
            data = await fetchLastItemsSalesperson(String(us_codigo))
          }
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
  const filter = async () => {
    // invalid date
    if (dateFrom > dateTo) {
      if (!toast.isActive(id)) {
        toast.show({
          id,
          title: 'Rango de fechas no válido',
          duration: 1500
        })
      } 
    }

    // download pdf
    try {
      // const pdfUrl = await fetchRangeScli({ customer: String(myUser.cliente), dateFrom: getDateWithoutHyphen(dateFrom), dateTo: getDateWithoutHyphen(dateTo) })
      const pdfUrl = 'https://global.sharp/contents/calculator/support/classroom/el-w531/pdf/Random_Numbers.pdf'
      
      const { config, fs } = RNFetchBlob
      const downloads = fs.dirs?.DownloadDir
      return config({
        fileCache: true,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          path: downloads + '/' + `certra${getDate(dateTo)}` + '.pdf',
        }
      })
      .fetch('GET', pdfUrl)
        .then(() => {
          if (!toast.isActive(id)) {
            toast.show({
              id,
              title: 'PDF descargado correctamente',
              duration: 2500
            })
          } 
        })
        .catch(() => {
          if (!toast.isActive(id)) {
            toast.show({
              id,
              title: 'No se encontraron datos',
              duration: 1500
            })
          } 
        })
    } catch (error) {
      if (!toast.isActive(id)) {
        toast.show({
          id,
          title: 'Error al filtrar',
          duration: 1500
        })
      } 
    }
  }

  return (
    <>
      <View className='flex-1 px-3 pt-6' style={{ backgroundColor: background }}>
        <StatusBar backgroundColor={background} barStyle='dark-content' />

        <Logos image={image_url as URL} />

        <View className='flex flex-row items-center justify-between'>
          <BackScreen title='Historial' />

          {lastItems?.length !== 0 && (
            <View className='flex flex-row items-center'>
              <Text className='font-black' style={{ fontSize: wp(5), color: turquoise }}>Bs</Text>
              <Switch 
                onToggle={() => setDollarCurrency(!dollarCurrency)}
                value={dollarCurrency}
                onTrackColor={'green.600'}
                offTrackColor={'gray.400'}
                size='md'
              />
              <Text className='font-black' style={{ fontSize: wp(5.5), color: turquoise }}>$</Text>
            </View>
          )}
        </View>

        <View>
          {loadingOrderRecord ? (
            <View className='mt-5'>
              <Loader color={`${primary}`} />
            </View>
          ) : (
            lastItems?.length === 0 ? (
              <NoDataText
                text='No hay pedidos recientes'
              />
            ) : (
              <View>
                
                {/* table header */}
                <View className='flex flex-row justify-center items-center mt-4'>
                  {orderRecordCols[customerAccess ? 0 : 1].map((item) => {
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
                      const { numero, fecha, subTotal, iva, importe, unidades, total, nombre, totaldolar } = item
                      const isPair = index % 2 === 0
                      const isLast = index === lastItems.length - 1
                      return (
                        <>
                          {customerAccess ? (
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
                              <Text className='text-center' style={{ color: typography, width: wp(13.5), fontSize: wp(2.6) }}>{iva}%</Text>
                              <Text className='text-center' style={{ color: typography, width: wp(13.5), fontSize: wp(2.6) }}>{dollarCurrency ? `${totaldolar} $` : `${importe} Bs` ?? `${total} Bs`}</Text>
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
                              <Text className='text-center' style={{ color: typography, width: wp(11), fontSize: wp(2.6) }}>{numero}</Text>
                              <Text className='text-center' style={{ color: typography, width: wp(32), fontSize: wp(2.6) }}
                                numberOfLines={1}
                              >
                                {nombre}
                              </Text>
                              <Text className='text-center' style={{ color: typography, width: wp(15), fontSize: wp(2.6) }}>{fecha}</Text>
                              <Text className='text-center' style={{ color: typography, width: wp(11), fontSize: wp(2.6) }}>{dollarCurrency ? `${totaldolar} $` : `${importe} Bs` ?? `${total} Bs`}</Text>
                              <Text className='text-center' style={{ color: typography, width: wp(11), fontSize: wp(2.6) }}>{unidades}</Text>
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
            )
          )}
        </View>
      </View>

      {/* modal details */}
      <Modal isOpen={modalDetails} onClose={() => setModalDetails(false)} animationPreset='fade'>
        <Modal.Content style={{ width: wp(95), minHeight: 350, maxHeight: 700, backgroundColor: lightList }}>

          {/* header */}
          <View className='flex flex-row items-center justify-between' style={{ height: wp(16), backgroundColor: list }}>
            <View className='flex flex-row items-center'>
              <Text className='pl-5' style={{ fontSize: wp(4.5), color: typography, width: wp(60) }}>
                {selectedItem?.fecha}
              </Text>
            </View>

            <TouchableOpacity className='flex flex-row items-center justify-center' 
              onPress={() => setModalDetails(false)}
              style={{ height: wp(16), width: wp(16), backgroundColor: green }}
            >
              <XMarkIcon size={wp(10)} color='white' />
            </TouchableOpacity>
          </View>

          {/* columns */}
          <View className='flex flex-row items-center py-2' style={{ borderBottomWidth: 0.3, borderBottomColor: turquoise }}>
            {orderRecordCols[2].map((item) => {
              const { id, size, name } = item
              return (
                <Text key={id} className='text-center'
                  style={{ fontSize: wp(2.4), color: typography, width: wp(size) }}
                >{name}</Text>
              )
            })}
          </View>

          {/* content */}
          <FlatList
            data={selectedItem?.productos}
            numColumns={1}
            contentContainerStyle={{paddingBottom: 10}}
            showsVerticalScrollIndicator={false}
            renderItem={({item, index}) => {
              const { codigo, nombreP, cantidad, precio, iva, total, preciodolar, totaldolar } = item
              const isLast = index === selectedItem?.productos.length - 1
              return (
                <View className='flex flex-row items-center justify-center py-3'
                  style={{ borderBottomWidth: isLast ? 0 : 0.3, borderBottomColor: turquoise }}
                >
                  <Text className='text-center' style={{ color: typography, width: wp(10), fontSize: wp(2.6) }}>{codigo}</Text>
                  <Text className='text-center' style={{ color: typography, width: wp(42), fontSize: wp(2.6) }}
                    numberOfLines={1}
                  >
                    {nombreP}
                  </Text>
                  <Text className='text-center' style={{ color: typography, width: wp(10), fontSize: wp(2.6) }}>{cantidad}</Text>
                  <Text className='text-center' style={{ color: typography, width: wp(10), fontSize: wp(2.6) }}>{dollarCurrency ? `${preciodolar} $` : `${precio} Bs`}</Text>
                  <Text className='text-center' style={{ color: typography, width: wp(10), fontSize: wp(2.6) }}>{iva}%</Text>
                  <Text className='text-center' style={{ color: typography, width: wp(10), fontSize: wp(2.6) }}>{dollarCurrency ? `${totaldolar} $` : `${total} Bs`}</Text>
                </View>
              )
            }} 
          />

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
                <TouchableOpacity onPress={() => setOpenDatePickerFrom(true)} className='flex flex-row items-center'>
                  <Image style={{ width: wp(6), height: wp(6) }} resizeMode='cover'
                    source={require('../assets/calendar.png')}
                  />
                  <Text className='font-normal pl-2' style={{ fontSize: wp(3.5), color: typography }}>
                    {getDate(dateFrom)}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View className='w-[48%] flex flex-col'>
              <Text className='font-bold mb-0.5' style={{ fontSize: wp(3.5), color: typography }}>Hasta</Text>

              <View className='flex flex-row items-center rounded-lg pl-2' style={{ backgroundColor: lightList, height: wp(10) }}>
                <TouchableOpacity onPress={() => setOpenDatePickerTo(true)} className='flex flex-row items-center'>
                  <Image style={{ width: wp(6), height: wp(6) }} resizeMode='cover'
                    source={require('../assets/calendar.png')}
                  />
                  <Text className='font-normal pl-2' style={{ fontSize: wp(3.5), color: typography }}>
                    {getDate(dateTo)}
                  </Text>
                </TouchableOpacity>
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

      {/* date picker from */}
      <DatePicker
        modal
        mode='date'
        open={openDatePickerFrom}
        date={dateFrom}
        onConfirm={(date) => {
          setOpenDatePickerFrom(false)
          setDateFrom(date)
        }}
        onCancel={() => {
          setOpenDatePickerFrom(false)
        }}
      />

      {/* date picker to */}
      <DatePicker
        modal
        mode='date'
        open={openDatePickerTo}
        date={dateTo}
        onConfirm={(date) => {
          setOpenDatePickerTo(false)
          setDateTo(date)
        }}
        onCancel={() => {
          setOpenDatePickerTo(false)
        }}
      />
    </>
  )
}

export default OrderRecord