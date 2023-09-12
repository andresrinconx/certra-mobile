import { View } from "react-native"
import useLogin from "../../hooks/useLogin"

const LoaderCustomersSearch = () => {
  const { themeColors: { charge } } = useLogin()

  return (
    <>
      <View className="h-12 mb-3 w-full rounded-xl" style={{ backgroundColor: charge }}></View>
    </>
  )
}

export default LoaderCustomersSearch