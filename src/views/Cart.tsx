import { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, FlatList, TextInput, SafeAreaView } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { AlertDialog, Button, Modal } from 'native-base';
import { StatusBar } from 'react-native';
import { themeColors } from '../../tailwind.config';
import { fetchOneItem } from '../utils/api';
import { ProductInterface } from '../utils/interfaces';
import { getDataStorage, setDataStorage } from '../utils/asyncStorage';
import { useCertra, useLogin, useNavigation } from '../hooks';
import { ProductCart, Loader, Logos, LabelCustomer, BackScreen, ProcessOrder, ModalInfo } from '../components';

const Cart = () => {
  const [loadingCart, setLoadingCart] = useState(true);
  const [fullProductsCart, setFullProductsCart] = useState([]);
  const [linealDiscount, setLinealDiscount] = useState(0);
  const [linealDiscountInput, setLinealDiscountInput] = useState('');
  
  const [alertClearCart, setAlertClearCart] = useState(false);
  const [openLinealDiscountModal, setOpenLinealDiscountModal] = useState(false);
  const [disableAcept, setDisableAcept] = useState(true);
  const [modalInfo, setModalInfo] = useState(false);

  const { background, darkTurquoise } = themeColors;
  const { myUser: { access: { customerAccess, labAccess }, customer, image_url, dscCliente } } = useLogin();
  const { productsCart, setProductsCart } = useCertra();
  const initialRef = useRef(null);
  const cancelRef = useRef(null);
  const navigation = useNavigation();

  const onCloseAlertClearCart = () => setAlertClearCart(false);
  
  // Get full products cart
  useEffect(() => {
    const getFullProductsCart = async () => {

      // lineal discount storage
      if (!linealDiscount) {
        const linealDiscountStorage = await getDataStorage('linealDiscount');
        setLinealDiscount(linealDiscountStorage ? JSON.parse(linealDiscountStorage) : 0);
        setLinealDiscountInput(linealDiscountStorage ? JSON.parse(linealDiscountStorage) : '');
      }

      if (productsCart?.length > 0) {
        const newFullProductsCart = [];
    
        for (let i = 0; i < productsCart?.length; i++) {
          const code = productsCart[i].codigo;
          const amount = productsCart[i].amount;
          const labDiscount = productsCart[i].labDiscount;
          const customerDiscount = customerAccess ? dscCliente : customer?.dscCliente;
    
          // get product api
          const res: ProductInterface[] = await fetchOneItem('appSinv/searchC', code);
          newFullProductsCart.push({ ...res[0], amount, labDiscount, customerDiscount });
          
          // last item
          if (i === productsCart?.length - 1) {
            setFullProductsCart(newFullProductsCart as any);
            setLoadingCart(false);
          }
        }

      } else {
        setLoadingCart(false);
      }
    };

    getFullProductsCart();
  }, [productsCart]);

  // -----------------------------------------------
  // ACTIONS
  // -----------------------------------------------

  // Clear cart
  const clearCart = async () => {
    await setDataStorage('linealDiscount', '0');
    setAlertClearCart(false);
    setProductsCart([]);
  };

  const aceptDiscount = async () => {
    const updatedProductsCart = productsCart.map(item => {
      const cleanDiscount = parseInt(String(linealDiscountInput).replace(/-/g, ''));
      return { ...item, labDiscount: isNaN(cleanDiscount) ? '0' : String(cleanDiscount) };
    });
    setProductsCart(updatedProductsCart);
    
    // set discounts
    const cleanDiscount = parseInt(String(linealDiscountInput).replace(/-/g, ''));
    setLinealDiscount(isNaN(cleanDiscount) ? 0 : cleanDiscount);
    try {
      await setDataStorage('linealDiscount', isNaN(cleanDiscount) ? '0' : String(cleanDiscount));
    } catch (error) {
      console.log(error);
    }

    setOpenLinealDiscountModal(false);
    setDisableAcept(true);
    if (Number(linealDiscountInput) >= 20) {
      setModalInfo(true);
    }
  };

  return (
    <>
      <SafeAreaView className='flex-1 px-3 pt-6 bg-background'>
        <StatusBar backgroundColor={background} barStyle='dark-content' />

        <Logos image={image_url as URL} />

        {/* content */}
        <View className='h-full px-3'>

          {/* back & trash */}
          <View className='gap-2 mb-2'>
            <BackScreen 
              title='Carrito de compras' 
              condition={productsCart?.length !== 0 && !loadingCart}
              iconImage={require('../assets/trash-can.png')}
              onPressIcon={() => setAlertClearCart(true)}
            />
          </View>

          {/* customer and lineal discount */}
          {productsCart?.length !== 0 && customer?.nombre && !loadingCart ? (
            <View className='flex flex-row justify-between items-center pb-1'>
              <View style={{ width: wp(65) }}>
                <LabelCustomer
                  name={customer?.nombre}
                />
              </View>

              {labAccess && (
                <View>
                  <Text className='font-bold text-typography' style={{ fontSize: hp(1.5) }}>Dcto. Lineal</Text>
                  
                  <View style={{ width: wp(18), borderWidth: .5 }} className='rounded-md border-turquoise'>
                    <TouchableOpacity onPress={() => setOpenLinealDiscountModal(true)}>
                      <Text style={{ fontSize: wp(4.5) }} className='text-center text-darkTurquoise'>
                        {linealDiscount}%
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          ):null}

          {/* products */}
          {loadingCart ? (
            <View className='mt-5'>
              <Loader />
            </View>
          ) : (
            <View className='flex flex-col justify-center'>
              {productsCart.length === 0 && !loadingCart ? (
                <View className='flex flex-col items-center justify-center' style={{ height: hp(65) }}>
                  <Text className='font-extrabold text-center mt-6 text-typography' style={{ fontSize: wp(6) }}>
                    No hay productos
                  </Text>

                  <Text style={{ fontSize: wp(4) }} className='font-medium h-8 text-typography'
                    onPress={() => navigation.navigate('Home')}>Continúa {''}
                    <Text style={{ fontSize: wp(4) }} className='font-medium text-darkTurquoise'>aquí</Text>
                  </Text>
                </View>
              ) : (
                <FlatList
                  data={fullProductsCart}
                  numColumns={1}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ 
                    paddingBottom: 330,
                    marginTop: 5 
                  }}
                  overScrollMode='never'
                  renderItem={({ item }: { item: ProductInterface }) => {
                    return (
                      <ProductCart key={item.id} product={item} />
                    );
                  }}
                />
              )}
            </View>
          )}
        </View>

      </SafeAreaView>

      {/* process order */}
      {!loadingCart && (
        <ProcessOrder
          fullProductsCart={fullProductsCart}
        />
      )}

      {/* alert clear cart */}
      <AlertDialog leastDestructiveRef={cancelRef} isOpen={alertClearCart} onClose={onCloseAlertClearCart}>
        <AlertDialog.Content>
          <AlertDialog.CloseButton />
          <AlertDialog.Header>¿Deseas continuar?</AlertDialog.Header>
          <AlertDialog.Body>
            <Text className='font-normal text-typography'>
              Se eliminarán todos los productos de tu carrito.
            </Text>
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Button.Group space={2}>
              <Button variant='unstyled' colorScheme='coolGray' onPress={onCloseAlertClearCart} ref={cancelRef}>
                Cancelar
              </Button>
              <Button color={darkTurquoise} onPress={() => clearCart()}>
                Aceptar
              </Button>
            </Button.Group>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>

      {/* modal lineal discount */}
      <Modal isOpen={openLinealDiscountModal} initialFocusRef={initialRef}>
        <Modal.Content style={{ width: wp(89), paddingHorizontal: 25, paddingVertical: 20, borderRadius: 25 }}>

          <Text className='text-center mb-3 text-typography' style={{ fontSize: wp(5) }}>Descuento Lineal</Text>

          {/* input */}
          <View className='w-full rounded-xl mb-4 bg-list'>
            <TextInput className='h-12 text-center rounded-xl text-turquoise' style={{ fontSize: wp(5) }}
              keyboardType='numeric'
              onChangeText={text => {
                if (Number(text) < 0 || Number(text) > 99) {
                  setDisableAcept(true);
                } else {
                  setDisableAcept(false);
                  setLinealDiscountInput(text);
                }
              }}
              selectionColor={darkTurquoise}
            />
          </View>
          
          {/* btns */}
          <View className='flex flex-row items-center justify-between'>
            <View className='flex justify-center w-[48%] rounded-xl bg-green'>
              <TouchableOpacity onPress={() => {
                setOpenLinealDiscountModal(false);
                setDisableAcept(true);
                setLinealDiscountInput('');
              }}>
                <Text style={{ fontSize: wp(4.5) }} className='py-2 text-center font-bold text-white'>
                  Cancelar
                </Text>
              </TouchableOpacity>
            </View>

            <View className={`flex justify-center w-[48%] rounded-xl ${disableAcept ? 'bg-processBtn' : 'bg-green'}`}>
              <TouchableOpacity onPress={() => aceptDiscount()} disabled={disableAcept}>
                <Text style={{ fontSize: wp(4.5) }} className='py-2 text-center font-bold text-white'>
                  Aceptar
                </Text>
              </TouchableOpacity>
            </View>
          </View>

        </Modal.Content>
      </Modal>

      {/* modal info */}
      <ModalInfo
        stateModal={modalInfo} 
        setStateModal={setModalInfo}
        message={`¡Alerta! Estás aplicando un descuento ${Number(linealDiscount) === 20 ? 'del' : 'mayor al'} 20%`}
        aceptButtonText='Aceptar'
      />
    </>
  );
};

export default Cart;