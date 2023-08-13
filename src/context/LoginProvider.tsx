import { createContext, useState, useEffect } from "react"
import UserFromUsuarioInterface from "../interfaces/UserFromUsuarioInterface"
import UserFromScliInterface from "../interfaces/UserFromScliInterface"
import { getDataStorage, setDataStorage } from "../utils/asyncStorage"
import { fetchTableData } from "../utils/api"

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
  usersFromUsuario: [],
  usersFromScli: [],
})

export const LoginProvider = ({children}: {children: React.ReactNode}) => {
  // user
  const [login, setLogin] = useState(false) // go to login or go to home
  const [myUser, setMyUser] = useState<any>({
    from: '',
    letters: '',
  })
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

  // ---- STORAGE
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

  // ----- API
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

  // ----- ACTIONS


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
      usersFromScli,
      usersFromUsuario
    }}>
      {children}
    </LoginContext.Provider>
  )
}

export default LoginContext