import { createContext, useState, useEffect } from "react"
import AsyncStorage from '@react-native-async-storage/async-storage'
import {Alert} from 'react-native'
import UserInterface from "../interfaces/UserInterface"
import {URL_API} from '@env'

const LoginContext = createContext<{
  login: boolean
  setLogin: (login: boolean) => void
  loading: boolean
  setLoading: (loading: boolean) => void
  user: string
  setUser: (user: string) => void
  password: string
  setPassword: (password: string) => void
  users: UserInterface[]
  setUsers: (users: UserInterface[]) => void
  auth: () => void
  logOut: () => void
  isAuth: boolean
  setIsAuth: (isAuth: boolean) => void
  myUser: UserInterface
}>({
  login: false,
  setLogin: () => {},
  loading: false,
  setLoading: () => {},
  user: '',
  setUser: () => {},
  password: '',
  setPassword: () => {},
  users: [],
  setUsers: () => {},
  auth: () => {},
  logOut: () => {},
  isAuth: false,
  setIsAuth: () => {},
  myUser: {
    us_codigo: '',
    us_clave: '',
    activo: '',
    almacen: '',
    cajero: '',
    cedula: '',
    clavec: '',
    clipro: '',
    direc: '',
    emailc: '',
    emailp: '',
    especial: null,
    id: '',
    pers: '',
    propio: '',
    remoto: '',
    sucursal: '',
    supervisor: '',
    tele1: '',
    tele2: '',
    tipo: '',
    us_fechae: null,
    us_fechas: null,
    us_horae: null,
    us_horas: null,
    us_nombre: '',
    uuid: '',
    vendedor: '',
  },
})

export const LoginProvider = ({children}: {children: React.ReactNode}) => {
  // api
  const [users, setUsers] = useState<UserInterface[]>([]) // espera que users sea un arreglo de objetos UserInterface
  const [myUser, setMyUser] = useState<UserInterface>({
    us_codigo: '',
    us_clave: '',
    activo: '',
    almacen: '',
    cajero: '',
    cedula: '',
    clavec: '',
    clipro: '',
    direc: '',
    emailc: '',
    emailp: '',
    especial: null,
    id: '',
    pers: '',
    propio: '',
    remoto: '',
    sucursal: '',
    supervisor: '',
    tele1: '',
    tele2: '',
    tipo: '',
    us_fechae: null,
    us_fechas: null,
    us_horae: null,
    us_horas: null,
    us_nombre: '',
    uuid: '',
    vendedor: '',
  })
  // inputs
  const [user, setUser] = useState('')
  const [password, setPassword] = useState('')
  // auth
  const [isAuth, setIsAuth] = useState(false)
  const [login, setLogin] = useState(false)
  const [loading, setLoading] = useState(false)

  // get logged user
  useEffect(() => {
    const getUser = async () => {
      try {
        setLoading(true)
        const loginStorage = await AsyncStorage.getItem('login')
        setLogin(loginStorage === 'true' ? true : false)
        setLoading(false)
      } catch (error) {
        console.log(error)
      }
    }
    getUser()
  }, [])

  // get users from db
  useEffect(() => {
    const getUsers = async () => {
      const url = `${URL_API}Usuario`
    
      try {
        const response = await fetch(url)
        const result = await response.json()
        setUsers(result)
      } catch (error) {
        console.log(error)
      }
    }
    getUsers()
  }, [])

  // auth
  const auth = async () => {
    // required fields
    if([user, password].includes('')) {
      Alert.alert(
        'Error',
        'Todos los campos son obligatorios',
        [
          { text: 'OK' },
        ]
      )
      return
    }

    // find in the db
    const actualUser = users.find((userDb: UserInterface) => userDb.us_codigo === user && userDb.us_clave === password)
    if (actualUser === undefined) {
      Alert.alert(
        'Error',
        'Usuario y contraseña incorrectos',
        [
          { text: 'OK' },
        ]
      )
      return
    }

    // success 
    await AsyncStorage.setItem('login', JSON.stringify(true))
    setIsAuth(true)
    setMyUser(actualUser)
  }

  // log out
  const logOut = async () => {
    await AsyncStorage.setItem('login', JSON.stringify(false))
    setUser('')
    setPassword('')
    setLogin(false)
    setIsAuth(false)
  }
  
  return (
    <LoginContext.Provider value={{
      login,
      setLogin,
      loading,
      setLoading,
      user,
      setUser,
      password,
      setPassword,
      users,
      setUsers,
      auth,
      logOut,
      isAuth,
      setIsAuth,
      myUser,
    }}>
      {children}
    </LoginContext.Provider>
  )
}

export default LoginContext