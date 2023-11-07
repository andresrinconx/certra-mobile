import { View, Text, TouchableOpacity, Image } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useNavigation } from '../../hooks';
import Highlight from '../elements/Highlight';

const BackScreen = ({ title, condition, iconImage, onPressIcon }: { title: string, condition?: boolean, iconImage?: any, onPressIcon?: () => void }) => {
  const navigation = useNavigation();
  
  return (
    <View className='flex flex-row items-center justify-between'>
      <View className='flex flex-row items-center gap-x-1'>
        <Highlight
          onPress={() => navigation.goBack()}
          padding={4}
        >
          <Image style={{ width: wp(8), height: wp(8) }} resizeMode='cover'
            source={require('../../assets/back.png')}
          />
        </Highlight>
        
        <Text className='font-bold text-typography' style={{ fontSize: wp(4.5) }}>{title}</Text>
      </View>

      {condition && onPressIcon ? (
        <Highlight
          onPress={() => onPressIcon()}
          padding={4}
        >
          <Image style={{ width: wp(8), height: wp(8) }} resizeMode='cover'
            source={iconImage}
          />
        </Highlight>
      ):null}
    </View>
  );
};

export default BackScreen;