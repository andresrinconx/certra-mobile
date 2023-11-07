import { TouchableHighlight } from 'react-native';
import { themeColors } from '../../../tailwind.config';

const Highlight = ({ children, padding, onPress }: { children: React.ReactNode, padding: number, onPress: () => void }) => {
  const { charge } = themeColors;
  
  return (
    <TouchableHighlight
      className='flex items-center justify-center rounded-full'
      style={{ padding }}
      underlayColor={charge}
      onPress={onPress} 
    >
      {children}
    </TouchableHighlight>
  );
};

export default Highlight;