import { View, Text } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

const LabelCustomer = ({name}: {name: string}) => {
  return (
    <View>
      <Text className='font-extrabold text-typography' style={{ fontSize: wp(4.5) }}>Cliente</Text>
      <Text className='font-normal text-typography' style={{ fontSize: wp(4) }}>{name}</Text>
    </View>
  );
};

export default LabelCustomer;