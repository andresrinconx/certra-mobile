import { createContext, useState, useEffect } from "react"
import {Alert} from 'react-native'
import ProductoInterface from "../interfaces/ProductoInterface"
import { getDataStorage, setDataStorage } from "../utils/asyncStorage"
import { fetchTableData } from "../utils/api"
import UserFromScliInterface from "../interfaces/UserFromScliInterface"
import { OrderInterface } from "../interfaces/OrderInterface"

const InvContext = createContext<{
  productsCart: ProductoInterface[]
  setProductsCart: (productsCart: ProductoInterface[]) => void
  products: ProductoInterface[]
  setProducts: (products: ProductoInterface[]) => void
  searchedProducts: ProductoInterface[]
  setSearchedProducts: (searchedProducts: ProductoInterface[]) => void
  clearCart: () => void
  searchedCustomers: UserFromScliInterface[]
  setSearchedCustomers: (searchedCustomers: UserFromScliInterface[]) => void
  flowControl: {showProducts: boolean, showSelectCustomer: boolean, showSelectSearch: boolean, showSelectResults: boolean, showSelectLabel: boolean, selected: boolean,}
  setFlowControl: (flowControl: {showProducts: boolean, showSelectCustomer: boolean, showSelectSearch: boolean, showSelectResults: boolean, showSelectLabel: boolean, selected: boolean,}) => void
  loaders: {loadingProducts: boolean, loadingSearchedItems: boolean, loadingSlectedCustomer: boolean, loadingStorageInv: boolean,}
  setLoaders: (loaders: {loadingProducts: boolean, loadingSearchedItems: boolean, loadingSlectedCustomer: boolean, loadingStorageInv: boolean,}) => void
  valueSearchCustomers: string
  setValueSearchCustomers: (valueSearchCustomers: string) => void
  increase: (id: number) => void
  decrease: (id: number) => void
  subtotal: number
  setSubtotal: (subtotal: number) => void
  total: number
  setTotal: (total: number) => void
  removeElement: (id: number) => void
  addToCart: (product: ProductoInterface) => void
  confirmOrder: () => void
}>({
  productsCart: [],
  setProductsCart: () => {},
  products: [],
  setProducts: () => {},
  searchedProducts: [],
  setSearchedProducts: () => {},
  clearCart: () => {},
  searchedCustomers: [],
  setSearchedCustomers: () => {},
  flowControl: {showProducts: false, showSelectCustomer: false, showSelectSearch: false, showSelectResults: false, showSelectLabel: false, selected: false,},
  setFlowControl: () => {},
  loaders: {loadingProducts: false, loadingSearchedItems: false, loadingSlectedCustomer: false, loadingStorageInv: false,},
  setLoaders: () => {},
  valueSearchCustomers: '',
  setValueSearchCustomers: () => {},
  increase: () => {},
  decrease: () => {},
  subtotal: 0,
  setSubtotal: () => {},
  total: 0,
  setTotal: () => {},
  removeElement: () => {},
  addToCart: () => {},
  confirmOrder: () => {},
})

