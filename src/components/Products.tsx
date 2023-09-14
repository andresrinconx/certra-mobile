import { useEffect } from 'react'
import { View, Text, FlatList, Keyboard } from 'react-native'
import useInv from '../hooks/useInv'
import { items } from '../utils/constants'
import LoaderProductsGrid from './LoaderProductsGrid'
import useLogin from '../hooks/useLogin'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import Loader from './Loader'
import ProductsGrid from './ProductsGrid'

const Products = () => {
  const { themeColors: { typography, primary } } = useLogin()
  const { flowControl, loaders, products, setCurrentPage, currentPage, getProducts } = useInv()

  // hide keyboard
  const handleScroll = () => {
    // Cerrar el teclado
    Keyboard.dismiss()
  }

  const loadMoreItems = () => {
    setCurrentPage(currentPage + 1);
  }

  useEffect(() => {
    getProducts()
  }, [currentPage])

  return (
    <>
      {flowControl?.showProducts && !flowControl?.showSelectResults ? (

        loaders?.loadingProducts ? (
          <View className="h-full">
            <View className="flex-1 justify-center items-center">
              <FlatList
                data={items}
                numColumns={2}
                contentContainerStyle={{
                  paddingBottom: flowControl?.showSelectCustomer ? 130 : 30,
                  marginTop: 15
                }}
                showsVerticalScrollIndicator={false}
                overScrollMode="never"
                renderItem={({ item }) => {
                  return (
                    <LoaderProductsGrid key={item.id} />
                  )
                }}
              />
            </View>
          </View>
        ) : (
          <View className="h-full">
            <View className="flex-1 justify-center">
              <FlatList
                data={products}
                onScroll={handleScroll}
                numColumns={2}
                contentContainerStyle={{
                  paddingBottom: flowControl?.showSelectCustomer ? 130 : 30,
                  marginTop: 15
                }}
                showsVerticalScrollIndicator={false}
                overScrollMode="never"
                ListHeaderComponent={() => (
                  <View className="mb-2">
                    <Text className="font-bold" style={{ fontSize: wp(4.5), color: typography }}>
                      Productos
                    </Text>
                  </View>
                )}
                ListFooterComponent={() => (
                    <View>
                      <Loader size={40} color={primary} />
                    </View>
                  )
                }
                renderItem={({ item }) => {
                  return (
                    <ProductsGrid key={item.id} product={item} />
                  )
                }}
                onEndReached={loadMoreItems}
              />
            </View>
          </View>
        )
      ):null}
    </>
  )
}

export default Products