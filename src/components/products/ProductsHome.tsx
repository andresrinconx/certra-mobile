import { useState, useEffect } from 'react';
import { View, Text, FlatList, Image } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { items } from '../../utils/constants';
import { useCertra, useLogin } from '../../hooks';
import { LoaderProductsGrid, Loader, ProductGrid } from '..';
import { themeColors } from '../../../tailwind.config';
import { Switch } from 'native-base';
import { fetchPsicotropicos } from '../../utils/api';
import Spinner from 'react-native-loading-spinner-overlay';
import { ProductInterface } from '../../utils/interfaces';

const ProductsHome = () => {
  const [isPsicotropicos, setIsPsicotropicos] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const [currentProducts, setCurrentProducts] = useState<ProductInterface[]>([]);

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
    if (!isPsicotropicos) {
      if (products?.length !== 0) {
        getProducts();
      } else {
        setCurrentPage(1);
        setProducts([]);
        getProducts();
      }
    }
  }, [currentPage]);

  const loadMoreItems = () => {
    if (products?.length !== 0) {
      setCurrentPage(currentPage + 1);
    }
  };

  const switchProducts = async () => {
    setIsPsicotropicos(!isPsicotropicos);
    
    if (isPsicotropicos) {
      setIsSwitchLoading(true);
      setTimeout(() => {
        setProducts(currentProducts);
        setIsSwitchLoading(false);
      }, 0);
    } else {
      setIsSwitchLoading(true);
      setCurrentProducts(products);
      setProducts(await fetchPsicotropicos());
      setIsSwitchLoading(false);
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
                <View className='flex flex-row items-center justify-between mb-2' style={{ marginTop: !customerAccess ? 8 : 0 }}>
                  <Text className='font-bold text-typography' style={{ fontSize: wp(4.5) }}>
                    Productos
                  </Text>

                  <View className='flex-row items-center'>
                    <Switch 
                      onToggle={switchProducts}
                      value={isPsicotropicos}
                      onTrackColor={'green.600'}
                      offTrackColor={'gray.400'}
                      size='md'
                    />
                    <Image style={{ width: 30, height: 30 }} resizeMode='contain'
                      source={require('../../assets/pill.png')}
                    />
                  </View>
                </View>
              )}
              ListFooterComponent={() => (
                !loadingProducts && !isPsicotropicos ? (
                  <View>
                    <Loader size={40} color={darkTurquoise} />
                  </View>
                ):null
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

      <Spinner
        visible={isSwitchLoading}
        textStyle={{ color: '#FFF' }}
      />
    </>
  );
};

export default ProductsHome;