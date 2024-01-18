import { useState, useEffect } from 'react';
import { View, Text, StatusBar, FlatList, TouchableOpacity, Image } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useToast, Switch, Popover } from 'native-base';
import { XMarkIcon } from 'react-native-heroicons/outline';
import DatePicker from 'react-native-date-picker';
import RNFetchBlob from 'rn-fetch-blob';
import { themeColors } from '../../tailwind.config';
import { fetchLastItemsLab, fetchLastItemsLabCustomer, fetchLastItemsSalesperson, fetchLastItemsSalespersonCustomer, fetchLastItemsCustomer, fetchRangeCustomer, fetchRangeLabCustomer, fetchRangeLab, fetchRangeSalespersonCustomer, fetchRangeSalesperson } from '../utils/api';
import { currency, getDayMonthYear, getDateDesc, getDateWithoutHyphen, getDateAsc } from '../utils/helpers';
import { OrderRecordItemInterface } from '../utils/interfaces';
import { orderRecordCols } from '../utils/constants';
import { useCertra, useLogin } from '../hooks';
import { Loader, BackScreen, Logos, NoDataText, LabelCustomer, Modal } from '../components';
import { SafeAreaView } from 'react-native-safe-area-context';

const OrderRecord = () => {
  const [loadingOrderRecord, setLoadingOrderRecord] = useState(true);
  const [lastItems, setLastItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState<any>({});

  const [dollarCurrency, setDollarCurrency] = useState(false);
  const [modalDetails, setModalDetails] = useState(false);
  const [modalOlderOnes, setModalOlderOnes] = useState(false);

  const [openDatePickerFrom, setOpenDatePickerFrom] = useState(false);
  const [dateFrom, setDateFrom] = useState(new Date());
  const [openDatePickerTo, setOpenDatePickerTo] = useState(false);
  const [dateTo, setDateTo] = useState(new Date());

  const { background, lightList } = themeColors;
  const { myUser: { access: { customerAccess, labAccess, salespersonAccess }, us_codigo, clipro, cliente, customer, image_url } } = useLogin();
  const { lookAtPharmacy } = useCertra();
  const toast = useToast();
  const id = 'toast';

  // Date from
  useEffect(() => {
    const currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() - 1);
    setDateFrom(currentDate);
  }, []);

  // Get last items
  useEffect(() => {
    const getLastItems = async () => {
      try {
        let data;

        if (customerAccess) {
          data = await fetchLastItemsCustomer(cliente as string);
        } else if (labAccess) {
          if (lookAtPharmacy) {
            data = await fetchLastItemsLabCustomer({ code: us_codigo as string, customer: String(customer?.cliente) });
          } else {
            data = await fetchLastItemsLab({ clipro: clipro as string, code: us_codigo as string });
          }
        } else if (salespersonAccess) {
          if (lookAtPharmacy) {
            data = await fetchLastItemsSalespersonCustomer({ code: us_codigo as string, customer: String(customer?.cliente) });
          } else {
            data = await fetchLastItemsSalesperson(String(us_codigo));
          }
        }
        
        if (data) {
          setLastItems(data);
          setLoadingOrderRecord(false);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getLastItems();
  }, []);

  // Show details
  const handleDetails = (item: OrderRecordItemInterface) => {
    setSelectedItem(item);
    setModalDetails(true);
  };

  // Filter range
  const filter = async () => {
    // invalid date
    if (dateFrom > dateTo) {
      if (!toast.isActive(id)) {
        toast.show({
          id,
          title: 'Rango de fechas no válido',
          duration: 1500
        });
      } 
    }

    // download pdf
    try {
      let pdfUrl;
      if (customerAccess) {
        pdfUrl = await fetchRangeCustomer({ customer: String(cliente), dateFrom: getDateWithoutHyphen(dateFrom), dateTo: getDateWithoutHyphen(dateTo) });
      } else if (labAccess) {
        if (lookAtPharmacy) {
          pdfUrl = await fetchRangeLabCustomer({ customer: String(customer?.cliente), code: String(us_codigo), dateFrom: getDateWithoutHyphen(dateFrom), dateTo: getDateWithoutHyphen(dateTo) });
        } else {
          pdfUrl = await fetchRangeLab({ clipro: String(clipro), code: String(us_codigo), dateFrom: getDateWithoutHyphen(dateFrom), dateTo: getDateWithoutHyphen(dateTo) });
        }
      } else if (salespersonAccess) {
        if (lookAtPharmacy) {
          pdfUrl = await fetchRangeSalespersonCustomer({ customer: String(customer?.cliente), code: String(us_codigo), dateFrom: getDateWithoutHyphen(dateFrom), dateTo: getDateWithoutHyphen(dateTo) });
        } else {
          pdfUrl = await fetchRangeSalesperson({ code: String(us_codigo), dateFrom: getDateWithoutHyphen(dateFrom), dateTo: getDateWithoutHyphen(dateTo) });
        }
      }

      if (pdfUrl) {
        const { config, fs } = RNFetchBlob;
        const downloads = fs.dirs?.DownloadDir;
        return config({
          fileCache: true,
          addAndroidDownloads: {
            useDownloadManager: true,
            notification: true,
            path: downloads + '/' + `certra${getDateDesc(dateTo)}` + '.pdf',
          }
        })
        .fetch('GET', pdfUrl)
          .then(() => {
            if (!toast.isActive(id)) {
              toast.show({
                id,
                title: 'PDF descargado correctamente',
                duration: 2500
              });
            } 
          })
          .catch(() => {
            if (!toast.isActive(id)) {
              toast.show({
                id,
                title: 'No se encontraron datos',
                duration: 1500
              });
            } 
          });
      }
    } catch (error) {
      if (!toast.isActive(id)) {
        toast.show({
          id,
          title: 'Error al filtrar',
          duration: 1500
        });
      } 
    }
  };

  return (
    <>
      <SafeAreaView className='flex-1 px-3 bg-background'>
        <StatusBar backgroundColor={background} barStyle='dark-content' />

        <Logos image={image_url as URL} />

        {/* back & switch */}
        <View className='flex flex-row items-center justify-between'>
          <BackScreen title='Historial' />

          {lastItems?.length !== 0 && (
            <View className='flex flex-row items-center'>
              <Text className='font-black text-turquoise' style={{ fontSize: wp(5) }}>Bs</Text>
              <Switch 
                onToggle={() => setDollarCurrency(!dollarCurrency)}
                value={dollarCurrency}
                onTrackColor={'green.600'}
                offTrackColor={'gray.400'}
                size='md'
              />
              <Text className='font-black text-turquoise' style={{ fontSize: wp(5.5) }}>$</Text>
            </View>
          )}
        </View>

        {/* customer */}
        {lookAtPharmacy && !loadingOrderRecord ? (
          <View className='pb-1'>
            <LabelCustomer name={customer?.nombre as string} />
          </View>
        ):null}

        {/* content */}
        <View>
          {loadingOrderRecord ? (
            <View className='mt-5'>
              <Loader />
            </View>
          ) : (
            lastItems?.length === 0 ? (
              <NoDataText
                text={`No hay pedidos recientes ${lookAtPharmacy ? 'para esta farmacia': ''}`}
              />
            ) : (
              <View>
                
                {/* table header */}
                <View className='flex flex-row justify-center items-center mt-4'>
                  {orderRecordCols[customerAccess ? 0 : 1].map((item) => {
                    const { id, size, name } = item;
                    return (
                      <Text key={id} className='text-center text-typography' 
                        style={{ fontSize: wp(2.4), width: wp(size) }}
                      >{name}</Text>
                    );
                  })}
                </View>

                {/* content */}
                <View className='mt-1'>
                  <FlatList
                    data={lastItems}
                    numColumns={1}
                    contentContainerStyle={{ paddingBottom: wp(3) }}
                    showsVerticalScrollIndicator={false}
                    renderItem={({item, index}) => {
                      const { pedido, fecha, subTotal, iva, importe, unidades, total, nombre, totaldolar } = item;
                      const isPair = index % 2 === 0;
                      const isLast = index === lastItems.length - 1;
                      return (
                        <>
                          {customerAccess ? (
                            <View key={pedido} className={`flex flex-row justify-center items-center mb-[1px] ${!isPair ? 'bg-background' : 'bg-list'}`}
                              style={{ 
                                height: wp(14),
                                borderTopRightRadius: index === 0 ? wp(5) : 0,
                                borderTopLeftRadius: index === 0 ? wp(5) : 0, 
                                borderBottomRightRadius: isLast ? wp(5) : 0,
                                borderBottomLeftRadius: isLast ? wp(5) : 0,
                              }}
                            >
                              <Text className='text-center text-typography' style={{ width: wp(13.5), fontSize: wp(2.6) }}>{pedido}</Text>
                              <Text className='text-center text-typography' style={{ width: wp(13.5), fontSize: wp(2.6) }}>{getDayMonthYear(fecha)}</Text>
                              <Text className='text-center text-typography' style={{ width: wp(13.5), fontSize: wp(2.6) }}>{subTotal}</Text>
                              <Text className='text-center text-typography' style={{ width: wp(13.5), fontSize: wp(2.6) }}>{Number(iva)}%</Text>
                              <Text className='text-center text-typography' style={{ width: wp(13.5), fontSize: wp(2.6) }}>{dollarCurrency ? `${currency(totaldolar, '$')}` : `${currency(importe)}` ?? `${currency(total)}`}</Text>
                              <Text className='text-center text-typography' style={{ width: wp(13.5), fontSize: wp(2.6) }}>{unidades}</Text>
                              <TouchableOpacity className='flex flex-col justify-center items-center bg-green' 
                                onPress={() => handleDetails(item)}
                                style={{ 
                                  width: wp(13.5), 
                                  height: '100%', 
                                  borderTopRightRadius: index === 0 ? wp(5) : 0,
                                  borderBottomRightRadius: isLast ? wp(5) : 0,
                                }}
                              >
                                <Image style={{ width: wp(7), height: wp(7) }} resizeMode='cover'
                                  source={require('../assets/search.png')}
                                />
                              </TouchableOpacity>
                            </View>
                          ) : (
                            <View key={pedido} className={`flex flex-row justify-center items-center mb-[1px] ${!isPair ? 'bg-background' : 'bg-list'}`}
                              style={{ 
                                height: wp(14),
                                borderTopRightRadius: index === 0 ? wp(5) : 0,
                                borderTopLeftRadius: index === 0 ? wp(5) : 0,
                                borderBottomRightRadius: isLast ? wp(5) : 0,
                                borderBottomLeftRadius: isLast ? wp(5) : 0,
                              }}
                            >
                              <Text className='text-center text-typography' style={{ width: wp(14), fontSize: wp(2.6) }}>{pedido}</Text>
                              <Popover trigger={triggerProps => {
                                return <Text {...triggerProps} className='text-center text-typography' style={{ width: wp(26), fontSize: wp(2.6) }} numberOfLines={1}>
                                         {nombre}
                                       </Text>;
                              }}>
                                <Popover.Content w='56'>
                                  <View className='bg-turquoise p-0.5'>
                                    <Text className='text-center text-white'>{nombre}</Text>
                                  </View>
                                </Popover.Content>
                              </Popover>
                              <Text className='text-center text-typography' style={{ width: wp(15), fontSize: wp(2.6) }}>{getDayMonthYear(fecha)}</Text>
                              <Text className='text-center text-typography' style={{ width: wp(16), fontSize: wp(2.6) }} numberOfLines={2}>{dollarCurrency ? `${currency(totaldolar, '$')}` : `${currency(importe)}` ?? `${currency(total)}`}</Text>
                              <Text className='text-center text-typography' style={{ width: wp(11), fontSize: wp(2.6) }}>{unidades}</Text>
                              <TouchableOpacity className='flex flex-col justify-center items-center bg-green' 
                                onPress={() => handleDetails(item)}
                                style={{ 
                                  width: wp(13.5), 
                                  height: '100%', 
                                  borderTopRightRadius: index === 0 ? wp(5) : 0,
                                  borderBottomRightRadius: isLast ? wp(5) : 0,
                                }}
                              >
                                <Image style={{ width: wp(7), height: wp(7) }} resizeMode='cover'
                                  source={require('../assets/search.png')}
                                />
                              </TouchableOpacity>
                            </View>
                          )}
                        </>
                      );
                    }} 
                  />
                </View>

                {/* older ones */}
                <View className='rounded-xl py-3 bg-turquoise'>
                  <TouchableOpacity onPress={() => setModalOlderOnes(true)}>
                    <Text className='text-center font-bold text-white' style={{ fontSize: wp(5) }}>
                      Ver más antiguos
                    </Text>
                  </TouchableOpacity>
                </View>

              </View>
            )
          )}
        </View>
      </SafeAreaView>

      {/* modal details */}
      <Modal
        bgColor={lightList}
        minHeight={86}
        openModal={modalDetails}
        setOpenModal={setModalDetails}
      >
        <View>
          {/* header */}
          <View className='flex flex-row items-center justify-between bg-list' style={{ height: wp(16) }}>
            <View className='flex flex-row items-center'>
              <Text className='pl-5 text-typography' style={{ fontSize: wp(4.5), width: wp(60) }}>
                {getDayMonthYear(selectedItem?.fecha)}
              </Text>
            </View>

            <TouchableOpacity className='flex flex-row items-center justify-center bg-green' 
              onPress={() => setModalDetails(false)}
              style={{ height: wp(16), width: wp(16) }}
            >
              <XMarkIcon size={wp(10)} color='white' />
            </TouchableOpacity>
          </View>

          {/* columns */}
          <View className='flex flex-row items-center py-2 pl-1.5 border-b-turquoise' style={{ borderBottomWidth: 0.3 }}>
            {orderRecordCols[2].map((item) => {
              const { id, size, name } = item;
              return (
                <Text key={id} className='text-center text-typography'
                  style={{ fontSize: wp(2.4), width: wp(size) }}
                >{name}</Text>
              );
            })}
          </View>

          {/* content */}
          <FlatList
            data={selectedItem?.productos}
            numColumns={1}
            contentContainerStyle={{ paddingBottom: 10 }}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => {
              const { codigo, nombreP, cantidad, precio, iva, total, preciodolar, totaldolar } = item;
              const isLast = index === selectedItem?.productos.length - 1;
              return (
                <View className='flex flex-row items-center justify-center py-3 border-b-turquoise'
                  style={{ borderBottomWidth: isLast ? 0 : 0.3 }}
                >
                  <Text className='text-center text-typography' style={{ width: wp(10), fontSize: wp(2.6) }}>{codigo}</Text>
                  <Text className='text-center text-typography' style={{ width: wp(36), fontSize: wp(2.6) }} numberOfLines={1}>{nombreP}</Text>
                  <Text className='text-center text-typography' style={{ width: wp(10), fontSize: wp(2.6) }}>{cantidad}</Text>
                  <Text className='text-center text-typography' style={{ width: wp(13), fontSize: wp(2.6) }}>{dollarCurrency ? `${currency(preciodolar, '$')}` : `${currency(precio)}`}</Text>
                  <Text className='text-center text-typography' style={{ width: wp(10), fontSize: wp(2.6) }}>{Number(iva)}%</Text>
                  <Text className='text-center text-typography' style={{ width: wp(13), fontSize: wp(2.6) }}>{dollarCurrency ? `${currency(totaldolar, '$')}` : `${currency(total)}`}</Text>
                </View>
              );
            }} 
          />
        </View>
      </Modal>

      {/* modal older ones */}
      <Modal
        bgColor={'white'}
        minHeight={20}
        borderRadius={25}
        openModal={modalOlderOnes}
        setOpenModal={setModalOlderOnes}
      >
        <View className='px-7 py-5'>
          <Text className='font-normal mb-3 text-typography' style={{ fontSize: wp(4.3) }}>
            Indique un rango de fecha que desea consultar
          </Text>

          {/* range */}
          <View className='flex flex-row items-center justify-between mb-3'>
            <View className='w-[48%] flex flex-col'>
              <Text className='font-bold mb-0.5 text-typography' style={{ fontSize: wp(3.5) }}>Desde</Text>

              <View className='flex flex-row items-center rounded-lg pl-2 bg-lightList' style={{ height: wp(10) }}>
                <TouchableOpacity onPress={() => setOpenDatePickerFrom(true)} className='flex flex-row items-center'>
                  <Image style={{ width: wp(6), height: wp(6) }} resizeMode='cover'
                    source={require('../assets/calendar.png')}
                  />
                  <Text className='font-normal pl-2 text-typography' style={{ fontSize: wp(3.5) }}>
                    {getDateAsc(dateFrom)}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View className='w-[48%] flex flex-col'>
              <Text className='font-bold mb-0.5 text-typography' style={{ fontSize: wp(3.5) }}>Hasta</Text>

              <View className='flex flex-row items-center rounded-lg pl-2 bg-lightList' style={{ height: wp(10) }}>
                <TouchableOpacity onPress={() => setOpenDatePickerTo(true)} className='flex flex-row items-center'>
                  <Image style={{ width: wp(6), height: wp(6) }} resizeMode='cover'
                    source={require('../assets/calendar.png')}
                  />
                  <Text className='font-normal pl-2 text-typography' style={{ fontSize: wp(3.5) }}>
                    {getDateAsc(dateTo)}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          
          {/* filter btn */}
          <View className='flex flex-row items-center justify-between'>
            <View className='flex justify-center w-full rounded-xl bg-green'>
              <TouchableOpacity onPress={() => filter()}>
                <Text style={{ fontSize: wp(4.5) }} className='py-2 text-center font-bold text-white'>
                  Filtrar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* date picker from */}
      <DatePicker
        modal
        mode='date'
        open={openDatePickerFrom}
        date={dateFrom}
        onConfirm={(date) => {
          setOpenDatePickerFrom(false);
          setDateFrom(date);
        }}
        onCancel={() => {
          setOpenDatePickerFrom(false);
        }}
      />

      {/* date picker to */}
      <DatePicker
        modal
        mode='date'
        open={openDatePickerTo}
        date={dateTo}
        onConfirm={(date) => {
          setOpenDatePickerTo(false);
          setDateTo(date);
        }}
        onCancel={() => {
          setOpenDatePickerTo(false);
        }}
      />
    </>
  );
};

export default OrderRecord;