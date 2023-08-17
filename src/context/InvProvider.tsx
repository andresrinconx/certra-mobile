import { createContext, useState, useEffect } from "react"
import {Alert} from 'react-native'
import ProductoInterface from "../interfaces/ProductoInterface"
import { getDataStorage, setDataStorage } from "../utils/asyncStorage"
import { fetchTableData } from "../utils/api"
import UserFromScliInterface from "../interfaces/UserFromScliInterface"

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
  increase: (id: number, cantidad: number) => any
  decrease: (id: number, cantidad: number) => any
  inputChange: (id: number, cantidad: number) => any
  subtotal: number
  setSubtotal: (subtotal: number) => void
  total: number
  setTotal: (total: number) => void
  removeElement: (id: number) => void
  addToCart: (id: number) => void
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
  inputChange: () => {},
  subtotal: 0,
  setSubtotal: () => {},
  total: 0,
  setTotal: () => {},
  removeElement: () => {},
  addToCart: () => {},
})

export const InvProvider = ({children}: {children: React.ReactNode}) => {
  // products & cart
  const [products, setProducts] = useState<ProductoInterface[]>([])
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
    console.log(productsCart)
  }, [productsCart])

  // ----- STORAGE
  // get storage (productsCart, flowControl)
  useEffect(() => {
    const getCartStorage = async () => {
      try {
        setLoaders({...loaders, loadingStorageInv: true})
        
        // products
        const productsStorage = await getDataStorage('products')
        setProducts(productsStorage ? JSON.parse(productsStorage) : [])
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

  // set products
  useEffect(() => {
    const setProductsStorage = async () => {
      try {
        await setDataStorage('products', products)
      } catch (error) {
        console.log(error)
      }
    }
    setProductsStorage()
  }, [products])

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
      // tiene datos en el storage
      if(products.length === 0) {
        console.log('none')
      } else {
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
    }
    obtenerProductos()
  }, [])

  // ----- ACTIONS
  // set productsCart
  useEffect(() => {
    const addedProducts = products.filter(product => product.agregado === true)
    setProductsCart(addedProducts)
  }, [products])
  
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
  const addToCart = (id: number) => {
    const updatedProducts = products.map(product => {
      if (product.id === id || product.agregado === true) {
        return {...product, agregado: true}
      } else {
        return {...product, agregado: false}
      }
    })
    setProducts(updatedProducts)
  }

  // increase & decrease
  const increase = (id: number, cantidad: number) => {
    const updatedProducts = products.map(product => {
      if (product.id === id && product.agregado === true) {
        return {...product, cantidad: cantidad + 1}
      } else {
        return {...product}
      }
    })
    setProducts(updatedProducts)
  }
  const decrease = (id: number, cantidad: number) => {
    const updatedProducts = products.map(product => {
      if (product.id === id && product.agregado === true && product.cantidad > 1) {
        return {...product, cantidad: cantidad - 1}
      } else if(product.id === id && product.agregado === true && product.cantidad === 1) {
        return {...product, agregado: false}
      } else {
        return {...product}
      }
    })
    setProducts(updatedProducts)
  }
  const inputChange = (id: number, cantidad: number) => {
    if(cantidad > 1) {
      const updatedProducts = products.map(product => {
        if (product.id === id && product.agregado === true && cantidad > 0) {
          return {...product, cantidad}
        } else if(product.id === id && product.agregado === true) {
          return {...product, cantidad: 1}
        } else {
          return {...product}
        }
      })
      setProducts(updatedProducts)
    }
  }
  
  // remove element from cart
  const removeElement = (id: number) => {
    const updatedProducts = products.map(product => {
      if (product.id === id && product.agregado === true) {
        return {...product, agregado: false, cantidad: 1}
      } else {
        return {...product}
      }
    })
    setProducts(updatedProducts)
  }

  // clear cart
  const clearCart = () => {
    Alert.alert(
      '¿Quieres eliminar todos los productos del carrito?',
      'Esta acción no se puede deshacer',
      [
        { text: 'Aceptar', onPress: () => {
          const updatedProducts = products.map(product => product.agregado === true ? {
            ...product, 
            agregado: false, 
            cantidad: 1
          } : {...product})
          setProducts(updatedProducts)
        }},
        { text: 'Cancelar', style: 'cancel',},
      ]
    )
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
      inputChange,
      subtotal,
      setSubtotal,
      total,
      setTotal,
      removeElement,
      addToCart
    }}>
      {children}
    </InvContext.Provider>
  )
}

export default InvContext