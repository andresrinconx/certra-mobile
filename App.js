import React, {useState, useEffect} from 'react';
import Navigation from './src/navigation/Navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
  const [cart, setCart] = useState([])
  const [type, setType] = useState('grid')

  // obtener productos cart
  useEffect(() => {
    const getCartStorage = async () => {
      try {
        const cartStorage = await AsyncStorage.getItem('cart')
        setCart(cartStorage ? JSON.parse(cartStorage) : [])
      } catch (error) {
        console.log(error)
      }
    }
    getCartStorage()
  }, [])
  
  return(
    <Navigation 
      cart={cart}
      setCart={setCart}
      type={type}
      setType={setType}
    />
  )
}

export default App;
