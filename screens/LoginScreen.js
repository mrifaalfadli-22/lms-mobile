import { API_BASE_URL, EPORTAL_API_URL } from '../config/api';
import React, { useState } from 'react';
import AppText from '../components/AppText';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Circle, Ellipse } from 'react-native-svg';
import { useNotification } from '../context/NotificationContext';

const { width, height } = Dimensions.get('window');

const PRIMARY = '#116E63';

// ── Eye icon ───────────────────────────────────────────────────────────────────
const EyeIcon = ({ visible }) =>
  visible ? (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <Circle cx="12" cy="12" r="3" stroke="#9CA3AF" strokeWidth="2" />
    </Svg>
  ) : (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );

// ── Background blobs ───────────────────────────────────────────────────────────
const BackgroundBlobs = () => (
  <Svg
    style={StyleSheet.absoluteFill}
    width={width}
    height={height * 0.5}
    viewBox={`0 0 ${width} ${height * 0.5}`}
    pointerEvents="none"
  >
    {/* Large teal blob — top right */}
    <Ellipse cx={width + 10} cy={-20} rx={120} ry={130} fill="rgba(178,232,220,0.60)" />
    {/* Medium blob behind illustration */}
    <Ellipse cx={width * 0.62} cy={height * 0.18} rx={90} ry={95} fill="rgba(178,232,220,0.40)" />
    {/* Accent dots */}
    <Circle cx={width - 118} cy={58} r={7} fill="rgba(48,156,130,0.55)" />
    <Circle cx={width - 40} cy={155} r={5} fill="rgba(48,156,130,0.45)" />
    <Circle cx={width * 0.42} cy={height * 0.25} r={5} fill="rgba(48,156,130,0.45)" />
  </Svg>
);

// ── LoginScreen ────────────────────────────────────────────────────────────────
export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { showError, showWarning } = useNotification();

  const handleLogin = async () => {
    if (email.trim() === '' || password.trim() === '') {
      showWarning('Silakan masukkan email dan password akun E-Portal Anda.');
      return;
    }

    setIsLoading(true);

    try {
      const eportalResponse = await fetch(`${EPORTAL_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const eportalJson = await eportalResponse.json();

      if (!eportalResponse.ok || !eportalJson?.data?.uika_sso_token) {
        showError(eportalJson?.message || 'Email atau password E-Portal salah.');
        setIsLoading(false);
        return;
      }

      const lmsResponse = await fetch(`${API_BASE_URL}/api/sso/mobile-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ token: eportalJson.data.uika_sso_token }),
      });

      const lmsJson = await lmsResponse.json();

      if (lmsResponse.ok && lmsJson.status === 'success') {
        navigation.replace('Main', {
          isRegistered: true,
          user: lmsJson.data.user,
          token: lmsJson.data.token,
        });
      } else {
        showError(lmsJson.message || 'Gagal masuk ke LMS dengan akun E-Portal.');
      }
    } catch (error) {
      console.error('Login Error: ', error);
      showError('Tidak dapat terhubung ke server. Periksa koneksi internet Anda.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5FAFA" />

      {/* Background blobs — absolute overlay */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <BackgroundBlobs />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* ── Illustration ── */}
          <View style={styles.illustrationContainer}>
            <Image
              source={require('../assets/login-illustration.png')}
              style={styles.illustrationImage}
              resizeMode="contain"
            />
          </View>

          {/* ── Headline ── */}
          <AppText style={styles.headline}>Masuk dengan{'\n'}Akun E-Portal</AppText>
          <AppText style={styles.subheadline}>
            Gunakan email dan password akun E-Portal UIKA Anda{'\n'}untuk masuk ke u-Cademy.
          </AppText>

          {/* ── Form ── */}
          <View style={styles.form}>

            {/* Email */}
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Email E-Portal"
                placeholderTextColor="#BDBDBD"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            {/* Password */}
            <View style={[styles.inputWrapper, styles.passwordWrapper]}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Masukkan Password"
                placeholderTextColor="#BDBDBD"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeBtn}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <EyeIcon visible={showPassword} />
              </TouchableOpacity>
            </View>

            {/* Masuk */}
            <TouchableOpacity
              style={styles.primaryBtn}
              activeOpacity={0.85}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <AppText style={styles.primaryBtnText}>Masuk</AppText>
              )}
            </TouchableOpacity>

            {/* Login as Guest */}
            <TouchableOpacity
              style={styles.secondaryBtn}
              activeOpacity={0.8}
              onPress={() => navigation.replace('Main')}
            >
              <AppText style={styles.secondaryBtnText}>Login as Guest</AppText>
            </TouchableOpacity>

          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5FAFA',
  },

  scrollContent: {
    flexGrow: 1,
    paddingTop: 10,
    paddingBottom: 20,
  },

  // ── Illustration ──
  illustrationContainer: {
    alignItems: 'flex-start',
    paddingLeft: 12,
    marginTop: 20,
    marginBottom: 20,
  },
  illustrationImage: {
    width: width * 0.58,
    height: height * 0.22,
  },

  // ── Typography ──
  headline: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    marginHorizontal: 24,
    lineHeight: 32,
    letterSpacing: -0.3,
    marginBottom: 10,
  },
  subheadline: {
    fontSize: 14,
    color: '#6B7280',
    marginHorizontal: 24,
    lineHeight: 20,
    marginBottom: 32,
  },

  // ── Form ──
  form: {
    paddingHorizontal: 20,
  },

  // Inputs
  inputWrapper: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
    paddingHorizontal: 14,
    height: 48,
    justifyContent: 'center',
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    fontSize: 14,
    color: '#374151',
    height: '100%',
    padding: 0,
  },
  eyeBtn: {
    paddingLeft: 8,
  },

  // Tombol Masuk
  primaryBtn: {
    backgroundColor: PRIMARY,
    borderRadius: 50,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    elevation: 3,
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  // Tombol Guest
  secondaryBtn: {
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    borderRadius: 50,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    marginBottom: 24,
  },
  secondaryBtnText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '500',
  },
});
