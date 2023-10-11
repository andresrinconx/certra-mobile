import { createContext, useState, useEffect } from 'react'
import { ProductInterface, ProductCartInterface } from '../utils/interfaces'
import { setDataStorage } from '../utils/asyncStorage'
import { fetchSearchedItems } from '../utils/api'
import useLogin from '../hooks/useLogin'

const InvContext = createContext<{
  productsCart: ProductCartInterface[]
  setProductsCart: (productsCart: ProductCartInterface[]) => void
  products: ProductInterface[]
  setProducts: (products: ProductInterface[]) => void
  loaders: {
    loadingProducts: boolean,
    loadingConfirmOrder: boolean,
    loadingLogOut: boolean,
  }
  setLoaders: (loaders: {
    loadingProducts: boolean,
    loadingConfirmOrder: boolean,
    loadingLogOut: boolean,
  }) => void
  loadingProductsGrid: boolean
  setLoadingProductsGrid: (loadingProductsGrid: boolean) => void
  loadingSelectCustomer: boolean
  setloadingSelectCustomer: (loadingSelectCustomer: boolean) => void
  removeElement: (codigo: string) => void
  addToCart: (codigo: string, amount: number) => void
  getProducts: () => void
  currentPage: number
  setCurrentPage: (currentPage: number) => void
  reloadItinerary: boolean
  setReloadItinerary: (reloadItinerary: boolean) => void
  lookAtPharmacy: boolean
  setLookAtPharmacy: (lookAtPharmacy: boolean) => void
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
  loadingSelectCustomer: false,
  setloadingSelectCustomer: () => { 
    // do nothing
  },
  removeElement: () => { 
    // do nothing
  },
  addToCart: () => { 
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
})

export const InvProvider = ({ children }: { children: React.ReactNode }) => {
  // PRODUCTS
  const [products, setProducts] = useState<ProductInterface[]>([])
  const [currentPage, setCurrentPage] = useState(1)

  // CART & ORDER 
  const [productsCart, setProductsCart] = useState<ProductCartInterface[]>([]) // code and amount

  // LOADERS
  const [loadingProductsGrid, setLoadingProductsGrid] = useState(true)
  const [loadingSelectCustomer, setloadingSelectCustomer] = useState(false)
  const [loaders, setLoaders] = useState({
    loadingProducts: true,
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
      if (myUser?.access?.customerAccess || myUser?.access?.salespersonAccess) {

        // inv farmacia
        data = await fetchSearchedItems({ table: 'appSinv/sinv', searchTerm: `${currentPage}` })
      } else if(myUser?.access?.labAccess) {

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
    setProductsCart([ ...productsCart, { codigo, amount, labDiscount: '0', productDiscount: '0', customerDiscount: '0' } ])
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
      getProducts,
      currentPage,
      setCurrentPage,
      reloadItinerary,
      setReloadItinerary,
      lookAtPharmacy,
      setLookAtPharmacy,
      loadingSelectCustomer,
      setloadingSelectCustomer
    }}>
      {children}
    </InvContext.Provider>
  )
}

export default InvContext