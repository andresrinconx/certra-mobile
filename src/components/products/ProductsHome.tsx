import { useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { items } from '../../utils/constants';
import { useCertra, useLogin } from '../../hooks';
import { LoaderProductsGrid, Loader, ProductGrid } from '..';
import { themeColors } from '../../../tailwind.config';

const ProductsHome = () => {
  const { darkTurquoise } = themeColors;
  const { myUser: { customer, access: { customerAccess } }, login } = useLogin();
  const { loadingProducts, products, setCurrentPage, currentPage, getProducts, loadingProductsGrid, setProducts } = useCertra();

  useEffect(() => {
    if (products?.length === 0 && login) {
      setCurrentPage(1);
      setProducts([]);
      getProducts();
    }
  }, [login]);
  
  useEffect(() => {
    if (products?.length !== 0) {
      getProducts();
    } else {
      setCurrentPage(1);
      setProducts([]);
      getProducts();
    }
  }, [currentPage]);

  const loadMoreItems = () => {
    if (products?.length !== 0) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <>
      {loadingProductsGrid ? (
        <View className='h-full'>
          <View className='flex-1 justify-center items-center'>
            <FlatList
              data={items}
              numColumns={2}
              contentContainerStyle={{
                paddingBottom: customer ? 130 : customerAccess ? 30 : 60,
                marginTop: 15
              }}
              showsVerticalScrollIndicator={false}
              overScrollMode='never'
              renderItem={({ item }) => {
                return (
                  <LoaderProductsGrid key={item.id} />
                );
              }}
            />
          </View>
        </View>
      ) : (
        <View className='h-full'>
          <View className='flex-1 justify-center'>
            <FlatList
              data={products}
              initialNumToRender={10}
              numColumns={2}
              contentContainerStyle={{
                paddingBottom: customer ? 130 : customerAccess ? 30 : 60,
                marginTop: 15
              }}
              showsVerticalScrollIndicator={false}
              overScrollMode='never'
              ListHeaderComponent={() => (
                <View className='mb-2'>
                  <Text className='font-bold text-typography' style={{ fontSize: wp(4.5) }}>
                    Productos
                  </Text>
                </View>
              )}
              ListFooterComponent={() => (
                !loadingProducts && (
                  <View>
                    <Loader size={40} color={darkTurquoise} />
                  </View>
                )
              )}
              renderItem={({ item }) => (
                <ProductGrid key={item.id} product={item} />
              )}
              onEndReached={loadMoreItems}
              onEndReachedThreshold={0}
            />
          </View>
        </View>
      )}
    </>
  );
};

export default ProductsHome;