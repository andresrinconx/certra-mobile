import { useState, useEffect } from "react"
import { View, Text, TextInput, TouchableOpacity, Image, ImageBackground, Linking } from "react-native"
import { EyeIcon, EyeSlashIcon } from "react-native-heroicons/mini"
import useLogin from "../hooks/useLogin"
import { useNavigation } from "@react-navigation/native"
import Loader from "../components/loaders/Loader"
import UserFromScliInterface from "../interfaces/UserFromScliInterface"
import UserFromUsuarioInterface from "../interfaces/UserFromUsuarioInterface"
import { setDataStorage } from "../utils/asyncStorage"
import { firstTwoLetters } from "../utils/helpers"
import { pallete } from "../utils/pallete"
import { utilities } from "../utils/styles"

const Login = () => {
  // styles
  const {  } = utilities

  // state
  const [showPassword, setShowPassword] = useState(false)
  const [incorrectCredentials, setIncorrectCredentials] = useState(false)
  const [requiredFields, setRequiredFields] = useState({
    user: false,
    password: false,
  })

  const { user, setUser, password, setPassword, login, loaders, setLoaders, usersFromUsuario, usersFromScli, setMyUser, setLogin, setThemeColors } = useLogin()
  const navigation = useNavigation()

  // actions
  const auth = async () => {
    // required fields
    if (user === "" && password === "") {
      setRequiredFields({ ...requiredFields, user: true, password: true })
      setIncorrectCredentials(false)
      return
    } else if (user === "") {
      setRequiredFields({ ...requiredFields, user: true, password: false })
      setIncorrectCredentials(false)
      return
    } else if (password === "") {
      setRequiredFields({ ...requiredFields, user: false, password: true })
      setIncorrectCredentials(false)
      return
    } else {
      setRequiredFields({ ...requiredFields, user: false, password: false })
    }

    setLoaders({ ...loaders, loadingAuth: true })
    setIncorrectCredentials(false)

    // find in the table "Usuario"
    const userFromUsuario = usersFromUsuario?.find((userDb: UserFromUsuarioInterface) => (userDb.us_codigo === user.toUpperCase() || userDb.us_codigo === user) && userDb.us_clave === password)
    if (userFromUsuario === undefined) {

      // find in the table "Scli"
      const userFromScli = usersFromScli?.find((userDb: UserFromScliInterface) => ("W" + userDb.cliente === user.toUpperCase() || "W" + userDb.clave === user) && userDb.clave === password)
      if (userFromScli === undefined) {

        // Incorrect Credentials
        setTimeout(() => {
          setLoaders({ ...loaders, loadingAuth: false })
          setIncorrectCredentials(true)
        }, 1000)
        return
      } else {

        // Success from Scli
        setIncorrectCredentials(false)
        const letters = firstTwoLetters(userFromScli.nombre)
        setMyUser({
          ...userFromScli,
          from: "scli",
          letters,
        })
        await setDataStorage("themeColors", { ...pallete[0] }) // 0 = Scli
        await setDataStorage("login", true)
        await setDataStorage("myUser", {
          ...userFromScli,
          from: "scli",
          letters,
        })
        setThemeColors({ ...pallete[0] }) // 0 = Scli
        setLogin(true)
        setTimeout(() => {
          setLoaders({ ...loaders, loadingAuth: false })
        }, 1500)
        setShowPassword(false)
      }
    } else {

      // Success from Usuario
      setIncorrectCredentials(false)
      const letters = firstTwoLetters(userFromUsuario.us_nombre)
      setMyUser({
        ...userFromUsuario,
        from: "usuario",
        letters,
      })
      await setDataStorage("themeColors", { ...pallete[1] }) // 1 = Usuario
      await setDataStorage("login", true)
      await setDataStorage("myUser", {
        ...userFromUsuario,
        from: "usuario",
        letters,
      })
      setThemeColors({ ...pallete[1] }) // 1 = Usuario
      setLogin(true)
      setTimeout(() => {
        setLoaders({ ...loaders, loadingAuth: false })
      }, 1500)
      setShowPassword(false)
    }
  }

  useEffect(() => {
    if (login) {
      navigation.navigate("Home")
    }
  }, [login])

  return (
    <View className="flex-1 relative">
      <ImageBackground className="w-full h-full" resizeMode="cover"
        source={require("../assets/background.png")}
      >
        {/* form & logos */}
        <View className="">

          {/* logo drocerca */}
          <View className="flex flex-row justify-center h-1/6 pt-10">
            <Image className="w-80 h-24" resizeMode="contain"
              source={require("../assets/logo-drocerca.png")}
            />
          </View>

          {/* form */}
          <View className="h-4/6 flex flex-col items-center">
            <View className="w-5/6 absolute bottom-0 space-y-3">

              {/* username */}
              <View className="">
                <View className="flex-row items-center rounded-2xl p-2 bg-white">
                  <TextInput className="w-full pl-3 text-lg text-[#666666]"
                    placeholder="Usuario"
                    placeholderTextColor="#666666"
                    value={user}
                    onChangeText={setUser}
                    selectionColor="#006283"
                  />
                </View>

                {requiredFields.user && (
                  <View className="pl-4">
                    <Text className="text-lg text-white">* Campo obligatorio</Text>
                  </View>
                )}
              </View>

              {/* password */}
              <View className="">
                <View className="flex-row items-center rounded-2xl p-2 bg-white">
                  <TextInput className="w-full pl-3 text-lg text-[#666666]"
                    secureTextEntry={!showPassword}
                    placeholder="Contraseña"
                    placeholderTextColor="#666666"
                    value={password}
                    onChangeText={setPassword}
                    selectionColor="#006283"
                  />
                  {!showPassword && (
                    <TouchableOpacity onPress={() => setShowPassword(true)} className="absolute right-4">
                      <EyeIcon size={30} color="#B3B3B3" />
                    </TouchableOpacity>
                  )}
                  {showPassword && (
                    <TouchableOpacity onPress={() => setShowPassword(false)} className="absolute right-4">
                      <EyeSlashIcon size={30} color="#B3B3B3" />
                    </TouchableOpacity>
                  )}
                </View>

                {requiredFields.password && (
                  <View className="pl-4">
                    <Text className="text-lg text-white">* Campo obligatorio</Text>
                  </View>
                )}
              </View>

              {/* Incorrect Credentials */}
              {incorrectCredentials && (
                <View className="pr-4">
                  <Text className="text-lg text-white text-right">* Datos incorrectos</Text>
                </View>
              )}

              {/* sign in */}
              <View className="flex flex-col items-center">
                <TouchableOpacity onPress={() => auth()} className="rounded-lg p-1.5 w-40"
                  style={{ backgroundColor: "#92BF1E" }}
                >
                  {!loaders.loadingAuth && (
                    <View className="h-6">
                      <Text className="text-black font-medium text-base text-center">Iniciar Sesión</Text>
                    </View>
                  )}

                  {loaders.loadingAuth && (
                    <View className="h-6">
                      <Loader color="white" size={24} />
                    </View>
                  )}
                </TouchableOpacity>
              </View>

            </View>
          </View>

          {/* social media */}
          <View className="h-1/6 flex flex-row justify-center items-start pt-8 space-x-5">
            <View className="">
              <TouchableOpacity onPress={ ()=>{ Linking.openURL('https://www.instagram.com/drocerca/')}} className="">
                <Image className="w-10 h-10" resizeMode="cover"
                  source={require("../assets/instagram.png")}
                />
              </TouchableOpacity>
            </View>

            <View className="">
              <TouchableOpacity onPress={ ()=>{ Linking.openURL('https://www.facebook.com/DROCERCA/')}} className="">
                <Image className="w-10 h-10" resizeMode="cover"
                  source={require("../assets/facebook.png")}
                />
              </TouchableOpacity>
            </View>

            <View className="">
              <TouchableOpacity onPress={ ()=>{ Linking.openURL('https://www.youtube.com/channel/UCE63H9js4lEAN8C713SRFrQ')}} className="">
                <Image className="w-10 h-10" resizeMode="cover"
                  source={require("../assets/youtube.png")}
                />
              </TouchableOpacity>
            </View>

            <View className="">
              <TouchableOpacity onPress={ ()=>{ Linking.openURL('https://twitter.com/drocerca')}} className="">
                <Image className="w-10 h-10" resizeMode="cover"
                  source={require("../assets/x.png")}
                />
              </TouchableOpacity>
            </View>
          </View>

        </View>
      </ImageBackground>
    </View>
  )
}

export default Login