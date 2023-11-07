import { useNavigation as useNavigationHook } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../utils/types';

const useNavigation = () => {
  return useNavigationHook<NativeStackNavigationProp<RootStackParamList>>();
};

export default useNavigation;