import { createContext, useState, useEffect } from "react"
import AsyncStorage from '@react-native-async-storage/async-storage'

const CartContext = createContext<{
  cart: any[]
  setCart: any
  type: string
  setType: any
}>({
  cart: [],
  setCart: () => {},
  type: 'grid',
  setType: () => {}
})

export const CartProvider = ({children}: {children: React.ReactNode}) => {
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
  
  return (
    <CartContext.Provider value={{
      cart,
      setCart,
      type,
      setType
    }}>
      {children}
    </CartContext.Provider>
  )
}

export default CartContext