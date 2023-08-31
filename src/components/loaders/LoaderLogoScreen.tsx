import React, { useState, useEffect } from 'react';
import { View, Image, Animated, Easing } from 'react-native';
import useLogin from '../../hooks/useLogin';

const LoaderLogoScreen = () => {
  const { themeColors: { primary } } = useLogin();
  const [rotationValue] = useState(new Animated.Value(0));

  useEffect(() => {
    const rotateImage = () => {
      Animated.timing(rotationValue, {
        toValue: 1,
        duration: 1500, // Ajusta la duración según tus necesidades
        easing: Easing.linear,
        useNativeDriver: false,
      }).start(() => {
        rotationValue.setValue(0);
        rotateImage();
      });
    };

    rotateImage();
  }, []);

  const rotateInterpolation = rotationValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View className='flex-1 justify-center items-center' style={{ backgroundColor: primary || '#fff' }}>
      <Animated.Image
        source={require('../../assets/pastilla.png')}
        style={{
          transform: [{ rotate: rotateInterpolation }],
          width: 100,
          height: 100,
        }}
        resizeMode="contain"
      />
    </View>
  );
};

export default LoaderLogoScreen;