import { createContext, useState, useEffect } from "react"
import { Alert } from "react-native"
import ProductoInterface from "../interfaces/ProductoInterface"
import { getDataStorage, setDataStorage } from "../utils/asyncStorage"
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
  clearCart: () => void
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
  }
  setLoaders: (loaders: { 
    loadingProducts: boolean, 
    loadingSearchedItems: boolean, 
    loadingSlectedCustomer: boolean, 
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
  confirmOrder: (myUser: any) => void
  order: OrderInterface
}>({
  productsCart: [],
  setProductsCart: () => { },
  products: [],
  setProducts: () => { },
  searchedProducts: [],
  setSearchedProducts: () => { },
  clearCart: () => { },
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
  confirmOrder: () => { },
  order: {
    subtotal: "",
    total: "",
    cliente: "",
    productos: []
  }
})

export const InvProvider = ({ children }: { children: React.ReactNode }) => {
  // products
  const [products, setProducts] = useState<ProductoInterface[]>([])

  // order & cart
  const [order, setOrder] = useState<OrderInterface>({
    subtotal: "",
    total: "",
    cliente: "",
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
  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        setLoaders({ ...loaders, loadingProducts: true })
        const data = await fetchTableData("sinv")

        // Add properties to each producto
        const productos = data?.map((producto: ProductoInterface) => ({
          ...producto,
          agregado: false,
          cantidad: 1,
        }))

        // no fail api call
        if (productos?.length !== 0) {
          setProducts(productos)
          setLoaders({ ...loaders, loadingProducts: false })
        }
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
    const subtotal = productsCart.reduce((total, product) => total + product.precio1 * product.cantidad, 0);
    const subtotalFormated = subtotal.toLocaleString();
    setSubtotal(subtotalFormated);

    // total
    const total = productsCart.reduce((total, product) => total + product.precio1 * product.cantidad, 0);
    const totalFormated = total.toLocaleString();
    setTotal(totalFormated);
  }, [productsCart])

  // send order
  useEffect(() => {
    if (order.productos.length !== 0) {
      const sendOrder = async () => {
        await sendData(order)
      }
      sendOrder()
    }
  }, [order])

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
      Alert.alert(
        "Advertencia",
        "¿Quieres eliminar este producto del carrito?",
        [
          {
            text: "Eliminar", style: "destructive", onPress: () => {
              const updatedProductsCart = productsCart.filter(item => item.id !== id)
              setProductsCart(updatedProductsCart)
            }
          },
          { text: "Cancelar", style: "cancel" },
        ]
      )
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

  // clear cart
  const clearCart = () => {
    Alert.alert(
      "¿Quieres eliminar todos los productos del carrito?",
      "Esta acción no se puede deshacer",
      [
        {
          text: "Sí, eliminar", onPress: () => {
            const updatedProducts = productsCart.filter(item => item.agregado !== true)
            setProductsCart(updatedProducts)
          }
        },
        { text: "Cancelar", style: "cancel", },
      ]
    )
  }

  // confirm order
  const confirmOrder = async (myUser: any) => {
    // order data
    setOrder({
      ...order,
      subtotal: String(parseInt(subtotal)),
      total: String(parseInt(total)),
      cliente: (myUser.from === "scli" ? myUser.nombre : myUser.us_nombre),
      productos: productsCart.map((product: ProductoInterface) => ({
        codigo: Number(product.codigo),
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
      confirmOrder,
      order
    }}>
      {children}
    </InvContext.Provider>
  )
}

export default InvContext