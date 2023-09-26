import { useState, useEffect } from 'react'
import { View, Text, StatusBar, FlatList, TouchableOpacity, Image } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import useLogin from '../hooks/useLogin'
import { fetchLast10 } from '../utils/api'
import { orderRecordCols } from '../utils/constants'
import BackScreen from '../components/BackScreen'
import Logos from '../components/Logos'
import Loader from '../components/Loader'

const OrderRecord = () => {
  const [loadingOrderRecord, setLoadingOrderRecord] = useState(true)
  const [lastItems, setLastItems] = useState([])

  const { themeColors: { background, primary, typography, list, green, turquoise }, myUser } = useLogin()

  // Get last items
  useEffect(() => {
    const getLastItems = async () => {
      try {
        const res = await fetchLast10()
        setLastItems(res)

        if (res) {
          setLoadingOrderRecord(false)
        }
      } catch (error) {
        console.log(error)
      }
    }
    getLastItems()
  }, [])

  return (
    <View className='flex-1 px-3 pt-6' style={{ backgroundColor: background }}>
      <StatusBar backgroundColor={background} barStyle='dark-content' />

      <Logos image={myUser?.image_url} />
      <BackScreen title='Historial' />

      <View>
        {loadingOrderRecord ? (
          <View className='mt-10'>
            <Loader color={`${primary}`} />
          </View>
        ) : (
          <View>
            
            {/* table header */}
            <View className='flex flex-row justify-center items-center mt-4'>
              {orderRecordCols.map((item) => {
                const { id, name } = item
                return (
                  <Text key={id} className='text-center' 
                    style={{ fontSize: wp(2.4), color: typography, width: wp(13.5) }}
                  >{name}</Text>
                )
              })}
            </View>

            {/* content */}
            <View className='mt-1'>
              <FlatList
                data={lastItems}
                numColumns={1}
                contentContainerStyle={{ paddingBottom: wp(10) }}
                showsVerticalScrollIndicator={false}
                renderItem={({item, index}) => {
                  const { id, fecha, subTotal, iva, importe, unidades } = item
                  let isPair = index % 2 === 0
                  let isLast = index === lastItems.length - 1
                  return (
                    <View key={id} className='flex flex-row justify-center items-center mb-[1px]' 
                      style={{ 
                        backgroundColor: !isPair ? background : list, 
                        height: wp(14),
                        borderTopRightRadius: index === 0 ? wp(5) : 0,
                        borderTopLeftRadius: index === 0 ? wp(5) : 0, 
                        borderBottomRightRadius: isLast ? wp(5) : 0,
                        borderBottomLeftRadius: isLast ? wp(5) : 0,
                      }}
                    >
                      <Text className='text-center' style={{ color: typography, width: wp(13.5), fontSize: wp(2.6) }}>{id}</Text>
                      <Text className='text-center' style={{ color: typography, width: wp(13.5), fontSize: wp(2.6) }}>{fecha}</Text>
                      <Text className='text-center' style={{ color: typography, width: wp(13.5), fontSize: wp(2.6) }}>{subTotal}</Text>
                      <Text className='text-center' style={{ color: typography, width: wp(13.5), fontSize: wp(2.6) }}>{iva}</Text>
                      <Text className='text-center' style={{ color: typography, width: wp(13.5), fontSize: wp(2.6) }}>{importe}</Text>
                      <Text className='text-center' style={{ color: typography, width: wp(13.5), fontSize: wp(2.6) }}>{unidades}</Text>
                      <TouchableOpacity className='flex flex-col justify-center items-center' 
                        style={{ 
                          width: wp(13.5), 
                          height: '100%', 
                          backgroundColor: green,
                          borderTopRightRadius: index === 0 ? wp(5) : 0,
                          borderBottomRightRadius: isLast ? wp(5) : 0,
                        }}
                      >
                        <Image style={{ width: wp(6), height: wp(6) }} resizeMode='cover'
                          source={require('../assets/search.png')}
                        />
                        <Text className='text-white font-normal' style={{ fontSize: wp(2.4) }}>Enviado</Text>
                      </TouchableOpacity>
                    </View>
                  )
                }} 
              />
            </View>

            {/* older ones */}
            {/* <TouchableOpacity onPress={() => ''} className='py-3 rounded-xl' 
              style={{ backgroundColor: turquoise }}
            >
              <Text className='text-center font-bold text-white' style={{ fontSize: wp(5) }}>Ver más antiguos</Text>
            </TouchableOpacity> */}
          </View>
        )}
      </View>
    </View>
  )
}

export default OrderRecord