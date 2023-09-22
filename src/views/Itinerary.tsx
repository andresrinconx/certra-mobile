import { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, FlatList } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { useNavigation } from '@react-navigation/native'
import { StatusBar } from 'react-native'
import { EllipsisHorizontalIcon } from 'react-native-heroicons/solid'
import { ItineraryEventInterface } from '../interfaces/ItineraryEventInterface'
import useLogin from '../hooks/useLogin'
import { getDayOfWeekInText, getMonthAndDays } from '../utils/helpers'
import { fetchItinerary } from '../utils/api'
import { days } from '../utils/constants'
import Loader from '../components/Loader'
import Logos from '../components/Logos'
import BackScreen from '../components/BackScreen'

interface daysItineraryInterface {
  current: boolean,
  day: string | number,
  events: ItineraryEventInterface[]
}

const Itinerary = () => {
  const [loadingItinerary, setLoadingItinerary] = useState(true)

  const [currentDay, setCurrentDay] = useState('')
  const [dayOfWeekInText, setDayOfWeekInText] = useState('')
  const [currentMonthInText, setCurrentMonthInText] = useState('')
  const [daysItinerary, setDaysItinerary] = useState<daysItineraryInterface[]>([])

  const { themeColors: { background, typography, primary, turquoise, lightList }, myUser } = useLogin()
  const navigation = useNavigation()

  // Set data
  useEffect(() => {
    const setData = async () => {
      try {
        // date
        const currentDate = new Date()
  
        // -----------------------------------------------
        // CURRENT DATA
        // -----------------------------------------------

        // month 
        const currentMonthAndDays = getMonthAndDays(currentDate) // object {month: string, days: number}
        setCurrentMonthInText(currentMonthAndDays.month)

        // day
        const currentDay = currentDate.getDate()
        setCurrentDay(String(currentDay))

        // day name
        const currentDayOfWeekInText = getDayOfWeekInText(currentDate)
        setDayOfWeekInText(currentDayOfWeekInText)

        // first day of month
        const currentYear = currentDate.getFullYear()
        const currentMonth = currentDate.getMonth()
        const currentFirstDay = new Date(currentYear, currentMonth, 1)
        const currentFirstDayInText = getDayOfWeekInText(currentFirstDay).substring(0, 3)

        // prev days number
        const prevDaysNumber = 
          'Lun' === currentFirstDayInText ? 0 : 
          'Mar' === currentFirstDayInText ? 1 : 
          'Mié' === currentFirstDayInText ? 2 : 
          'Jue' === currentFirstDayInText ? 3 : 
          'Vie' === currentFirstDayInText ? 4 : 
          'Sáb' === currentFirstDayInText ? 5 : 
          'Dom' === currentFirstDayInText ? 6 : 0


        // post days number
        const postDaysNumber = 
          'Lun' === currentFirstDayInText ?
            currentMonthAndDays.days === 31 ? 11 :
            currentMonthAndDays.days === 30 ? 12 :
            currentMonthAndDays.days === 29 ? 13 :
            currentMonthAndDays.days === 28 ? 14 : 0 :
          'Mar' === currentFirstDayInText ?
            currentMonthAndDays.days === 31 ? 10 :
            currentMonthAndDays.days === 30 ? 11 :
            currentMonthAndDays.days === 29 ? 12 :
            currentMonthAndDays.days === 28 ? 13 : 0 :
          'Mié' === currentFirstDayInText ?
            currentMonthAndDays.days === 31 ? 9 :
            currentMonthAndDays.days === 30 ? 10 :
            currentMonthAndDays.days === 29 ? 11 :
            currentMonthAndDays.days === 28 ? 12 : 0 :
          'Jue' === currentFirstDayInText ?
            currentMonthAndDays.days === 31 ? 8 :
            currentMonthAndDays.days === 30 ? 9 :
            currentMonthAndDays.days === 29 ? 10 :
            currentMonthAndDays.days === 28 ? 11 : 0 :
          'Vie' === currentFirstDayInText ?
            currentMonthAndDays.days === 31 ? 7 :
            currentMonthAndDays.days === 30 ? 8 :
            currentMonthAndDays.days === 29 ? 9 :
            currentMonthAndDays.days === 28 ? 10 : 0 :
          'Sáb' === currentFirstDayInText ?
            currentMonthAndDays.days === 31 ? 6 :
            currentMonthAndDays.days === 30 ? 7 :
            currentMonthAndDays.days === 29 ? 8 :
            currentMonthAndDays.days === 28 ? 9 : 0 :
          'Dom' === currentFirstDayInText ?
            currentMonthAndDays.days === 31 ? 5 :
            currentMonthAndDays.days === 30 ? 6 :
            currentMonthAndDays.days === 29 ? 7 :
            currentMonthAndDays.days === 28 ? 8 : 0 : 0
        
        // -----------------------------------------------
        // MONTH ITINERARY
        // -----------------------------------------------
  
        // days with info
        const dataItinerary = await fetchItinerary(myUser?.vendedor)
        const daysItinerary: daysItineraryInterface[] = []

        // previous days
        for (let i = 0; i < prevDaysNumber; i++) {
          daysItinerary.push({
            current: false,
            day: '',
            events: []
          })
        }

        // days itinerary
        for (let i = 0; i < currentMonthAndDays.days; i++) {
          daysItinerary.push({
            current: true,
            day: i + 1,
            events: dataItinerary.filter((item: ItineraryEventInterface) => String(item.fecha).substring(8, 10) === (String(i + 1).length === 1 ? `0${i + 1}` : String(i + 1)))
          })
        }

        // post days
        for (let i = 0; i < postDaysNumber; i++) {
          daysItinerary.push({
            current: false,
            day: '',
            events: []
          })
        }
        setDaysItinerary(daysItinerary)
  
        setLoadingItinerary(false)
      } catch (error) {
        console.log(error)
      }
    }
    setData()
  }, [])

  return (
    <View className='flex-1 px-2.5 pt-6' style={{ backgroundColor: background }}>
      <StatusBar backgroundColor={background} barStyle='dark-content' />

      <Logos image={myUser?.image_url} />
      <BackScreen title='Itinerario' />

      <View>
        {loadingItinerary ? (
          <View className='mt-5'>
            <Loader color={primary} />
          </View>
        ) : (
          <>
            {/* current month */}
            <View className='mt-2'>
              <Text className='text-center font-bold' style={{ color: typography, fontSize: wp(5) }}>
                {currentMonthInText}
              </Text>
            </View>

            {/* days view */}
            <View className='flex flex-row justify-center items-center mt-4'>
              {days.map((item) => {
                const { id, name } = item
                return (
                  <Text key={id} className='uppercase text-center' 
                    style={{ fontSize: wp(2.4), color: name === dayOfWeekInText ? turquoise : typography, width: wp(13.5) }}
                  >{name}</Text>
                )
              })}
            </View>

            {/* square days view */}
            <View className='border-[0.5px] mt-1' style={{ borderColor: typography }}>
              <FlatList
                data={daysItinerary}
                numColumns={7}
                showsVerticalScrollIndicator={false}
                renderItem={({item: {current, day, events}, index}) => {
                  return (
                    <TouchableOpacity key={index} className='border-[0.5px] p-0.5'
                      style={{ 
                        width: wp(13.5), 
                        height: wp(20), 
                        borderColor: typography, 
                        backgroundColor: current ? background : lightList,
                      }}
                      onPress={() => current ? navigation.navigate('ItineraryDay', {
                        month: currentMonthInText,
                        day,
                        dayOfWeekInText,
                        events
                      }) : ''}
                    >
                      {/* circle day */}
                      <View className='flex flex-row justify-center items-center mb-0.5'
                        style={{ 
                          backgroundColor: day === Number(currentDay) ? turquoise : 'transparent', 
                          width: wp(4), 
                          height: wp(4),
                          borderRadius: day === Number(currentDay) ? 999 : 0, 
                        }}
                      >
                        <Text style={{ fontSize: wp(2.5), color: day === Number(currentDay) ? 'white' : typography }}>
                          {day}
                        </Text>
                      </View>

                      {/* day events */}
                      <FlatList
                        data={events}
                        numColumns={1}
                        className='max-h-[50%]'
                        showsVerticalScrollIndicator={false}
                        renderItem={({item: {cliente}}) => {
                          return (
                            <Text className='mb-0.5 px-1 rounded font-normal text-white' numberOfLines={1}
                              style={{ fontSize: wp(2.5), backgroundColor: turquoise }}
                            >{cliente}</Text>
                          )
                        }} 
                      />

                      {/* more events */}
                      {events?.length > 3 && (
                        <EllipsisHorizontalIcon size={18} color={typography} />
                      )}
                    </TouchableOpacity>
                  )
                }} 
              />
            </View>
          </>
        )}
      </View>

    </View>
  )
}

export default Itinerary