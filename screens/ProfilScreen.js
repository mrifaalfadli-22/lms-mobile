import React, { useState } from 'react';
import AppText from '../components/AppText';
import { View, StyleSheet, TouchableOpacity, ImageBackground, TextInput, ScrollView, KeyboardAvoidingView, Platform, Alert, Image, Modal } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Circle } from 'react-native-svg';
import * as ImagePicker from 'expo-image-picker';

const BG = '#F8FAFC';
const PRIMARY = '#116E63';

const UserIcon = ({ size = 64, color = '#116E63' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <Circle cx="12" cy="7" r="4" />
  </Svg>
);

const ChevronLeft = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M15 18l-6-6 6-6" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const CameraIcon = ({ size = 20, color = '#FFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <Circle cx="12" cy="13" r="4" />
  </Svg>
);

const PencilIcon = ({ size = 16, color = '#116E63' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M12 20h9" />
    <Path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
  </Svg>
);

const LogOutIcon = ({ size = 18, color = '#EF4444' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <Path d="M16 17l5-5-5-5" />
    <Path d="M21 12H9" />
  </Svg>
);

const LockIcon = ({ size = 20, color = PRIMARY }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M19 11H5c-1.1 0-2 .9-2 2v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7c0-1.1-.9-2-2-2z" />
    <Path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </Svg>
);

const BellIcon = ({ size = 20, color = PRIMARY }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <Path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </Svg>
);

const HelpIcon = ({ size = 20, color = PRIMARY }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="10" />
    <Path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <Path d="M12 17h.01" />
  </Svg>
);

const InfoIcon = ({ size = 20, color = PRIMARY }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="10" />
    <Path d="M12 16v-4" />
    <Path d="M12 8h.01" />
  </Svg>
);

const ChevronRightIcon = ({ size = 20, color = '#9CA3AF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M9 18l6-6-6-6" />
  </Svg>
);

export default function ProfilScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const isRegistered = route.params?.isRegistered || false;
  const user = route.params?.user || null;

  // States for registered user form
  const [activeTab, setActiveTab] = useState('profil');
  const [form, setForm] = useState({
    nama: user?.nama || 'mahasiswa',
    email: user?.email || 'mahasiswa@student.ui.ac.id',
    npm: user?.npm || '1234567890',
    fakultas: user?.fakultas || 'Fakultas Teknik dan Sains',
    programStudi: user?.programStudi || 'Teknik Informatika',
    tahunAngkatan: user?.tahunAngkatan || '2023',
    foto_profil: user?.foto_profil || null,
  });

  // Modal states
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState('');

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setForm({ ...form, foto_profil: result.assets[0].uri });
      Alert.alert('Sukses', 'Foto profil berhasil diperbarui!');
    }
  };

  const openEditModal = (field) => {
    setEditingField(field);
    setTempValue(form[field]);
    setEditModalVisible(true);
  };

  const handleSimpanAwal = () => {
    // Open confirmation modal
    setConfirmModalVisible(true);
  };

  const handleSimpanFinal = () => {
    setForm({ ...form, [editingField]: tempValue });
    setConfirmModalVisible(false);
    setEditModalVisible(false);
    // Optional: Keep a small alert or toast for success, or just do nothing
    // Alert.alert('Sukses', `${editingField === 'nama' ? 'Nama' : 'Email'} berhasil diperbarui!`);
  };

  const handleLogoutClick = () => {
    setLogoutModalVisible(true);
  };

  const handleLogoutConfirm = () => {
    setLogoutModalVisible(false);
    navigation.replace('Main', { screen: 'Home', params: { isRegistered: false } });
  };

  if (!isRegistered) {
    return (
      <View style={styles.container}>
        {/* ── Header ── */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
            <ChevronLeft />
            <AppText style={styles.headerTitle}>Profil Saya</AppText>
          </TouchableOpacity>
        </View>

        <ImageBackground source={require('../assets/bg-pattern.png')} style={styles.bgPattern} imageStyle={{ opacity: 0.2 }}>
          <View style={styles.guestContainer}>
            <Image
              source={require('../assets/guest-avatar-green.png')}
              style={[styles.avatarPlaceholder, { backgroundColor: '#FFF' }]}
            />
            <AppText style={styles.guestTitle}>Halo, Sobat!</AppText>
            <AppText style={styles.guestDesc}>
              Kamu belum mendaftar nih. Yuk daftar atau masuk sekarang untuk bisa menyimpan progress belajar, mengakses jadwal kuliah, dan mengumpulkan tugas!
            </AppText>

            <TouchableOpacity
              style={styles.loginBtn}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('Register')}
            >
              <AppText style={styles.loginBtnText}>Daftar / Masuk</AppText>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    );
  }

  // Registered View
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <ChevronLeft />
          <AppText style={styles.headerTitle}>Profil Saya</AppText>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'profil' && styles.tabButtonActive]}
          onPress={() => setActiveTab('profil')}
        >
          <AppText style={[styles.tabText, activeTab === 'profil' && styles.tabTextActive]}>Profil</AppText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'settings' && styles.tabButtonActive]}
          onPress={() => setActiveTab('settings')}
        >
          <AppText style={[styles.tabText, activeTab === 'settings' && styles.tabTextActive]}>Pengaturan</AppText>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {activeTab === 'settings' ? (
            <View style={styles.settingsContainer}>

              <TouchableOpacity style={styles.settingsItem} activeOpacity={0.7} onPress={() => navigation.navigate('Password')}>
                <View style={styles.settingsItemLeft}>
                  <LockIcon />
                  <AppText style={styles.settingsItemText}>Password</AppText>
                </View>
                <ChevronRightIcon />
              </TouchableOpacity>

              <TouchableOpacity style={styles.settingsItem} activeOpacity={0.7} onPress={() => navigation.navigate('Notifikasi')}>
                <View style={styles.settingsItemLeft}>
                  <BellIcon />
                  <AppText style={styles.settingsItemText}>Notifikasi</AppText>
                </View>
                <ChevronRightIcon />
              </TouchableOpacity>

              <TouchableOpacity style={styles.settingsItem} activeOpacity={0.7} onPress={() => navigation.navigate('Bantuan')}>
                <View style={styles.settingsItemLeft}>
                  <HelpIcon />
                  <AppText style={styles.settingsItemText}>Bantuan</AppText>
                </View>
                <ChevronRightIcon />
              </TouchableOpacity>

              <TouchableOpacity style={[styles.settingsItem, styles.settingsItemLast]} activeOpacity={0.7} onPress={() => navigation.navigate('TentangKami')}>
                <View style={styles.settingsItemLeft}>
                  <InfoIcon />
                  <AppText style={styles.settingsItemText}>Tentang kami</AppText>
                </View>
                <ChevronRightIcon />
              </TouchableOpacity>

            </View>
          ) : (
            <View style={styles.formContainer}>
              {/* Foto Profil */}
              <View style={styles.avatarSection}>
                <View style={styles.avatarWrapper}>
                  {form.foto_profil ? (
                    <Image source={{ uri: form.foto_profil }} style={styles.avatarImage} />
                  ) : (
                    <View style={styles.avatarInitialContainer}>
                      <AppText style={styles.avatarInitial}>
                        {(() => {
                          const name = form.nama || 'Mahasiswa';
                          const words = name.trim().split(/\s+/);
                          if (words.length > 1) return (words[0][0] + words[words.length - 1][0]).toUpperCase();
                          return name.substring(0, 2).toUpperCase();
                        })()}
                      </AppText>
                    </View>
                  )}
                  <TouchableOpacity style={styles.editAvatarBtn} activeOpacity={0.8} onPress={pickImage}>
                    <CameraIcon size={16} />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={pickImage} activeOpacity={0.7}>
                  <AppText style={styles.ubahFotoText}>Ubah Foto</AppText>
                </TouchableOpacity>
              </View>

              {/* Form Data */}
              <AppText style={styles.label}>Nama Lengkap</AppText>
              <TouchableOpacity style={styles.inputEditableWrapper} activeOpacity={0.7} onPress={() => openEditModal('nama')}>
                <AppText style={styles.inputEditableText}>{form.nama}</AppText>
                <PencilIcon size={16} color={PRIMARY} />
              </TouchableOpacity>

              <AppText style={styles.label}>Email</AppText>
              <TouchableOpacity style={styles.inputEditableWrapper} activeOpacity={0.7} onPress={() => openEditModal('email')}>
                <AppText style={styles.inputEditableText}>{form.email}</AppText>
                <PencilIcon size={16} color={PRIMARY} />
              </TouchableOpacity>

              <AppText style={styles.label}>NPM</AppText>
              <View style={[styles.inputWrapper, styles.inputDisabled]}>
                <TextInput
                  style={[styles.input, styles.inputTextDisabled]}
                  value={form.npm}
                  editable={false}
                />
              </View>

              <AppText style={styles.label}>Tahun Angkatan</AppText>
              <View style={[styles.inputWrapper, styles.inputDisabled]}>
                <TextInput
                  style={[styles.input, styles.inputTextDisabled]}
                  value={form.tahunAngkatan}
                  editable={false}
                />
              </View>

              <AppText style={styles.label}>Fakultas</AppText>
              <View style={[styles.inputWrapper, styles.inputDisabled]}>
                <TextInput
                  style={[styles.input, styles.inputTextDisabled]}
                  value={form.fakultas}
                  editable={false}
                />
              </View>

              <AppText style={styles.label}>Program Studi</AppText>
              <View style={[styles.inputWrapper, styles.inputDisabled]}>
                <TextInput
                  style={[styles.input, styles.inputTextDisabled]}
                  value={form.programStudi}
                  editable={false}
                />
              </View>

              <View style={styles.logoutContainer}>
                <TouchableOpacity style={styles.logoutBtn} activeOpacity={0.8} onPress={handleLogoutClick}>
                  <LogOutIcon size={16} color="#DC2626" />
                  <AppText style={styles.logoutBtnText}>Keluar dari Akun</AppText>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ── MODAL EDIT DATA ── */}
      <Modal visible={editModalVisible} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <AppText style={styles.modalTitle}>Ubah {editingField === 'nama' ? 'Nama' : 'Email'}</AppText>
            <View style={styles.modalInputWrapper}>
              <TextInput
                style={styles.modalInput}
                value={tempValue}
                onChangeText={setTempValue}
                autoCapitalize={editingField === 'nama' ? 'words' : 'none'}
                keyboardType={editingField === 'email' ? 'email-address' : 'default'}
              />
            </View>
            <View style={styles.modalBtnRow}>
              <TouchableOpacity style={styles.modalBtnOutline} onPress={() => setEditModalVisible(false)}>
                <AppText style={styles.modalBtnOutlineText}>Batal</AppText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalBtnPrimary} onPress={handleSimpanAwal}>
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
            <AppText style={styles.modalDesc}>Yakin nggak nih mau disimpan perubahannya?</AppText>
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

      {/* ── MODAL LOGOUT ── */}
      <Modal visible={logoutModalVisible} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <AppText style={styles.modalTitle}>Konfirmasi Keluar</AppText>
            <AppText style={styles.modalDesc}>Yakin nggak nih mau keluar dari akun kamu?</AppText>
            <View style={styles.modalBtnRow}>
              <TouchableOpacity style={styles.modalBtnOutline} onPress={() => setLogoutModalVisible(false)}>
                <AppText style={styles.modalBtnOutlineText}>Batal</AppText>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtnPrimary, { backgroundColor: '#EF4444' }]} onPress={handleLogoutConfirm}>
                <AppText style={styles.modalBtnPrimaryText}>Ya, Keluar</AppText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 54,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: BG,
    zIndex: 10,
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
  bgPattern: {
    flex: 1,
    resizeMode: 'cover',
  },
  guestContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    borderWidth: 4,
    borderColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  guestTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  guestDesc: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  loginBtn: {
    backgroundColor: PRIMARY,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  loginBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Registered styles
  safeArea: {
    flex: 1,
    backgroundColor: BG,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFF',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabButtonActive: {
    borderBottomColor: PRIMARY,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  tabTextActive: {
    color: PRIMARY,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  settingsContainer: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  settingsItemLast: {
    marginBottom: 24,
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingsItemText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#374151',
    marginLeft: 16,
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarWrapper: {
    position: 'relative',
    width: 96,
    height: 96,
  },
  avatarImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  avatarInitialContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontSize: 36,
    color: '#FFF',
    fontWeight: 'bold',
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: PRIMARY,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  ubahFotoText: {
    marginTop: 12,
    color: PRIMARY,
    fontWeight: '600',
    fontSize: 14,
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
    paddingHorizontal: 12,
    height: 44,
    justifyContent: 'center',
  },
  inputDisabled: {
    backgroundColor: '#F3F4F6',
    borderColor: '#E5E7EB',
  },
  inputEditableWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
    paddingHorizontal: 12,
    height: 44,
  },
  inputEditableText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  input: {
    fontSize: 14,
    color: '#374151',
    height: '100%',
    padding: 0,
  },
  inputTextDisabled: {
    color: '#4B5563', // Darker gray for better readability
  },
  logoutContainer: {
    marginTop: 32,
    marginBottom: 24, // Reduced bottom space
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEE2E2', // Solid light red background
    height: 44, // Match input height
    borderRadius: 8, // Match input border radius
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  logoutBtnText: {
    color: '#DC2626',
    fontSize: 14, // Smaller text
    fontWeight: '600',
    marginLeft: 8,
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
  modalInputWrapper: {
    borderRadius: 8,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 24,
    paddingHorizontal: 12,
    height: 44,
    justifyContent: 'center',
  },
  modalInput: {
    fontSize: 14,
    color: '#374151',
    height: '100%',
    padding: 0,
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
