import { useEffect, useState } from 'react';
import { View, Image, FlatList, StatusBar, Text, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { themeColors } from '../../tailwind.config';
import { DataConfigProfileInterface } from '../utils/interfaces';
import { fetchProfileData, fetchPsicotropicosInfo } from '../utils/api';
import { useCertra, useLogin, useNavigation } from '../hooks';
import { Loader, Logos, BackScreen, ProfileGroup, IconLogOut, Highlight, Modal } from '../components';
import { SafeAreaView } from 'react-native-safe-area-context';
import SetPhoto from '../components/profile/SetPhoto';
import PsicotropicosDates from '../components/profile/PsicotropicosDates';

const Profile = () => {
  const [dataConfig, setDataConfig] = useState<DataConfigProfileInterface>({});
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [isPsicotropicosModalOpen, setIsPsicotropicosModalOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const [startDateSolvence, setStartDateSolvence] = useState<string | Date>('');
  const [endDateSolvence, setEndDateSolvence] = useState<string | Date>('');
  const [startDateWorking, setStartDateWorking] = useState<string | Date>('');
  const [endDateWorking, setEndDateWorking] = useState<string | Date>('');
  const [solvenceFile, setSolvenceFile] = useState({});
  const [permissionFile, setPermissionFile] = useState({});
  const [titleFile, setTitleFile] = useState({});
  const [idCardFile, setIdCardFile] = useState({});

  const { background } = themeColors;
  const { myUser: { access: { customerAccess, labAccess, salespersonAccess }, cliente, cedula, clipro, image_url, us_codigo, conexion } } = useLogin();
  const { setLookAtPharmacy } = useCertra();
  const navigation = useNavigation();

  // Get data
  useEffect(() => {
    const getData = async () => {
      try {
        const res = await fetchProfileData({ 
          table: `${customerAccess    ? 'appClientes/scliU'    :
                    salespersonAccess ? 'appUsuarios/usuarioP' :
                    labAccess         ? 'appUsuarios/usuarioU' : null}`,

          code: `${customerAccess     ? `${cliente}` : 
                   salespersonAccess  ? `${cedula}`  :
                   labAccess          ? `${clipro}/${us_codigo}`  : null}`,
        });
        setDataConfig(res);

        if (res) {
          setLoadingProfile(false);
        }
        
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, []);

  // Save psicotropicos info
  const saveInfo = async () => {
    setIsSending(true);
    try {
      const res = await fetchPsicotropicosInfo({
        cliente,
        startDateSolvence,
        endDateSolvence,
        startDateWorking,
        endDateWorking,
        solvenceFile,
        permissionFile,
        titleFile,
        idCardFile,
      });

      if (res) {
        setIsSending(false);
        setIsPsicotropicosModalOpen(false);
        setStartDateSolvence('');
        setEndDateSolvence('');
        setStartDateWorking('');
        setEndDateWorking('');
        setSolvenceFile({});
        setPermissionFile({});
        setTitleFile({});
        setIdCardFile({});
      }
    } catch (error) {
      console.log(error);
    }
  };

  const groups = [
    // main info
    {
      name: 
        customerAccess    ? dataConfig?.nombre : 
        salespersonAccess ? `${dataConfig?.nombre} ${dataConfig?.apellido}` :
        labAccess         ? dataConfig?.nombre : null,

      subname: 
        customerAccess    ? `Código: ${dataConfig?.cliente}` : 
        salespersonAccess ? ''                               :
        labAccess         ? `Código: ${dataConfig?.proveed}` : null,

      fields: [
        { 
          label: 'RIF',
          value: 
            customerAccess    ? dataConfig?.rifci  : 
            salespersonAccess ? dataConfig?.rif    :
            labAccess         ? dataConfig?.rif    : null,
        },
        { 
          label: 
            customerAccess    ? ''       :
            salespersonAccess ? 'Cédula' :
            labAccess          ? ''      : null,

          value: 
            customerAccess    ? '' : 
            salespersonAccess ? dataConfig?.cedula :
            labAccess         ? '' : null,
        },
        { 
          label: 'Correo', 
          value: 
            customerAccess    ? dataConfig?.email  : 
            salespersonAccess ? dataConfig?.email  :
            labAccess         ? dataConfig?.emailc : null,
        },
        { 
          label: 'Teléfono', 
          value: 
            customerAccess    ? dataConfig?.telefono : 
            salespersonAccess ? dataConfig?.telefono :
            labAccess         ? dataConfig?.telefono : null,
        },
        { 
          label: 
            customerAccess    ? 'Aniversario' :
            salespersonAccess ? 'Cumpleaños'  :
            labAccess         ? 'Aniversario' : null,

          value: 
            customerAccess    ? dataConfig?.aniversario : 
            salespersonAccess ? dataConfig?.nacimi      :
            labAccess         ? dataConfig?.aniversario : null,
        },
        { 
          label: 'Ubicación', 
          value: 
            customerAccess    ? dataConfig?.dire11 : 
            salespersonAccess ? dataConfig?.direc1 :
            labAccess         ? dataConfig?.direc1 : null,
        },
      ],
    },
    // extra info
    {
      name: 
        customerAccess    ? 'Datos del representante' : 
        salespersonAccess ? ''                        :
        labAccess         ? 'Datos del representante' : null,
            
      subname: '',
      fields: [
        { 
          label: 'Nombre', 
          value: 
            customerAccess ? dataConfig?.contacto  : 
            labAccess      ? dataConfig?.us_nombre : null,
        },
        { 
          label: 'Teléfono', 
          value: 
            customerAccess ? dataConfig?.telefon2 : 
            labAccess      ? dataConfig?.telefon2 : null,
        },
      ]
    }
  ];
  
  return (
    <>
      <SafeAreaView className='flex-1 px-3 bg-background'>
        <StatusBar backgroundColor={background} barStyle='dark-content' />

        <Logos image={image_url as URL} />

        {/* options */}
        <View className='flex-row items-center justify-between'>
          <BackScreen title='Mi perfil' />

          <View className='flex-row items-center gap-x-2'>
            <Highlight
              onPress={() => setIsPsicotropicosModalOpen(true)}
              padding={4}
            >
              <Image style={{ width: 30, height: 30 }} resizeMode='contain'
                source={require('../assets/pill.png')}
              />
            </Highlight>        

            {/* order record */}
            {!customerAccess && (
              <Highlight
                onPress={() => {
                  setLookAtPharmacy(false);
                  navigation.navigate('OrderRecord');
                }}
                padding={4}
              >
                <Image style={{ width: wp(8), height: wp(8) }} resizeMode='cover'
                  source={require('../assets/history-blue.png')}
                />
              </Highlight>
            )}
          </View>

        </View>
        
        {/* info */}
        <View className='h-full'>
          {loadingProfile ? (
            <View className='mt-5'>
              <Loader />
            </View>
          ) : (
            <View className='px-3'>
              <FlatList
                data={groups}
                numColumns={1}
                contentContainerStyle={{
                  paddingBottom: 200,
                }}
                overScrollMode='never'
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={() => (
                  <View className='flex flex-col items-center'>
                    {customerAccess && (
                      <View>
                        <Image style={{ width: wp(32), height: wp(32) }} resizeMode='cover'
                          source={require('../assets/drugstore.png')}
                        />
                      </View>
                    )}
                  </View>
                )}
                renderItem={({item}) => {
                  const { name, subname, fields } = item;
                  return (
                    <ProfileGroup 
                      name={name as string}
                      subname={String(subname)}
                      fields={fields}
                    />
                  );
                }} 
              />
            </View>
          )}
        </View>

        {/* log out */}
        {!loadingProfile && (
          <View className='flex flex-row bottom-0 py-2.5 w-screen absolute bg-background'>
            <View className='flex flex-col justify-center items-center space-y-0.5 pl-14' style={{ width: wp(25) }}>
              <Text className='w-32 text-typography' style={{ fontSize: wp(3) }}>Conexión: {conexion}</Text>
              <Text className='w-32 text-typography' style={{ fontSize: wp(3) }}>Certra 1.0.0</Text>
            </View>
            <View className='flex flex-col justify-center items-center pl-5' style={{ width: wp(72) }}>
              <View className='flex flex-row justify-center items-center rounded-xl py-3 bg-darkTurquoise'>
                <IconLogOut />
              </View>
            </View>
          </View>
        )}
      </SafeAreaView>

      <Modal
        bgColor={background}
        openModal={isPsicotropicosModalOpen}
        setOpenModal={setIsPsicotropicosModalOpen}
        minHeight={110}
        maxHeight={110}
      >
        <View className='px-3 py-4'>
          <View className='flex-row items-center justify-center'>
            <Text className='font-bold pr-1 text-typography' style={{ fontSize: wp(4.8) }}>Permisología de Psicotrópicos</Text>
            <Image style={{ width: wp(8), height: wp(8) }} resizeMode='cover'
              source={require('../assets/pill.png')}
            />
          </View>

          <View className='mt-3'>
            <SetPhoto 
              title='Solvencia de contraloría' 
              imageName='Solvencia' 
              imageFile={solvenceFile}
              setImageFile={setSolvenceFile} 
            />
            <PsicotropicosDates 
              startDate={startDateSolvence} 
              setStartDate={setStartDateSolvence} 
              endDate={endDateSolvence}
              setEndDate={setEndDateSolvence}
            />

            <SetPhoto 
              title='Permiso de funcionamiento' 
              isNotTitle={true} 
              imageName='Permiso' 
              imageFile={permissionFile}
              setImageFile={setPermissionFile} 
            />
            <PsicotropicosDates 
              startDate={startDateWorking}
              setStartDate={setStartDateWorking}
              endDate={endDateWorking}
              setEndDate={setEndDateWorking}
            />
            
            <SetPhoto 
              title='Título regente' 
              imageName='Título' 
              imageFile={titleFile}
              setImageFile={setTitleFile} 
            />
            <SetPhoto 
              title='Cédula regente' 
              imageName='Cédula' 
              imageFile={idCardFile}
              setImageFile={setIdCardFile} 
            />
          </View>

          <View className='items-center pt-4'>
            <View className='w-[70%] flex-row justify-center items-center rounded-xl bg-darkTurquoise'>
              <TouchableOpacity onPress={saveInfo} className='w-full h-full py-3'>
                {isSending ? (
                  <Loader color='white' size={wp(7.5)} />
                ) : (
                  <Text className='text-xl text-center font-bold text-white'>Guardar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default Profile;