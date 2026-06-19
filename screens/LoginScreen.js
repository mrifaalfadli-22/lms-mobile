import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Image,
} from 'react-native';
import Svg, {
  Path,
  Circle,
  Ellipse,
} from 'react-native-svg';

const { width, height } = Dimensions.get('window');

// ── Google "G" logo (official colors) ─────────────────────────────────────────
const GoogleIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24">
    <Path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <Path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <Path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      fill="#FBBC05"
    />
    <Path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </Svg>
);

// ── Eye / Eye-Off icon ────────────────────────────────────────────────────────
const EyeIcon = ({ visible }) =>
  visible ? (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Path
        d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
        stroke="#9CA3AF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx="12" cy="12" r="3" stroke="#9CA3AF" strokeWidth="2" />
    </Svg>
  ) : (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Path
        d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22"
        stroke="#9CA3AF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );

// ── Background blobs ──────────────────────────────────────────────────────────
const BackgroundBlobs = () => (
  <Svg
    style={StyleSheet.absoluteFill}
    width={width}
    height={height * 0.45}
    viewBox={`0 0 ${width} ${height * 0.45}`}
  >
    <Ellipse
      cx={width - 20}
      cy={-10}
      rx={100}
      ry={110}
      fill="rgba(178,232,220,0.55)"
    />
    <Circle cx={width - 130} cy={70} r={7} fill="rgba(78,170,140,0.6)" />
    <Circle cx={width - 45} cy={140} r={5} fill="rgba(78,170,140,0.5)" />
  </Svg>
);

// ── Main LoginScreen ──────────────────────────────────────────────────────────
export default function LoginScreen({ navigation }) {
  const [npm, setNpm] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F7FAFA" />

      {/* Background blobs — absolute, tidak pengaruhi layout */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <BackgroundBlobs />
      </View>

      {/* ── Illustration (pojok kiri, flex shrink kalau layar kecil) ── */}
      <View style={styles.illustrationContainer}>
        <Image
          source={require('../assets/login-illustration.png')}
          style={styles.illustrationImage}
          resizeMode="contain"
        />
      </View>

      {/* ── Content area ── */}
      <View style={styles.content}>

        {/* Headline */}
        <Text style={styles.headline}>Yuk, Daftar di U-Cademy{'\n'}GRATIS!</Text>
        <Text style={styles.subheadline}>
          Akses ratusan materi kuliah dan beragam fitur menarik lainnya sekarang !
        </Text>

        {/* Form */}
        <View style={styles.form}>

          {/* NPM Input */}
          <View style={styles.inputWrapper}>
            <TextInput
              id="npm-input"
              style={styles.input}
              placeholder="Masukkan NPM kamu"
              placeholderTextColor="#9CA3AF"
              value={npm}
              onChangeText={setNpm}
              autoCapitalize="none"
              keyboardType="numeric"
            />
          </View>

          {/* Password Input */}
          <View style={[styles.inputWrapper, styles.passwordWrapper]}>
            <TextInput
              id="password-input"
              style={[styles.input, { flex: 1 }]}
              placeholder="Masukkan Password"
              placeholderTextColor="#9CA3AF"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity
              id="toggle-password-btn"
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeBtn}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <EyeIcon visible={showPassword} />
            </TouchableOpacity>
          </View>

          {/* Lupa Password */}
          <TouchableOpacity
            id="forgot-password-btn"
            style={styles.forgotBtn}
            onPress={() => {}}
          >
            <Text style={styles.forgotText}>Lupa Password</Text>
          </TouchableOpacity>

          {/* Masuk */}
          <TouchableOpacity
            id="login-btn"
            style={styles.primaryBtn}
            activeOpacity={0.85}
            onPress={() => {}}
          >
            <Text style={styles.primaryBtnText}>Masuk</Text>
          </TouchableOpacity>

          {/* Login as Guest */}
          <TouchableOpacity
            id="guest-login-btn"
            style={styles.secondaryBtn}
            activeOpacity={0.8}
            onPress={() => navigation.replace('Main')}
          >
            <Text style={styles.secondaryBtnText}>Login as Guest</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>Atau masuk dengan</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Google SSO */}
          <TouchableOpacity
            id="google-login-btn"
            style={styles.googleBtn}
            activeOpacity={0.8}
            onPress={() => {}}
          >
            <View style={styles.googleIconBox}>
              <GoogleIcon />
            </View>
            <Text style={styles.googleBtnText}>Masuk dengan Google</Text>
          </TouchableOpacity>
        </View>

        {/* Sign-up link */}
        <View style={styles.signupRow}>
          <Text style={styles.signupText}>Tidak punya akun? </Text>
          <TouchableOpacity id="signup-btn" onPress={() => {}}>
            <Text style={styles.signupLink}>Buat sekarang</Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const PRIMARY = '#116E63';
const LINK_COLOR = '#116E63';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7FAFA',
  },

  // Illustration — pojok kiri, tinggi proporsional ~23% layar
  illustrationContainer: {
    alignItems: 'flex-start',
    paddingLeft: 0,
  },
  illustrationImage: {
    width: width * 0.65,
    height: height * 0.23,
  },

  // Content flex, mengisi sisa layar
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 16,
  },

  // Typography
  headline: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1A1A2E',
    marginHorizontal: 24,
    lineHeight: 32,
    letterSpacing: -0.3,
  },
  subheadline: {
    fontSize: 13,
    color: '#6B7280',
    marginHorizontal: 24,
    marginTop: 6,
    lineHeight: 19,
  },

  // Form
  form: {
    paddingHorizontal: 24,
    marginTop: 16,
  },

  // Inputs
  inputWrapper: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
    paddingHorizontal: 14,
    height: 48,
    justifyContent: 'center',
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    fontSize: 13,
    color: '#374151',
    height: '100%',
  },
  eyeBtn: {
    paddingLeft: 8,
  },

  // Lupa Password
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: 14,
    marginTop: -4,
  },
  forgotText: {
    color: LINK_COLOR,
    fontSize: 12,
    fontWeight: '600',
  },

  // Tombol Masuk
  primaryBtn: {
    backgroundColor: PRIMARY,
    borderRadius: 50,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 12,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
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
    marginBottom: 14,
  },
  secondaryBtnText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '500',
    textDecorationLine: 'none',
  },

  // Divider
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    marginHorizontal: 10,
    fontSize: 12,
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
    height: 50,
    paddingHorizontal: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  googleIconBox: {
    width: 34,
    height: 34,
    borderRadius: 6,
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  googleBtnText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },

  // Sign-up
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  signupText: {
    fontSize: 12,
    color: '#6B7280',
  },
  signupLink: {
    fontSize: 12,
    color: LINK_COLOR,
    fontWeight: '700',
  },
});
