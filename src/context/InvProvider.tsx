import { createContext, useState, useEffect } from "react"
import ProductoInterface from "../interfaces/ProductoInterface"
import { setDataStorage } from "../utils/asyncStorage"
import { fetchTableData, sendData } from "../utils/api"
import UserFromScliInterface from "../interfaces/UserFromScliInterface"
import { OrderInterface } from "../interfaces/OrderInterface"

const InvContext = createContext<{
  productsCart: ProductoInterface[]
  setProductsCart: (productsCart: ProductoInterface[]) => void
  products: ProductoInterface[]
  setProducts: (products: ProductoInterface[]) => void
  searchedProducts: ProductoInterface[]
  setSearchedProducts: (searchedProducts: ProductoInterface[]) => void
  searchedCustomers: UserFromScliInterface[]
  setSearchedCustomers: (searchedCustomers: UserFromScliInterface[]) => void
  flowControl: {
    showProducts: boolean
    showSelectCustomer: boolean
    showSelectSearch: boolean
    showSelectResults: boolean
    showSelectLabel: boolean
    showLogoCertra: boolean
    showLogoLab: boolean
    selected: boolean
  }
  setFlowControl: (flowControl: {
    showProducts: boolean
    showSelectCustomer: boolean
    showSelectSearch: boolean
    showSelectResults: boolean
    showSelectLabel: boolean
    showLogoCertra: boolean
    showLogoLab: boolean
    selected: boolean
  }) => void
  loaders: {
    loadingProducts: boolean,
    loadingSearchedItems: boolean,
    loadingSlectedCustomer: boolean,
    loadingConfirmOrder: boolean,
    loadingLogOut: boolean,
  }
  setLoaders: (loaders: {
    loadingProducts: boolean,
    loadingSearchedItems: boolean,
    loadingSlectedCustomer: boolean,
    loadingConfirmOrder: boolean,
    loadingLogOut: boolean,
  }) => void
  valueSearchCustomers: string
  setValueSearchCustomers: (valueSearchCustomers: string) => void
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
}>({
  productsCart: [],
  setProductsCart: () => { },
  products: [],
  setProducts: () => { },
  searchedProducts: [],
  setSearchedProducts: () => { },
  searchedCustomers: [],
  setSearchedCustomers: () => { },
  flowControl: {
    showProducts: false,
    showSelectCustomer: false,
    showSelectSearch: false,
    showSelectResults: false,
    showSelectLabel: false,
    showLogoCertra: false,
    showLogoLab: false,
    selected: false,
  },
  setFlowControl: () => { },
  loaders: {
    loadingProducts: false,
    loadingSearchedItems: false,
    loadingSlectedCustomer: false,
    loadingConfirmOrder: false,
    loadingLogOut: false,
  },
  setLoaders: () => { },
  valueSearchCustomers: "",
  setValueSearchCustomers: () => { },
  increase: () => { },
  decrease: () => { },
  subtotal: "",
  setSubtotal: () => { },
  total: "",
  setTotal: () => { },
  removeElement: () => { },
  addToCart: () => { },
  processOrder: () => { },
  order: {
    subtotal: "",
    total: "",
    cliente: { name: "", code: 0 },
    productos: []
  },
  getProducts: () => { }
})

