import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Image, Dimensions, Animated } from 'react-native';
import AppText from '../components/AppText';
import Svg, { Rect, Path, G, Defs, ClipPath } from 'react-native-svg';

const { width, height } = Dimensions.get('window');
const PRIMARY = '#116E63';

const CenterLogoSvg = () => (
  <Svg width="70" height="70" viewBox="0 0 70 70" fill="none">
    <Rect width="70" height="70" rx="12" fill="#D9D9D9" />
    <Path d="M13.9117 30.7346L33.4764 42.3902C34.1071 42.7659 34.8929 42.7659 35.5236 42.3902L51.7587 32.7182C53.5042 31.6783 52.7669 29 50.7351 29H36.9519C35.8474 29 34.9519 28.1046 34.9519 27V18.4856C34.9519 16.9412 33.276 15.9796 31.9427 16.7589L13.926 27.2897C12.6114 28.0581 12.6035 29.9553 13.9117 30.7346Z" fill="#116E63" />
    <Path d="M17.2027 46.3216C16.8356 45.9626 17.0497 39.2909 17.2027 36L33.2656 44.9753C34.7746 45.8495 35.5677 45.72 36.9371 44.9753L53 36V46.3216L36.4782 55.7457C35.3804 56.064 34.7749 56.105 33.7245 55.7457C28.3702 52.7539 17.5699 46.6806 17.2027 46.3216Z" fill="#10B981" />
  </Svg>
);

const MosqueSvg = () => (
  <Svg width="100%" height="172" viewBox="0 0 393 172" fill="none">
    <G>
      <Path d="M133.6 172V78.1819C175.2 36.4849 216.8 36.4849 258.4 78.1819V172" fill="white" fillOpacity="0.04" />
      <Path d="M160.9 172V74.2724C184.3 40.3936 207.7 40.3936 231.1 74.2724V172" fill="white" fillOpacity="0.03" />
      <Path d="M196 39.873C198.585 39.873 200.68 37.7728 200.68 35.1821C200.68 32.5914 198.585 30.4912 196 30.4912C193.416 30.4912 191.32 32.5914 191.32 35.1821C191.32 37.7728 193.416 39.873 196 39.873Z" stroke="white" strokeOpacity="0.06" strokeWidth="1.5" />
      <Path d="M198.34 35.1814C198.34 35.6453 198.203 36.0987 197.946 36.4845C197.689 36.8702 197.323 37.1708 196.896 37.3483C196.468 37.5258 195.998 37.5723 195.544 37.4818C195.09 37.3913 194.673 37.1679 194.346 36.8399C194.018 36.5119 193.795 36.0939 193.705 35.639C193.615 35.184 193.661 34.7124 193.838 34.2838C194.015 33.8553 194.315 33.4889 194.7 33.2312C195.085 32.9735 195.537 32.8359 196 32.8359" fill="white" fillOpacity="0.06" />
      <Path d="M103.18 46.9092H96.9396C95.6473 46.9092 94.5996 47.9593 94.5996 49.2546V169.655C94.5996 170.95 95.6473 172 96.9396 172H103.18C104.472 172 105.52 170.95 105.52 169.655V49.2546C105.52 47.9593 104.472 46.9092 103.18 46.9092Z" fill="white" fillOpacity="0.025" />
      <Path d="M96.1602 46.9087C98.7602 40.6541 101.88 40.6541 105.52 46.9087Z" fill="white" fillOpacity="0.025" />
      <Path d="M295.06 46.9092H288.82C287.528 46.9092 286.48 47.9593 286.48 49.2546V169.655C286.48 170.95 287.528 172 288.82 172H295.06C296.353 172 297.4 170.95 297.4 169.655V49.2546C297.4 47.9593 296.353 46.9092 295.06 46.9092Z" fill="white" fillOpacity="0.025" />
      <Path d="M288.039 46.9087C290.639 40.6541 293.759 40.6541 297.399 46.9087Z" fill="white" fillOpacity="0.025" />
      <Path d="M-116 148.546C-12 138.121 92 135.515 196 140.727C300 145.94 404 144.637 508 136.818V172H-116V148.546Z" fill="white" fillOpacity="0.02" />
    </G>
  </Svg>
);

export default function SplashScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    ]).start();

    // After 2.5 seconds, navigate to Login Screen
    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      {/* Top Left Logo UIKA */}
      <View style={styles.topContainer}>
        <Image 
          source={require('../assets/logo-uika.png')} 
          style={styles.logoUika} 
          resizeMode="contain" 
        />
        <View style={styles.uikaTextContainer}>
          <AppText style={styles.uikaText}>Universitas</AppText>
          <AppText style={styles.uikaText}>Ibn Khaldun</AppText>
        </View>
      </View>

      {/* Center u-Cademy Logo */}
      <Animated.View style={[
        styles.centerContainer, 
        { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }
      ]}>
        <CenterLogoSvg />
        <AppText style={styles.ucademyText}>u-Cademy</AppText>
      </Animated.View>

      {/* Bottom Mosque Background */}
      <View style={styles.bottomContainer} pointerEvents="none">
        <MosqueSvg />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PRIMARY,
    position: 'relative',
  },
  topContainer: {
    position: 'absolute',
    top: 60, // Give some space for status bar
    left: 24,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
  },
  logoUika: {
    width: 42,
    height: 42,
    marginRight: 12,
  },
  uikaTextContainer: {
    justifyContent: 'center',
  },
  uikaText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 18,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  ucademyText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
    marginTop: 16,
    letterSpacing: -0.5,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  }
});
