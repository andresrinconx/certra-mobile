import { NativeBaseProvider } from 'native-base'
import { LoginProvider } from './src/context/LoginProvider'
import { CertraProvider } from './src/context/CertraProvider'
import Navigation from './src/components/Navigation'

const App = () => {
  return (
    <NativeBaseProvider>
      <LoginProvider>
        <CertraProvider>
          <Navigation />
        </CertraProvider>
      </LoginProvider>
    </NativeBaseProvider>
  )
}

export default App