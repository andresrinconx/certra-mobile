import { useState, useEffect } from 'react'
import { View, SafeAreaView, StatusBar, Text, ScrollView, Pressable } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { InformationCircleIcon } from 'react-native-heroicons/outline'
import { themeColors } from '../../tailwind.config'
import { LineChart } from 'react-native-chart-kit'
import { fetchDataCustomer } from '../utils/api'
import { currency, getMonthInText, longDate } from '../utils/helpers'
import { useLogin } from '../hooks'
import { Logos, BackScreen, Loader, DataField, Divider, TextImage, NoDataText } from '../components'

interface DataCustomer {
  label: string
  value: string
}

interface AverageData {
  promdrocerca: string
  promotro: string
  image_url: URL
  deuda: string
  utimaF: string
  message: string
  combinedData: { 
    fecha: string
    promdrocerca: string
    promotro: string
  }[]
  promedios: {
    drogueria: string
    unidades: string
  }[]
  promedioDrogueria: {
    drogueria: string
    unidades: string
  }[]
}

const CustomerProfile = () => {
  const [loadingCustomerProfile, setLoadingCustomerProfile] = useState(true)
  const [dataCustomer, setDataCustomer] = useState<DataCustomer[]>([])
  const [averageData, setAverageData] = useState<AverageData>()
  const [modalDetails, setModalDetails] = useState(false)

  const { background, turquoise, green } = themeColors
  const { myUser: { customer } } = useLogin()

  // Get info
  useEffect(() => {
    const getDataCustomer = async () => {
      try {
        const res = await fetchDataCustomer(customer?.cliente as string)

        if (res) {
          setAverageData(res)
          setDataCustomer([
            { label: 'Código', value: res?.cod_cli },
            { label: 'Nombre', value: res?.nombre },
            { label: 'RIF', value: res?.rif },
          ])

          setLoadingCustomerProfile(false)
        }
        setLoadingCustomerProfile(false)
      } catch (error) {
        console.log(error)
      }
    }
    getDataCustomer()
  }, [])

  // Average Details
  const handleDetailsAverage = () => {
    setModalDetails(true)
  }

  return (
    <>
      <SafeAreaView className='flex-1 px-3 pt-6 bg-background'>
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
                  const { label, value } = item
                  return (
                    <DataField key={label} label={label} value={value} />
                  )
                })}

                <Divider marginY={16} />
                <TextImage 
                  image={require('../assets/stadistic-light.png')}
                  text='Estadísticas'
                />

                {/* averages */}
                <View className='flex flex-col pt-4'>
                  <View className='flex flex-row justify-between items-center'>
                    <Text className='font-medium text-typography' style={{ fontSize: hp(2.5) }}>Promedio Drocerca</Text>
                    
                    <Pressable onPress={() => handleDetailsAverage()} className='flex flex-row items-center space-x-1'>
                      <InformationCircleIcon size={wp(5)} color={turquoise} />
                      <Text className='font-bold text-turquoise' style={{ fontSize: hp(2.5) }}>{Number(averageData?.promdrocerca).toFixed(2)}</Text>
                    </Pressable>
                  </View>
                  <View className='flex flex-row justify-between items-center'>
                    <Text className='font-medium text-typography' style={{ fontSize: hp(2.5) }}>Promedio Data Medical</Text>

                    <Pressable onPress={() => handleDetailsAverage()} className='flex flex-row items-center space-x-1'>
                      <InformationCircleIcon size={wp(5)} color={green} />
                      <Text className='font-bold text-green' style={{ fontSize: hp(2.5) }}>{Number(averageData?.promotro).toFixed(2)}</Text>
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
                      labels: averageData?.combinedData?.map((item) => getMonthInText(item.fecha)),
                      datasets: [
                        { // drocerca
                          data: averageData?.combinedData?.map((item) => Number(item.promdrocerca)), 
                          color: (opacity = 1) => `rgba(28, 129, 159, ${opacity})` 
                        },
                        { // data medical
                          data: averageData?.combinedData?.map((item) => Number(item.promotro)), 
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
  
                <View className='flex flex-row justify-between items-center pt-2'>
                  <Text className='font-medium text-typography' style={{ fontSize: hp(2) }}>Último pedido realizado</Text>
                  <Text className='font-normal text-typography' style={{ fontSize: hp(2) }}>{longDate(averageData?.utimaF as string)}</Text>
                </View>
                {averageData?.deuda && (
                  <View className='flex flex-row justify-between items-center pt-2'>
                    <Text className='font-medium text-typography' style={{ fontSize: hp(2) }}>Saldo vencido</Text>
                    <Text className='font-extrabold text-typography' style={{ fontSize: hp(2) }}>{currency(averageData?.deuda)}</Text>
                  </View>
                )}
              </View>
            )
          )}
        </ScrollView>
      </SafeAreaView>
      
      
    </>
  )
}

export default CustomerProfile