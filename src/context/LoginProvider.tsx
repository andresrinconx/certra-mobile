import { createContext, useState, useEffect } from "react"
import {Alert} from 'react-native'
import UserFromUsuarioInterface from "../interfaces/UserFromUsuarioInterface"
import UserFromScliInterface from "../interfaces/UserFromScliInterface"
import { getDataStorage, setDataStorage } from "../utils/helpers"
import { fetchTableData } from "../api/inv"

const LoginContext = createContext<{
  login: boolean
  setLogin: (login: boolean) => void
  user: string
  setUser: (user: string) => void
  password: string
  setPassword: (password: string) => void
  myUser: any
  setMyUser: (myUser: any) => void
  loaders: {loadingLogin: boolean, loadingAuth: boolean,}
  setLoaders: (loaders: {loadingLogin: boolean, loadingAuth: boolean,}) => void
  firstTwoLetters: (fullName: string) => string
  usersFromUsuario: UserFromUsuarioInterface[]
  usersFromScli: UserFromScliInterface[]
}>({
  login: false,
  setLogin: () => {},
  user: '',
  setUser: () => {},
  password: '',
  setPassword: () => {},
  myUser: {},
  setMyUser: () => {},
  loaders: {loadingLogin: false, loadingAuth: false,},
  setLoaders: () => {},
  firstTwoLetters: () => '',
  usersFromUsuario: [],
  usersFromScli: [],
})

export const LoginProvider = ({children}: {children: React.ReactNode}) => {
  // user
  const [login, setLogin] = useState(false) // go to login or go to home
  const [myUser, setMyUser] = useState<any>({})
  // api
  const [usersFromUsuario, setUsersFromUsuario] = useState<UserFromUsuarioInterface[]>([]) // espera que usersFromUsuario sea un arreglo de objetos UserFromUsuarioInterface
  const [usersFromScli, setUsersFromScli] = useState<UserFromScliInterface[]>([])
  // inputs
  const [user, setUser] = useState('')
  const [password, setPassword] = useState('')
  // loaders
  const [loaders, setLoaders] = useState({
    loadingLogin: false,
    loadingAuth: false,
  })

  // get storage (logged user, myUser)
  useEffect(() => {
    const getUser = async () => {
      try {
        setLoaders({...loaders, loadingLogin: true})

        // login
        const loginStorage = await getDataStorage('login')
        setLogin(loginStorage === 'true' ? true : false)
        // myUser
        const myUserStorage = await getDataStorage('myUser')
        setMyUser(myUserStorage ? JSON.parse(myUserStorage) : {})

        setLoaders({...loaders, loadingLogin: false})
      } catch (error) {
        console.log(error)
      }
    }
    getUser()
  }, [])
  
  // get usersFromUsuario & usersFromScli
  useEffect(() => {
    const getUsers = async () => {
      try {
        const dataUsuario = fetchTableData('Usuario')
        const dataScli = fetchTableData('Scli')
        const [usuario, scli] = await Promise.all([dataUsuario, dataScli]) // recibe un arreglo con los JSON, y unicamente se resuelve cuando se resuelvan todaas al mismo tiempo
        setUsersFromUsuario(usuario)
        setUsersFromScli(scli)
      } catch (error) {
        console.log(error)
      }
    }
    getUsers()
  }, [])

  // add myUser storage
  useEffect(() => {
    if(myUser.letters) {
      const cartStorage = async () => {
        try {
          await setDataStorage('myUser', myUser)
        } catch (error) {
          console.log(error)
        }
      }
      cartStorage()
    }
  }, [myUser])
  
  // get two first letters of the user
  const firstTwoLetters = (fullName: string) => {
    const palabras = fullName.split(' ')
    let letters = ''
    for (let i = 0; i < 2; i++) {
      letters += palabras[i][0]
    }
    return letters
  }

  return (
    <LoginContext.Provider value={{
      login,
      setLogin,
      user,
      setUser,
      password,
      setPassword,
      myUser,
      setMyUser,
      loaders,
      setLoaders,
      firstTwoLetters,
      usersFromScli,
      usersFromUsuario
    }}>
      {children}
    </LoginContext.Provider>
  )
}

export default LoginContext