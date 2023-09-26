import { useState } from 'react'
import { View, Text, TouchableOpacity, Image, Pressable, TextInput } from 'react-native'
import { PresenceTransition, Menu, useToast } from 'native-base'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { ChevronDownIcon, ChevronUpIcon } from 'react-native-heroicons/mini'
import useLogin from '../hooks/useLogin'
import { getDate } from '../utils/helpers'
import { fetchItineraryItem } from '../utils/api'

const ItineraryDayEvent = ({ 
  day, 
  dayInText, 
  cliente, 
  direccion,
  reasons,
  telefono,
  numero
}: { 
  day: string
  dayInText: string 
  cliente: string
  direccion: string
  reasons: []
  telefono: string
  numero: string
}) => {
  const [openDetails, setOpenDetails] = useState(false)
  const [selectedReason, setSelectedReason] = useState('')
  const [observation, setObservation] = useState('')

  // toast
  const toast = useToast()
  const id = "test-toast"
  const { themeColors: { typography, turquoise, lightList, charge, primary }, locationPermissionGranted, getCurrentLocation } = useLogin()

  // Save
  const handleSave = async () => {
    if (locationPermissionGranted) {

      // get location
      const currentLocation = await getCurrentLocation()
      const { latitude, longitude } = currentLocation

      if (currentLocation) {
        const requestData = {
          numero,
          coordenadas: `${latitude}, ${longitude}`,
          observacion: observation,
          motivo: selectedReason,
          fecha: getDate(new Date())
        }

        // sen data
        const res = await fetchItineraryItem(requestData)
        
        // toast message
        if (!toast.isActive(id)) {
          toast.show({
            id,
            title: res ? 'Se ha enviado correctamente' : 'No se ha podido enviar',
          })
        }
      }
    }
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

        {/* drugstore */}
        <TouchableOpacity className='flex-row' onPress={() => setOpenDetails(!openDetails)}>
          <View className='p-1.5 rounded-lg' style={{ backgroundColor: turquoise, width: wp(openDetails ? 75 : 83) }}>
            <Text className='font-normal text-white' numberOfLines={openDetails ? 2 : 1} style={{ maxWidth: wp(70) }}>
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

        {openDetails && (
          <TouchableOpacity onPress={handleSave}>
            <Image style={{ width: wp(7), height: wp(7) }} resizeMode='cover'
              source={require('../assets/file.png')}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* details */}
      <View className='flex flex-row items-center justify-between'>
        <View style={{ width: wp(10) }} />

        {openDetails && (
          <PresenceTransition visible={openDetails} initial={{
            opacity: 0
          }} animate={{
            opacity: 1,
            transition: {
              duration: 250
            }
          }}>
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

              <Menu style={{ backgroundColor: lightList }} shadow={1} w="210" trigger={triggerProps => {
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
                {reasons?.map((reason, index) => {
                  const { motivo } = reason
                  let isLast = index === reasons.length - 1
                  return (
                    <Menu.Item key={motivo} onPress={() => setSelectedReason(motivo)}
                      style={{ borderBottomWidth: isLast ? 0 : 0.3, borderBottomColor: turquoise }}
                    >
                      <Text className='font-normal' style={{ color: typography }}>{motivo}</Text>
                    </Menu.Item>
                  )
                })}
              </Menu>
            </View>

            {/* observation */}
            <View className='flex flex-row items-center justify-between pl-2 mb-1.5'>
              <Text className='text-base font-bold' style={{ color: typography }}>Observación</Text>

              <TextInput className='px-2 rounded-lg text-sm'
                style={{ color: typography, backgroundColor: charge, minHeight: wp(10), maxHeight: wp(30), width: wp(55) }}
                value={observation}
                onChangeText={setObservation}
                selectionColor={primary}
                multiline={true}
              />
            </View>
          </PresenceTransition>
        )}
      </View>
    </View>
  )
}

export default ItineraryDayEvent