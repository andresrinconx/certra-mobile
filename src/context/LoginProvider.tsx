import { createContext, useState, useEffect } from 'react'
import { PermissionsAndroid } from 'react-native'
import GetLocation from 'react-native-get-location'
import { UserFromScliInterface, ThemeColorsInterface, MyUserInterface } from '../utils/interfaces'
import { setDataStorage } from '../utils/asyncStorage'
import { fetchTableData } from '../utils/api'

const LoginContext = createContext<{
  login: boolean
  setLogin: (login: boolean) => void
  user: string
  setUser: (user: string) => void
  password: string
  setPassword: (password: string) => void
  myUser: MyUserInterface
  setMyUser: (myUser: MyUserInterface) => void
  loaders: { loadingAuth: boolean, }
  setLoaders: (loaders: { loadingAuth: boolean, }) => void
  usersFromScli: UserFromScliInterface[]
  themeColors: ThemeColorsInterface
  setThemeColors: (themeColors: ThemeColorsInterface) => void
  checkLocationPermission: () => void
  locationPermissionGranted: boolean
  getCurrentLocation: () => unknown
}>({
  login: false,
  setLogin: () => { 
    // do nothing
  },
  user: '',
  setUser: () => { 
    // do nothing
  },
  password: '',
  setPassword: () => { 
    // do nothing
  },
  myUser: {
    access: {
      customerAccess: false,
      labAccess: false,
      salespersonAccess: false
    }
  },
  setMyUser: () => { 
    // do nothing
  },
  loaders: { loadingAuth: false, },
  setLoaders: () => { 
    // do nothing
  },
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
  setThemeColors: () => { 
    // do nothing
  },
  checkLocationPermission: () => { 
    // do nothing
  },
  locationPermissionGranted: false,
  getCurrentLocation: () => { 
    // do nothing
  }
})

export const LoginProvider = ({ children }: { children: React.ReactNode }) => {
  // USER
  const [login, setLogin] = useState(false)
  const [myUser, setMyUser] = useState<MyUserInterface>({
    access: {
      customerAccess: false,
      labAccess: false,
      salespersonAccess: false
    }
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
    if (myUser?.customer) {
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
    const granted = await getLocationPermission()
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
      return null
    }
  }

  // -----------------------------------------------
  // API
  // -----------------------------------------------
  
  // Get usersFromUsuario & usersFromScli
  useEffect(() => {
    if (login) {
      const getUsers = async () => {
        try {
          const resScli = await fetchTableData('appClientes/scli')
          setUsersFromScli(resScli)
        } catch (error) {
          console.log(error)
        }
      }
      getUsers()
    }
  }, [login]) 

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