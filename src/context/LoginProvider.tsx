import { createContext, useState, useEffect } from "react"
import AsyncStorage from '@react-native-async-storage/async-storage'
import {Alert} from 'react-native'
import UserFromUsuarioInterface from "../interfaces/UserFromUsuarioInterface"
import UserFromScliInterface from "../interfaces/UserFromScliInterface"
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
  auth: () => void
  logOut: () => void
  isAuth: boolean
  setIsAuth: (isAuth: boolean) => void
  myUser: any
}>({
  login: false,
  setLogin: () => {},
  loading: false,
  setLoading: () => {},
  user: '',
  setUser: () => {},
  password: '',
  setPassword: () => {},
  auth: () => {},
  logOut: () => {},
  isAuth: false,
  setIsAuth: () => {},
  myUser: {},
})

export const LoginProvider = ({children}: {children: React.ReactNode}) => {
  // api
  const [usersFromUsuario, setUsersFromUsuario] = useState<UserFromUsuarioInterface[]>([]) // espera que usersFromUsuario sea un arreglo de objetos UserFromUsuarioInterface
  const [usersFromScli, setUsersFromScli] = useState<UserFromScliInterface[]>([])
  const [myUser, setMyUser] = useState<any>({})
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

  // get usersFromUsuario
  useEffect(() => {
    const getUsers = async () => {
      const url = `${URL_API}Usuario`
    
      try {
        const response = await fetch(url)
        const result = await response.json()
        setUsersFromUsuario(result)
      } catch (error) {
        console.log(error)
      }
    }
    getUsers()
  }, [])

  // get usersFromScli
  useEffect(() => {
    const getUsers = async () => {
      const url = `${URL_API}Scli`
    
      try {
        console.log('result') 
        const response = await fetch(url)
        const result = await response.json()
        setUsersFromScli(result)
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

    // find in the table 'Usuario'
    const userFromUsuario = usersFromUsuario.find((userDb: UserFromUsuarioInterface) => (userDb.us_codigo === user.toUpperCase() || userDb.us_codigo === user) && userDb.us_clave === password)

    if (userFromUsuario === undefined) {
      // find in the table 'Scli'
      const userFromScli = usersFromScli.find((userDb: UserFromScliInterface) => (userDb.cliente === user.toUpperCase() || userDb.clave === user) && userDb.clave === password)
      if (userFromScli === undefined) {
        Alert.alert(
          'Error',
          'Usuario y contraseña incorrectos',
          [
            { text: 'OK' },
          ]
        )
        return
      } else {
        // success
        await AsyncStorage.setItem('login', JSON.stringify(true))
        setIsAuth(true)
        setMyUser(userFromScli)
      }
    } else {
      // success
      await AsyncStorage.setItem('login', JSON.stringify(true))
      setIsAuth(true)
      setMyUser(userFromUsuario)
    }
  }

  // log out
  const logOut = async () => {
    setUser('')
    setPassword('')
    await AsyncStorage.setItem('login', JSON.stringify(false))
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