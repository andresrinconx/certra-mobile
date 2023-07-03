import { View, Text } from 'react-native'
import React from 'react'

const random = () => {
  return (
    <View className='mr-[2px] ml-[1px] mb-2 mt-[1px] p-3' style={styles.shadow}>
        <View className='flex-row'>

        {/* textos item */}
        <View className='basis-[70%]'>
            <Text className='color-black font-bold text-lg leading-6' numberOfLines={2}>
            {descrip}
            </Text>
    
            <Text className='font-bold text-lg color-[#bed03c]'>Bs. {precio1}</Text>
        </View>

        {/* btns */}
        <View className='basis-[30%] flex-row justify-center items-center space-x-3'>
            <TouchableOpacity onPress={() => decremento()} className={`bg-[${theme.azulClaro}] w-7 rounded-full`}>
            <Text className='text-white text-center font-bold text-xl'>-</Text>
            </TouchableOpacity>

            <Text className='color-black text-2xl mx-1'>{cantidad}</Text>

            <TouchableOpacity onPress={() => incremento()} className={`bg-[${theme.azulClaro}] w-7 rounded-full`}>
            <Text className='text-white text-center font-bold text-xl'>+</Text>
            </TouchableOpacity>
        </View>
        </View>
    </View>
  )
}

export default random