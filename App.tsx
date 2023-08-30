import Navigation from './src/components/Navigation'
import { InvProvider } from './src/context/InvProvider'
import { LoginProvider } from './src/context/LoginProvider'

const App = () => {
  return ( 
    <LoginProvider>
      <InvProvider>
        <Navigation />
      </InvProvider>
    </LoginProvider>
  )
}

export default App
