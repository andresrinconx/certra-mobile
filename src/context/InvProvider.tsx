import { createContext, useState, useEffect } from "react"
import {Alert} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Squares2X2Icon, ListBulletIcon } from 'react-native-heroicons/outline'
import {URL_API} from '@env'

const InvContext = createContext<{
  cart: any[]
  setCart: any
  type: string
  setType: any
  productos: any[]
  setProductos: any
  loading: boolean
  setLoading: (loading: boolean) => void
  cantidad: number
  setCantidad: (cantidad: number) => void
  modalVisible: boolean
  setModalVisible: (modalVisible: boolean) => void
  disabledBtn: boolean
  setDisabledBtn: (disabledBtn: boolean) => void
  incremento: () => void
  decremento: () => void
  cartList: boolean
  setCartList: (cartList: boolean) => void
  icon: (type: string) => any
  clearCart: () => void
  pay: () => void
}>({
  cart: [],
  setCart: () => {},
  type: 'grid',
  setType: () => {},
  productos: [],
  setProductos: () => {},
  loading: false,
  setLoading: () => {},
  cantidad: 1,
  setCantidad: () => {},
  modalVisible: false,
  setModalVisible: () => {},
  disabledBtn: false,
  setDisabledBtn: () => {},
  incremento: () => {},
  decremento: () => {},
  cartList: false,
  setCartList: () => {},
  icon: () => {},
  clearCart: () => {},
  pay: () => {},
})

export const InvProvider = ({children}: {children: React.ReactNode}) => {
  // --- Cart
  const [productos, setProductos] = useState([])
  const [cart, setCart] = useState([])
  const [cantidad, setCantidad] = useState(1)
  const [modalVisible, setModalVisible] = useState(false)
  const [disabledBtn, setDisabledBtn] = useState(false)
  const [cartList, setCartList] = useState(false)

  // --- Layout
  const [type, setType] = useState('grid')
  const [loading, setLoading] = useState(false)

  /* 
  --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
  */

  // --- Cart
  // get cart storage
  useEffect(() => {
    const getCartStorage = async () => {
      try {
        const cartStorage = await AsyncStorage.getItem('cart')
        setCart(cartStorage ? JSON.parse(cartStorage) : [])
      } catch (error) {
        console.log(error)
      }
    }
    getCartStorage()
  }, [])

  // get products api
  useEffect(() => {
    const obtenerProductos = async () => {
      const url = `http://${URL_API}:3000/sinv`
    
      try {
        setLoading(true)
        const response = await fetch(url)
        const result = await response.json()
        setProductos(result.result.data)
        setLoading(false)
      } catch (error) {
        console.log(error)
      }
    }
    obtenerProductos()
  }, [])

  // add cart storage
  useEffect(() => {
    const cartStorage = async () => {
      try {
        await AsyncStorage.setItem('cart', JSON.stringify(cart))
      } catch (error) {
        console.log(error)
      }
    }
    cartStorage()
  }, [cart])

  // incremento y decremento
  const incremento = () => {
    const total = cantidad + 1
    setCantidad(total)
  }
  const decremento = () => {
    if (cantidad !== 1) {
      const total = cantidad - 1
      setCantidad(total)
    }
  }

  // list
  useEffect(() => {
    setCartList(true)
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

  // --- Layout
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
      productos,
      setProductos,
      loading,
      setLoading,
      cantidad,
      setCantidad,
      modalVisible,
      setModalVisible,
      disabledBtn,
      setDisabledBtn,
      incremento,
      decremento,
      cartList,
      setCartList,
      icon,
      clearCart,
      pay
    }}>
      {children}
    </InvContext.Provider>
  )
}

export default InvContext