import { View } from "react-native"
import useLogin from "../../hooks/useLogin"
import { widthPercentageToDP as wp } from "react-native-responsive-screen"

const LoaderProductsGrid = () => {
  const { themeColors: { charge } } = useLogin()

  return (
    <View className="h-56 mb-2 mr-2 rounded-2xl" style={{ backgroundColor: charge, width: wp("42%") }} />
  )
}

export default LoaderProductsGrid