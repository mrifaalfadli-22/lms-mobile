import React from 'react';
import AppText from './AppText';
import {
  View,
  
  Modal,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { BlurView } from 'expo-blur';
import Svg, { Path, Circle, Line, Polyline } from 'react-native-svg';

const { width } = Dimensions.get('window');

// ── Icons ────────────────────────────────────────────────────────────
const CheckCircleIcon = ({ color, size }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></Path>
    <Polyline points="22 4 12 14.01 9 11.01"></Polyline>
  </Svg>
);

const XCircleIcon = ({ color, size }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="10"></Circle>
    <Line x1="15" y1="9" x2="9" y2="15"></Line>
    <Line x1="9" y1="9" x2="15" y2="15"></Line>
  </Svg>
);

const AlertTriangleIcon = ({ color, size }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></Path>
    <Line x1="12" y1="9" x2="12" y2="13"></Line>
    <Line x1="12" y1="17" x2="12.01" y2="17"></Line>
  </Svg>
);

const XIcon = ({ color, size }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Line x1="18" y1="6" x2="6" y2="18"></Line>
    <Line x1="6" y1="6" x2="18" y2="18"></Line>
  </Svg>
);

const CheckIcon = ({ color, size }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Polyline points="20 6 9 17 4 12"></Polyline>
  </Svg>
);

const VARIANTS = {
  success: {
    icon: CheckCircleIcon,
    iconColor: '#10b981', // emerald-500
    iconBgColor: '#d1fae5', // emerald-100
    btnTextColor: '#059669', // emerald-600
    btnBorderColor: '#ecfdf5', // emerald-50
    btnIcon: CheckIcon,
    btnLabel: 'Mengerti',
    defaultTitle: 'Berhasil',
  },
  error: {
    icon: XCircleIcon,
    iconColor: '#ef4444', // red-500
    iconBgColor: '#fee2e2', // red-100
    btnTextColor: '#ef4444', // red-500
    btnBorderColor: '#fef2f2', // red-50
    btnIcon: XIcon,
    btnLabel: 'Tutup',
    defaultTitle: 'Terjadi Kesalahan',
  },
  warning: {
    icon: AlertTriangleIcon,
    iconColor: '#f59e0b', // amber-500
    iconBgColor: '#fef3c7', // amber-100
    btnTextColor: '#d97706', // amber-600
    btnBorderColor: '#fffbeb', // amber-50
    btnIcon: XIcon,
    btnLabel: 'Tutup',
    defaultTitle: 'Peringatan',
  },
  confirm: {
    icon: AlertTriangleIcon,
    iconColor: '#3b82f6', // blue-500
    iconBgColor: '#dbeafe', // blue-100
    btnTextColor: '#3b82f6',
    btnBorderColor: '#eff6ff',
    btnIcon: CheckIcon,
    btnLabel: 'Ya',
    defaultTitle: 'Konfirmasi',
    showCancel: true,
  },
};

export default function NotificationPopup({
  visible,
  message,
  title,
  type = 'error',
  onClose,
  onConfirm,
}) {
  const [scaleAnim] = React.useState(new Animated.Value(0.9));
  const [opacityAnim] = React.useState(new Animated.Value(0));

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 50,
          friction: 7,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(0.9);
      opacityAnim.setValue(0);
    }
  }, [visible, scaleAnim, opacityAnim]);

  if (!visible) return null;

  const v = VARIANTS[type] || VARIANTS.error;
  const Icon = v.icon;
  const BtnIcon = v.btnIcon;
  const displayTitle = title || v.defaultTitle;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill}>
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.popupContainer,
            {
              opacity: opacityAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Body */}
          <View style={styles.body}>
            <View style={[styles.iconWrapper, { backgroundColor: v.iconBgColor }]}>
              <Icon color={v.iconColor} size={28} />
            </View>
            <AppText style={styles.title}>{displayTitle}</AppText>
            <AppText style={styles.message}>{message}</AppText>
          </View>

          {/* Action button */}
          {v.showCancel ? (
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.buttonHalf, { borderRightWidth: 1, borderRightColor: '#f3f4f6' }]}
                activeOpacity={0.7}
                onPress={onClose}
              >
                <AppText style={[styles.buttonText, { color: '#6b7280' }]}>
                  Batal
                </AppText>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonHalf}
                activeOpacity={0.7}
                onPress={onConfirm}
              >
                <AppText style={[styles.buttonText, { color: v.iconColor, fontWeight: '700' }]}>
                  {v.btnLabel}
                </AppText>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.button, { borderTopColor: v.btnBorderColor }]}
              activeOpacity={0.7}
              onPress={onClose}
            >
              <BtnIcon color={v.btnTextColor} size={15} />
              <AppText style={[styles.buttonText, { color: v.btnTextColor }]}>
                {v.btnLabel}
              </AppText>
            </TouchableOpacity>
          )}
        </Animated.View>
      </View>
      </BlurView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  popupContainer: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
  },
  body: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
    alignItems: 'center',
  },
  iconWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 6,
    textAlign: 'center',
  },
  message: {
    fontSize: 13,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  button: {
    width: '100%',
    paddingVertical: 14,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  buttonText: {
    fontSize: 13,
    fontWeight: '500',
    marginLeft: 6,
  },
  buttonRow: {
    width: '100%',
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  buttonHalf: {
    flex: 1,
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
});
