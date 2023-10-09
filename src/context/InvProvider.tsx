import { createContext, useState, useEffect } from 'react'
import { ProductInterface, ProductCartInterface, OrderInterface } from '../utils/interfaces'
import { setDataStorage } from '../utils/asyncStorage'
import { fetchSearchedItems } from '../utils/api'
import useLogin from '../hooks/useLogin'

const InvContext = createContext<{
  productsCart: { codigo: string, amount: number, discount: string }[]
  setProductsCart: (productsCart: { codigo: string, amount: number, discount: string }[]) => void
  products: ProductInterface[]
  setProducts: (products: ProductInterface[]) => void
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
  lookAtPharmacy: boolean
  setLookAtPharmacy: (lookAtPharmacy: boolean) => void
  subtotal: string
  setSubtotal: (subtotal: string) => void
  discount: string
  setDiscount: (discount: string) => void
  iva: string
  setIva: (iva: string) => void
  total: string
  setTotal: (total: string) => void
}>({
  productsCart: [],
  setProductsCart: () => { 
    // do nothing
  },
  products: [],
  setProducts: () => { 
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
    cliente: { name: '', code: '' },
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
  lookAtPharmacy: false,
  setLookAtPharmacy: () => { 
    // do nothing
  },
  subtotal: '',
  setSubtotal: () => { 
    // do nothing
  },
  discount: '',
  setDiscount: () => { 
    // do nothing
  },
  iva: '',
  setIva: () => { 
    // do nothing
  },
  total: '',
  setTotal: () => { 
    // do nothing
  }
})

export const InvProvider = ({ children }: { children: React.ReactNode }) => {
  // PRODUCTS
  const [products, setProducts] = useState<ProductInterface[]>([])
  const [currentPage, setCurrentPage] = useState(1)

  // CART & ORDER 
  const [productsCart, setProductsCart] = useState<ProductCartInterface[]>([]) // code and amount
  const [order, setOrder] = useState<OrderInterface>({
    date: '',
    hora: '',
    cliente: { name: '', code: '' },
    productos: [],
    subtotal: '',
    total: '',
  })
  const [subtotal, setSubtotal] = useState('')
  const [discount, setDiscount] = useState('')
  const [iva, setIva] = useState('')
  const [total, setTotal] = useState('')

  // LOADERS
  const [loadingProductsGrid, setLoadingProductsGrid] = useState(true)
  const [loaders, setLoaders] = useState({
    loadingProducts: true,
    loadingSlectedCustomer: false,
    loadingConfirmOrder: false,
    loadingLogOut: false,
  })

  // ITINERARY & ORDER RECORD
  const [reloadItinerary, setReloadItinerary] = useState(false)
  const [lookAtPharmacy, setLookAtPharmacy] = useState(false)
  
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

  // -----------------------------------------------
  // API
  // -----------------------------------------------

  // Get products api
  const getProducts = async () => {
    try {
      let data: ProductInterface[] = []

      // fetch data
      if (myUser?.access.customerAccess || myUser?.access.salespersonAccess) {

        // inv farmacia
        data = await fetchSearchedItems({ table: 'appSinv/sinv', searchTerm: `${currentPage}` })
      } else if(myUser?.access.labAccess) {

        // inv lab
        data = await fetchSearchedItems({ table: 'appSinv/searchclipr', searchTerm: `${myUser?.clipro}/${currentPage}` })
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
    setProductsCart([ ...productsCart, { codigo, amount, discount: '0' } ])
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
      setReloadItinerary,
      lookAtPharmacy,
      setLookAtPharmacy,
      subtotal,
      setSubtotal,
      discount,
      setDiscount,
      iva,
      setIva,
      total,
      setTotal
    }}>
      {children}
    </InvContext.Provider>
  )
}

export default InvContext