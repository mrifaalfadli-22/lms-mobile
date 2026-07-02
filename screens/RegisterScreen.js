import React, { useState } from 'react';
import AppText from '../components/AppText';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
  FlatList,
  Alert,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Circle, Ellipse } from 'react-native-svg';
import { fakultasData } from '../data/fakultasData';
import { API_BASE_URL } from '../config/api';

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
    npm: '',
    email: '',
    fakultas: '',
    programStudi: '',
    tahunAngkatan: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  // ── Modal & Select Logic ──
  const [modalType, setModalType] = useState(null); // 'fakultas' | 'prodi' | null
  const [searchText, setSearchText] = useState('');

  const filteredFakultas = fakultasData.filter((f) =>
    f.label.toLowerCase().includes(searchText.toLowerCase())
  );
  const selectedFakultasObj = fakultasData.find((f) => f.label === form.fakultas);
  const prodiList = selectedFakultasObj ? selectedFakultasObj.prodi : [];
  const filteredProdi = prodiList.filter((p) =>
    p.label.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleSelectFakultas = (fakultasLabel) => {
    setForm({ ...form, fakultas: fakultasLabel, programStudi: '' });
    setModalType(null);
    setSearchText('');
  };

  const handleSelectProdi = (prodiLabel) => {
    setForm({ ...form, programStudi: prodiLabel });
    setModalType(null);
    setSearchText('');
  };

  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!form.nama || !form.npm || !form.email || !form.password || !form.fakultas || !form.programStudi || !form.tahunAngkatan) {
      Alert.alert('Gagal', 'Harap isi semua kolom terlebih dahulu.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/register/mahasiswa`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          nama_lengkap: form.nama,
          npm: form.npm,
          email: form.email,
          fakultas: form.fakultas,
          prodi: form.programStudi,
          angkatan: form.tahunAngkatan,
          password: form.password,
          password_confirmation: form.password
        })
      });

      const json = await response.json();

      if (response.status === 201 && json.success) {
        Alert.alert('Sukses', json.message || 'Pendaftaran berhasil. Silakan login.', [
          { text: 'OK', onPress: () => navigation.replace('Login') }
        ]);
      } else {
        let errorMessage = json.message || 'Pendaftaran gagal.';
        if (json.errors) {
          const firstErrorKey = Object.keys(json.errors)[0];
          errorMessage = json.errors[firstErrorKey][0];
        }
        Alert.alert('Gagal', errorMessage);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Terjadi kesalahan jaringan.');
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
          {/* ── Header ── */}
          <View style={styles.headerContainer}>
            <AppText style={styles.headline}>Buat akun</AppText>
            <AppText style={styles.subheadline}>
              Isi data diri di bawah untuk mendaftarkan{'\n'}diri kamu
            </AppText>
          </View>

          {/* ── Form ── */}
          <View style={styles.form}>
            {/* Nama lengkap */}
            <AppText style={styles.label}>Nama Lengkap</AppText>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                value={form.nama}
                onChangeText={(v) => setForm({ ...form, nama: v })}
                autoCapitalize="words"
              />
            </View>

            {/* Baris 1: NPM & Tahun Angkatan */}
            <View style={styles.row}>
              <View style={styles.half}>
                <AppText style={styles.label}>NPM</AppText>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    value={form.npm}
                    onChangeText={(v) => setForm({ ...form, npm: v })}
                    keyboardType="numeric"
                  />
                </View>
              </View>
              <View style={styles.spacer} />
              <View style={styles.half}>
                <AppText style={styles.label}>Tahun Angkatan</AppText>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    value={form.tahunAngkatan}
                    onChangeText={(v) => setForm({ ...form, tahunAngkatan: v })}
                    keyboardType="numeric"
                  />
                </View>
              </View>
            </View>

            {/* Fakultas */}
            <AppText style={styles.label}>Fakultas</AppText>
            <TouchableOpacity
              style={styles.inputWrapper}
              activeOpacity={0.8}
              onPress={() => {
                setSearchText('');
                setModalType('fakultas');
              }}
            >
              <AppText style={[styles.selectText, !form.fakultas && { color: '#9CA3AF' }]} numberOfLines={1}>
                {form.fakultas || 'Pilih...'}
              </AppText>
            </TouchableOpacity>

            {/* Program Studi */}
            <AppText style={styles.label}>Program Studi</AppText>
            <TouchableOpacity
              style={styles.inputWrapper}
              activeOpacity={0.8}
              onPress={() => {
                if (form.fakultas) {
                  setSearchText('');
                  setModalType('prodi');
                }
              }}
            >
              <AppText style={[styles.selectText, (!form.programStudi || !form.fakultas) && { color: '#9CA3AF' }]} numberOfLines={1}>
                {!form.fakultas ? 'Pilih Fakultas Terlebih Dahulu' : form.programStudi || 'Pilih...'}
              </AppText>
            </TouchableOpacity>

            {/* Email */}
            <AppText style={styles.label}>Email</AppText>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                value={form.email}
                onChangeText={(v) => setForm({ ...form, email: v })}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Password */}
            <AppText style={styles.label}>Password</AppText>
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
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <AppText style={styles.primaryBtnText}>Daftar</AppText>
              )}
            </TouchableOpacity>

            {/* Login Link */}
            <View style={styles.loginLinkContainer}>
              <AppText style={styles.loginLinkText}>Sudah punya akun? </AppText>
              <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('Login')}>
                <AppText style={styles.loginLinkAction}>Masuk sekarang</AppText>
              </TouchableOpacity>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ── Modal for Searchable Select ── */}
      <Modal visible={modalType !== null} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <AppText style={styles.modalTitle}>
                {modalType === 'fakultas' ? 'Pilih Fakultas' : 'Pilih Program Studi'}
              </AppText>
              <TouchableOpacity onPress={() => setModalType(null)}>
                <AppText style={styles.closeBtn}>Tutup</AppText>
              </TouchableOpacity>
            </View>

            <View style={styles.modalSearchWrapper}>
              <TextInput
                style={styles.modalSearchInput}
                placeholder="Cari..."
                value={searchText}
                onChangeText={setSearchText}
              />
            </View>

            <FlatList
              data={modalType === 'fakultas' ? filteredFakultas : filteredProdi}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() =>
                    modalType === 'fakultas'
                      ? handleSelectFakultas(item.label)
                      : handleSelectProdi(item.label)
                  }
                >
                  <AppText style={styles.modalItemText}>{item.label}</AppText>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <AppText style={styles.emptyText}>Tidak ditemukan</AppText>
              }
            />
          </View>
        </View>
      </Modal>

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
    paddingBottom: 24,
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
    marginBottom: 6,
  },
  subheadline: {
    fontSize: 14,
    color: '#333333',
    textAlign: 'center',
    lineHeight: 18,
  },
  form: {
    paddingHorizontal: 24,
  },
  row: {
    flexDirection: 'row',
  },
  half: {
    flex: 1,
  },
  spacer: {
    width: 16,
  },
  label: {
    fontSize: 14,
    color: '#4A4A4A',
    marginBottom: 8,
    fontWeight: '600',
  },
  inputWrapper: {
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
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
  selectText: {
    fontSize: 14,
    color: '#374151',
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
    marginTop: 24,
  },
  loginLinkText: {
    fontSize: 14,
    color: '#6B7280',
  },
  loginLinkAction: {
    fontSize: 14,
    color: PRIMARY,
    fontWeight: '700',
  },

  // ── Modal Styles ──
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    height: height * 0.6,
    paddingTop: 16,
    paddingBottom: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333333',
  },
  closeBtn: {
    fontSize: 14,
    color: PRIMARY,
    fontWeight: '600',
  },
  modalSearchWrapper: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  modalSearchInput: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
    fontSize: 14,
    color: '#374151',
  },
  modalItem: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalItemText: {
    fontSize: 14,
    color: '#4A4A4A',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#9CA3AF',
    fontSize: 14,
  },
});
