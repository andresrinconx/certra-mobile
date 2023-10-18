import { useState, useEffect } from 'react'
import { View, SafeAreaView, StatusBar, FlatList, Text } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import useLogin from '../hooks/useLogin'
import { fetchDataCustomer } from '../utils/api'
import { Logos, BackScreen, Loader, DataField, Divider, TextImage } from '../components'

interface DataCustomer {
  label: string
  value: string
}

const CustomerProfile = () => {
  const [loadingCustomerProfile, setLoadingCustomerProfile] = useState(true)
  const [dataCustomer, setDataCustomer] = useState<DataCustomer[]>([])

  const { themeColors: { background, primary, typography, turquoise }, myUser: { image_url, customer } } = useLogin()

  useEffect(() => {
    const getDataCustomer = async () => {
      try {
        const res = await fetchDataCustomer(customer?.cliente as string)

        if (res) {
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
      <View>
        {loadingCustomerProfile ? (
          <View className='mt-5'>
            <Loader color={`${primary}`} />
          </View>
        ) : (
          <View className='px-3 pt-3'>
            <FlatList
              data={dataCustomer}
              numColumns={1}
              showsVerticalScrollIndicator={false}
              renderItem={({item}) => {
                const { label, value } = item
                return (
                  <DataField label={label} value={value} />
                )
              }} 
            />

            <Divider marginY={16} />
            <TextImage 
              image={require('../assets/stadistic.png')}
              text='Estadísticas'
            />

            {/* averages */}
            <View className='flex flex-col pt-4'>
              <View className='flex flex-row justify-between items-center'>
                <Text className='font-medium' style={{ fontSize: hp(2.5), color: typography }}>Promedio Drocerca</Text>
                <Text className='font-bold' style={{ fontSize: hp(2.5), color: turquoise }}>200</Text>
              </View>
              <View className='flex flex-row justify-between items-center'>
                <Text className='font-medium' style={{ fontSize: hp(2.5), color: typography }}>Promedio Data Medica</Text>
                <Text className='font-bold' style={{ fontSize: hp(2.5), color: turquoise }}>3000</Text>
              </View>
            </View>

            {/* chart */}
            <View>
              
            </View>

          </View>
        )}
      </View>
    </SafeAreaView>
  )
}

export default CustomerProfile