import { MenuProvider } from 'react-native-popup-menu'
import Navigation from './src/navigation/Navigation'
import { InvProvider } from './src/context/InvProvider'
import { LoginProvider } from './src/context/LoginProvider'

const App = () => {
  return (
    <MenuProvider>
      <LoginProvider>
        <InvProvider>
          <Navigation />
        </InvProvider>
      </LoginProvider>
    </MenuProvider>
  )
}

export default App
