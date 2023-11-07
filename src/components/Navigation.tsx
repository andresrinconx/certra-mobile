import { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getDataStorage } from '../utils/asyncStorage';
import { useCertra, useLogin } from '../hooks';
import { LoaderLogoScreen } from '.';
import { Home, Cart, Login, SearchProducts, Product, Profile, Itinerary, ItineraryDay, OrderRecord, SearchCustomer, CustomerProfile } from '../views';

const Stack = createNativeStackNavigator();

const Navigation = () => {
  const [loadingStorage, setLoadingStorage] = useState(true);
  const { login, setLogin, setMyUser } = useLogin();
  const { setProductsCart } = useCertra();

  // Get storage (global)
  useEffect(() => {
    const getStorage = async () => {
      // get storage
      const productsCartStorage = await getDataStorage('productsCart');
      const loginStorage = await getDataStorage('login');
      const myUserStorage = await getDataStorage('myUser');
  
      // set data
      setProductsCart(productsCartStorage ? JSON.parse(productsCartStorage) : []);
      setLogin(loginStorage === 'true' ? true : false);
      setMyUser(myUserStorage ? JSON.parse(myUserStorage) : {});
    };
    getStorage().then(() => {
      setTimeout(() => {
        setLoadingStorage(false);
      }, 1000);
    });
  }, []);

  return (
    <>
      {loadingStorage ? (
        <LoaderLogoScreen />
      ) : (
        <NavigationContainer>
          <Stack.Navigator initialRouteName={login ? 'Home' : 'Login'}>
            <Stack.Screen name='Login' component={Login} options={{ headerShown: false }} />
            <Stack.Screen name='Home' component={Home} options={{ headerShown: false, headerBackVisible: false }} />
            <Stack.Screen name='SearchCustomer' component={SearchCustomer} options={{ headerShown: false, animation: 'fade_from_bottom' }} />
            <Stack.Screen name='Profile' component={Profile} options={{ headerShown: false, animation: 'fade_from_bottom' }} />
            <Stack.Screen name='Itinerary' component={Itinerary} options={{ headerShown: false, animation: 'fade_from_bottom' }} />
            <Stack.Screen name='ItineraryDay' component={ItineraryDay} options={{ headerShown: false, animation: 'fade_from_bottom' }} />
            <Stack.Screen name='OrderRecord' component={OrderRecord} options={{ headerShown: false, animation: 'fade_from_bottom' }} />
            <Stack.Screen name='SearchProducts' component={SearchProducts} options={{ headerShown: false, animation: 'fade_from_bottom' }} />
            <Stack.Screen name='Cart' component={Cart} options={{ headerShown: false, animation: 'fade_from_bottom' }} />
            <Stack.Screen name='Product' component={Product} options={{ headerShown: false, animation: 'fade_from_bottom' }} />
            <Stack.Screen name='CustomerProfile' component={CustomerProfile} options={{ headerShown: false, animation: 'fade_from_bottom' }} />
          </Stack.Navigator>
        </NavigationContainer>
      )}
    </>
  );
};

export default Navigation;