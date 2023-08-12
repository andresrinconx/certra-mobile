import { createContext, useState, useEffect } from "react"
import {Alert} from 'react-native'
import { Squares2X2Icon, ListBulletIcon } from 'react-native-heroicons/outline'
import ProductoInterface from "../interfaces/ProductoInterface"
import { getDataStorage, setDataStorage } from "../utils/helpers"
import { fetchTableData } from "../api/inv"
import UserFromScliInterface from "../interfaces/UserFromScliInterface"

const InvContext = createContext<{
  cart: ProductoInterface[]
  setCart: (cart: ProductoInterface[]) => void
  type: string
  setType: (type: string) => void
  products: ProductoInterface[]
  setProducts: (products: ProductoInterface[]) => void
  searchedProducts: ProductoInterface[]
  setSearchedProducts: (searchedProducts: ProductoInterface[]) => void
  modalProduct: boolean
  setModalProduct: (modalProduct: boolean) => void
  modalSearch: boolean
  setModalSearch: (modalSearch: boolean) => void
  icon: (type: string) => any
  clearCart: () => void
  pay: () => void
  searchedCustomers: UserFromScliInterface[]
  setSearchedCustomers: (searchedCustomers: UserFromScliInterface[]) => void
  flowControl: {showProducts: boolean, showSelectCustomer: boolean, showSelectSearch: boolean, showSelectResults: boolean, showSelectLabel: boolean,}
  setFlowControl: (flowControl: {showProducts: boolean, showSelectCustomer: boolean, showSelectSearch: boolean, showSelectResults: boolean, showSelectLabel: boolean,}) => void
  loaders: {loadingProducts: boolean, loadingSearchedItems: boolean, loadingSlectedCustomer: boolean,}
  setLoaders: (loaders: {loadingProducts: boolean, loadingSearchedItems: boolean, loadingSlectedCustomer: boolean,}) => void
}>({
  cart: [],
  setCart: () => {},
  type: 'grid',
  setType: () => {},
  products: [],
  setProducts: () => {},
  searchedProducts: [],
  setSearchedProducts: () => {},
  modalProduct: false,
  setModalProduct: () => {},
  modalSearch: false,
  setModalSearch: () => {},
  icon: () => {},
  clearCart: () => {},
  pay: () => {},
  searchedCustomers: [],
  setSearchedCustomers: () => {},
  flowControl: {showProducts: false, showSelectCustomer: false, showSelectSearch: false, showSelectResults: false, showSelectLabel: false,},
  setFlowControl: () => {},
  loaders: {loadingProducts: false, loadingSearchedItems: false, loadingSlectedCustomer: false,},
  setLoaders: () => {},
})

export const InvProvider = ({children}: {children: React.ReactNode}) => {
  // cart
  const [products, setProducts] = useState<ProductoInterface[]>([])
  const [cart, setCart] = useState<ProductoInterface[]>([])
  // search
  const [searchedProducts, setSearchedProducts] = useState<ProductoInterface[]>([])
  const [searchedCustomers, setSearchedCustomers] = useState<UserFromScliInterface[]>([])
  // layout
  const [type, setType] = useState('grid')
  const [flowControl, setFlowControl] = useState({
    showProducts: false, 
    showSelectCustomer: false, 
    showSelectSearch: false, 
    showSelectResults: false, 
    showSelectLabel: false,
  })
  // modals
  const [modalSearch, setModalSearch] = useState(false)
  const [modalProduct, setModalProduct] = useState(false)
  // loaders
  const [loaders, setLoaders] = useState({
    loadingProducts: false, 
    loadingSearchedItems: false,
    loadingSlectedCustomer: false,
  })

  // get storage (cart, flowControl)
  useEffect(() => {
    const getCartStorage = async () => {
      try {
        // cart
        const cartStorage = await getDataStorage('cart')
        setCart(cartStorage ? JSON.parse(cartStorage) : [])

        // flowControl
        const flowControlStorage = await getDataStorage('flowControl')
        setFlowControl(flowControlStorage ? JSON.parse(flowControlStorage) : {
          showProducts: false, 
          showSelectCustomer: false, 
          showSelectSearch: false, 
          showSelectResults: false, 
          showSelectLabel: false,
        })
      } catch (error) {
        console.log(error)
      }
    }
    getCartStorage()
  }, [])

  useEffect(() => {
    console.log(flowControl)
  }, [flowControl])

  // SET STORAGE
  // cart
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

  // flow control
  useEffect(() => {
    const flowControlStorage = async () => {
      try {
        await setDataStorage('flowControl', flowControl)
      } catch (error) {
        console.log(error)
      }
    }
    flowControlStorage()
  }, [flowControl])

  // get products api
  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        setLoaders({...loaders, loadingProducts: true})
        const data = await fetchTableData('Sinv')
        setProducts(data)
        setLoaders({...loaders, loadingProducts: false})
      } catch (error) {
        console.log(error)
      }
    }
    obtenerProductos()
  }, [])

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
      modalProduct,
      setModalProduct,
      icon,
      clearCart,
      pay,
      setModalSearch,
      modalSearch,
      searchedProducts,
      setSearchedProducts,
      searchedCustomers,
      setSearchedCustomers,
      flowControl,
      setFlowControl,
      loaders,
      setLoaders
    }}>
      {children}
    </InvContext.Provider>
  )
}

export default InvContext