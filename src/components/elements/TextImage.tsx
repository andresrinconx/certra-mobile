import { View, Text, Image } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const TextImage = ({ image, text }: { image: any, text: string }) => {
  return (
    <View className='flex flex-row items-center gap-x-2'>
      <Image style={{ width: wp(7), height: wp(7) }} resizeMode='contain'
        source={image}
      />
      <Text style={{ fontSize: hp(2.5) }} className='font-medium text-typography'>
        {text}
      </Text>
    </View>
  );
};

export default TextImage;