import { createContext, useState, useEffect } from 'react'
import ProductoInterface from '../interfaces/ProductoInterface'
import { setDataStorage } from '../utils/asyncStorage'
import { sendData, fetchSearchedItems } from '../utils/api'
import { OrderInterface } from '../interfaces/OrderInterface'
import { getDate, getHour } from '../utils/helpers'
import useLogin from '../hooks/useLogin'

const InvContext = createContext<{
  productsCart: ProductoInterface[]
  setProductsCart: (productsCart: ProductoInterface[]) => void
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
  increase: (id: number) => void
  decrease: (id: number) => void
  subtotal: string
  setSubtotal: (subtotal: string) => void
  total: string
  setTotal: (total: string) => void
  removeElement: (id: number) => void
  addToCart: (product: ProductoInterface) => void
  processOrder: (myUser: any) => void
  order: OrderInterface
  getProducts: () => void
  currentPage: number
  setCurrentPage: (currentPage: number) => void
}>({
  productsCart: [],
  setProductsCart: () => { },
  products: [],
  setProducts: () => { },
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
  setFlowControl: () => { },
  loaders: {
    loadingProducts: true,
    loadingSlectedCustomer: false,
    loadingConfirmOrder: false,
    loadingLogOut: false,
  },
  setLoaders: () => { },
  increase: () => { },
  decrease: () => { },
  subtotal: '',
  setSubtotal: () => { },
  total: '',
  setTotal: () => { },
  removeElement: () => { },
  addToCart: () => { },
  processOrder: () => { },
  order: {
    date: '',
    hora: '',
    cliente: { name: '', code: 0 },
    productos: [],
    subtotal: '',
    total: '',
  },
  getProducts: () => { },
  currentPage: 1,
  setCurrentPage: () => { },
})

export const InvProvider = ({ children }: { children: React.ReactNode }) => {
  // PRODUCTS
  const [products, setProducts] = useState<ProductoInterface[]>([])
  const [currentPage, setCurrentPage] = useState(1)

  // ORDER & CART
  const [order, setOrder] = useState<OrderInterface>({
    date: '',
    hora: '',
    cliente: { name: '', code: 0 },
    productos: [],
    subtotal: '',
    total: '',
  })
  const [productsCart, setProductsCart] = useState<ProductoInterface[]>([])
  const [subtotal, setSubtotal] = useState('')
  const [total, setTotal] = useState('')

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
  const [loaders, setLoaders] = useState({
    loadingProducts: true,
    loadingSlectedCustomer: false,
    loadingConfirmOrder: false,
    loadingLogOut: false,
  })
  
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
        data = await fetchSearchedItems({ table: 'sinv', searchTerm: currentPage.toString() })

      } else if(myUser.from === 'usuario-clipro') {
        data = await fetchSearchedItems({ table: 'searchclipr', searchTerm: `${myUser?.clipro}/${currentPage}` })

      }

      if (data.length > 0) {
        setProducts([ ...products, ...data ])
        setLoaders({ ...loaders, loadingProducts: false })
      }
      
      // Add properties to each producto
      // const products = data?.map((product: ProductoInterface) => ({
      //   ...product,
      //   agregado: false,
      //   cantidad: 1,
      // }))
    } catch (error) {
      console.log(error)
    }
  }

  // -----------------------------------------------
  // CART ACTIONS
  // -----------------------------------------------

  // Set subtotal & total
  useEffect(() => {
    // subtotal
    const subtotal = productsCart.reduce((total, product) => total + product.precio1 * product.cantidad, 0)
    const subtotalFormated = subtotal.toLocaleString()
    setSubtotal(subtotalFormated)

    // total
    const total = productsCart.reduce((total, product) => total + product.precio1 * product.cantidad, 0)
    const totalFormated = total.toLocaleString()
    setTotal(totalFormated)
  }, [productsCart])

  // Add to cart
  const addToCart = (product: ProductoInterface) => {
    setProductsCart([...productsCart, { ...product, agregado: true, cantidad: 1 }])
  }

  // Increase & decrease
  const increase = (id: number) => {
    const updatedProductsCart = productsCart.map(item => item.id === id ? { ...item, cantidad: item.cantidad + 1 } : { ...item })
    setProductsCart(updatedProductsCart)
  }
  const decrease = (id: number) => {
    const productInCart = productsCart.find(item => item.id === id && item.cantidad === 1)

    // If the product is in the cart and has a quantity of 1, show an alert to confirm the deletion.
    if (productInCart !== undefined) {
      const updatedProductsCart = productsCart.filter(item => item.id !== id)
      setProductsCart(updatedProductsCart)
    } else {
      // If the product is in the cart and has a quantity greater than 1, decrease the quantity by 1.
      const updatedProductsCart = productsCart.map(item => (item.id === id && item.cantidad > 1) ? { ...item, cantidad: item.cantidad - 1 } : { ...item })
      setProductsCart(updatedProductsCart)
    }
  }

  // Remove element from cart
  const removeElement = (id: number) => {
    const updatedProductsCart = productsCart.filter(item => item.id !== id)
    setProductsCart(updatedProductsCart)
  }

  // -----------------------------------------------
  // ORDER
  // -----------------------------------------------

  // Send order
  useEffect(() => {
    const sendOrder = async () => {
      try {
        if (order.productos.length !== 0) {
          await sendData(order)

          setTimeout(() => {
            // clear cart
            const updatedProducts = productsCart.filter(item => item.agregado !== true)
            setProductsCart(updatedProducts)
          }, 2000)

          setTimeout(() => {

            setLoaders({ ...loaders, loadingConfirmOrder: false }) // loader from alert*
          }, 3000)
        }
      } catch (error) {
        console.log(error)
      }
    }
    sendOrder()
  }, [order])

  // Process order
  const processOrder = async (myUser: any) => {
    // order data
    setOrder({
      ...order,
      date: getDate(new Date()),
      hora: getHour(new Date()),
      cliente: (myUser.from === 'scli' ? {
        name: myUser?.nombre,
        code: myUser?.cliente
      } : {
        name: myUser.us_nombre,
        usuario: myUser.us_codigo,
        code: myUser?.customer?.cliente
      }),
      productos: productsCart.map((product: ProductoInterface) => ({
        codigo: product.codigo,
        descrip: String(product.descrip),
        base1: Number(product.base1),
        precio1: Number(product.precio1),
        iva: Number(product.iva),
        cantidad: Number(product.cantidad)
      })),
      subtotal: String(subtotal),
      total: String(total),
    })
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
      increase,
      decrease,
      subtotal,
      setSubtotal,
      total,
      setTotal,
      removeElement,
      addToCart,
      processOrder,
      order,
      getProducts,
      currentPage,
      setCurrentPage
    }}>
      {children}
    </InvContext.Provider>
  )
}

export default InvContext