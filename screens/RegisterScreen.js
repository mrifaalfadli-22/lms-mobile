import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Circle, Ellipse } from 'react-native-svg';

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
    <Ellipse cx={width} cy={50} rx={140} ry={150} fill="rgba(178,232,220,0.60)" />
    {/* Medium blob overlapping */}
    <Ellipse cx={width * 0.62} cy={height * 0.15} rx={110} ry={100} fill="rgba(178,232,220,0.40)" />
  </Svg>
);

export default function RegisterScreen({ navigation }) {
  const [form, setForm] = useState({
    nama: '',
    universitas: '',
    alamatEmail: '', // This label is "Alamat email" in the mockup
    npm: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = () => {
    // Navigasi ke Main/Login setelah daftar
    navigation.replace('Main', { screen: 'Home', params: { isRegistered: true } });
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
          {/* ── Header ── */}
          <View style={styles.headerContainer}>
            <Text style={styles.headline}>Buat akun</Text>
            <Text style={styles.subheadline}>
              Isi data diri di bawah untuk mendaftarkan{'\n'}diri kamu
            </Text>
          </View>

          {/* ── Form ── */}
          <View style={styles.form}>
            {/* Nama lengkap */}
            <Text style={styles.label}>Nama lengkap</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                value={form.nama}
                onChangeText={(v) => setForm({ ...form, nama: v })}
                autoCapitalize="words"
              />
            </View>

            {/* Universitas asal */}
            <Text style={styles.label}>Universitas asal</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                value={form.universitas}
                onChangeText={(v) => setForm({ ...form, universitas: v })}
              />
            </View>

            {/* Alamat email */}
            <Text style={styles.label}>Alamat email</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                value={form.alamatEmail}
                onChangeText={(v) => setForm({ ...form, alamatEmail: v })}
              />
            </View>

            {/* Masukkan NPM */}
            <Text style={styles.label}>Masukkan NPM</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                value={form.npm}
                onChangeText={(v) => setForm({ ...form, npm: v })}
                keyboardType="numeric"
              />
            </View>



            {/* Password */}
            <Text style={styles.label}>Password</Text>
            <View style={[styles.inputWrapper, styles.passwordWrapper]}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                value={form.password}
                onChangeText={(v) => setForm({ ...form, password: v })}
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

            {/* Daftar Button */}
            <TouchableOpacity
              style={styles.primaryBtn}
              activeOpacity={0.85}
              onPress={handleRegister}
            >
              <Text style={styles.primaryBtnText}>Daftar</Text>
            </TouchableOpacity>

            {/* Login Link */}
            <View style={styles.loginLinkContainer}>
              <Text style={styles.loginLinkText}>Sudah punya akun? </Text>
              <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLinkAction}>Masuk sekarang</Text>
              </TouchableOpacity>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 40,
    paddingBottom: 20,
    justifyContent: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  headline: {
    fontSize: 26,
    fontWeight: '800',
    color: '#000000',
    marginBottom: 8,
  },
  subheadline: {
    fontSize: 13,
    color: '#333333',
    textAlign: 'center',
    lineHeight: 20,
  },
  form: {
    paddingHorizontal: 24,
  },
  label: {
    fontSize: 14,
    color: '#4A4A4A',
    marginBottom: 4,
    fontWeight: '600',
  },
  inputWrapper: {
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
    paddingHorizontal: 14,
    height: 44,
    justifyContent: 'center',
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
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
  primaryBtn: {
    backgroundColor: PRIMARY,
    borderRadius: 50,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
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
  },
  loginLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginLinkText: {
    fontSize: 13,
    color: '#6B7280',
  },
  loginLinkAction: {
    fontSize: 13,
    color: PRIMARY,
    fontWeight: '700',
  },
});
