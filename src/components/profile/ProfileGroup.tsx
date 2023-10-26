import { View, Text, FlatList } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { DataField } from '..'

const ProfileGroup = ({ name, subname, fields }: { name: string, subname: string, fields: any[] }) => {
  return (
    <>
      {name && (
        <View>
          {/* name and subname */}
          <View className='flex flex-col items-center my-3'>
            <Text className='w-56 font-extrabold text-center text-typography' style={{ fontSize: wp(4.5) }}>
              {name}
            </Text>
    
            {subname && (
              <Text className='w-28 font-normal text-center text-typography' style={{ fontSize: wp(4) }}>
                {subname}
              </Text>
            )}
          </View>
    
          {/* fields */}
          <FlatList
            data={fields}
            numColumns={1}
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => {
              const { label, value } = item
              return (
                <DataField label={label} value={value} />
              )
            }} 
          />
        </View>
      )}
    </>
  )
}

export default ProfileGroup