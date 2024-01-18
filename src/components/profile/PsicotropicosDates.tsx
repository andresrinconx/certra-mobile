import React, { useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { getDateAsc, getEndDate } from '../../utils/helpers';

interface Props {
  startDate: string | Date;
  setStartDate: (startDate: string | Date) => void;
  endDate: string | Date;
  setEndDate: (endDate: string | Date) => void;
}

const PsicotropicosDates = ({ startDate, setStartDate, endDate, setEndDate }: Props) => {
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  return (
    <>
      <View className='flex-row items-center justify-between'>
        <Text className='font-bold text-center text-typography' style={{ fontSize: wp(3.5) }}>
          Fecha de emisión
        </Text>

        <View className='flex flex-row items-center rounded-lg pl-2 bg-lightList' style={{ height: wp(10) }}>
          <TouchableOpacity onPress={() => setIsPickerOpen(true)} className='flex flex-row items-center'>
            <Text className='font-normal pr-1 italic text-typography' style={{ fontSize: wp(3.5) }}>
              {getDateAsc(startDate as Date) || 'dd-mm-aaaa'}
            </Text>
            <Image style={{ width: wp(6), height: wp(6) }} resizeMode='cover'
              source={require('../../assets/calendar.png')}
            />
          </TouchableOpacity>
        </View>

        <Text className='font-bold text-center text-typography' style={{ fontSize: wp(3.5) }}>
          Vence
        </Text>
        <View className='flex flex-row items-center rounded-lg bg-lightList' style={{ height: wp(10) }}>
          <Text className='font-normal italic text-typography' style={{ fontSize: wp(3.5) }}>
            {endDate as string || 'dd-mm-aaaa'}
          </Text>
        </View>
      </View>

      <DatePicker
        modal
        mode='date'
        open={isPickerOpen}
        date={new Date()}
        onConfirm={(date) => {
          setStartDate(date);
          setEndDate(getEndDate(date));
          setIsPickerOpen(false);
        }}
        onCancel={() => {
          setIsPickerOpen(false);
        }}
      />
    </>
  );
};

export default PsicotropicosDates;