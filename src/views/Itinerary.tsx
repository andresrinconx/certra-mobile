import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Pressable } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { StatusBar } from 'react-native';
import { EllipsisHorizontalIcon } from 'react-native-heroicons/solid';
import { themeColors } from '../../tailwind.config';
import { ItineraryEventInterface } from '../utils/interfaces';
import { getDayOfWeekInText, getMonthAndDays } from '../utils/helpers';
import { fetchItinerary, fetchReasons } from '../utils/api';
import { days } from '../utils/constants';
import { useCertra, useLogin, useNavigation } from '../hooks';
import { Loader, Logos, BackScreen } from '../components';
import { SafeAreaView } from 'react-native-safe-area-context';

interface daysItineraryInterface {
  current: boolean,
  day: string | number,
  events: ItineraryEventInterface[]
}

const Itinerary = () => {
  const [loadingItinerary, setLoadingItinerary] = useState(true);

  const [currentYear, setCurrentYear] = useState('');
  const [currentMonth, setCurrentMonth] = useState('');
  const [currentMonthInText, setCurrentMonthInText] = useState('');
  const [currentDay, setCurrentDay] = useState('');
  const [dayOfWeekInText, setDayOfWeekInText] = useState('');
  const [daysItinerary, setDaysItinerary] = useState<daysItineraryInterface[]>([]);

  const [reasons, setReasons] = useState([]);
  const [location, setLocation] = useState('');

  const { background, turquoise } = themeColors;
  const { myUser, locationPermissionGranted, checkLocationPermission, getCurrentLocation } = useLogin();
  const { reloadItinerary } = useCertra();
  const navigation = useNavigation();

  // Load
  useEffect(() => {
    checkLocationPermission();
    getLocation();
  }, []);

  // Reload
  useEffect(() => {
    if (reloadItinerary) {
      setLoadingItinerary(true);
      setData();
    }
  }, [reloadItinerary]);

  const getLocation = async () => {
    try {
      const { latitude } = await getCurrentLocation() as { latitude: number };
      
      if (latitude) {
        setLocation(String(latitude));
        setData();
      }
    } catch (error) {
      setLoadingItinerary(false);
    }
  };

  // Set data
  const setData = async () => {
    try {
      // date
      const currentDate = new Date();

      // -----------------------------------------------
      // CURRENT DATA
      // -----------------------------------------------

      // year
      const currentYear = currentDate.getFullYear();
      setCurrentYear(String(currentYear));

      // month and days
      const currentMonthAndDays = getMonthAndDays(currentDate); // object {month: string, days: number}
      setCurrentMonthInText(currentMonthAndDays.month);

      // month
      const currentMonth = currentDate.getMonth();
      setCurrentMonth(String(currentMonth + 1));

      // day
      const currentDay = currentDate.getDate();
      setCurrentDay(String(currentDay));

      // day name
      const currentDayOfWeekInText = getDayOfWeekInText(currentDate);
      setDayOfWeekInText(currentDayOfWeekInText);

      // first day of month
      const currentFirstDay = new Date(currentYear, currentMonth, 1);
      const currentFirstDayInText = getDayOfWeekInText(currentFirstDay).substring(0, 3);

      // prev days number
      const prevDaysNumber = 
        'Lun' === currentFirstDayInText ? 0 : 
        'Mar' === currentFirstDayInText ? 1 : 
        'Mié' === currentFirstDayInText ? 2 : 
        'Jue' === currentFirstDayInText ? 3 : 
        'Vie' === currentFirstDayInText ? 4 : 
        'Sáb' === currentFirstDayInText ? 5 : 
        'Dom' === currentFirstDayInText ? 6 : 0;


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
          currentMonthAndDays.days === 28 ? 8 : 0 : 0;
      
      // -----------------------------------------------
      // MONTH ITINERARY
      // -----------------------------------------------

      // days with info
      const dataItinerary = await fetchItinerary({
        salesperson: myUser?.vendedor ? myUser?.vendedor : String(0), 
        year: String(currentYear), 
        month: String(currentMonth + 1)
      });

      const daysItinerary: daysItineraryInterface[] = [];

      // previous days
      for (let i = 0; i < prevDaysNumber; i++) {
        daysItinerary.push({
          current: false,
          day: '',
          events: []
        });
      }

      // days itinerary
      for (let i = 0; i < currentMonthAndDays.days; i++) {
        daysItinerary.push({
          current: true,
          day: i + 1,
          events: dataItinerary?.filter((item: ItineraryEventInterface) => String(item.fecha).substring(8, 10) === (String(i + 1).length === 1 ? `0${i + 1}` : String(i + 1)))
        });
      }

      // post days
      for (let i = 0; i < postDaysNumber; i++) {
        daysItinerary.push({
          current: false,
          day: '',
          events: []
        });
      }
      setDaysItinerary(daysItinerary);

      // -----------------------------------------------
      // OTHER
      // -----------------------------------------------

      // reasons
      const reasons = await fetchReasons();
      setReasons(reasons);

      setLoadingItinerary(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView className='flex-1 px-2.5 bg-background'>
      <StatusBar backgroundColor={background} barStyle='dark-content' />

      <Logos image={myUser?.image_url as URL} />
      <BackScreen title='Itinerario' />

      <View>
        {loadingItinerary ? (
          <View className='mt-5'>
            <Loader />
          </View>
        ) : (
          !locationPermissionGranted || location === '' ? (
            <Pressable onPress={() => {
              setLoadingItinerary(true);
              getLocation();
            }} className='mt-5'>
              <Text className='text-center font-bold text-typography' style={{ fontSize: wp(4) }}>Por favor activar GPS</Text>
              <Text className='text-center font-medium text-darkTurquoise' style={{ fontSize: wp(4) }}>Volver a cargar</Text>
            </Pressable>
          ) : (
            <>

              {/* current month */}
              <View className='mt-2'>
                <Text className='text-center font-bold text-typography' style={{ fontSize: wp(5) }}>
                  {currentMonthInText}
                </Text>
              </View>

              {/* days view */}
              <View className='flex flex-row justify-center items-center mt-4'>
                {days.map((item) => {
                  const { id, name } = item;
                  return (
                    <Text key={id} className={`uppercase text-center ${name === dayOfWeekInText ? 'text-turquoise' : 'text-typography'}`} 
                      style={{ fontSize: wp(2.4), width: wp(13.5) }}
                    >{name}</Text>
                  );
                })}
              </View>

              {/* square days view */}
              <View className='border-[0.5px] mt-1 border-typography'>
                <FlatList
                  data={daysItinerary}
                  numColumns={7}
                  showsVerticalScrollIndicator={false}
                  renderItem={({item: {current, day, events}, index}) => {
                    const date = new Date(`${currentYear}-${currentMonth}-${Number(day) + 1}`);
                    const dayInText = getDayOfWeekInText(date);

                    return (
                      <TouchableOpacity key={index} className={`p-0.5 border-[0.5px] border-typography ${current ? 'bg-background' : 'bg-lightList'}`}
                        style={{ 
                          width: wp(13.5), 
                          height: wp(20), 
                        }}
                        onPress={() => current ? navigation.navigate('ItineraryDay', {
                          month: currentMonthInText,
                          day,
                          dayInText,
                          events,
                          reasons
                        }) : ''}
                      >
                        {/* circle day */}
                        <View className={`flex flex-row justify-center items-center mb-0.5 ${day === Number(currentDay) ? 'bg-turquoise' : 'bg-transparent'}`}
                          style={{ 
                            width: wp(4), 
                            height: wp(4),
                            borderRadius: day === Number(currentDay) ? 999 : 0, 
                          }}
                        >
                          <Text className={`${day === Number(currentDay) ? 'text-white' : 'text-typography'}`} style={{ fontSize: wp(2.5) }}>
                            {day}
                          </Text>
                        </View>
    
                        {/* events */}
                        {events?.length > 0 && (
                          <View className='flex flex-row items-center justify-center h-[50%]'>
                            <EllipsisHorizontalIcon size={18} color={turquoise} />
                          </View>
                        )}
                      </TouchableOpacity>
                    );
                  }} 
                />
              </View>
            </>
          )
        )}
      </View>

    </SafeAreaView>
  );
};

export default Itinerary;