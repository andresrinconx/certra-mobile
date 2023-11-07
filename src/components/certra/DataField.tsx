import { View, Text } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

const DataField = ({label, value}: {label: string, value: string}) => {
  return (
    <>
      {label && (
        <View className='flex flex-row justify-between items-center mb-3'>
          {/* label */}
          <Text className='w-2/6 font-bold capitalize text-typography' style={{ fontSize: wp(4.5) }}>{label}</Text>

          {/* value */}
          <View className='w-4/6 rounded-lg py-2 px-1 bg-charge'>
            <Text className='text-center text-typography'>
              {value}
            </Text>
          </View>
        </View>
      )}
    </>
  );
};

export default DataField;