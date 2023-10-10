import { View, Text, Image, Pressable } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import useLogin from '../../hooks/useLogin'
import { LabelCustomer } from '..'

const SelectCustomer = () => {
  const { themeColors: { list, typography }, myUser: { access: { customerAccess }, customer } } = useLogin()
  const navigation = useNavigation()

  return (
    <>
      {!customerAccess && (
        <View className='space-y-4'>
          {customer?.nombre && (
            <LabelCustomer name={customer?.nombre as string} />
          )}
          <View className='flex flex-row items-center'>
            <Image style={{ width: wp(10), height: wp(10) }} resizeMode='cover'
              source={require('../../assets/drugstore-search.png')}
            />

            <Pressable className='rounded-lg w-5/6 ml-3 py-0' 
              onPress={() => navigation.navigate('Customer')}
              style={{ backgroundColor: list }}
            >
              <Text className='pl-3 py-1' style={{ fontSize: wp(4), color: typography }}>Buscar un cliente</Text>
            </Pressable>
          </View>
        </View>
      )}
    </>
  )
}

export default SelectCustomer