import { useState, useEffect, memo } from 'react';
import { View, Text, Image, TouchableOpacity, Pressable, FlatList } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { CheckIcon, PlusIcon } from 'react-native-heroicons/outline';
import { ProductInterface } from '../../utils/interfaces';
import { disponibility } from '../../utils/constants';
import { currency } from '../../utils/helpers';
import { useCertra, useLogin, useNavigation } from '../../hooks';
import { ModalInfo, ModalAmount, Bonus } from '..';

const ProductGrid = ({ product }: { product: ProductInterface }) => {
  const [added, setAdded] = useState(false);
  const [amount, setAmount] = useState(1);
  const [maxAmount, setMaxAmount] = useState(0);

  const [openAmountModal, setOpenAmountModal] = useState(false);
  const [modalSelectCustomer, setModalSelectCustomer] = useState(false);

  const { myUser: { deposito, access: { labAccess, salespersonAccess }, customer } } = useLogin();
  const { addToCart, productsCart, removeElement } = useCertra();
  const { descrip, image_url, merida, centro, oriente, codigo, base1, iva, bonicant, bonifica, fdesde, fhasta } = product;
  const navigation = useNavigation();

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

  // -----------------------------------------------
  // ACTIONS
  // -----------------------------------------------

  // Refresh data when cart change
  useEffect(() => {
    const productInCart = productsCart.find(productInCart => productInCart.codigo === codigo);
    if (productInCart !== undefined) { 

      // product in cart
      setAdded(true);
      setAmount(productInCart.amount);
    } else {

      // product not in cart
      setAdded(false);
      setAmount(1);
    }
  }, [productsCart]);

  // Handle actions
  const handleAddToCart = () => {
    if ((labAccess || salespersonAccess) && !customer) {
      setModalSelectCustomer(true);
      return;
    }
    addToCart(codigo, amount);

    setAdded(true);
  };
  const handleRemoveElement = () => {
    setAdded(false);
    setAmount(1);
    removeElement(codigo);
  };

  return (
    <>
      <View className='h-[98%] mb-3 mr-2 p-2 rounded-2xl bg-lightList' style={{ width: wp('45.5%') }}>

        {/* remove element icon */}
        {added && (
          <Pressable className='absolute top-0 right-0 z-50' 
            style={{ width: wp(12), height: wp(12) }}
            onPress={handleRemoveElement}
          >
            <View className='absolute top-0 right-0 flex flex-col justify-center items-center rounded-tr-2xl rounded-bl-2xl bg-turquoise' 
              style={{ width: wp(10), height: wp(10) }}
            >
              <Image style={{ width: wp(3), height: hp(3) }} resizeMode='cover'
                source={require('../../assets/white-trash-can.png')}
              />
            </View>
          </Pressable>
        )}

        {/* content */}
        <View>

          {/* img */}
          <Pressable onPress={() => navigation.navigate('Product', { ...product })} className='mb-2 justify-center items-center'>
            {image_url === null ? (
              <Image style={{ width: wp(32), height: wp(32) }} resizeMode='contain'
                source={require('../../assets/no-image.png')}
              />
            ) : (
              <Image style={{ width: wp(32), height: wp(32) }} resizeMode='contain'
                source={{ uri: `${image_url}` }}
              />
            )}
          </Pressable>

          {/* texts & btn */}
          <View>

            {/* descrip */}
            <Pressable onPress={() => navigation.navigate('Product', { ...product })}>
              <Text style={{ fontSize: wp(4) }} className='font-bold text-typography' numberOfLines={2}>
                {descrip}
              </Text>
            </Pressable>

            {/* bonus */}
            <View className='mt-1'>
              <Bonus
                bonifica={bonifica as string}
                bonicant={bonicant as string}
                fdesde={fdesde as string}
                fhasta={fhasta as string}
              />
            </View>

            {/* price */}
            <View className='my-2'>
              <Text style={{ fontSize: hp(1.5) }} className='font-bold text-typography'>
                Precio:
              </Text>

              <Text style={{ fontSize: hp(2.2) }} className='font-bold text-darkTurquoise'>
                {currency(base1)}
              </Text>

              {Number(iva) > 0 && (
                <Text style={{ fontSize: hp(1.6) }} className='text-turquoise'>
                  IVA {currency((base1 * (iva as number)) / 100)}
                </Text>
              )}
            </View>

            {/* disponibility */}
            <View className='mb-2'>
              <Text style={{ fontSize: hp(1.6) }} className='pb-0.5 font-bold text-typography'>
                Disponibilidad:
              </Text>

              {/* sedes */}
              <View>
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

            {/* amount and added */}
            <View className='flex flex-row items-center justify-center w-full'>

              <View style={{ width: wp(20), borderWidth: .5 }} className='rounded-md border-turquoise'>
                <TouchableOpacity onPress={() => {
                  if ((labAccess || salespersonAccess) && !customer) {
                    setModalSelectCustomer(true);
                    return;
                  }

                  setOpenAmountModal(true);
                }}>
                  <Text style={{ fontSize: wp(4.5) }} className='text-center text-darkTurquoise'>
                    {amount}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* add & added */}
              <View className='pl-5'>
                {!added ? (
                  <Pressable onPress={handleAddToCart} className={`flex flex-row items-center justify-center rounded-md w-7 h-7 ${maxAmount === 0 ? 'bg-processBtn': 'bg-darkTurquoise'}`}
                    disabled={maxAmount === 0}
                  >
                    <PlusIcon size={25} color='white' strokeWidth={2} />
                  </Pressable>
                ) : (
                  <View className='flex flex-row items-center justify-center rounded-md w-7 h-7 bg-green'>
                    <CheckIcon size={20} color='white' strokeWidth={3} />
                  </View>
                )}
              </View>

            </View>
            
          </View>
        </View>

      </View>

      <ModalAmount
        stateModal={openAmountModal}
        setStateModal={setOpenAmountModal}
        codigo={codigo}
        amount={amount}
        maxAmount={maxAmount}
      />

      <ModalInfo 
        stateModal={modalSelectCustomer} 
        setStateModal={setModalSelectCustomer}
        message='Debes seleccionar un cliente para continuar.'
        cancelButtonText='Cancelar'
        aceptButtonText='Aceptar'
        onPressAcept={() => navigation.navigate('SearchCustomer')}
      />
    </>
  );
};

export default memo(ProductGrid);