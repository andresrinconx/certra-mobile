import { createContext, useState, useEffect } from "react"
import {Alert} from 'react-native'
import UserFromUsuarioInterface from "../interfaces/UserFromUsuarioInterface"
import UserFromScliInterface from "../interfaces/UserFromScliInterface"
import {URL_API} from '@env'
import { getDataStorage, setDataStorage } from "../utils/helpers"

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
  myUser: any
  setMyUser: (myUser: any) => void
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
  myUser: {},
  setMyUser: () => {}
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
  const [login, setLogin] = useState(false)
  const [loading, setLoading] = useState(false)

  // get logged user
  useEffect(() => {
    const getUser = async () => {
      try {
        setLoading(true)
        // login
        const loginStorage = await getDataStorage('login')
        setLogin(loginStorage === 'true' ? true : false)
        
        // user
        const myUserStorage = await getDataStorage('myUser')
        setMyUser(myUserStorage ? JSON.parse(myUserStorage) : {})
        
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
        setLogin(true)
        setMyUser(userFromScli)
        await setDataStorage('login', true)
        await setDataStorage('myUser', userFromScli)
      }
    } else {
      // success
      setLogin(true)
      setMyUser(userFromUsuario)
      await setDataStorage('login', true)
      await setDataStorage('myUser', userFromUsuario)
    }
  }

  // log out
  const logOut = async () => {
    setUser('')
    setPassword('')
    setLogin(false)
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
      myUser,
      setMyUser
    }}>
      {children}
    </LoginContext.Provider>
  )
}

export default LoginContext