export const InvProvider = ({children}: {children: React.ReactNode}) => {
  // products
  const [products, setProducts] = useState<ProductoInterface[]>([])
  
  // order & cart
  const [order, setOrder] = useState<OrderInterface>({subtotal: 0, total: 0, cliente: '', productos: []})
  const [productsCart, setProductsCart] = useState<ProductoInterface[]>([])
  const [subtotal, setSubtotal] = useState(0)
  const [total, setTotal] = useState(0)
  // search
  const [searchedProducts, setSearchedProducts] = useState<ProductoInterface[]>([])
  const [searchedCustomers, setSearchedCustomers] = useState<UserFromScliInterface[]>([])
  const [valueSearchCustomers, setValueSearchCustomers] = useState('')
  // layout
  const [flowControl, setFlowControl] = useState({
    showProducts: false, 
    showSelectCustomer: false, 
    showSelectSearch: false, 
    showSelectResults: false, 
    showSelectLabel: false,
    selected: false,
  })
  // loaders
  const [loaders, setLoaders] = useState({
    loadingProducts: false, 
    loadingSearchedItems: false,
    loadingSlectedCustomer: false,
    loadingStorageInv: false,
  })

  useEffect(() => {
    console.log(order)
  }, [order])

  // ----- STORAGE
  // get storage (productsCart, flowControl)
  useEffect(() => {
    const getCartStorage = async () => {
      try {
        setLoaders({...loaders, loadingStorageInv: true})
        
        // productsCart
        const productsCartStorage = await getDataStorage('productsCart')
        setProductsCart(productsCartStorage ? JSON.parse(productsCartStorage) : [])
        // flowControl
        const flowControlStorage = await getDataStorage('flowControl')
        setFlowControl(flowControlStorage ? JSON.parse(flowControlStorage) : null)

        setLoaders({...loaders, loadingStorageInv: false})
      } catch (error) {
        console.log(error)
      }
    }
    getCartStorage()
  }, [])

  // set productsCart
  useEffect(() => {
    const setProductsStorage = async () => {
      try {
        await setDataStorage('productsCart', productsCart)
      } catch (error) {
        console.log(error)
      }
    }
    setProductsStorage()
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
        
        // fail api
        if(data === undefined) {return}

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
  // set subtotal & total
  useEffect(() => {
    // subtotal
    let subtotal = productsCart.reduce((total, product) => total + product.precio1 * product.cantidad, 0)
    subtotal = Number(subtotal.toFixed(2))
    setSubtotal(subtotal)

    // total
    let total = productsCart.reduce((total, product) => total + product.precio1 * product.cantidad, 0)
    total = Number(total.toFixed(2))
    setTotal(total)
  }, [productsCart])

  // add to cart
  const addToCart = (product: ProductoInterface) => {
    setProductsCart([...productsCart, {...product, agregado: true, cantidad: 1}])
  }

  // increase & decrease
  const increase = (id: number) => {
    const updatedProductsCart = productsCart.map(item => item.id === id ? {...item, cantidad: item.cantidad + 1} : {...item})
    setProductsCart(updatedProductsCart)
  }
  const decrease = (id: number) => {
    const productInCart = productsCart.find(item => item.id === id && item.cantidad === 1)
    if(productInCart !== undefined) {
      Alert.alert(
        'Advertencia',
        '¿Quieres eliminar este producto del carrito?',
        [
          { text: 'Eliminar', style: 'destructive' , onPress: () => {
            const updatedProductsCart = productsCart.filter(item => item.id !== id)
            setProductsCart(updatedProductsCart)
          }},
          { text: 'Cancelar', style: 'cancel' },
        ]
      )
    } else {
      const updatedProductsCart = productsCart.map(item => (item.id === id && item.cantidad > 1) ? {...item, cantidad: item.cantidad - 1} : {...item})
      setProductsCart(updatedProductsCart)
    }
  }
  
  // remove element from cart
  const removeElement = (id: number) => {
    const updatedProductsCart = productsCart.filter(item => item.id !== id)
    setProductsCart(updatedProductsCart)
  }

  // clear cart
  const clearCart = () => {
    Alert.alert(
      '¿Quieres eliminar todos los productos del carrito?',
      'Esta acción no se puede deshacer',
      [
        { text: 'Sí, eliminar', onPress: () => {
          const updatedProducts = productsCart.filter(item => item.agregado !== true)
          setProductsCart(updatedProducts)
        }},
        { text: 'Cancelar', style: 'cancel',},
      ]
    )
  }

  // confirm order
  const confirmOrder = () => {
    
  }
  
  return (
    <InvContext.Provider value={{
      productsCart,
      setProductsCart,
      products,
      setProducts,
      clearCart,
      searchedProducts,
      setSearchedProducts,
      searchedCustomers,
      setSearchedCustomers,
      flowControl,
      setFlowControl,
      loaders,
      setLoaders,
      valueSearchCustomers,
      setValueSearchCustomers,
      increase,
      decrease,
      subtotal,
      setSubtotal,
      total,
      setTotal,
      removeElement,
      addToCart,
      confirmOrder
    }}>
      {children}
    </InvContext.Provider>
  )
}

export default InvContext