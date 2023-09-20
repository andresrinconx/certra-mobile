import { useEffect } from 'react'
import { View, BackHandler } from 'react-native'
import { StatusBar } from 'react-native'
import useLogin from '../hooks/useLogin'
import useInv from '../hooks/useInv'
import SelectCustomer from '../components/SelectCustomer'
import Loader from '../components/Loader'
import Logos from '../components/Logos'
import Products from '../components/Products'
import Footer from '../components/Footer'

const Home = () => {
  const { themeColors: { backgrund }, myUser: { image_url } } = useLogin()
  const { products, loaders, getProducts } = useInv()
  
  // Get products
  useEffect(() => {
    if (products?.length === 0) {
      getProducts()
    }
  }, [])

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
      <View className='flex-1' style={{ backgroundColor: backgrund }}>
        <StatusBar backgroundColor={backgrund} barStyle='dark-content' />

        <View className='flex-1 px-3'>
          <Logos image={image_url} />

          <View className='flex-1'>
            {loaders.loadingSlectedCustomer ? (
              <View className='flex-1 flex-row items-center justify-center'>
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

      <Footer />
    </>
  )
}

export default Home