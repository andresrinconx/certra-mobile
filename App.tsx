import { NativeBaseProvider } from 'native-base'
import { LoginProvider } from './src/context/LoginProvider'
import { InvProvider } from './src/context/InvProvider'
import Navigation from './src/components/Navigation'

const App = () => {
  return (
    <NativeBaseProvider>
      <LoginProvider>
        <InvProvider>
          <Navigation />
        </InvProvider>
      </LoginProvider>
    </NativeBaseProvider>
  )
}

export default App