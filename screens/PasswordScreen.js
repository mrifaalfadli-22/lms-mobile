import React, { useState } from 'react';
import AppText from '../components/AppText';
import { View, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView, Modal, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

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

export default function PasswordScreen() {
  const navigation = useNavigation();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const dummyCurrentPassword = 'mypassword123';

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);

  const handleSimpanClick = () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert('Gagal', 'Semua kolom password harus diisi.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Gagal', 'Konfirmasi password baru tidak cocok.');
      return;
    }
    // Close edit modal, open confirm modal
    setEditModalVisible(false);
    setTimeout(() => {
      setConfirmModalVisible(true);
    }, 300); // slight delay for smooth transition
  };

  const handleSimpanFinal = () => {
    setConfirmModalVisible(false);
    setTimeout(() => {
      Alert.alert('Sukses', 'Password berhasil diubah!');
      navigation.goBack();
    }, 300);
  };

  return (
    <View style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <ChevronLeft />
          <AppText style={styles.headerTitle}>Password</AppText>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.formContainer}>
            <AppText style={styles.label}>Password Saat Ini</AppText>
            <TouchableOpacity style={styles.inputEditableWrapper} activeOpacity={0.7} onPress={() => setShowPassword(!showPassword)}>
              <AppText style={styles.inputEditableText}>{showPassword ? dummyCurrentPassword : '••••••••'}</AppText>
              {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveBtn} activeOpacity={0.8} onPress={() => setEditModalVisible(true)}>
              <AppText style={styles.saveBtnText}>Ubah Password</AppText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ── MODAL UBAH PASSWORD ── */}
      <Modal visible={editModalVisible} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <AppText style={styles.modalTitle}>Ubah Password</AppText>

            <AppText style={styles.modalLabel}>Password Baru</AppText>
            <View style={styles.modalInputWrapper}>
              <TextInput
                style={styles.modalInput}
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
                placeholder="Masukkan password baru"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <AppText style={styles.modalLabel}>Konfirmasi Password Baru</AppText>
            <View style={styles.modalInputWrapper}>
              <TextInput
                style={styles.modalInput}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                placeholder="Konfirmasi password baru"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.modalBtnRow}>
              <TouchableOpacity style={styles.modalBtnOutline} onPress={() => setEditModalVisible(false)}>
                <AppText style={styles.modalBtnOutlineText}>Batal</AppText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalBtnPrimary} onPress={handleSimpanClick}>
                <AppText style={styles.modalBtnPrimaryText}>Simpan</AppText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ── MODAL KONFIRMASI ── */}
      <Modal visible={confirmModalVisible} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <AppText style={styles.modalTitle}>Konfirmasi</AppText>
            <AppText style={styles.modalDesc}>Yakin nggak nih mau ubah password kamu?</AppText>
            <View style={styles.modalBtnRow}>
              <TouchableOpacity style={styles.modalBtnOutline} onPress={() => setConfirmModalVisible(false)}>
                <AppText style={styles.modalBtnOutlineText}>Batal</AppText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalBtnPrimary} onPress={handleSimpanFinal}>
                <AppText style={styles.modalBtnPrimaryText}>Ya, Simpan</AppText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: BG },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 54, paddingBottom: 16, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  backBtn: { flexDirection: 'row', alignItems: 'center' },
  headerTitle: { fontSize: 16, fontWeight: '600', color: '#111827', marginLeft: 8 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 40 },
  formContainer: { flex: 1 },
  label: { fontSize: 14, color: '#4A4A4A', fontWeight: '600', marginBottom: 8 },
  inputEditableWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 24,
    paddingHorizontal: 16,
    height: 48,
  },
  inputEditableText: { fontSize: 16, color: '#374151', flex: 1, letterSpacing: 2 },
  saveBtn: {
    backgroundColor: PRIMARY,
    borderRadius: 99,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignSelf: 'flex-center',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4
  },
  saveBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 },
  modalBox: { width: '100%', backgroundColor: '#FFF', borderRadius: 16, padding: 24, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 20, textAlign: 'center' },
  modalDesc: { fontSize: 14, color: '#4B5563', textAlign: 'center', marginBottom: 24, lineHeight: 20 },
  modalLabel: { fontSize: 14, color: '#374151', fontWeight: '600', marginBottom: 8 },
  modalInputWrapper: { borderRadius: 8, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 16, paddingHorizontal: 12, height: 48, justifyContent: 'center' },
  modalInput: { fontSize: 14, color: '#374151', height: '100%', padding: 0 },
  modalBtnRow: { flexDirection: 'row', gap: 12, marginTop: 8 },
  modalBtnOutline: { flex: 1, height: 44, borderRadius: 8, borderWidth: 1, borderColor: '#D1D5DB', alignItems: 'center', justifyContent: 'center' },
  modalBtnOutlineText: { color: '#4B5563', fontWeight: '600', fontSize: 14 },
  modalBtnPrimary: { flex: 1, height: 44, borderRadius: 8, backgroundColor: PRIMARY, alignItems: 'center', justifyContent: 'center' },
  modalBtnPrimaryText: { color: '#FFF', fontWeight: '600', fontSize: 14 },
});
