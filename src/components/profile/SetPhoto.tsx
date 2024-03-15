import { Modal } from 'native-base';
import { useState } from 'react';
import { View, Image, Text, TouchableOpacity } from 'react-native';
import { ImagePickerResponse, launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

interface Props {
  title: string;
  isNotTitle?: boolean;
  imageName: string;
  imageFile: { type: string, base64: string, name: string };
  setImageFile: (imageFile: { type: string, base64: string, name: string }) => void;
}

const SetPhoto = ({ title, isNotTitle, imageName, imageFile, setImageFile }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const takePhoto = async () => {
    const result: ImagePickerResponse = await launchCamera({
      mediaType: 'photo',
      includeBase64: true,
      quality: 0.5,
    });
    if (result.assets) {
      const { type, base64 } = result.assets[0];
      setImageFile({ type, base64, name: imageName } as { type: string, base64: string, name: string });
      setIsModalOpen(false);
    }
  };

  const takePhotoFromGallery = async () => {
    const result: ImagePickerResponse = await launchImageLibrary({
      mediaType: 'photo',
      includeBase64: true,
      quality: 0.5,
    });
    if (result.assets) {
      const { type, base64 } = result.assets[0];
      setImageFile({ type, base64, name: imageName } as { type: string, base64: string, name: string });
      setIsModalOpen(false);
    }
  };

  return (
    <View className='flex-row items-center justify-between my-1.5'>
      <Text className='font-bold text-center text-typography' style={{ fontSize: isNotTitle ? wp(3.5) : wp(4) }}>
        {title}
      </Text>

      <View className='w-[48%] flex-row items-center rounded-lg pl-2 bg-lightList' style={{ height: wp(10) }}>
        <TouchableOpacity onPress={() => setIsModalOpen(true)} className='flex-1 flex-row items-center justify-between'>
          <Text className='w-[80%] font-normal text-center pl-2 italic text-typography' 
            style={{ fontSize: wp(5), textDecorationLine: imageFile.name ? 'underline' : 'none' }}
            numberOfLines={1}
          >
            {imageFile.name ? imageName : '- - -'}
          </Text>
          <Image style={{ width: wp(8), height: wp(8) }} resizeMode='cover'
            source={require('../../assets/camera.png')}
          />
        </TouchableOpacity>
      </View>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <View className='w-72 p-5 space-y-5 rounded-3xl' style={{ backgroundColor: '#312c29' }}>
          <TouchableOpacity onPress={takePhoto}>
            <Text className='text-white' style={{ fontSize: wp(5) }}>Tomar foto</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={takePhotoFromGallery}>
            <Text className='text-white' style={{ fontSize: wp(5) }}>Elegir foto</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default SetPhoto;