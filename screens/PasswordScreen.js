import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView, Modal, Alert } from 'react-native';
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

export default function PasswordScreen() {
  const navigation = useNavigation();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);

  const handleSimpanClick = () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      Alert.alert('Gagal', 'Semua kolom password harus diisi.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Gagal', 'Konfirmasi password baru tidak cocok.');
      return;
    }
    setConfirmModalVisible(true);
  };

  const handleSimpanFinal = () => {
    setConfirmModalVisible(false);
    Alert.alert('Sukses', 'Password berhasil diubah!');
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <ChevronLeft />
          <Text style={styles.headerTitle}>Ubah Password</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.description}>
            Silakan masukkan password saat ini dan password baru Anda untuk melakukan perubahan.
          </Text>

          <View style={styles.formContainer}>
            <Text style={styles.label}>Password Saat Ini</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                value={oldPassword}
                onChangeText={setOldPassword}
                secureTextEntry
                placeholder="Masukkan password saat ini"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <Text style={styles.label}>Password Baru</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
                placeholder="Masukkan password baru"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <Text style={styles.label}>Konfirmasi Password Baru</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                placeholder="Konfirmasi password baru"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <TouchableOpacity style={styles.saveBtn} activeOpacity={0.8} onPress={handleSimpanClick}>
              <Text style={styles.saveBtnText}>Simpan Password</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ── MODAL KONFIRMASI ── */}
      <Modal visible={confirmModalVisible} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Konfirmasi</Text>
            <Text style={styles.modalDesc}>Yakin nggak nih mau ubah password?</Text>
            <View style={styles.modalBtnRow}>
              <TouchableOpacity style={styles.modalBtnOutline} onPress={() => setConfirmModalVisible(false)}>
                <Text style={styles.modalBtnOutlineText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalBtnPrimary} onPress={handleSimpanFinal}>
                <Text style={styles.modalBtnPrimaryText}>Ya, Simpan</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BG,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 8,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  description: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 22,
    marginBottom: 24,
  },
  formContainer: {
    flex: 1,
  },
  label: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '600',
    marginBottom: 8,
  },
  inputWrapper: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    height: 48,
    paddingHorizontal: 16,
    justifyContent: 'center',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
  },
  saveBtn: {
    backgroundColor: PRIMARY,
    borderRadius: 8,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalBox: {
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 24,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalDesc: {
    fontSize: 14,
    color: '#4B5563',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  modalBtnRow: {
    flexDirection: 'row',
    gap: 12,
  },
  modalBtnOutline: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBtnOutlineText: {
    color: '#4B5563',
    fontWeight: '600',
    fontSize: 14,
  },
  modalBtnPrimary: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    backgroundColor: PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBtnPrimaryText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
  },
});
