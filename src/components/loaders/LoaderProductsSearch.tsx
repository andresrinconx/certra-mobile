import { View } from "react-native"
import useLogin from "../../hooks/useLogin"
import { widthPercentageToDP as wp } from "react-native-responsive-screen"

const LoaderProductsSearch = () => {
  const { themeColors: { charge } } = useLogin()

  return (
    <View className="h-16 w-full mb-2 mr-2 rounded-2xl" style={{ backgroundColor: charge }} />
  )
}

export default LoaderProductsSearch