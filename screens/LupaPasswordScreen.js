import React, { useState } from 'react';
import AppText from '../components/AppText';
import { View, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
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

export default function LupaPasswordScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleKirimLink = async () => {
    if (!email) {
      Alert.alert('Peringatan', 'Silakan masukkan email Anda terlebih dahulu.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const json = await response.json();

      if (response.ok && json.success) {
        setIsSuccess(true);
      } else {
        let msg = json.message || 'Gagal mengirim link. Pastikan email terdaftar.';
        if (json.errors && json.errors.email) {
            msg = json.errors.email[0];
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
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <ChevronLeft />
          <AppText style={styles.headerTitle}>Lupa Password</AppText>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {isSuccess ? (
            <View style={styles.successContainer}>
              <View style={styles.iconCircle}>
                <Svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={PRIMARY} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <Path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <Path d="M22 4L12 14.01l-3-3" />
                </Svg>
              </View>
              <AppText style={styles.successTitle}>Cek Email Anda</AppText>
              <AppText style={styles.successDesc}>
                Kami telah mengirimkan tautan untuk mengatur ulang kata sandi Anda ke <AppText style={{fontWeight: '700'}}>{email}</AppText>.
              </AppText>
              <TouchableOpacity style={styles.primaryBtn} onPress={() => navigation.goBack()}>
                <AppText style={styles.primaryBtnText}>Kembali ke Login</AppText>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.formContainer}>
              <AppText style={styles.title}>Atur Ulang Password</AppText>
              <AppText style={styles.desc}>
                Masukkan email yang terdaftar pada akun Anda. Kami akan mengirimkan tautan untuk mengatur ulang kata sandi.
              </AppText>

              <AppText style={styles.label}>Email Terdaftar</AppText>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Contoh: mahasiswa@email.com"
                  placeholderTextColor="#BDBDBD"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>

              <TouchableOpacity style={styles.primaryBtn} onPress={handleKirimLink} disabled={isLoading}>
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <AppText style={styles.primaryBtnText}>Kirim Tautan</AppText>
                )}
              </TouchableOpacity>
            </View>
          )}
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
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 24,
    paddingHorizontal: 16,
    height: 48,
    justifyContent: 'center',
  },
  input: { fontSize: 15, color: '#374151', height: '100%', padding: 0 },
  primaryBtn: {
    backgroundColor: PRIMARY,
    borderRadius: 8,
    height: 48,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  successTitle: { fontSize: 24, fontWeight: '700', color: '#111827', marginBottom: 12, textAlign: 'center' },
  successDesc: { fontSize: 14, color: '#6B7280', lineHeight: 22, textAlign: 'center', marginBottom: 32 },
});
