import { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, FlatList, Pressable, TextInput } from 'react-native';
import { XMarkIcon } from 'react-native-heroicons/outline';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { AlertDialog, Button, Modal } from 'native-base';
import { themeColors } from '../../../tailwind.config';
import { disponibility } from '../../utils/constants';
import { ProductInterface, ScalesInterface } from '../../utils/interfaces';
import { calculateDiscountsPrice, calculatePercentProductDiscount, currency, valitadeDateInRange } from '../../utils/helpers';
import { setDataStorage } from '../../utils/asyncStorage';
import { useCertra, useLogin, useNavigation } from '../../hooks';
import { ModalInfo, ModalAmount, Bonus } from '..';

const ProductCart = ({ product }: { product: ProductInterface }) => {
  const [added, setAdded] = useState(true);
  const [amount, setAmount] = useState(1);
  const [maxAmount, setMaxAmount] = useState(0);
  const [labDiscount, setLabDiscount] = useState(0);
  const [labDiscountInput, setLabDiscountInput] = useState('');
  
  const [alertRemoveElement, setAlertRemoveElement] = useState(false);
  const [openAmountModal, setOpenAmountModal] = useState(false);
  const [openDiscountModal, setOpenDiscountModal] = useState(false);
  const [disableAcept, setDisableAcept] = useState(true);
  const [modalInfo, setModalInfo] = useState(false);
  
  const { icon, darkTurquoise } = themeColors;
  const { myUser: { deposito, access: { labAccess, customerAccess }, customer, dscCliente } } = useLogin();
  const { removeElement, productsCart, setProductsCart } = useCertra();
  const { descrip, codigo, centro, merida, oriente, base1, escala1, pescala1, escala2, pescala2, escala3, pescala3, fdesde, fhasta, bonicant, bonifica } = product;
  const cancelRef = useRef(null);
  const initialRef = useRef(null);
  const navigation = useNavigation();

  const onCloseAlertRemoveElement = () => setAlertRemoveElement(false);

  // -----------------------------------------------
  // ACTIONS
  // -----------------------------------------------

  // Get max amount
  useEffect(() => {
    if (maxAmount === 0) {
      if (merida || centro || oriente) {
        if (deposito) {
          if (deposito === 'MERIDA') {
            setMaxAmount(parseInt(String(merida)) + parseInt(String(centro)));
          } else if (deposito === 'CARACAS') {
            setMaxAmount(parseInt(String(merida)) + parseInt(String(centro)) + parseInt(String(oriente)));
          } else if (deposito === 'ORIENTE') {
            setMaxAmount(parseInt(String(centro)) + parseInt(String(oriente)));
          }
        } else {
          setMaxAmount(parseInt(String(merida)) + parseInt(String(centro)) + parseInt(String(oriente)));
        }
      }
    }
  }, []);

  // Refresh data when cart change
  useEffect(() => {
    const productInCart = productsCart.find(productInCart => productInCart.codigo === codigo);
    if (productInCart !== undefined) { 

      // product in cart
      setAdded(true);
      setAmount(productInCart.amount);

      setLabDiscount(Number(productInCart.labDiscount));
      setLabDiscountInput('');
    }
  }, [productsCart]);

  // -----------------------------------------------
  // HANDLERS
  // -----------------------------------------------

  const handleRemoveElement = async () => {
    if (productsCart?.length === 1) {
      await setDataStorage('linealDiscount', '0');
      setProductsCart([]);
    }
    removeElement(codigo);

    setAdded(false);
    setAmount(1);
    setAlertRemoveElement(false);
  };

  return (
    <>
      {added && (
        <View className='flex flex-col mb-3 p-2 rounded-2xl bg-lightList'>

          {/* descrip & remove */}
          <View className='flex flex-row items-center justify-between'>
            
            {/* descrip */}
            <Pressable onPress={() => navigation.navigate('Product', { ...product })}>
              <Text style={{ fontSize: wp(4), width: wp(70) }} className='font-bold text-typography' numberOfLines={1}>
                {descrip}
              </Text>
            </Pressable>

            <View className='pl-5'>
              <TouchableOpacity onPress={() => setAlertRemoveElement(true)} className='flex flex-row items-center justify-center rounded-md w-7 h-7'>
                <XMarkIcon size={20} color={icon} strokeWidth={3} />
              </TouchableOpacity>
            </View>
          </View>

          {/* main info */}
          <View className='flex flex-row justify-center'>

            {/* left info */}
            <View className='w-[53%] pr-2 mt-1'>

              {/* bonus */}
              <View>
                <Bonus 
                  bonifica={bonifica as string}
                  bonicant={bonicant as string}
                  fdesde={fdesde as string}
                  fhasta={fhasta as string}
                />
              </View>

              {/* price */}
              <View className='flex flex-row justify-between items-center mb-2'>

                {/* normal price */}
                <View>
                  <Text style={{ fontSize: hp(1.5) }} className='font-bold text-typography'>
                    Precio:
                  </Text>

                  <Text style={{ fontSize: hp(1.7) }} className='font-bold text-darkTurquoise'>
                    {currency(base1)}
                  </Text>
                </View>

                {/* discount price */}
                <View>
                  <Text style={{ fontSize: hp(1.5) }} className='font-bold text-typography'>
                    Con desc.:
                  </Text>

                  <Text style={{ fontSize: hp(1.7) }} className='font-bold text-darkTurquoise'>
                    {currency(base1 - calculateDiscountsPrice(product))}
                  </Text>
                </View>
              </View>

              {/* disponibility */}
              <View>

                {/* sedes */}
                <View className='px-3'>
                  <FlatList
                    data={disponibility}
                    horizontal={true}
                    contentContainerStyle={{
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item: { id, name } }) => {
                      return (
                        <>
                          {deposito === 'MERIDA' ? (
                            <View key={id} className='flex flex-col items-center'>
                              <Text style={{ fontSize: hp(1.5) }} className='w-10 text-center font-bold text-darkTurquoise'>
                                {name === 'Oriente' ? '' : name}
                              </Text>

                              <Text style={{ fontSize: hp(1.6) }} className='text-center font-bold text-typography'>
                                {
                                  name === 'Mérida' ? parseInt(String(merida)) :
                                  name === 'Centro' ? parseInt(String(centro)) : null
                                }
                              </Text>
                            </View>
                          ) : 
                            deposito === 'CARACAS' ? (
                              <View key={id} className='flex flex-col items-center'>
                                <Text style={{ fontSize: hp(1.5) }} className='w-10 text-center font-bold text-darkTurquoise'>
                                  {name}
                                </Text>

                                <Text style={{ fontSize: hp(1.6) }} className='text-center font-bold text-typography'>
                                  {
                                    name === 'Mérida' ? parseInt(String(merida)) :
                                    name === 'Centro' ? parseInt(String(centro)) :
                                    name === 'Oriente' ? parseInt(String(oriente)) : null
                                  }
                                </Text>
                              </View>
                            ) : (
                              deposito === 'ORIENTE' ? (
                                <View key={id} className='flex flex-col items-center'>
                                  <Text style={{ fontSize: hp(1.5) }} className='w-10 text-center font-bold text-darkTurquoise'>
                                    {name === 'Mérida' ? '' : name}
                                  </Text>

                                  <Text style={{ fontSize: hp(1.6) }} className='text-center font-bold text-typography'>
                                    {
                                      name === 'Centro' ? parseInt(String(centro)) :
                                      name === 'Oriente' ? parseInt(String(oriente)) : null
                                    }
                                  </Text>
                                </View>
                              ) : (
                                <View key={id} className='flex flex-col items-center'>
                                  <Text style={{ fontSize: hp(1.5) }} className='w-10 text-center font-bold text-darkTurquoise'>
                                    {name}
                                  </Text>

                                  <Text style={{ fontSize: hp(1.6) }} className='text-center font-bold text-typography'>
                                    {
                                      name === 'Mérida' ? parseInt(String(merida)) :
                                      name === 'Centro' ? parseInt(String(centro)) :
                                      name === 'Oriente' ? parseInt(String(oriente)) : null
                                    }
                                  </Text>
                                </View>
                              )
                            )
                          }
                        </>
                      );
                    }}
                  />
                </View>
              </View>

            </View>

            {/* right info */}
            <View className='w-[47%] pl-2 mt-1'>

              {/* amount and lab discount */}
              <View className='flex flex-row items-center w-full mb-2'
                style={{ justifyContent: !labAccess ? 'center' : 'space-between' }}
              >
                {/* amount */}
                <View>
                  <Text className='font-bold text-typography' style={{ fontSize: hp(1.5) }}>Cantidad</Text>

                  <View style={{ width: wp(!labAccess ? 28 : 18), borderWidth: .5 }} className='rounded-md border-turquoise'>
                    <TouchableOpacity onPress={() => setOpenAmountModal(true)}>
                      <Text style={{ fontSize: wp(4.5) }} className='text-center text-darkTurquoise'>
                        {amount}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                
                {/* dcto labs */}
                {labAccess && (
                  <View>
                    <Text className='font-bold text-typography' style={{ fontSize: hp(1.5) }}>Dcto. Labs.</Text>
                    
                    <View style={{ width: wp(18), borderWidth: .5 }} className='rounded-md border-turquoise'>
                      <TouchableOpacity onPress={() => setOpenDiscountModal(true)}>
                        <Text style={{ fontSize: wp(4.5) }} className='text-center text-darkTurquoise'>
                          {labDiscount}%
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}

              </View>

              {/* discounts info */}
              <View className='flex flex-row justify-center items-center gap-x-2'>

                {/* product discount */}
                <View>
                  <Text className='font-bold text-typography' style={{ fontSize: hp(1.5) }}>Dcto. Producto</Text>

                  <View style={{ width: wp(18) }} className='rounded-md'>
                    <Text style={{ fontSize: wp(4.5) }} className='text-center text-darkTurquoise'>
                      {valitadeDateInRange(new Date(`${fdesde}`), new Date(`${fhasta}`)) ? calculatePercentProductDiscount(amount, { escala1, escala2, escala3, pescala1, pescala2, pescala3 } as ScalesInterface) : '0'}%
                    </Text>
                  </View>
                </View>

                {/* customer discount */}
                <View>
                  <Text className='font-bold text-typography' style={{ fontSize: hp(1.5) }}>Dcto. Cliente</Text>

                  <View style={{ width: wp(18) }} className='rounded-md'>
                    <Text style={{ fontSize: wp(4.5) }} className='text-center text-darkTurquoise'>
                      {customerAccess ? Number(dscCliente) : Number(customer?.dscCliente)}%
                    </Text>
                  </View>
                </View>
              </View>
            </View>

          </View>
        </View>
      )}

      <ModalAmount
        stateModal={openAmountModal}
        setStateModal={setOpenAmountModal}
        codigo={codigo}
        amount={amount}
        maxAmount={maxAmount}
      />

      {/* modal lab discount */}
      <Modal isOpen={openDiscountModal} initialFocusRef={initialRef}>
        <Modal.Content style={{ width: wp(89), paddingHorizontal: 25, paddingVertical: 20, borderRadius: 25 }}>

          <Text className='text-center mb-3 text-typography' style={{ fontSize: wp(5) }}>Descuento</Text>

          {/* input */}
          <View className='w-full rounded-xl mb-4 bg-list'>
            <TextInput className='h-12 text-center rounded-xl text-turquoise' style={{ fontSize: wp(5) }}
              keyboardType='numeric'
              onChangeText={text => {
                if (Number(text) < 0 || Number(text) > 99) {
                  setDisableAcept(true);
                } else {
                  setDisableAcept(false);
                  setLabDiscountInput(text);
                }
              }}
              selectionColor={darkTurquoise}
            />
          </View>
          
          {/* btns */}
          <View className='flex flex-row items-center justify-between'>
            <View className='flex justify-center w-[48%] rounded-xl bg-green'>
              <TouchableOpacity onPress={() => {
                setOpenDiscountModal(false);
                setDisableAcept(true);
                setLabDiscountInput('');
              }}>
                <Text style={{ fontSize: wp(4.5) }} className='py-2 text-center font-bold text-white'>
                  Cancelar
                </Text>
              </TouchableOpacity>
            </View>

            <View className={`flex justify-center w-[48%] rounded-xl ${disableAcept ? 'bg-processBtn' : 'bg-green'}`}>
              <TouchableOpacity disabled={disableAcept} onPress={() => {
                // changes to the cart
                const updatedProductsCart = productsCart.map(item => {
                  if (item.codigo === codigo) {
                    const cleanDiscount = parseInt(String(labDiscountInput).replace(/-/g, ''));
            
                    return { ...item, labDiscount: isNaN(cleanDiscount) ? '0' : String(cleanDiscount) };
                  } else {
                    return { ...item };
                  }
                });
                setProductsCart(updatedProductsCart);
                setOpenDiscountModal(false);
                setDisableAcept(true);
                if (Number(labDiscountInput) >= 20) {
                  setModalInfo(true);
                }
              }}>
                <Text style={{ fontSize: wp(4.5) }} className='py-2 text-center font-bold text-white'>
                  Aceptar
                </Text>
              </TouchableOpacity>
            </View>
          </View>

        </Modal.Content>
      </Modal>

      {/* alert clear cart */}
      <AlertDialog leastDestructiveRef={cancelRef} isOpen={alertRemoveElement} onClose={onCloseAlertRemoveElement}>
        <AlertDialog.Content>
          <AlertDialog.CloseButton />
          <AlertDialog.Header>Eliminar producto</AlertDialog.Header>
          <AlertDialog.Body>
            <Text className='font-normal text-typography'>
              ¿Estás seguro que deseas eliminar este producto del carrito?
            </Text>
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Button.Group space={2}>
              <Button variant='unstyled' colorScheme='coolGray' onPress={onCloseAlertRemoveElement} ref={cancelRef}>
                Cancelar
              </Button>
              <Button color={darkTurquoise} onPress={handleRemoveElement}>
                Aceptar
              </Button>
            </Button.Group>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>

      {/* modal info */}
      <ModalInfo 
        stateModal={modalInfo} 
        setStateModal={setModalInfo}
        message={`¡Alerta! Estás aplicando un descuento ${Number(labDiscount) === 20 ? 'del' : 'mayor al'} 20%`}
        aceptButtonText='Aceptar'
      />
    </>
  );
};

export default ProductCart;