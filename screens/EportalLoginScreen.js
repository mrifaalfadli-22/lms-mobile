import { API_BASE_URL, EPORTAL_API_URL } from '../config/api';
import React, { useState } from 'react';
import AppText from '../components/AppText';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNotification } from '../context/NotificationContext';

const PRIMARY = '#116E63';

export default function EportalLoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      console.error('Eportal Login Error: ', error);
      showError('Tidak dapat terhubung ke server. Periksa koneksi internet Anda.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5FAFA" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <AppText style={styles.headline}>Masuk dengan{'\n'}Akun E-Portal</AppText>
          <AppText style={styles.subheadline}>
            Gunakan email dan password akun E-Portal UIKA Anda untuk masuk ke u-Cademy.
          </AppText>

          <View style={styles.form}>
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

            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#BDBDBD"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
              />
            </View>

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

            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
              <AppText style={styles.backText}>Kembali</AppText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5FAFA',
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 40,
    paddingBottom: 20,
  },
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
  form: {
    paddingHorizontal: 20,
  },
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
  input: {
    fontSize: 14,
    color: '#374151',
    height: '100%',
    padding: 0,
  },
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
  backBtn: {
    alignItems: 'center',
    marginTop: 4,
  },
  backText: {
    color: PRIMARY,
    fontSize: 14,
    fontWeight: '600',
  },
});
