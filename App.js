import Navigation from './src/navigation/Navigation';

import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import Inicio from './src/components/views/Inicio';
import Cart from './src/components/views/Cart';
import Login from './src/components/views/Login';

import Carrito from './src/components/ui/Carrito';

const Stack = createNativeStackNavigator()

const App = () => {
  return(
    <Navigation />
  )
}

export default App;
