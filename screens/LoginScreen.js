import { API_BASE_URL } from '../config/api';
import React, { useState, useEffect } from 'react';
import AppText from '../components/AppText';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
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
import NotificationPopup from '../components/NotificationPopup';

const { width, height } = Dimensions.get('window');

const PRIMARY = '#116E63';
const LINK_COLOR = '#116E63';

// ── Google "G" logo ────────────────────────────────────────────────────────────
const GoogleIcon = () => (
  <Svg width="22" height="22" viewBox="0 0 24 24">
    <Path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <Path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <Path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
    <Path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </Svg>
);

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
WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen({ navigation }) {
  const [npm, setNpm] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleDeepLink = async (event) => {
      let data = Linking.parse(event.url);
      if (data.path === 'auth/callback' || event.url.includes('auth/callback')) {
        WebBrowser.dismissBrowser();
        
        const { token, error } = data.queryParams || {};
        
        if (error) {
          showPopup('Gagal Masuk', error, 'error');
        } else if (token) {
          setIsLoading(true);
          try {
            const profileResponse = await fetch(`${API_BASE_URL}/api/profile`, {
              method: 'GET',
              headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
              }
            });

            const profileJson = await profileResponse.json();

            if (profileResponse.ok && profileJson.success) {
              navigation.replace('Main', {
                isRegistered: true,
                user: profileJson.data,
                token: token
              });
            } else {
              showPopup('Gagal Masuk', 'Gagal mengambil data profil Google Anda.', 'error');
            }
          } catch (error) {
            showPopup('Gagal Masuk', 'Terjadi kesalahan jaringan.', 'error');
          } finally {
            setIsLoading(false);
          }
        }
      }
    };

    const subscription = Linking.addEventListener('url', handleDeepLink);
    
    // Check initial URL just in case the app was fully killed and launched via the link
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url });
    });

    return () => subscription.remove();
  }, [navigation]);


  // State untuk Notification Popup
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupConfig, setPopupConfig] = useState({ title: '', message: '', type: 'error' });

  const showPopup = (title, message, type = 'error') => {
    setPopupConfig({ title, message, type });
    setPopupVisible(true);
  };

  const handleGoogleLogin = async () => {
    try {
      const authUrl = `${API_BASE_URL}/api/auth/google/redirect?source=mobile`;
      // Use lms://auth/callback directly as a fallback format to match the backend
      const redirectUrl = Linking.createURL('/auth/callback');

      const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUrl);

      // result.type === 'success' normally triggers if WebBrowser catches it natively
      if (result.type === 'success' && result.url) {
        const params = Linking.parse(result.url);
        const { token, error } = params.queryParams;

        if (error) {
          showPopup('Gagal Masuk', error, 'error');
        } else if (token) {
          setIsLoading(true);
          const profileResponse = await fetch(`${API_BASE_URL}/api/profile`, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });

          const profileJson = await profileResponse.json();

          if (profileResponse.ok && profileJson.success) {
            navigation.replace('Main', {
              isRegistered: true,
              user: profileJson.data,
              token: token
            });
          } else {
            showPopup('Gagal Masuk', 'Gagal mengambil data profil Google Anda.', 'error');
          }
          setIsLoading(false);
        }
      }
    } catch (e) {
      console.error(e);
      showPopup('Gagal Masuk', 'Gagal membuka halaman login Google.', 'error');
    }
  };

  const handleLogin = async () => {
    if (npm.trim() === '' || password.trim() === '') {
      showPopup('Gagal Masuk', 'Silakan masukkan NPM dan Password Anda terlebih dahulu.', 'warning');
      return;
    }

    setIsLoading(true);

    try {
      // Endpoint API backend Laravel Anda. 
      // Ganti dengan IP lokal Anda jika menggunakan physical device (contoh: http://192.168.1.100:8000/api/login)
      // Gunakan 10.0.2.2 untuk Android Emulator.
      const API_URL = Platform.OS === 'android' ? `${API_BASE_URL}/api/login` : `http://localhost:8000/api/login`;

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          identifier: npm, // Backend menerima 'identifier' (yang memproses NPM / nomor_induk)
          password: password,
        }),
      });

      const jsonResponse = await response.json();

      if (response.status === 200 && jsonResponse.status === 'success') {
        // Jika login berhasil
        const token = jsonResponse.data.token;

        navigation.replace('Main', {
          isRegistered: true,
          user: jsonResponse.data.user,
          token: token
        });
      } else {
        // Tampilkan error (kredensial salah, akun dinonaktifkan, dll)
        showPopup('Gagal Masuk', jsonResponse.message || 'NPM atau Password yang Anda masukkan salah.', 'error');
      }
    } catch (error) {
      console.error("Login Error: ", error);
      showPopup('Kesalahan', 'Tidak dapat terhubung ke server. Pastikan backend Laravel sudah berjalan dan URL API sesuai.', 'error');
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
          <AppText style={styles.headline}>Yuk, Daftar di U-Cademy{'\n'}GRATIS!</AppText>
          <AppText style={styles.subheadline}>
            Akses ratusan materi kuliah dan beragam fitur{'\n'}menarik lainnya sekarang !
          </AppText>

          {/* ── Form ── */}
          <View style={styles.form}>

            {/* NPM */}
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Masukkan NPM kamu"
                placeholderTextColor="#BDBDBD"
                value={npm}
                onChangeText={setNpm}
                autoCapitalize="none"
                keyboardType="numeric"
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

            {/* Lupa Password */}
            <TouchableOpacity style={styles.forgotBtn} onPress={() => navigation.navigate('LupaPassword')}>
              <AppText style={styles.forgotText}>Lupa Password</AppText>
            </TouchableOpacity>

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

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <AppText style={styles.dividerText}>Atau masuk dengan</AppText>
              <View style={styles.dividerLine} />
            </View>

            {/* Google SSO */}
            <TouchableOpacity style={styles.googleBtn} activeOpacity={0.8} onPress={handleGoogleLogin}>
              <View style={styles.googleIconBox}>
                <GoogleIcon />
              </View>
              <AppText style={styles.googleBtnText}>Masuk dengan Google</AppText>
            </TouchableOpacity>

          </View>

          {/* Sign-up link */}
          <View style={styles.signupRow}>
            <AppText style={styles.signupText}>Tidak punya akun? </AppText>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <AppText style={styles.signupLink}>Buat sekarang</AppText>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>

      <NotificationPopup
        visible={popupVisible}
        title={popupConfig.title}
        message={popupConfig.message}
        type={popupConfig.type}
        onClose={() => setPopupVisible(false)}
      />
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

  // Lupa Password
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: 28,
    marginTop: -8,
  },
  forgotText: {
    color: LINK_COLOR,
    fontSize: 13,
    fontWeight: '600',
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

  // Divider
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 14,
    color: '#9CA3AF',
  },

  // Google button
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    height: 48,
    paddingHorizontal: 14,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  googleIconBox: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  googleBtnText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginRight: 32, // Compensate for icon width to keep text centered
  },

  // Sign-up
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 18,
  },
  signupText: {
    fontSize: 14,
    color: '#6B7280',
  },
  signupLink: {
    fontSize: 14,
    color: LINK_COLOR,
    fontWeight: '700',
  },
});
