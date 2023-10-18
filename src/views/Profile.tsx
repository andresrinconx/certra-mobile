import { useEffect, useState } from 'react'
import { View, Image, FlatList, StatusBar, SafeAreaView } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { DataConfigProfileInterface } from '../utils/interfaces'
import useCertra from '../hooks/useCertra'
import useNavigation from '../hooks/useNavigation'
import useLogin from '../hooks/useLogin'
import { fetchProfileData } from '../utils/api'
import { Loader, Logos, BackScreen, ProfileGroup, IconLogOut } from '../components'

const Profile = () => {
  const [dataConfig, setDataConfig] = useState<DataConfigProfileInterface>({})
  const [loadingProfile, setLoadingProfile] = useState(true)
  
  const { themeColors: { primary, background, darkTurquoise }, myUser: { access: { customerAccess, labAccess, salespersonAccess }, cliente, cedula, clipro, image_url } } = useLogin()
  const { setLookAtPharmacy } = useCertra()
  const navigation = useNavigation()

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
                   labAccess          ? `${clipro}`  : null}`,
        })
        setDataConfig(res)

        if (res) {
          setLoadingProfile(false)
        }
        
      } catch (error) {
        console.log(error)
      }
    }
    getData()
  }, [])

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
  ]
  
  return (
    <SafeAreaView className='flex-1 px-3' style={{ backgroundColor: background }}>
      <StatusBar backgroundColor={background} barStyle='dark-content' />

      <Logos image={image_url as URL} />
      <BackScreen 
        title='Mi perfil' 
        condition={!customerAccess}
        iconImage={require('../assets/history-blue.png')}
        onPressIcon={() => {
          setLookAtPharmacy(false)
          navigation.navigate('OrderRecord')
        }}
      />
      
      {/* info */}
      <View className='h-full'>
        {loadingProfile ? (
          <View className='mt-5'>
            <Loader color={`${primary}`} />
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
                const { name, subname, fields } = item
                return (
                  <ProfileGroup 
                    name={name as string}
                    subname={String(subname)}
                    fields={fields}
                  />
                )
              }} 
            />
          </View>
        )}
      </View>

      {/* log out */}
      {!loadingProfile && (
        <View className='flex flex-row items-center justify-center bottom-0 py-2.5 w-screen absolute'
          style={{ backgroundColor: background }}
        >
          <View className='flex flex-row justify-center items-center w-5/6 rounded-xl py-3' style={{ backgroundColor: darkTurquoise}}>
            <IconLogOut />
          </View>
        </View>
      )}
    </SafeAreaView>
  )
}

export default Profile