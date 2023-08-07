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
  users: any[]
  setUsers: any
  auth: () => void
  logOut: () => void
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
})

export const LoginProvider = ({children}: {children: React.ReactNode}) => {
  const [login, setLogin] = useState(false)
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState('')
  const [password, setPassword] = useState('')
  const [users, setUsers] = useState([])

  // get logged user
  useEffect(() => {
    const getUser = async () => {
      try {
        setLoading(true)
        const loginStorage = await AsyncStorage.getItem('login')
        setLogin(loginStorage ? true : false)
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
      const url = `http://${URL_API}:4000`
    
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
    const actualUser = users.find((userDb: UserInterface) => userDb.us_codigo === user && userDb.us_clave === password);
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
  }

  // log out
  const logOut = async () => {
    await AsyncStorage.setItem('login', JSON.stringify(false))
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
      logOut
    }}>
      {children}
    </LoginContext.Provider>
  )
}

export default LoginContext