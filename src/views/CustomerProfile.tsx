import { useState, useEffect } from 'react';
import { View, StatusBar, Text, ScrollView, Pressable, FlatList } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { InformationCircleIcon } from 'react-native-heroicons/outline';
import { themeColors } from '../../tailwind.config';
import { LineChart } from 'react-native-chart-kit';
import { fetchDataCustomer } from '../utils/api';
import { currency, formatAmount, getMonthInText, longDate } from '../utils/helpers';
import { useLogin } from '../hooks';
import { Logos, BackScreen, Loader, DataField, Divider, TextImage, NoDataText, Modal } from '../components';
import { SafeAreaView } from 'react-native-safe-area-context';

interface DataCustomer {
  label: string
  value: string
}

interface Averages {
  drogueria: string
  promedio: string
}

interface AverageData {
  promdrocerca: string
  promotro: string
  image_url: URL
  deuda: string
  utimaF: string
  message: string
  grafica: { 
    fecha: string
    promdrocerca: string
    promotro: string
  }[]
  promedioOtrasDroguerias: Averages[]
  promedioDrocerca: Averages[]
}

const CustomerProfile = () => {
  const [loadingCustomerProfile, setLoadingCustomerProfile] = useState(true);
  const [dataCustomer, setDataCustomer] = useState<DataCustomer[]>([]);
  const [averageData, setAverageData] = useState<AverageData>();
  const [selectedAverages, setSelectedAverages] = useState<Averages[]>([]);

  const [modalDetails, setModalDetails] = useState(false);

  const { background, turquoise, green } = themeColors;
  const { myUser: { customer } } = useLogin();

  // Get info
  useEffect(() => {
    const getDataCustomer = async () => {
      try {
        const res = await fetchDataCustomer(customer?.cliente as string);

        if (res) {
          setAverageData(res);
          setDataCustomer([
            { label: 'Código', value: res?.cod_cli },
            { label: 'Nombre', value: res?.nombre },
            { label: 'RIF', value: res?.rif },
          ]);

          setLoadingCustomerProfile(false);
        }
        setLoadingCustomerProfile(false);
      } catch (error) {
        console.log(error);
      }
    };
    getDataCustomer();
  }, []);

  // Average Details
  const handleDetailsAverage = (data: Averages[]) => {
    setSelectedAverages(data);
    setModalDetails(true);
  };

  return (
    <>
      <SafeAreaView className='flex-1 px-3 bg-background'>
        <StatusBar backgroundColor={background} barStyle='dark-content' />

        <Logos image={averageData?.image_url as URL} />
        <BackScreen title='Perfil del cliente' />

        {/* info */}
        <ScrollView
          overScrollMode='auto'
          showsVerticalScrollIndicator={false}
        >
          {loadingCustomerProfile ? (
            <View className='mt-5'>
              <Loader />
            </View>
          ) : (
            averageData?.message || averageData === undefined ? (
              <NoDataText text='No se encontraron datos de este cliente' />
            ) : (
              <View className='px-3 pt-3'>
                {dataCustomer.map((item) => {
                  const { label, value } = item;
                  return (
                    <DataField key={label} label={label} value={value} />
                  );
                })}

                <Divider marginY={16} />
                <TextImage 
                  image={require('../assets/stadistic-light.png')}
                  text='Estadísticas'
                />

                {/* averages */}
                <View className='flex flex-col pt-4 space-y-1'>
                  <View className='flex flex-row justify-between items-center'>
                    <Text className='font-medium text-typography' style={{ fontSize: hp(2.5) }}>Promedio Drocerca</Text>
                    
                    <Pressable onPress={() => handleDetailsAverage(averageData?.promedioDrocerca)} className='flex flex-row items-center space-x-1'>
                      <InformationCircleIcon size={wp(5)} color={turquoise} />
                      <Text className='font-bold text-turquoise' style={{ fontSize: hp(2.5) }}>{formatAmount(averageData?.promdrocerca)}</Text>
                    </Pressable>
                  </View>
                  <View className='flex flex-row justify-between items-center'>
                    <Text className='font-medium text-typography' style={{ fontSize: hp(2.5) }}>Promedio Data Medical</Text>

                    <Pressable onPress={() => handleDetailsAverage(averageData?.promedioOtrasDroguerias)} className='flex flex-row items-center space-x-1'>
                      <InformationCircleIcon size={wp(5)} color={green} />
                      <Text className='font-bold text-green' style={{ fontSize: hp(2.5) }}>{formatAmount(averageData?.promotro)}</Text>
                    </Pressable>
                  </View>
                </View>

                {/* chart */}
                <View className='pt-8 -ml-6'>
                  <LineChart
                    width={wp(125)}
                    height={220}
                    withInnerLines={true}
                    withVerticalLines={false}
                    segments={3}
                    data={{
                      labels: averageData?.grafica?.map((item) => getMonthInText(item.fecha)),
                      datasets: [
                        { // drocerca
                          data: averageData?.grafica?.map((item) => Number(item.promdrocerca)), 
                          color: (opacity = 1) => `rgba(28, 129, 159, ${opacity})` 
                        },
                        { // data medical
                          data: averageData?.grafica?.map((item) => Number(item.promotro)), 
                          color: (opacity = 1) => `rgba(146, 191, 30, ${opacity})` 
                        },
                      ]
                    }}
                    chartConfig={{
                      backgroundColor: `${background}`,
                      backgroundGradientFrom: `${background}`,
                      backgroundGradientTo: `${background}`,
                      color: (opacity = 1) => `rgba(28, 129, 159, ${opacity})`,
                      labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                      fillShadowGradient: `${green}`,
                      strokeWidth: 2,
                      decimalPlaces: 0,
                      propsForDots: {
                        r: '3',
                      }
                    }}
                  />
                </View>
  
                {/* other data */}
                <View className='flex flex-row justify-between items-center pt-2'>
                  <Text className='font-medium text-typography' style={{ fontSize: hp(1.9) }}>Última compra</Text>
                  <Text className='font-normal text-typography' style={{ fontSize: hp(1.9) }}>{longDate(averageData?.utimaF as string)}</Text>
                </View>
                {averageData?.deuda && (
                  <View className='flex flex-row justify-between items-center pt-2'>
                    <Text className='font-medium text-typography' style={{ fontSize: hp(1.9) }}>Saldo vencido</Text>
                    <Text className='font-extrabold text-typography' style={{ fontSize: hp(1.9) }}>{currency(averageData?.deuda)}</Text>
                  </View>
                )}
              </View>
            )
          )}
        </ScrollView>
      </SafeAreaView>
      
      {/* modal selected averages */}
      <Modal
        bgColor={background}
        minHeight={50}
        maxHeight={120}
        openModal={modalDetails}
        setOpenModal={setModalDetails}
      >
        <View>
          <FlatList
            data={selectedAverages}
            numColumns={1}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => {
              const { drogueria, promedio } = item;
              const isLast = index === selectedAverages.length - 1;
              return (
                <>
                  {drogueria && (
                    <View className='flex flex-row justify-between items-center px-3 py-4 space-x-2 border-b-turquoise'
                      style={{ borderBottomWidth: isLast ? 0 : 0.3 }}
                    >
                      <Text className='font-medium text-typography' style={{ fontSize: hp(2), width: wp(65) }}>
                        {drogueria}
                      </Text>
                      <Text className='font-bold text-right text-turquoise' style={{ fontSize: hp(2), width: wp(18) }}>
                        {formatAmount(promedio)}
                      </Text>
                    </View>
                  )}
                </>
              );
            }} 
          />
        </View>
      </Modal>
    </>
  );
};

export default CustomerProfile;