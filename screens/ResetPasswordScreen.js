import React, { useState } from 'react';
import AppText from '../components/AppText';
import { View, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { API_BASE_URL } from '../config/api';

const PRIMARY = '#116E63';
const BG = '#F8FAFC';

const ChevronLeft = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M15 18l-6-6 6-6" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const EyeIcon = ({ size = 20, color = '#6B7280' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <Path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
  </Svg>
);

const EyeOffIcon = ({ size = 20, color = '#6B7280' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
    <Path d="M1 1l22 22" />
  </Svg>
);

export default function ResetPasswordScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  // Ambil token dan email dari deep link url params
  const { token, email } = route.params || {};

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!token || !email) {
      Alert.alert('Gagal', 'Tautan tidak valid. Silakan minta tautan baru.');
      return;
    }

    if (!password || !confirmPassword) {
      Alert.alert('Gagal', 'Semua kolom harus diisi.');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Gagal', 'Kata sandi baru minimal 8 karakter.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Gagal', 'Konfirmasi kata sandi tidak cocok.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          token,
          email,
          password,
          password_confirmation: confirmPassword,
        }),
      });

      const json = await response.json();

      if (response.ok && json.success) {
        Alert.alert('Sukses', 'Kata sandi Anda berhasil diatur ulang. Silakan masuk dengan kata sandi baru Anda.', [
          { text: 'OK', onPress: () => navigation.navigate('Login') }
        ]);
      } else {
        let msg = json.message || 'Gagal mengatur ulang kata sandi.';
        if (json.errors) {
            // Ambil pesan error validasi pertama jika ada
            msg = Object.values(json.errors)[0][0];
        }
        Alert.alert('Gagal', msg);
      }
    } catch (error) {
      Alert.alert('Error', 'Gagal terhubung ke server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.navigate('Login')} activeOpacity={0.7}>
          <ChevronLeft />
          <AppText style={styles.headerTitle}>Reset Password</AppText>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.formContainer}>
            <AppText style={styles.title}>Buat Password Baru</AppText>
            <AppText style={styles.desc}>
              Kata sandi baru Anda harus unik dan tidak pernah digunakan sebelumnya. Minimal 8 karakter dan mengandung huruf.
            </AppText>

            <AppText style={styles.label}>Email</AppText>
            <View style={[styles.inputWrapper, { backgroundColor: '#F3F4F6' }]}>
              <TextInput
                style={[styles.input, { color: '#6B7280' }]}
                value={email || 'Email tidak ditemukan'}
                editable={false}
              />
            </View>

            <AppText style={styles.label}>Kata Sandi Baru</AppText>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Masukkan kata sandi baru"
                placeholderTextColor="#BDBDBD"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIconBtn}>
                {showPassword ? <EyeIcon size={20} /> : <EyeOffIcon size={20} />}
              </TouchableOpacity>
            </View>

            <AppText style={styles.label}>Konfirmasi Kata Sandi Baru</AppText>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Konfirmasi kata sandi baru"
                placeholderTextColor="#BDBDBD"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIconBtn}>
                {showConfirmPassword ? <EyeIcon size={20} /> : <EyeOffIcon size={20} />}
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.primaryBtn} onPress={handleResetPassword} disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <AppText style={styles.primaryBtnText}>Simpan Password Baru</AppText>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: BG },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backBtn: { flexDirection: 'row', alignItems: 'center' },
  headerTitle: { fontSize: 16, fontWeight: '600', color: '#111827', marginLeft: 8 },
  scrollContent: { paddingHorizontal: 24, paddingTop: 32, paddingBottom: 40 },
  formContainer: { flex: 1 },
  title: { fontSize: 24, fontWeight: '700', color: '#111827', marginBottom: 12 },
  desc: { fontSize: 14, color: '#6B7280', lineHeight: 22, marginBottom: 32 },
  label: { fontSize: 14, color: '#4A4A4A', fontWeight: '600', marginBottom: 8 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 24,
    paddingHorizontal: 16,
    height: 48,
  },
  input: { flex: 1, fontSize: 15, color: '#374151', height: '100%', padding: 0 },
  eyeIconBtn: { padding: 4, marginLeft: 8 },
  primaryBtn: {
    backgroundColor: PRIMARY,
    borderRadius: 8,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  primaryBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});
