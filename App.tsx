import Navigation from './src/navigation/Navigation'
import { InvProvider } from './src/context/InvProvider'
import { LoginProvider } from './src/context/LoginProvider'
import { CartProvider } from './src/context/CartProvider'

const App = () => {
  return (
    <InvProvider>
      <LoginProvider>
        <CartProvider>
          <Navigation />
        </CartProvider>
      </LoginProvider>
    </InvProvider>
  )
}

export default App
