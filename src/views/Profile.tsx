import { useEffect, useState } from 'react'
import { View, Image, FlatList } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { StatusBar } from 'react-native'
import useInv from '../hooks/useInv'
import useLogin from '../hooks/useLogin'
import { fetchUserData } from '../utils/api'
import Loader from '../components/Loader'
import Logos from '../components/Logos'
import BackScreen from '../components/BackScreen'
import ProfileGroup from '../components/ProfileGroup'
import IconLogOut from '../components/IconLogOut'
import { DataConfigProfileInterface } from '../interfaces/DataConfigProfileInterface'

const Profile = () => {
  const [dataConfig, setDataConfig] = useState<DataConfigProfileInterface>({})
  const [loadingProfile, setLoadingProfile] = useState(true)
  
  const { themeColors: { primary, background, darkTurquoise }, myUser } = useLogin()
  const { flowControl } = useInv()

  // Get data
  useEffect(() => {
    const getData = async () => {
      try {
        const res = await fetchUserData({ 
          table: `${myUser?.from === 'scli'           ? 'scliU'    :
                    myUser?.from === 'usuario'        ? 'usuarioP' :
                    myUser?.from === 'usuario-clipro' ? 'usuarioU' : null}`,

          code: `${myUser?.from === 'scli'           ? `${myUser?.cliente}` : 
                   myUser?.from === 'usuario'        ? `${myUser?.cedula}`  :
                   myUser?.from === 'usuario-clipro' ? `${myUser.clipro}`   : null}`,
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
        myUser.from === 'scli'           ? dataConfig?.nombre : 
        myUser.from === 'usuario'        ? `${dataConfig?.nombre} ${dataConfig?.apellido}` :
        myUser.from === 'usuario-clipro' ? dataConfig?.nombre : null,

      subname: 
        myUser.from === 'scli'           ? `Código: ${dataConfig?.cliente}` : 
        myUser.from === 'usuario'        ? ''                               :
        myUser.from === 'usuario-clipro' ? `Código: ${dataConfig?.proveed}` : null,

      fields: [
        { 
          label: 'RIF',
          value: 
            myUser.from === 'scli'           ? dataConfig?.rifci  : 
            myUser.from === 'usuario'        ? dataConfig?.rif    :
            myUser.from === 'usuario-clipro' ? dataConfig?.rif    : null,
        },
        { 
          label: 
            myUser.from === 'scli'           ? ''       :
            myUser.from === 'usuario'        ? 'Cédula' :
            myUser.from === 'usuario-clipro' ? ''       : null,

          value: 
            myUser.from === 'scli'           ? '' : 
            myUser.from === 'usuario'        ? dataConfig?.cedula :
            myUser.from === 'usuario-clipro' ? '' : null,
        },
        { 
          label: 'Correo', 
          value: 
            myUser.from === 'scli'           ? dataConfig?.email  : 
            myUser.from === 'usuario'        ? dataConfig?.email  :
            myUser.from === 'usuario-clipro' ? dataConfig?.emailc : null,
        },
        { 
          label: 'Teléfono', 
          value: 
            myUser.from === 'scli'           ? dataConfig?.telefono : 
            myUser.from === 'usuario'        ? dataConfig?.telefono :
            myUser.from === 'usuario-clipro' ? dataConfig?.telefono : null,
        },
        { 
          label: 
            myUser.from === 'scli'           ? 'Aniversario' :
            myUser.from === 'usuario'        ? 'Cumpleaños'  :
            myUser.from === 'usuario-clipro' ? 'Aniversario' : null,

          value: 
            myUser.from === 'scli'           ? dataConfig?.aniversario : 
            myUser.from === 'usuario'        ? dataConfig?.nacimi      :
            myUser.from === 'usuario-clipro' ? dataConfig?.aniversario : null,
        },
        { 
          label: 'Ubicación', 
          value: 
            myUser.from === 'scli'           ? dataConfig?.dire11 : 
            myUser.from === 'usuario'        ? dataConfig?.direc1 :
            myUser.from === 'usuario-clipro' ? dataConfig?.direc1 : null,
        },
      ],
    },
    // extra info
    {
      name: 
        myUser.from === 'scli'           ? 'Datos del representante' : 
        myUser.from === 'usuario'        ? ''                        :
        myUser.from === 'usuario-clipro' ? 'Datos del representante' : null,
            
      subname: '',
      fields: [
        { 
          label: 'Nombre', 
          value: 
            myUser.from === 'scli'           ? dataConfig?.contacto  : 
            myUser.from === 'usuario-clipro' ? dataConfig?.us_nombre : null,
        },
        { 
          label: 'Teléfono', 
          value: 
            myUser.from === 'scli'           ? dataConfig?.telefon2 : 
            myUser.from === 'usuario-clipro' ? dataConfig?.telefon2 : null,
        },
      ]
    }
  ]
  
  return (
    <View className='flex-1 px-3 pt-6' style={{ backgroundColor: background }}>
      <StatusBar backgroundColor={background} barStyle='dark-content' />

      <Logos image={myUser?.image_url as URL} />
      <BackScreen title='Mi perfil' />
      
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
                paddingBottom: 180,
              }}
              overScrollMode='never'
              showsVerticalScrollIndicator={false}
              ListHeaderComponent={() => (
                <View className='flex flex-col items-center'>
                  {!flowControl?.showLogoCertra && (
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
    </View>
  )
}

export default Profile