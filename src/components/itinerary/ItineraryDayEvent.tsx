import { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, Image, Pressable, TextInput } from 'react-native'
import { PresenceTransition, Menu, useToast } from 'native-base'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { ChevronDownIcon, ChevronUpIcon } from 'react-native-heroicons/mini'
import DatePicker from 'react-native-date-picker'
import { themeColors } from '../../../tailwind.config'
import { getDateDesc } from '../../utils/helpers'
import { fetchItineraryItem, fetchReasign } from '../../utils/api'
import { useCertra, useLogin, useNavigation } from '../../hooks'

const ItineraryDayEvent = ({ 
  day, 
  dayInText, 
  reasons,
  item
}: { 
  day: string
  dayInText: string 
  reasons: []
  item: { cliente: string, direccion: string, telefono: string, numero: string, motivo: string, descrip: string, codcli: string }
}) => {
  const [selectedReason, setSelectedReason] = useState('')
  const [observation, setObservation] = useState('')
  const [touch, setTouch] = useState(false)
  const [openDetails, setOpenDetails] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)

  const [date, setDate] = useState(new Date())
  const [openDatePickerReasign, setOpenDatePickerReasign] = useState(false)

  const { cliente, direccion, telefono, numero, motivo, descrip, codcli } = item
  const { lightList, turquoise, darkTurquoise } = themeColors
  const { allCustomers, getCurrentLocation, setMyUser, myUser, myUser: { us_codigo } } = useLogin()
  const { setReloadItinerary, setProductsCart } = useCertra()
  const navigation = useNavigation()
  const toast = useToast()
  const id = 'toast'

  // Saved Event
  useEffect(() => {
    if (motivo || descrip) {
      setSelectedReason(motivo)
      setObservation(descrip)
    }
  }, [])

  const selectCustomer = () => {
    const customer = allCustomers.find((customer) => customer.cliente === codcli)
    if (customer) {
      setMyUser({ ...myUser, customer })
      setProductsCart([])
    }
  }

  // -----------------------------------------------
  // HANDLERS
  // -----------------------------------------------

  // Search products
  const handleSearchProducts = () => {
    selectCustomer()
    navigation.navigate('SearchProducts')
  }

  // Select Customer and Show data
  const handleSelectCustomer = () => {
    selectCustomer()
    navigation.navigate('CustomerProfile')
  }

  // Save
  const handleSave = async () => {
    if (!touch) {
      if ([selectedReason, observation].includes('')) {
        if (!toast.isActive(id)) {
          toast.show({
            id,
            title: selectedReason ? 'Debe escribir una observación' : 'Debe seleccionar un motivo',
            duration: 1500
          })
        } 
        setTouch(false)
        return
      }
  
      try {
        // get location
        const currentLocation = await getCurrentLocation()
        const { latitude, longitude } = currentLocation as { latitude: number, longitude: number }
  
        if (currentLocation) {
  
          // send data
          const res = await fetchItineraryItem({
            id: numero,
            coordenadas: `${latitude}, ${longitude}`,
            observacion: observation,
            motivo: selectedReason,
            fecha: getDateDesc(new Date())
          })
          
          // toast message
          if (!toast.isActive(id)) {
            toast.show({
              id,
              title: res ? 'Se ha enviado correctamente' : 'No se ha podido enviar',
            })
          }
          
          // success
          navigation.navigate('Itinerary')
          setReloadItinerary(true)
          setTouch(false)
        }
      } catch (error) {
        if (!toast.isActive(id)) {
          toast.show({
            id,
            title: '¡Error! No se ha podido enviar'
          })
        }
        setTouch(false)
      }
    }
  }

  return (
    <>
      <View className='flex flex-col'>

        {/* day & descrip */}
        <View className='flex flex-row items-center justify-between'>

          {/* day */}
          <Pressable className='flex flex-col justify-center mb-2' onLongPress={() => {
            if (!motivo) {
              setOpenDetails(false)
              setOpenEdit(true)
            }
          }} 
            style={{ width: wp(10) }}
          >
            <Text className='-mb-2 text-center text-sm lowercase text-typography'>{dayInText.substring(0, 3)}</Text>
            <Text className='text-lg text-center text-typography'>{day}</Text>
          </Pressable>
          
          {openEdit && (
            <PresenceTransition visible={openEdit} 
              initial={{
                opacity: 0
              }} 
              animate={{
                opacity: 1,
                transition: {
                  duration: 500
                }
              }}
            >
              <TouchableOpacity onPress={() => setOpenDatePickerReasign(true)} className='-ml-2'>
                <Image style={{ width: wp(7), height: wp(7) }} resizeMode='cover'
                  source={require('../../assets/edit.png')}
                />
              </TouchableOpacity>
            </PresenceTransition>
          )}

          {/* customer name */}
          <TouchableOpacity className='flex-row' onPress={() => {
            setOpenEdit(false)
            setOpenDetails(!openDetails)
          }}>
            <View className={`p-1.5 rounded-lg ${motivo ? 'bg-green' : 'bg-turquoise'}`} style={{ width: wp(openDetails && !motivo ? 59 : openEdit ? 75 : 83) }}>
              <Text className='font-normal text-white' numberOfLines={openDetails ? 2 : 1} style={{ maxWidth: wp(openDetails && !motivo ? 50 : 74) }}>
                {cliente}
              </Text>
            </View>

            <View className='flex flex-row justify-center items-center absolute right-1 top-1.5'>
              {openDetails ? (
                <ChevronUpIcon size={18} color='white' />
              ) : (
                <ChevronDownIcon size={18} color='white' />
              )}
            </View>
          </TouchableOpacity>

          {openDetails && !motivo ? (
            <View className='flex flex-row items-center gap-x-1'>

              {/* products */}
              <TouchableOpacity onPress={handleSearchProducts}>
                <Image style={{ width: wp(6.3), height: wp(6.3) }} resizeMode='cover'
                  source={require('../../assets/drugstore.png')}
                />
              </TouchableOpacity>

              {/* stadistic */}
              <TouchableOpacity onPress={handleSelectCustomer}>
                <Image style={{ width: wp(7), height: wp(7) }} resizeMode='cover'
                  source={require('../../assets/stadistic-light.png')}
                />
              </TouchableOpacity>

              {/* save */}
              <TouchableOpacity onPress={() => {
                if (!touch) {
                  setTouch(true)
                  handleSave()
                }
              }}>
                <Image style={{ width: wp(7), height: wp(7) }} resizeMode='cover'
                  source={require('../../assets/file.png')}
                />
              </TouchableOpacity>
            </View>
          ):null}
        </View>

        {/* details */}
        <View className='flex flex-row items-center justify-between'>
          <View style={{ width: wp(10) }} />

          {openDetails && (
            <PresenceTransition visible={openDetails} 
              initial={{
                opacity: 0
              }} 
              animate={{
                opacity: 1,
                transition: {
                  duration: 250
                }
              }}
            >
              {/* address */}
              <View className='pl-2 mb-1.5' style={{ width: wp(83) }}>
                <Text className='text-base font-bold text-typography'>Dirección</Text>
                <Text className='text-base font-normal text-typography'>{direccion}</Text>
              </View>

              {/* phone number */}
              <View className='flex flex-row items-center justify-between pl-2 mb-1.5' style={{ width: wp(83) }}>
                <Text className='text-base font-bold text-typography'>Teléfono</Text>
                
                <View className='flex flex-row items-center justify-center rounded-lg bg-charge' style={{ width: wp(55), height: wp(10) }}>
                  <Text className='text-base font-normal text-typography'>{telefono}</Text>
                </View>
              </View>

              {/* reasons */}
              <View className='flex flex-row items-center justify-between pl-2 mb-1.5'>
                <Text className='text-base font-bold text-typography' style={{ width: wp(20) }}>Motivo</Text>

                <Menu style={{ backgroundColor: lightList }} shadow={1} w={wp(55)} trigger={triggerProps => {
                 return <Pressable className='flex flex-col justify-center rounded-lg bg-charge' 
                          style={{ height: wp(10), width: wp(55) }} 
                          {...triggerProps}
                        >
                          <Text className='text-center text-sm text-turquoise'>
                            {selectedReason ? selectedReason : '----------------------'}
                          </Text>

                          <View className='flex flex-row justify-center items-center absolute right-2 top-2.5'>
                            <ChevronDownIcon size={18} color={turquoise} strokeWidth={2} />
                          </View>
                        </Pressable>
                }}>
                  {!motivo ? (
                    reasons?.map((reason, index) => {
                      const { motivo } = reason
                      const isLast = index === reasons.length - 1
                      return (
                        <Menu.Item key={motivo} onPress={() => setSelectedReason(motivo)}
                          style={{ borderBottomWidth: isLast ? 0 : 0.3, borderBottomColor: turquoise }}
                        >
                          <Text className='font-normal text-typography'>{motivo}</Text>
                        </Menu.Item>
                      )
                    })
                  ):null}
                </Menu>
              </View>

              {/* observation */}
              <View className='flex flex-row items-center justify-between pl-2 mb-1.5'>
                <Text className='text-base font-bold text-typography'>Observación</Text>

                {!descrip ? (
                  <TextInput className='px-2 rounded-lg text-sm text-typography bg-charge'
                    style={{ minHeight: wp(10), maxHeight: wp(30), width: wp(55) }}
                    value={observation}
                    onChangeText={setObservation}
                    selectionColor={darkTurquoise}
                    multiline={true}
                  />
                ) : (
                  <View className='flex flex-row items-center px-2 py-3.5 rounded-lg text-sm bg-charge' style={{ minHeight: wp(10), maxHeight: wp(30), width: wp(55) }}>
                    <Text className='text-typography'>
                      {descrip}
                    </Text>
                  </View>
                )}
              </View>
            </PresenceTransition>
          )}
        </View>
      </View>
      
      {/* date picker from */}
      <DatePicker
        modal
        mode='date'
        open={openDatePickerReasign}
        date={date}
        onConfirm={async (date) => {
          setOpenDatePickerReasign(false)
          setDate(date)
          try {
            const res = await fetchReasign({
              usuario: us_codigo as string,
              id: numero,
              fecha: getDateDesc(date)
            })

            if (!toast.isActive(id)) {
              toast.show({
                id,
                title: res ? 'Se ha actualizado correctamente' : 'No se ha podido actualizar',
              })
            }
            
            // success
            navigation.navigate('Itinerary')
            setReloadItinerary(true)
          } catch (error) {
            console.log(error)
          }
        }}
        onCancel={() => {
          setOpenDatePickerReasign(false)
        }}
      />
    </>
  )
}

export default ItineraryDayEvent