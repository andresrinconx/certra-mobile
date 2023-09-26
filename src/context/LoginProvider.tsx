import { createContext, useState, useEffect } from 'react'
import { PermissionsAndroid } from 'react-native'
import GetLocation from 'react-native-get-location'
import UserFromUsuarioInterface from '../interfaces/UserFromUsuarioInterface'
import UserFromScliInterface from '../interfaces/UserFromScliInterface'
import { ThemeColorsInterface } from '../interfaces/ThemeColorsInterface'
import { setDataStorage } from '../utils/asyncStorage'
import { fetchTableData } from '../utils/api'

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
  checkLocationPermission: () => void
  locationPermissionGranted: boolean
  getCurrentLocation: () => any
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
    background: '',
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
  checkLocationPermission: () => { },
  locationPermissionGranted: false,
  getCurrentLocation: () => { }
})

export const LoginProvider = ({ children }: { children: React.ReactNode }) => {
  // USER
  const [login, setLogin] = useState(false)
  const [myUser, setMyUser] = useState<any>({
    from: '',
  })
  const [themeColors, setThemeColors] = useState<ThemeColorsInterface>({
    primary: '',
    background: '',
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

  // LOCATION
  const [locationPermissionGranted, setLocationPermissionGranted] = useState(false)

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
  // PERMISSIONS
  // -----------------------------------------------

  const checkLocationPermission = async () => {
    let granted = await getLocationPermission()
    setLocationPermissionGranted(granted)
  }

  const getLocationPermission = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    ).catch((err) => {
      console.warn(err)
    })
    return granted === PermissionsAndroid.RESULTS.GRANTED
  }

  const getCurrentLocation = async () => {
    const location = await GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    })
    
    if (location) {
      return location
    } else {
      throw new Error("No se pudo obtener la ubicación.")
    }
  }

  // -----------------------------------------------
  // API
  // -----------------------------------------------
  
  // Get usersFromUsuario & usersFromScli
  useEffect(() => {
    const getUsers = async () => {
      try {
        const resUser = await fetchTableData('usuario')
        setUsersFromUsuario(resUser)

        const resScli = await fetchTableData('scli')
        setUsersFromScli(resScli)
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
      setThemeColors,
      checkLocationPermission,
      locationPermissionGranted,
      getCurrentLocation
    }}>
      {children}
    </LoginContext.Provider>
  )
}

export default LoginContext