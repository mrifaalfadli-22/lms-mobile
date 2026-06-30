import React from 'react';
import { Text, StyleSheet } from 'react-native';

const AppText = (props) => {
  const { style, children, ...rest } = props;
  
  const flattenedStyle = StyleSheet.flatten(style || {});
  const weight = flattenedStyle.fontWeight;
  
  let fontFamily = 'PlusJakartaSans_400Regular';
  
  if (weight === 'bold' || weight === '800' || weight === '900') {
    fontFamily = 'PlusJakartaSans_700Bold';
  } else if (weight === '700') {
    fontFamily = 'PlusJakartaSans_700Bold';
  } else if (weight === '600') {
    fontFamily = 'PlusJakartaSans_600SemiBold';
  } else if (weight === '500') {
    fontFamily = 'PlusJakartaSans_500Medium';
  } else if (weight === '300') {
    fontFamily = 'PlusJakartaSans_300Light';
  }

  // Hapus fontWeight agar font kustom merender dengan sempurna di Android
  const customStyle = { ...flattenedStyle, fontFamily };
  delete customStyle.fontWeight;

  return (
    <Text style={customStyle} {...rest}>
      {children}
    </Text>
  );
};

export default AppText;
