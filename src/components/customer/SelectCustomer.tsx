import { View, Text, Image, Pressable, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useLogin, useNavigation } from '../../hooks';
import { LabelCustomer } from '..';

const SelectCustomer = () => {
  const { myUser: { access: { customerAccess, salespersonAccess }, customer } } = useLogin();
  const navigation = useNavigation();

  return (
    <>
      {!customerAccess && (
        <View className='space-y-4'>
          {customer && (
            <LabelCustomer name={customer?.nombre as string} />
          )}
          <View className='flex flex-row items-center'>
            {customer ? (
              salespersonAccess ? (
                <TouchableOpacity onPress={() => navigation.navigate('CustomerProfile')}>
                  <Image style={{ width: wp(10), height: wp(10) }} resizeMode='cover'
                    source={require('../../assets/drugstore-search.png')}
                  />
                </TouchableOpacity>
              ) : (
                <Image style={{ width: wp(10), height: wp(10) }} resizeMode='cover'
                  source={require('../../assets/drugstore-search.png')}
                />
              )
            ) : (
              <Image style={{ width: wp(10), height: wp(10) }} resizeMode='cover'
                source={require('../../assets/drugstore-search-gray.png')}
              />
            )}

            <Pressable className='rounded-lg w-5/6 ml-3 py-0 bg-list' 
              onPress={() => navigation.navigate('SearchCustomer')}
            >
              <Text className='pl-3 py-1 text-typography' style={{ fontSize: wp(4) }}>Buscar un cliente</Text>
            </Pressable>
          </View>
        </View>
      )}
    </>
  );
};

export default SelectCustomer;