import { useEffect } from 'react';
import { View, StatusBar, BackHandler } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { themeColors } from '../../tailwind.config';
import { useCertra, useLogin } from '../hooks';
import { SelectCustomer, Loader, Logos, ProductsHome, TabBar, IconLogOut } from '../components';
import { SafeAreaView } from 'react-native-safe-area-context';

const Home = () => {
  const { background } = themeColors;
  const { myUser: { image_url } } = useLogin();
  const { loadingSelectCustomer } = useCertra();
  const { name } = useRoute();

  // Back handler
  useEffect(() => {
    if (name === 'Home') {
      const backAction = () => {
        BackHandler.exitApp();
        return true;
      };
  
      const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
      return () => backHandler.remove();
    }
  }, []);

  return (
    <>
      <SafeAreaView className='flex-1 px-3 bg-background'>
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
        <TabBar />
      </View>
    </>
  );
};

export default Home;