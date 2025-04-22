import { Dimensions, PixelRatio } from 'react-native';

// iphone 11
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const scale = SCREEN_WIDTH / 375;

export const normalize = (size: number): number => {
  return Math.round(PixelRatio.roundToNearestPixel(size * scale));
};
