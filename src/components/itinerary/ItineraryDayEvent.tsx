import { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, Image, Pressable, TextInput } from 'react-native'
import { PresenceTransition, Menu, useToast } from 'native-base'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { ChevronDownIcon, ChevronUpIcon } from 'react-native-heroicons/mini'
import { getDate } from '../../utils/helpers'
import { fetchItineraryItem } from '../../utils/api'
import useLogin from '../../hooks/useLogin'
import useCertra from '../../hooks/useCertra'
import useNavigation from '../../hooks/useNavigation'
import { Loader } from '../'

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
  const [openDetails, setOpenDetails] = useState(false)
  const [selectedReason, setSelectedReason] = useState('')
  const [observation, setObservation] = useState('')
  const [touch, setTouch] = useState(false)

  const { cliente, direccion, telefono, numero, motivo, descrip, codcli } = item
  const { allCustomers, themeColors: { typography, turquoise, lightList, charge, primary, green }, getCurrentLocation, setMyUser, myUser } = useLogin()
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
          const requestData = {
            numero,
            coordenadas: `${latitude}, ${longitude}`,
            observacion: observation,
            motivo: selectedReason,
            fecha: getDate(new Date())
          }
  
          // send data
          const res = await fetchItineraryItem(requestData)
          
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
            title: 'No se ha podido enviar'
          })
        }
        setTouch(false)
      }
    }
  }

  // Select Customer and Show data
  const handleSelectCustomer = () => {
    const customer = allCustomers.filter((customer) => customer.cliente === codcli)[0]
    setMyUser({ ...myUser, customer })
    setProductsCart([])

    navigation.navigate('CustomerProfile')
  }

  return (
    <View className='flex flex-col'>

      {/* day & descrip */}
      <View className='flex flex-row items-center justify-between'>

        {/* day */}
        <View className='flex flex-col justify-center mb-2' style={{ width: wp(10) }}>
          <Text className='-mb-2 text-center text-sm lowercase' style={{ color: typography }}>{dayInText.substring(0, 3)}</Text>
          <Text className='text-lg text-center' style={{ color: typography }}>{day}</Text>
        </View>

        {/* customer name */}
        <TouchableOpacity className='flex-row' onPress={() => setOpenDetails(!openDetails)}>
          <View className='p-1.5 rounded-lg' style={{ backgroundColor: motivo ? green : turquoise, width: wp(openDetails && !motivo ? 65 : 83) }}>
            <Text className='font-normal text-white' numberOfLines={openDetails ? 2 : 1} style={{ maxWidth: wp(openDetails ? 55 : 70) }}>
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
              <Text className='text-base font-bold' style={{ color: typography }}>Dirección</Text>
              <Text className='text-base font-normal' style={{ color: typography }}>{direccion}</Text>
            </View>

            {/* phone number */}
            <View className='flex flex-row items-center justify-between pl-2 mb-1.5' style={{ width: wp(83) }}>
              <Text className='text-base font-bold' style={{ color: typography }}>Teléfono</Text>
              
              <View className='flex flex-row items-center justify-center rounded-lg' style={{ backgroundColor: charge, width: wp(55), height: wp(10) }}>
                <Text className='text-base font-normal' style={{ color: typography }}>{telefono}</Text>
              </View>
            </View>

            {/* reasons */}
            <View className='flex flex-row items-center justify-between pl-2 mb-1.5'>
              <Text className='text-base font-bold' style={{ color: typography, width: wp(20) }}>Motivo</Text>

              <Menu style={{ backgroundColor: lightList }} shadow={1} w='210' trigger={triggerProps => {
                return <Pressable className='flex flex-col justify-center rounded-lg' 
                         style={{ height: wp(10), width: wp(55), backgroundColor: charge }} 
                         {...triggerProps}
                       >
                         <Text className='text-center text-sm' style={{ color: turquoise }}>
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
                        <Text className='font-normal' style={{ color: typography }}>{motivo}</Text>
                      </Menu.Item>
                    )
                  })
                ):null}
              </Menu>
            </View>

            {/* observation */}
            <View className='flex flex-row items-center justify-between pl-2 mb-1.5'>
              <Text className='text-base font-bold' style={{ color: typography }}>Observación</Text>

              {!descrip ? (
                <TextInput className='px-2 rounded-lg text-sm'
                  style={{ color: typography, backgroundColor: charge, minHeight: wp(10), maxHeight: wp(30), width: wp(55) }}
                  value={observation}
                  onChangeText={setObservation}
                  selectionColor={primary}
                  multiline={true}
                />
              ) : (
                <View className='flex flex-row items-center px-2 py-3.5 rounded-lg text-sm' style={{ backgroundColor: charge, minHeight: wp(10), maxHeight: wp(30), width: wp(55) }}>
                  <Text style={{ color: typography }}>
                    {descrip}
                  </Text>
                </View>
              )}
            </View>
          </PresenceTransition>
        )}
      </View>
    </View>
  )
}

export default ItineraryDayEvent