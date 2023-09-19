import { createContext, useState, useEffect } from 'react'
import UserFromUsuarioInterface from '../interfaces/UserFromUsuarioInterface'
import UserFromScliInterface from '../interfaces/UserFromScliInterface'
import { setDataStorage } from '../utils/asyncStorage'
import { fetchTableData } from '../utils/api'
import { ThemeColorsInterface } from '../interfaces/ThemeColorsInterface'

const LoginContext = createContext<{
  login: boolean
  setLogin: (login: boolean) => void
  user: string
  setUser: (user: string) => void
  password: string
  setPassword: (password: string) => void
  myUser: any
  setMyUser: (myUser: any) => void
  loaders: { loadingAuth: boolean, }
  setLoaders: (loaders: { loadingAuth: boolean, }) => void
  usersFromUsuario: UserFromUsuarioInterface[]
  usersFromScli: UserFromScliInterface[]
  themeColors: ThemeColorsInterface
  setThemeColors: (themeColors: ThemeColorsInterface) => void
}>({
  login: false,
  setLogin: () => { },
  user: '',
  setUser: () => { },
  password: '',
  setPassword: () => { },
  myUser: { },
  setMyUser: () => { },
  loaders: { loadingAuth: false, },
  setLoaders: () => { },
  usersFromUsuario: [],
  usersFromScli: [],
  themeColors: {
    primary: '',
    backgrund: '',
    charge: '',
    list: '',
    lightList: '',
    turquoise: '',
    darkTurquoise: '',
    green: '',
    blue: '',
    icon: '',
    typography: '',
    processBtn: ''
  },
  setThemeColors: () => { },
})

export const LoginProvider = ({ children }: { children: React.ReactNode }) => {
  // USER
  const [login, setLogin] = useState(false)
  const [myUser, setMyUser] = useState<any>({
    from: '',
  })
  const [themeColors, setThemeColors] = useState<ThemeColorsInterface>({
    primary: '',
    backgrund: '',
    charge: '',
    list: '',
    lightList: '',
    turquoise: '',
    darkTurquoise: '',
    green: '',
    blue: '',
    icon: '',
    typography: '',
    processBtn: '',
  })

  // API
  const [usersFromUsuario, setUsersFromUsuario] = useState<UserFromUsuarioInterface[]>([]) 
  const [usersFromScli, setUsersFromScli] = useState<UserFromScliInterface[]>([])

  // INPUTS
  const [user, setUser] = useState('')
  const [password, setPassword] = useState('')

  // LOADERS
  const [loaders, setLoaders] = useState({
    loadingAuth: false,
  })

  // -----------------------------------------------
  // STORAGE
  // -----------------------------------------------

  // Add myUser storage
  useEffect(() => {
    if (myUser.from) {
      const setMyUserStorage = async () => {
        try {
          await setDataStorage('myUser', myUser)
        } catch (error) {
          console.log(error)
        }
      }
      setMyUserStorage()
    }
  }, [myUser])

  // -----------------------------------------------
  // API
  // -----------------------------------------------
  
  // Get usersFromUsuario & usersFromScli
  useEffect(() => {
    const getUsers = async () => {
      try {
        const dataUsuario = await fetchTableData('usuario')
        // const dataScli = fetchTableData('scli')
        // const [usuario, scli] = await Promise.all([dataUsuario, dataScli]) // recibe un arreglo con los JSON, y unicamente se resuelve cuando se resuelvan todas al mismo tiempo
        setUsersFromUsuario(dataUsuario)
        // setUsersFromScli(scli)
      } catch (error) {
        console.log(error)
      }
    }
    getUsers()
  }, []) 

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
      usersFromUsuario,
      themeColors,
      setThemeColors
    }}>
      {children}
    </LoginContext.Provider>
  )
}

export default LoginContext