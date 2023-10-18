import { View, SafeAreaView } from 'react-native'
import { StatusBar } from 'react-native'
import useLogin from '../hooks/useLogin'
import useCertra from '../hooks/useCertra'
import { SelectCustomer, Loader, Logos, ProductsHome, Footer } from '../components'

const Home = () => {
  const { themeColors: { background }, myUser: { image_url } } = useLogin()
  const { loadingSelectCustomer } = useCertra()

  return (
    <>
      <SafeAreaView className='flex-1 px-3 pt-6' style={{ backgroundColor: background }}>
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
                <ProductsHome />
              </>
            )}
          </View>
        </View>

      </SafeAreaView>
      
      <View className='bottom-0'>
        <Footer />
      </View>
    </>
  )
}

export default Home