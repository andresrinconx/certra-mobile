import { createContext, useState, useEffect } from 'react'
import ProductoInterface from '../interfaces/ProductoInterface'
import { setDataStorage } from '../utils/asyncStorage'
import { fetchSearchedItems } from '../utils/api'
import { OrderInterface } from '../interfaces/OrderInterface'
import useLogin from '../hooks/useLogin'
import { ProductCartInterface } from '../interfaces/ProductCartInterface'

const InvContext = createContext<{
  productsCart: { codigo: string, amount: number }[]
  setProductsCart: (productsCart: { codigo: string, amount: number }[]) => void
  products: ProductoInterface[]
  setProducts: (products: ProductoInterface[]) => void
  flowControl: {
    showProducts: boolean
    showSelectCustomer: boolean
    showSelectSearch: boolean
    showSelectResults: boolean
    showSelectLabel: boolean
    showLogoCertra: boolean
    showItinerary: boolean
    selected: boolean
  }
  setFlowControl: (flowControl: {
    showProducts: boolean
    showSelectCustomer: boolean
    showSelectSearch: boolean
    showSelectResults: boolean
    showSelectLabel: boolean
    showLogoCertra: boolean
    showItinerary: boolean
    selected: boolean
  }) => void
  loaders: {
    loadingProducts: boolean,
    loadingSlectedCustomer: boolean,
    loadingConfirmOrder: boolean,
    loadingLogOut: boolean,
  }
  setLoaders: (loaders: {
    loadingProducts: boolean,
    loadingSlectedCustomer: boolean,
    loadingConfirmOrder: boolean,
    loadingLogOut: boolean,
  }) => void
  loadingProductsGrid: boolean
  setLoadingProductsGrid: (loadingProductsGrid: boolean) => void
  removeElement: (codigo: string) => void
  addToCart: (codigo: string, amount: number) => void
  order: OrderInterface
  setOrder: (order: OrderInterface) => void
  getProducts: () => void
  currentPage: number
  setCurrentPage: (currentPage: number) => void
  reloadItinerary: boolean
  setReloadItinerary: (reloadItinerary: boolean) => void
}>({
  productsCart: [],
  setProductsCart: () => { 
    // do nothing
  },
  products: [],
  setProducts: () => { 
    // do nothing
  },
  flowControl: {
    showProducts: false,
    showSelectCustomer: false,
    showSelectSearch: false,
    showSelectResults: false,
    showSelectLabel: false,
    showLogoCertra: false,
    showItinerary: false,
    selected: false,
  },
  setFlowControl: () => { 
    // do nothing
  },
  loaders: {
    loadingProducts: true,
    loadingSlectedCustomer: false,
    loadingConfirmOrder: false,
    loadingLogOut: false,
  },
  setLoaders: () => { 
    // do nothing
  },
  loadingProductsGrid: true,
  setLoadingProductsGrid: () => { 
    // do nothing
  },
  removeElement: () => { 
    // do nothing
  },
  addToCart: () => { 
    // do nothing
  },
  order: {
    date: '',
    hora: '',
    cliente: { name: '', code: 0 },
    productos: [],
    subtotal: '',
    total: '',
  },
  setOrder: () => { 
    // do nothing
  },
  getProducts: () => { 
    // do nothing
  },
  currentPage: 1,
  setCurrentPage: () => { 
    // do nothing
  },
  reloadItinerary: false,
  setReloadItinerary: () => { 
    // do nothing
  },
})

export const InvProvider = ({ children }: { children: React.ReactNode }) => {
  // PRODUCTS
  const [products, setProducts] = useState<ProductoInterface[]>([])
  const [currentPage, setCurrentPage] = useState(1)

  // CART & ORDER 
  const [productsCart, setProductsCart] = useState<ProductCartInterface[]>([]) // code and amount
  const [order, setOrder] = useState<OrderInterface>({
    date: '',
    hora: '',
    cliente: { name: '', code: 0 },
    productos: [],
    subtotal: '',
    total: '',
  })

  // LAYOUT
  const [flowControl, setFlowControl] = useState({
    showProducts: false,
    showSelectCustomer: false,
    showSelectSearch: false,
    showSelectResults: false,
    showSelectLabel: false,
    showLogoCertra: false,
    showItinerary: false,
    selected: false,
  })

  // LOADERS
  const [loadingProductsGrid, setLoadingProductsGrid] = useState(true)
  const [loaders, setLoaders] = useState({
    loadingProducts: true,
    loadingSlectedCustomer: false,
    loadingConfirmOrder: false,
    loadingLogOut: false,
  })
  const [reloadItinerary, setReloadItinerary] = useState(false)
  
  const { myUser } = useLogin()

  // -----------------------------------------------
  // STORAGE
  // -----------------------------------------------

  // Set productsCart
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

  // Set flow control
  useEffect(() => {
    // set storage when a customer is selected
    if (flowControl?.selected || (flowControl?.showProducts && !flowControl?.showSelectCustomer)) {
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

  // -----------------------------------------------
  // API
  // -----------------------------------------------

  // Get products api
  const getProducts = async () => {
    try {
      let data: ProductoInterface[] = []

      // fetch data
      if (myUser.from === 'scli' || myUser.from === 'usuario') {

        // inv farmacia
        data = await fetchSearchedItems({ table: 'sinv', searchTerm: `${currentPage}` })
      } else if(myUser.from === 'usuario-clipro') {

        // inv lab
        data = await fetchSearchedItems({ table: 'searchclipr', searchTerm: `${myUser?.clipro}/${currentPage}` })
      }

      if (data?.length > 0) {
        setProducts([ ...products, ...data ])
        setLoaders({ ...loaders, loadingProducts: false })
        setLoadingProductsGrid(false)
      }
    } catch (error) {
      console.log(error)
    }
  }

  // -----------------------------------------------
  // CART ACTIONS
  // -----------------------------------------------

  // Add to cart
  const addToCart = (codigo: string, amount: number) => {
    setProductsCart([ ...productsCart, { codigo, amount } ])
  }

  // Remove element from cart
  const removeElement = (codigo: string) => {
    const updatedProductsCart = productsCart.filter(item => item.codigo !== codigo)
    setProductsCart(updatedProductsCart)
  }

  return (
    <InvContext.Provider value={{
      productsCart,
      setProductsCart,
      products,
      setProducts,
      flowControl,
      setFlowControl,
      loaders,
      setLoaders,
      loadingProductsGrid,
      setLoadingProductsGrid,
      removeElement,
      addToCart,
      order,
      setOrder,
      getProducts,
      currentPage,
      setCurrentPage,
      reloadItinerary,
      setReloadItinerary
    }}>
      {children}
    </InvContext.Provider>
  )
}

export default InvContext