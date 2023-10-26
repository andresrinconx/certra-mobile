import { View, Text } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { valitadeDateInRange } from '../../utils/helpers'

const Bonus = ({ bonicant, bonifica, fdesde, fhasta }: { bonicant: string, bonifica: string, fdesde: string, fhasta: string }) => {
  return (
    <>
      {Number(bonicant) > 0 && valitadeDateInRange(new Date(`${fdesde}`), new Date(`${fhasta}`)) ? (
        <View className='flex flex-row justify-between rounded-sm px-1 py-0.5 my-1 bg-turquoise'>
          <Text className='font-medium text-white' style={{ fontSize: wp(2.5) }}>Bonificación: {Number(bonicant)}x{Number(bonifica)}.</Text>
        </View>
      ):null}
    </>
  )
}

export default Bonus