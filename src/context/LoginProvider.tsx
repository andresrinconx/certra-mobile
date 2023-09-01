import { createContext, useState, useEffect } from "react"
import UserFromUsuarioInterface from "../interfaces/UserFromUsuarioInterface"
import UserFromScliInterface from "../interfaces/UserFromScliInterface"
import { getDataStorage, setDataStorage } from "../utils/asyncStorage"
import { fetchTableData } from "../utils/api"
import { ThemeColorsInterface } from "../interfaces/ThemeColorsInterface"

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
  myUser: {},
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
  // user
  const [login, setLogin] = useState(false) // go to login or go to home
  const [myUser, setMyUser] = useState<any>({
    from: '',
    letters: '',
  })
  const [themeColors, setThemeColors] = useState<ThemeColorsInterface>({ // 0 = Usuario, 1 = Scli
    primary: '',
    backgrund: '',
    charge: '',
    list: '',
    turquoise: '',
    darkTurquoise: '',
    green: '',
    blue: '',
    icon: '',
    typography: '',
    processBtn: '',
  })
  // api
  const [usersFromUsuario, setUsersFromUsuario] = useState<UserFromUsuarioInterface[]>([]) // espera que usersFromUsuario sea un arreglo de objetos UserFromUsuarioInterface
  const [usersFromScli, setUsersFromScli] = useState<UserFromScliInterface[]>([])
  // inputs
  const [user, setUser] = useState('')
  const [password, setPassword] = useState('')
  // loaders
  const [loaders, setLoaders] = useState({
    loadingAuth: false,
  })

  // ---- STORAGE
  // add myUser storage
  useEffect(() => {
    if (myUser.letters) {
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

  // ----- API
  // get usersFromUsuario & usersFromScli
  useEffect(() => {
    const getUsers = async () => {
      try {
        const dataUsuario = fetchTableData('usuario')
        const dataScli = fetchTableData('scli')
        const [usuario, scli] = await Promise.all([dataUsuario, dataScli]) // recibe un arreglo con los JSON, y unicamente se resuelve cuando se resuelvan todas al mismo tiempo
        setUsersFromUsuario(usuario)
        setUsersFromScli(scli)
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