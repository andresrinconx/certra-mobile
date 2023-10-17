import { useState, useEffect } from 'react'
import { View, SafeAreaView, StatusBar } from 'react-native'
import useLogin from '../hooks/useLogin'
import { Logos, BackScreen, Loader } from '../components'

const CustomerProfile = () => {
  const [loadingCustomerProfile, setLoadingCustomerProfile] = useState(true)

  const { themeColors: { background, primary }, myUser: { image_url } } = useLogin()

  useEffect(() => {
    setLoadingCustomerProfile(false)
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
          <View>
            
          </View>
        )}
      </View>
    </SafeAreaView>
  )
}

export default CustomerProfile