import { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { AlertDialog, Button } from 'native-base';
import { themeColors } from '../../../tailwind.config';
import { ProductInterface } from '../../utils/interfaces';
import { calculateProccessOrderData, getDateDesc, getHour, currency, valitadeDateInRange } from '../../utils/helpers';
import { fetchSendData } from '../../utils/api';
import { setDataStorage } from '../../utils/asyncStorage';
import { useCertra, useLogin } from '../../hooks';
import { Loader, Modal } from '../.';

const ProcessOrder = ({ fullProductsCart }: { fullProductsCart: any }) => {
  const [loadingProcess, setLoadingProcess] = useState(false);
  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [iva, setIva] = useState(0);
  const [total, setTotal] = useState(0);

  const [alertProcessOrder, setAlertProcessOrder] = useState(false);
  const [alertSuccessOrder, setAlertSuccessOrder] = useState(false);
  const [alertErrorOrder, setAlertErrorOrder] = useState(false);

  const { blue, darkTurquoise, processBtn } = themeColors;
  const { myUser: { access: { customerAccess, labAccess }, nombre, cliente, us_codigo, customer } } = useLogin();
  const { setProductsCart, productsCart } = useCertra();

  const cancelRef = useRef(null);
  const onCloseAlertProcessOrder = () => setAlertProcessOrder(false);

  // Calc subtotal, discount, IVA & total
  useEffect(() => {
    const { subtotal, discount, iva, total } = calculateProccessOrderData(fullProductsCart);

    setSubtotal(subtotal);
    setDiscount(discount);
    setIva(iva);
    setTotal(total);
  }, [fullProductsCart]);

  // Process order
  const handleProcess = async () => {
    setLoadingProcess(true);

    try {
      const res = await fetchSendData({
        date: getDateDesc(new Date()),
        hora: getHour(new Date()),
        cliente: customerAccess ? {
          name: String(nombre),
          usuario: String(cliente),
          code: String(cliente)
        } : {
          name: String(customer?.nombre),
          usuario: String(us_codigo),
          code: String(customer?.cliente)
        },
        productos: fullProductsCart.map((product: ProductInterface) => ({
          codigo: String(product.codigo),
          descrip: String(product.descrip),
          base1: Number(product.base1),
          precio1: Number(product.precio1),
          iva: Number(product.iva),
          cantidad: Number(product.amount),
          descuento: labAccess ? String(product.labDiscount) : String(0),
          bonifica: Number(product.bonicant) > 0 && valitadeDateInRange(new Date(`${product.fdesde}`), new Date(`${product.fhasta}`)) ? ~~(Number(product.amount) / (Number(product.bonifica) * Number(product.bonicant))) : 0
        })),
        subtotal: String(subtotal),
        total: String(total),
      });

      if (res?.message) {
        setProductsCart([]);
        setLoadingProcess(false);
        setAlertSuccessOrder(true);
        await setDataStorage('linealDiscount', '0');
      } else {
        setLoadingProcess(false);
        setAlertErrorOrder(true);
      } 
    } catch (error) {
      setLoadingProcess(false);
      setAlertErrorOrder(true);
    }

    // close process alert
    setAlertProcessOrder(false);
  };

  return (
    <>
      <View className='flex flex-col justify-center w-[100%] bottom-0 absolute border-t-[0.5px] border-t-placeholder'
        style={{ height: wp(discount > 0 && iva > 0 ? 43 : discount > 0 || iva > 0 ? 40 : 32) }}
      >
        <View className='flex flex-col justify-center h-full w-[92%] ml-4 border-t-icon bg-background'>
          {productsCart?.length !== 0 && (
            <View className='px-2'>

              {/* subtotal */}
              <View className='flex flex-row justify-between'>
                <Text style={{ fontSize: wp(4.2) }} className='font-semibold text-typography'>
                  Subtotal:
                </Text>
                <Text style={{ fontSize: wp(4.2) }} className='font-semibold text-typography'>
                  {currency(subtotal)}
                </Text>
              </View>

              {/* discount */}
              {discount > 0 && (
                <View className='flex flex-row justify-between'>
                  <Text style={{ fontSize: wp(4.2) }} className='font-semibold text-turquoise'>
                    Descuento:
                  </Text>
                  <Text style={{ fontSize: wp(4.2) }} className='font-semibold text-turquoise'>
                    -{currency(discount)}
                  </Text>
                </View>
              )}

              {/* iva */}
              {iva > 0 && (
                <View className='flex flex-row justify-between'>
                  <Text style={{ fontSize: wp(3.7) }} className='font-semibold text-green'>
                    IVA:
                  </Text>
                  <Text style={{ fontSize: wp(3.7) }} className='font-semibold text-green'>
                    +{currency(iva)}
                  </Text>
                </View>
              )}

              {/* total */}
              <View className='flex flex-row justify-between'>
                <Text style={{ fontSize: wp(5) }} className='mb-2 font-extrabold text-typography'>
                  Total:
                </Text>
                <Text style={{ fontSize: wp(5) }} className='mb-2 font-extrabold text-typography'>
                  {currency(total)}
                </Text>
              </View>
            </View>
          )}

          {/* btn process */}
          <View className={`rounded-xl py-3 ${productsCart?.length === 0 ? 'bg-processBtn' : 'bg-green'}`}>
            <TouchableOpacity onPress={() => setAlertProcessOrder(true)}
              disabled={productsCart?.length === 0 ? true : false}
            >
              <Text className='text-center font-bold text-white' style={{ fontSize: wp(5) }}>
                Procesar pedido {productsCart?.length === 0 ? '' : `(${productsCart?.length})`}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* alert process order */}
      <AlertDialog leastDestructiveRef={cancelRef} isOpen={alertProcessOrder} onClose={onCloseAlertProcessOrder}>
        <AlertDialog.Content>
          <AlertDialog.CloseButton />
          <AlertDialog.Header>Confirmar pedido</AlertDialog.Header>

          <AlertDialog.Body>
            <Text className='font-normal text-typography'>
              ¿Estás seguro de procesar el pedido?
            </Text>
          </AlertDialog.Body>

          <AlertDialog.Footer>
            <Button.Group space={2}>
              <Button variant='unstyled' colorScheme='coolGray' onPress={onCloseAlertProcessOrder} ref={cancelRef}>
                Cancelar
              </Button>
              <Button color={darkTurquoise} onPress={handleProcess}>
                {loadingProcess ? (
                  <View className='flex flex-row justify-center items-center w-14'>
                    <Loader color='white' size={wp(4)} />
                  </View>
                ) : (
                  <Text className='font-normal text-white'>Confirmar</Text>
                )}
              </Button>
            </Button.Group>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>

      {/* alert success order */}
      <Modal
        bgColor={customerAccess ? blue : darkTurquoise}
        openModal={alertSuccessOrder}
        setOpenModal={setAlertSuccessOrder}
      >
        <View className='flex flex-1 flex-col items-center justify-between'>
          
          {/* logo */}
          <View className='mt-4'>
            {!customer?.cliente ? (
              <Image style={{ width: wp(40), height: wp(20) }} resizeMode='contain'
                source={require('../../assets/logo-drocerca.png')}
              />
            ) : (
              <Image style={{ width: wp(40), height: wp(20) }} resizeMode='contain'
                source={require('../../assets/certra-process.png')}
              />  
            )}
          </View>

          {/* message */}
          <View className='flex flex-col justify-center items-center'>
            <Image style={{ width: wp(35), height: wp(25) }} resizeMode='contain'
              source={require('../../assets/cart-check.png')}
            />
            <Text className='w-52 pt-4 text-center text-white' style={{ fontSize: wp(6) }}>
              Su pedido ha sido procesado con éxito
            </Text>
          </View>

          {/* btn ok */}
          <View className='w-64 mb-8 mx-4'>
            <TouchableOpacity className='rounded-xl bg-green'
              onPress={() => setAlertSuccessOrder(false)} 
            >
              <Text className='p-3 text-center text-white' style={{ fontSize: wp(6) }}>Ok</Text>
            </TouchableOpacity>
          </View>
          
        </View>
      </Modal>

      {/* alert error order */}
      <Modal
        bgColor={processBtn}
        openModal={alertErrorOrder}
        setOpenModal={setAlertErrorOrder}
      >
        <View className='flex flex-1 flex-col items-center justify-between'>
          <View />
          
          {/* message */}
          <View className='flex flex-col justify-center items-center'>
            <Image style={{ width: wp(35), height: wp(25) }} resizeMode='contain'
              source={require('../../assets/cart-error.png')}
            />
            <Text className='w-52 pt-4 text-center text-white' style={{ fontSize: wp(6) }}>
              Su pedido no ha sido procesado
            </Text>
          </View>

          {/* btn retry */}
          <View className='w-64 mb-8 mx-4'>
            <TouchableOpacity className='rounded-xl bg-green'
              onPress={() => setAlertErrorOrder(false)} 
            >
              <Text className='p-3 text-center text-white' style={{ fontSize: wp(6) }}>Volver a intentarlo</Text>
            </TouchableOpacity>
          </View>
          
        </View>
      </Modal>
    </>
  );
};

export default ProcessOrder;