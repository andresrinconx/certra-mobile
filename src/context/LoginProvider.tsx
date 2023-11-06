import { createContext, useState, useEffect } from 'react'
import { PermissionsAndroid } from 'react-native'
import GetLocation from 'react-native-get-location'
import { UserFromScliInterface, MyUserInterface } from '../utils/interfaces'
import { setDataStorage } from '../utils/asyncStorage'
import { fetchTableData } from '../utils/api'
// import { notificationListener, requestUserPermission } from '../utils/pushNotification'

const LoginContext = createContext<{
  login: boolean
  setLogin: (login: boolean) => void
  myUser: MyUserInterface
  setMyUser: (myUser: MyUserInterface) => void
  loadingAuth: boolean
  setLoadingAuth: (loadingAuth: boolean) => void
  allCustomers: UserFromScliInterface[]
  checkLocationPermission: () => void
  locationPermissionGranted: boolean
  getCurrentLocation: () => unknown
}>({
  login: false,
  setLogin: () => { 
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
  loadingAuth: false,
  setLoadingAuth: () => { 
    // do nothing
  },
  allCustomers: [],
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

  // LOCATION
  const [locationPermissionGranted, setLocationPermissionGranted] = useState(false)

  // API
  const [allCustomers, setAllCustomers] = useState<UserFromScliInterface[]>([])

  // LOADERS
  const [loadingAuth, setLoadingAuth] = useState(false)

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

  // Push notification
  // useEffect(() => {
  //   PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS)
  //   requestUserPermission()
  //   notificationListener()
  // }, [])

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
  // CUSTOMERS
  // -----------------------------------------------
  
  // Get customers
  useEffect(() => {
    if (login) {
      const getCustomers = async () => {
        try {
          const resScli = await fetchTableData('appClientes/scli')
          setAllCustomers(resScli)
        } catch (error) {
          console.log(error)
        }
      }
      getCustomers()
    }
  }, [login]) 

  return (
    <LoginContext.Provider value={{
      login,
      setLogin,
      myUser,
      setMyUser,
      loadingAuth,
      setLoadingAuth,
      allCustomers,
      checkLocationPermission,
      locationPermissionGranted,
      getCurrentLocation
    }}>
      {children}
    </LoginContext.Provider>
  )
}

export default LoginContext