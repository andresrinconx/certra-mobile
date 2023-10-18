import { useState, useEffect } from 'react'
import { View, SafeAreaView, StatusBar, Text, ScrollView } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { LineChart } from 'react-native-chart-kit'
import useLogin from '../hooks/useLogin'
import { fetchDataCustomer } from '../utils/api'
import { Logos, BackScreen, Loader, DataField, Divider, TextImage } from '../components'
import { getMonthInText } from '../utils/helpers'

interface DataCustomer {
  label: string
  value: string
}

interface AverageData {
  promdrocerca: string
  promotro: string
  promedios: { 
    fecham: string,
    promdrocerca: string,
    promotro: string
  }[]
}

const CustomerProfile = () => {
  const [loadingCustomerProfile, setLoadingCustomerProfile] = useState(true)
  const [dataCustomer, setDataCustomer] = useState<DataCustomer[]>([])
  const [averageData, setAverageData] = useState<AverageData>()

  const { themeColors: { background, primary, typography, turquoise, green }, myUser: { image_url, customer } } = useLogin()

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
      } catch (error) {
        console.log(error)
      }
    }
    getDataCustomer()
  }, [])

  return (
    <SafeAreaView className='flex-1 px-3' style={{ backgroundColor: background }}>
      <StatusBar backgroundColor={background} barStyle='dark-content' />

      <Logos image={image_url as URL} />
      <BackScreen title='Perfil del cliente' />

      {/* info */}
      <ScrollView
        overScrollMode='never'
      >
        {loadingCustomerProfile || !averageData ? (
          <View className='mt-5'>
            <Loader color={`${primary}`} />
          </View>
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
              image={require('../assets/stadistic.png')}
              text='Estadísticas'
            />

            {/* averages */}
            <View className='flex flex-col pt-4'>
              <View className='flex flex-row justify-between items-center'>
                <Text className='font-medium' style={{ fontSize: hp(2.5), color: typography }}>Promedio Drocerca</Text>
                <Text className='font-bold' style={{ fontSize: hp(2.5), color: turquoise }}>{Number(averageData?.promdrocerca).toFixed(2)}</Text>
              </View>
              <View className='flex flex-row justify-between items-center'>
                <Text className='font-medium' style={{ fontSize: hp(2.5), color: typography }}>Promedio Data Medical</Text>
                <Text className='font-bold' style={{ fontSize: hp(2.5), color: green }}>{Number(averageData?.promotro).toFixed(2)}</Text>
              </View>
            </View>

            {/* chart */}
            <View className='pt-8 -ml-6' >
              <LineChart
                width={wp(125)}
                height={220}
                withInnerLines={true}
                withVerticalLines={false}
                segments={3}
                data={{
                  labels: [
                    getMonthInText(averageData?.promedios[0]?.fecham), 
                    getMonthInText(averageData?.promedios[1]?.fecham), 
                    getMonthInText(averageData?.promedios[2]?.fecham)
                  ],
                  datasets: [
                    { // drocerca data
                      data: [ 
                        Number(averageData?.promedios[0]?.promdrocerca), 
                        Number(averageData?.promedios[1]?.promdrocerca), 
                        Number(averageData?.promedios[2]?.promdrocerca) 
                      ], 
                      color: (opacity = 1) => `rgba(28, 129, 159, ${opacity})` 
                    },
                    { // data medical data
                      data: [ 
                        Number(averageData?.promedios[0]?.promotro), 
                        Number(averageData?.promedios[1]?.promotro), 
                        Number(averageData?.promedios[2]?.promotro) 
                      ], 
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
                    r: '5',
                  }
                }}
              />
            </View>

          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

export default CustomerProfile