import { View, Image, Text, TouchableOpacity } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

interface Props {
  title: string;
  isNotTitle?: boolean;
  imageName: string;
  imageFile: FormData | Record<string, never>;
  setImageFile: (imageFile: FormData) => void;
}

const SetPhoto = ({ title, isNotTitle, imageName, imageFile, setImageFile }: Props) => {
  // const takePhoto = () => {
  //   launchCamera({ mediaType: 'photo', quality: 0.5 }, (resp) => {
  //     if (resp?.didCancel) return;
  //     if (!resp?.assets?.[0]?.uri) return;

  //     const formData = new FormData();
  //     formData.append(imageName, {
  //       uri: resp?.assets?.[0]?.uri,
  //       type: resp?.assets?.[0].type,
  //       name: imageName
  //     });

  //     setImageFile(formData);
  //   });
  // };

  const takePhotoFromGallery = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.5 }, (resp) => {
      if (resp.didCancel) return;
      if (!resp.assets?.[0].uri) return;

      const formData = new FormData();
      formData.append(imageName, {
        uri: resp?.assets?.[0]?.uri,
        type: resp?.assets?.[0].type,
        name: imageName
      });

      setImageFile(formData);
    });
  };

  return (
    <View className='flex-row items-center justify-between my-1.5'>
      <Text className='font-bold text-center text-typography' style={{ fontSize: isNotTitle ? wp(3.5) : wp(4) }}>
        {title}
      </Text>

      <View className='w-[48%] flex-row items-center rounded-lg pl-2 bg-lightList' style={{ height: wp(10) }}>
        <TouchableOpacity onPress={takePhotoFromGallery} className='flex-1 flex-row items-center justify-between'>
          <Text className='w-[80%] font-normal text-center pl-2 italic text-typography' 
            style={{ fontSize: wp(5), textDecorationLine: imageFile?._parts ? 'underline' : 'none' }}
            numberOfLines={1}
          >
            {imageFile?._parts ? imageName : '- - -'}
          </Text>
          <Image style={{ width: wp(8), height: wp(8) }} resizeMode='cover'
            source={require('../../assets/camera.png')}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SetPhoto;