export const InvProvider = ({ children }: { children: React.ReactNode }) => {
  // products
  const [products, setProducts] = useState<ProductoInterface[]>([])

  // order & cart
  const [order, setOrder] = useState<OrderInterface>({
    subtotal: "",
    total: "",
    cliente: { name: "", code: 0 },
    productos: []
  })
  const [productsCart, setProductsCart] = useState<ProductoInterface[]>([])
  const [subtotal, setSubtotal] = useState("")
  const [total, setTotal] = useState("")

  // search
  const [searchedProducts, setSearchedProducts] = useState<ProductoInterface[]>([])
  const [searchedCustomers, setSearchedCustomers] = useState<UserFromScliInterface[]>([])
  const [valueSearchCustomers, setValueSearchCustomers] = useState("")

  // layout
  const [flowControl, setFlowControl] = useState({
    showProducts: false,
    showSelectCustomer: false,
    showSelectSearch: false,
    showSelectResults: false,
    showSelectLabel: false,
    showLogoCertra: false,
    showLogoLab: false,
    selected: false,
  })

  // loaders
  const [loaders, setLoaders] = useState({
    loadingProducts: false,
    loadingSearchedItems: false,
    loadingSlectedCustomer: false,
    loadingConfirmOrder: false,
    loadingLogOut: false,
  })

  // ----- STORAGE
  // set productsCart
  useEffect(() => {
    const setProductsStorage = async () => {
      try {
        await setDataStorage("productsCart", productsCart)
      } catch (error) {
        console.log(error)
      }
    }
    setProductsStorage()
  }, [productsCart])

  // set flow control
  useEffect(() => {
    // set storage when a customer is selected
    if (flowControl?.selected || (flowControl?.showProducts && !flowControl?.showSelectCustomer)) {
      const flowControlStorage = async () => {
        try {
          await setDataStorage("flowControl", flowControl)
        } catch (error) {
          console.log(error)
        }
      }
      flowControlStorage()
    }
  }, [flowControl])

  // ----- API
  // get products api
  const getProducts = async () => {
    try {
      setLoaders({ ...loaders, loadingProducts: true })
      const data = await fetchTableData("sinv")

      // Add properties to each producto
      const products = data?.map((product: ProductoInterface) => ({
        ...product,
        agregado: false,
        cantidad: 1,
      }))

      // fail api
      if (products?.length !== 0) {
        setProducts(products)
        setLoaders({ ...loaders, loadingProducts: false })
      }
      
      // slow api
      setTimeout(() => {
        if (products?.length !== 0) {
          setProducts(products)
          setLoaders({ ...loaders, loadingProducts: false })
        }
      }, 3000);
    } catch (error) {
      console.log(error)
    }
  }

  // ----- ACTIONS
  // set subtotal & total
  useEffect(() => {
    // subtotal
    const subtotal = productsCart.reduce((total, product) => total + product.precio1 * product.cantidad, 0);
    const subtotalFormated = subtotal.toLocaleString();
    setSubtotal(subtotalFormated);

    // total
    const total = productsCart.reduce((total, product) => total + product.precio1 * product.cantidad, 0);
    const totalFormated = total.toLocaleString();
    setTotal(totalFormated);
  }, [productsCart])

  // add to cart
  const addToCart = (product: ProductoInterface) => {
    setProductsCart([...productsCart, { ...product, agregado: true, cantidad: 1 }])
  }

  // increase & decrease
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

  // remove element from cart
  const removeElement = (id: number) => {
    const updatedProductsCart = productsCart.filter(item => item.id !== id)
    setProductsCart(updatedProductsCart)
  }

  // send order
  useEffect(() => {
    const sendOrder = async () => {
      try {
        if (order.productos.length !== 0) {
          await sendData(order)

          setTimeout(() => {
            // clear cart
            const updatedProducts = productsCart.filter(item => item.agregado !== true)
            setProductsCart(updatedProducts)
          }, 2000);

          setTimeout(() => {

            setLoaders({ ...loaders, loadingConfirmOrder: false }) // loader from alert*
          }, 3000);
        }
      } catch (error) {
        console.log(error)
      }
    }
    sendOrder()
  }, [order])

  // process order
  const processOrder = async (myUser: any) => {
    // order data
    setOrder({
      ...order,
      subtotal: String(subtotal),
      total: String(total),
      cliente: (myUser.from === "scli" ? {
        name: myUser?.nombre,
        code: myUser?.cliente
      } : {
        name: myUser.us_nombre,
        code: myUser?.customer?.cliente
      }),
      productos: productsCart.map((product: ProductoInterface) => ({
        codigo: product.codigo,
        descrip: String(product.descrip),
        base1: Number(product.base1),
        precio1: Number(product.precio1),
        iva: Number(product.iva),
        cantidad: Number(product.cantidad)
      }))
    })
  }

  return (
    <InvContext.Provider value={{
      productsCart,
      setProductsCart,
      products,
      setProducts,
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
      processOrder,
      order,
      getProducts
    }}>
      {children}
    </InvContext.Provider>
  )
}

export default InvContext