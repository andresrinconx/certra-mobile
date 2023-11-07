import { View, Image, Pressable } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useNavigation, useLogin } from '../../hooks';

const Logos = ({image}: {image: URL}) => {
  const { myUser: { access: { labAccess, salespersonAccess } } } = useLogin();
  const navigation = useNavigation();

  return (
    <View className='flex-row justify-between'>
      <Pressable onPress={() => navigation.navigate('Home')}>
        {labAccess || salespersonAccess ? (
          <Image style={{ width: wp(32), height: wp(16) }} resizeMode='contain'
            source={require('../../assets/logo-certra.png')}
          />
        ) : (
          <Image style={{ width: wp(40), height: wp(20) }} resizeMode='contain'
            source={require('../../assets/logo-drocerca.png')}
          />
        )}
      </Pressable>

      {image && (
        <Image style={{ width: wp(40), height: wp(16) }} resizeMode='contain'
          source={{uri: `${image}`}}
        />
      )}
    </View>
  );
};

export default Logos;