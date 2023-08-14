import { createContext, useState, useEffect } from "react"
import {Alert} from 'react-native'
import { Squares2X2Icon, ListBulletIcon } from 'react-native-heroicons/outline'
import ProductoInterface from "../interfaces/ProductoInterface"
import { getDataStorage, setDataStorage } from "../utils/asyncStorage"
import { fetchTableData } from "../utils/api"
import UserFromScliInterface from "../interfaces/UserFromScliInterface"

const InvContext = createContext<{
  productsCart: ProductoInterface[]
  setProductsCart: (productsCart: ProductoInterface[]) => void
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
  searchedCustomers: UserFromScliInterface[]
  setSearchedCustomers: (searchedCustomers: UserFromScliInterface[]) => void
  flowControl: {showProducts: boolean, showSelectCustomer: boolean, showSelectSearch: boolean, showSelectResults: boolean, showSelectLabel: boolean, selected: boolean,}
  setFlowControl: (flowControl: {showProducts: boolean, showSelectCustomer: boolean, showSelectSearch: boolean, showSelectResults: boolean, showSelectLabel: boolean, selected: boolean,}) => void
  loaders: {loadingProducts: boolean, loadingSearchedItems: boolean, loadingSlectedCustomer: boolean, loadingStorageInv: boolean,}
  setLoaders: (loaders: {loadingProducts: boolean, loadingSearchedItems: boolean, loadingSlectedCustomer: boolean, loadingStorageInv: boolean,}) => void
  valueSearchCustomers: string
  setValueSearchCustomers: (valueSearchCustomers: string) => void
}>({
  productsCart: [],
  setProductsCart: () => {},
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
  searchedCustomers: [],
  setSearchedCustomers: () => {},
  flowControl: {showProducts: false, showSelectCustomer: false, showSelectSearch: false, showSelectResults: false, showSelectLabel: false, selected: false,},
  setFlowControl: () => {},
  loaders: {loadingProducts: false, loadingSearchedItems: false, loadingSlectedCustomer: false, loadingStorageInv: false,},
  setLoaders: () => {},
  valueSearchCustomers: '',
  setValueSearchCustomers: () => {},
})

export const InvProvider = ({children}: {children: React.ReactNode}) => {
  // products
  const [products, setProducts] = useState<ProductoInterface[]>([])
  const [productsCart, setProductsCart] = useState<ProductoInterface[]>([])
  // search
  const [searchedProducts, setSearchedProducts] = useState<ProductoInterface[]>([])
  const [searchedCustomers, setSearchedCustomers] = useState<UserFromScliInterface[]>([])
  const [valueSearchCustomers, setValueSearchCustomers] = useState('')
  // layout
  const [type, setType] = useState('grid')
  const [flowControl, setFlowControl] = useState({
    showProducts: false, 
    showSelectCustomer: false, 
    showSelectSearch: false, 
    showSelectResults: false, 
    showSelectLabel: false,
    selected: false,
  })
  // modals
  const [modalSearch, setModalSearch] = useState(false)
  const [modalProduct, setModalProduct] = useState(false)
  // loaders
  const [loaders, setLoaders] = useState({
    loadingProducts: false, 
    loadingSearchedItems: false,
    loadingSlectedCustomer: false,
    loadingStorageInv: false,
  })

  // ----- STORAGE
  // get storage (productsCart, flowControl)
  useEffect(() => {
    const getCartStorage = async () => {
      try {
        // productsCart
        const cartStorage = await getDataStorage('productsCart')
        setProductsCart(cartStorage ? JSON.parse(cartStorage) : [])
        // flowControl
        const flowControlStorage = await getDataStorage('flowControl')
        setFlowControl(flowControlStorage ? JSON.parse(flowControlStorage) : null)
      } catch (error) {
        console.log(error)
      }
    }
    getCartStorage()
  }, [])

  // set productsCart
  useEffect(() => {
    const productsCartStorage = async () => {
      try {
        await setDataStorage('productsCart', productsCart)
      } catch (error) {
        console.log(error)
      }
    }
    productsCartStorage()
  }, [productsCart])

  // set flow control
  useEffect(() => {
    // set storage when a customer is selected
    if(flowControl?.selected || (flowControl?.showProducts && !flowControl?.showSelectCustomer)) {
      const flowControlStorage = async () => {
        try {
          await setDataStorage('flowControl', flowControl)
        } catch (error) {
          console.log(error)
        }
      }
      flowControlStorage()
    }
  }, [flowControl])

  // ----- API
  // get products api
  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        setLoaders({...loaders, loadingProducts: true})
        const data = await fetchTableData('Sinv')

        // Add properties to each producto
        const productos = data?.map((producto: ProductoInterface) => ({
          ...producto,
          agregado: false,
          cantidad: 1,
        }))
        setProducts(productos)
        setLoaders({...loaders, loadingProducts: false})
      } catch (error) {
        console.log(error)
      }
    }
    obtenerProductos()
  }, [])

  // ----- ACTIONS
  // set product properties
  useEffect(() => {
    const addedProducts = products.filter(product => product.agregado === true)
    setProductsCart(addedProducts)
  }, [products])

  // clear productsCart
  const clearCart = () => {
    Alert.alert(
      '¿Quieres eliminar todos los productos del carrito?',
      'Esta acción no se puede deshacer',
      [
        { text: 'Aceptar', onPress: () => {
          const updatedProducts = products.map(product => product.agregado === true ? {...product, agregado: false} : {...product})
          setProducts(updatedProducts)
        }},
        { text: 'Cancelar', style: 'cancel',},
      ]
    )
  }

  // ----- LAYOUT
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
      productsCart,
      setProductsCart,
      type,
      setType,
      products,
      setProducts,
      modalProduct,
      setModalProduct,
      icon,
      clearCart,
      setModalSearch,
      modalSearch,
      searchedProducts,
      setSearchedProducts,
      searchedCustomers,
      setSearchedCustomers,
      flowControl,
      setFlowControl,
      loaders,
      setLoaders,
      valueSearchCustomers,
      setValueSearchCustomers
    }}>
      {children}
    </InvContext.Provider>
  )
}

export default InvContext