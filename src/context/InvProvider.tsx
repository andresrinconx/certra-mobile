import { createContext, useState, useEffect } from "react"
import {Alert} from 'react-native'
import { Squares2X2Icon, ListBulletIcon } from 'react-native-heroicons/outline'
import ProductoInterface from "../interfaces/ProductoInterface"
import {URL_API} from '@env'
import { getDataStorage, setDataStorage } from "../utils/helpers"

const InvContext = createContext<{
  cart: ProductoInterface[]
  setCart: (cart: ProductoInterface[]) => void
  type: string
  setType: (type: string) => void
  products: ProductoInterface[]
  setProducts: (products: ProductoInterface[]) => void
  searchedProducts: ProductoInterface[]
  setSearchedProducts: (searchedProducts: ProductoInterface[]) => void
  loadingProducts: boolean
  setLoadingProducts: (loadingProducts: boolean) => void
  loadingSearchedProducts: boolean
  setLoadingSearchedProducts: (loadingSearchedProducts: boolean) => void
  modalProduct: boolean
  setModalProduct: (modalProduct: boolean) => void
  modalSearch: boolean
  setModalSearch: (modalSearch: boolean) => void
  icon: (type: string) => any
  clearCart: () => void
  pay: () => void
}>({
  cart: [],
  setCart: () => {},
  type: 'grid',
  setType: () => {},
  products: [],
  setProducts: () => {},
  searchedProducts: [],
  setSearchedProducts: () => {},
  loadingProducts: false,
  setLoadingProducts: () => {},
  loadingSearchedProducts: false,
  setLoadingSearchedProducts: () => {},
  modalProduct: false,
  setModalProduct: () => {},
  modalSearch: false,
  setModalSearch: () => {},
  icon: () => {},
  clearCart: () => {},
  pay: () => {},
})

export const InvProvider = ({children}: {children: React.ReactNode}) => {
  // cart
  const [products, setProducts] = useState<ProductoInterface[]>([])
  const [cart, setCart] = useState<ProductoInterface[]>([])
  // search
  const [searchedProducts, setSearchedProducts] = useState<ProductoInterface[]>([])
  // layout
  const [type, setType] = useState('grid')
  // modals
  const [modalSearch, setModalSearch] = useState(false)
  const [modalProduct, setModalProduct] = useState(false)
  // loaders
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [loadingSearchedProducts, setLoadingSearchedProducts] = useState(false)

  // CART
  // get cart storage
  useEffect(() => {
    const getCartStorage = async () => {
      try {
        const cartStorage = await getDataStorage('cart')
        setCart(cartStorage ? JSON.parse(cartStorage) : [])
      } catch (error) {
        console.log(error)
      }
    }
    getCartStorage()
  }, [])

  // get products api
  useEffect(() => {
    const obtenerProductos = async () => {
      const url = `${URL_API}Sinv`
    
      try {
        setLoadingProducts(true)
        const response = await fetch(url)
        const result = await response.json()
        setProducts(result)
        setLoadingProducts(false)
      } catch (error) {
        console.log(error)
      }
    }
    obtenerProductos()
  }, [])

  // add cart storage
  useEffect(() => {
    const cartStorage = async () => {
      try {
        await setDataStorage('cart', cart)
      } catch (error) {
        console.log(error)
      }
    }
    cartStorage()
  }, [cart])

  // clear cart
  const clearCart = () => {
    Alert.alert(
      'Alerta',
      '¿Seguro que quieres eliminar todos los productos del carrito?',
      [
        { text: 'Cancelar', style: 'cancel',},
        { text: 'Aceptar', onPress: () => {
          setCart([])
        }},
      ]
    )
  }

  // pay
  const pay = () => {
    console.log('pagando...')    
  }

  // LAYOUT
  // icon
  const icon = (type: string) => {
    if(type === 'grid') { // --- grid
      return (
        <Squares2X2Icon size={30} color='black' />
      )
    } else { // --- list
      return (
        <ListBulletIcon size={30} color='black' />
      )
    }
  }
  
  return (
    <InvContext.Provider value={{
      cart,
      setCart,
      type,
      setType,
      products,
      setProducts,
      loadingProducts,
      setLoadingProducts,
      loadingSearchedProducts,
      setLoadingSearchedProducts,
      modalProduct,
      setModalProduct,
      icon,
      clearCart,
      pay,
      setModalSearch,
      modalSearch,
      searchedProducts,
      setSearchedProducts
    }}>
      {children}
    </InvContext.Provider>
  )
}

export default InvContext