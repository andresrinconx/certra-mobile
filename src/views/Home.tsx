import { useEffect } from 'react'
import { View, BackHandler } from 'react-native'
import { StatusBar } from 'react-native'
import useLogin from '../hooks/useLogin'
import useInv from '../hooks/useInv'
import { SelectCustomer, Loader, Logos, Products, Footer } from '../components'

const Home = () => {
  const { themeColors: { background }, myUser: { image_url } } = useLogin()
  const { loadingSelectCustomer } = useInv()

  // Back handler
  useEffect(() => {
    const backAction = () => {
      BackHandler.exitApp()
      return true
    }

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction)
  }, [])

  return (
    <>
      <View className='flex-1 px-3 pt-6' style={{ backgroundColor: background }}>
        <StatusBar backgroundColor={background} barStyle='dark-content' />

        <View className='flex-1'>
          <Logos image={image_url as URL} />

          <View className='flex-1'>
            {loadingSelectCustomer ? (
              <View className='h-full flex-row items-center justify-center'>
                <Loader />
              </View>
            ) : (
              <>
                <SelectCustomer />
                <Products />
              </>
            )}
          </View>
        </View>

      </View>
      
      <View className='bottom-0'>
        <Footer />
      </View>
    </>
  )
}

export default Home