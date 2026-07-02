import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Modal,
  LogBox,
} from 'react-native';
import AppText from '../components/AppText';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path, Circle } from 'react-native-svg';
import { CameraView, useCameraPermissions, scanFromURLAsync } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { API_BASE_URL } from '../config/api';
import { downloadCertificate } from '../utils/pdfHelper';

// Ignore the CameraView warning since placing overlay as children is required to fix the layout bug on some Android devices
LogBox.ignoreLogs([
  /The <CameraView> component does not support children/,
]);

// Also suppress it from the terminal/console
const originalWarn = console.warn;
console.warn = (...args) => {
  if (args[0] && typeof args[0] === 'string' && args[0].includes('The <CameraView> component does not support children')) {
    return;
  }
  originalWarn(...args);
};

const PRIMARY = '#116E63';

const BackIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path
      d="M15 18L9 12L15 6"
      stroke="#111827"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const SearchIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path
      d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
      stroke="#FFFFFF"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const DownloadIcon = ({ color = '#116E63' }) => (
  <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <Path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export default function VerifikasiSertifikatScreen() {
  const navigation = useNavigation();
  const [certNumber, setCertNumber] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'valid' | 'invalid'
  const [verificationData, setVerificationData] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);

  // Camera state
  const [isScanning, setIsScanning] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  const handleVerify = async (scannedData = null) => {
    const numberToVerify = scannedData || certNumber;
    if (!numberToVerify.trim()) return;

    setStatus('loading');
    setVerificationData(null);

    try {
      const baseUrl = Platform.OS === 'android' ? API_BASE_URL : 'http://localhost:8000';
      const response = await fetch(`${baseUrl}/api/sertifikat/verify/${numberToVerify.trim()}`);

      const resData = await response.json();

      if (response.ok && resData.valid) {
        setStatus('valid');
        setVerificationData(resData.data);
      } else {
        setStatus('invalid');
      }
    } catch (error) {
      console.error('Error verifying certificate:', error);
      setStatus('invalid');
    }
  };

  const handleDownloadItem = async (sertif) => {
    setDownloadingId(sertif.id_sertifikat);
    const mk = verificationData.peserta?.jadwal?.mata_kuliah?.nama_mk || '';
    const kelas = verificationData.peserta?.jadwal?.kelas?.nama_kelas || '';

    // Construct dummy course object based on verified data
    const courseObj = {
      courseName: mk ? (kelas ? `${mk} - ${kelas}` : mk) : '',
      mkOnly: mk,
      mahasiswaName: verificationData.peserta?.mahasiswa?.nama_lengkap || '',
      npm: verificationData.peserta?.mahasiswa?.nomor_induk || '',
      lecturer: verificationData.peserta?.jadwal?.dosen?.nama_lengkap || ''
    };

    await downloadCertificate(sertif, courseObj, API_BASE_URL, null);

    setDownloadingId(null);
  };

  const startScanning = async () => {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) return;
    }
    setIsScanning(true);
  };

  const handleBarcodeScanned = ({ type, data }) => {
    setIsScanning(false);
    setCertNumber(data);
    handleVerify(data);
  };

  const pickImageToScan = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setIsScanning(false);
        const imageUri = result.assets[0].uri;

        // Scan the selected image
        const scannedResults = await scanFromURLAsync(imageUri, ['qr']);

        if (scannedResults && scannedResults.length > 0) {
          handleBarcodeScanned({ type: 'qr', data: scannedResults[0].data });
        } else {
          alert('Tidak ada QR Code yang terdeteksi pada gambar tersebut.');
        }
      }
    } catch (error) {
      console.log('Error scanning from image:', error);
      alert('Gagal memproses gambar. Pastikan gambar berisi QR Code yang jelas.');
    }
  };

  const getTipeLabel = (tipe) => {
    if (tipe === 'kelulusan') return 'Kelulusan';
    if (tipe === 'nilai') return 'Daftar Nilai';
    return 'Pelatihan';
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={{ flexDirection: 'row', alignItems: 'center' }}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <View style={styles.backBtn}>
            <BackIcon />
          </View>
          <AppText style={[styles.headerTitle, { marginLeft: 8 }]}>Verifikasi Sertifikat</AppText>
        </TouchableOpacity>
      </View>
      <View style={styles.headerLine} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">

          <View style={styles.instructionBox}>
            <AppText style={styles.instructionTitle}>Cek Keaslian Sertifikat</AppText>
            <AppText style={styles.instructionText}>
              Masukkan nomor seri sertifikat atau scan QR code yang tertera di sertifikat untuk memverifikasi keasliannya di sistem kami.
            </AppText>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            <AppText style={styles.inputLabel}>Nomor Sertifikat</AppText>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Contoh: SERT/UMUM/2026/06/0001"
                placeholderTextColor="#9CA3AF"
                value={certNumber}
                onChangeText={setCertNumber}
                autoCapitalize="characters"
                returnKeyType="search"
                onSubmitEditing={() => handleVerify()}
              />
            </View>

            <TouchableOpacity
              style={[styles.primaryBtn, !certNumber.trim() && styles.primaryBtnDisabled]}
              onPress={() => handleVerify()}
              disabled={!certNumber.trim() || status === 'loading'}
            >
              {status === 'loading' ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <SearchIcon />
                  <AppText style={styles.primaryBtnText}>Cari Sertifikat</AppText>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.scanBtn}
              onPress={startScanning}
            >
              <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <Path d="M4 4h6v6H4V4zm2 2v2h2V6H6zm10-2h6v6h-6V4zm2 2v2h2V6h-2zM4 14h6v6H4v-6zm2 2v2h2v-2H6zm10-2h6v6h-6v-6zm2 2v2h2v-2h-2zm-6-8h2v2h-2V8zm-2 2h2v2h-2v-2zm4 0h2v2h-2v-2zm-2 2h2v2h-2v-2zm-2 2h2v2h-2v-2zm0 4h2v2h-2v-2zm-2-2h2v2h-2v-2zm4 2h2v2h-2v-2zm2-2h2v2h-2v-2z" fill="#116E63" />
              </Svg>
              <AppText style={styles.scanBtnText}>Atau Scan QR Code</AppText>
            </TouchableOpacity>
          </View>

          {/* Result Area */}
          {status === 'valid' && verificationData && (
            <View style={styles.resultContainer}>
              <View style={styles.resultCardValid}>
                <View style={styles.resultHeader}>
                  <Svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <Circle cx="12" cy="12" r="10" stroke="#10B981" strokeWidth="2" />
                    <Path d="M8 12l3 3 5-6" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </Svg>
                  <AppText style={styles.resultStatusTextValid}>Sertifikat Valid</AppText>
                </View>

                <View style={styles.divider} />

                <View style={styles.infoRow}>
                  <AppText style={styles.infoLabel}>Nama Peserta</AppText>
                  <AppText style={styles.infoValue}>{verificationData.peserta?.mahasiswa?.nama_lengkap || '-'}</AppText>
                </View>
                <View style={styles.infoRow}>
                  <AppText style={styles.infoLabel}>Mata Kuliah</AppText>
                  <AppText style={styles.infoValue}>{verificationData.peserta?.jadwal?.mata_kuliah?.nama_mk || '-'}</AppText>
                </View>
                <View style={styles.infoRow}>
                  <AppText style={styles.infoLabel}>Tanggal Terbit</AppText>
                  <AppText style={styles.infoValue}>{verificationData.tanggal_terbit}</AppText>
                </View>
                <View style={styles.infoRow}>
                  <AppText style={styles.infoLabel}>Nomor Seri</AppText>
                  <AppText style={styles.infoValue}>{verificationData.nomor_sertifikat}</AppText>
                </View>
              </View>

              {verificationData.sertifikats && verificationData.sertifikats.length > 0 && (
                <View style={styles.listContainer}>
                  <AppText style={styles.listTitle}>Daftar Sertifikat Terkait</AppText>
                  {verificationData.sertifikats.map((sertif, idx) => (
                    <View key={sertif.id_sertifikat || idx} style={styles.sertifItem}>
                      <View style={styles.sertifInfo}>
                        <AppText style={styles.sertifType}>Sertifikat {getTipeLabel(sertif.tipe_sertifikat)}</AppText>
                      </View>
                      <TouchableOpacity
                        style={styles.downloadBtn}
                        onPress={() => handleDownloadItem(sertif)}
                        disabled={downloadingId === sertif.id_sertifikat}
                      >
                        {downloadingId === sertif.id_sertifikat ? (
                          <ActivityIndicator size="small" color="#116E63" />
                        ) : (
                          <>
                            <DownloadIcon />
                            <AppText style={styles.downloadText}>Unduh</AppText>
                          </>
                        )}
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}

          {status === 'invalid' && (
            <View style={styles.resultCardInvalid}>
              <View style={styles.resultHeader}>
                <Svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <Circle cx="12" cy="12" r="10" stroke="#EF4444" strokeWidth="2" />
                  <Path d="M15 9l-6 6M9 9l6 6" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
                </Svg>
                <AppText style={styles.resultStatusTextInvalid}>Sertifikat Tidak Ditemukan</AppText>
              </View>
              <View style={styles.dividerInvalid} />
              <AppText style={styles.invalidMessage}>
                Kami tidak dapat menemukan sertifikat dengan nomor seri "{certNumber}". Pastikan nomor atau kode QR yang Anda masukkan sudah benar.
              </AppText>
            </View>
          )}

        </ScrollView>
      </KeyboardAvoidingView>

      {/* Camera Modal */}
      <Modal visible={isScanning} animationType="slide" transparent={false}>
        <View style={styles.cameraContainer}>
          <CameraView
            style={{ flex: 1 }}
            facing="back"
            barcodeScannerSettings={{
              barcodeTypes: ["qr"],
            }}
            onBarcodeScanned={handleBarcodeScanned}
          >
            <View style={styles.cameraOverlay}>
              <View style={styles.cameraHeader}>
                <TouchableOpacity style={styles.cameraCloseBtn} onPress={() => setIsScanning(false)}>
                  <AppText style={styles.cameraCloseText}>Batal</AppText>
                </TouchableOpacity>
              </View>
              <View style={styles.scannerBox}>
                <View style={styles.scannerCornerTopLeft} />
                <View style={styles.scannerCornerTopRight} />
                <View style={styles.scannerCornerBottomLeft} />
                <View style={styles.scannerCornerBottomRight} />
              </View>
              <View style={styles.cameraFooter}>
                <AppText style={styles.cameraHint}>Arahkan kamera ke QR Code sertifikat</AppText>

                {/* <TouchableOpacity style={styles.uploadBtn} onPress={pickImageToScan}>
                  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <Path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </Svg>
                  <AppText style={styles.uploadBtnText}>Upload dari Galeri</AppText>
                </TouchableOpacity> */}
              </View>
            </View>
          </CameraView>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 54, // Safe area padding
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: '#F9FAFB',
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  headerLine: {
    height: 1,
    backgroundColor: '#E5E7EB',
    width: '100%',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  instructionBox: {
    marginBottom: 32,
    marginTop: 10,
  },
  instructionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 10,
    letterSpacing: -0.3,
  },
  instructionText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 22,
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  inputWrapper: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    marginBottom: 20,
    paddingHorizontal: 16,
    height: 52,
    justifyContent: 'center',
  },
  input: {
    fontSize: 15,
    color: '#111827',
    height: '100%',
    padding: 0,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  primaryBtn: {
    backgroundColor: PRIMARY,
    borderRadius: 8,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  primaryBtnDisabled: {
    backgroundColor: '#9CA3AF',
    shadowOpacity: 0,
    elevation: 0,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 8,
  },
  scanBtn: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#D1FAE5',
    backgroundColor: '#F0FDF4',
  },
  scanBtnText: {
    color: '#116E63',
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 8,
  },
  resultContainer: {
    gap: 20,
  },
  resultCardValid: {
    backgroundColor: '#ECFDF5',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#34D399',
  },
  resultCardInvalid: {
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F87171',
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultStatusTextValid: {
    fontSize: 18,
    fontWeight: '800',
    color: '#065F46',
    marginLeft: 10,
  },
  resultStatusTextInvalid: {
    fontSize: 18,
    fontWeight: '800',
    color: '#991B1B',
    marginLeft: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#A7F3D0',
    marginBottom: 16,
  },
  dividerInvalid: {
    height: 1,
    backgroundColor: '#FECACA',
    marginBottom: 12,
  },
  infoRow: {
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: '#065F46',
    opacity: 0.8,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#064E3B',
  },
  invalidMessage: {
    fontSize: 14,
    color: '#7F1D1D',
    lineHeight: 20,
  },
  listContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  listTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 12,
  },
  sertifItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  sertifInfo: {
    flex: 1,
    marginRight: 10,
  },
  sertifType: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  sertifSub: {
    fontSize: 12,
    color: '#6B7280',
  },
  downloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#D1FAE5',
  },
  downloadText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#116E63',
    marginLeft: 6,
  },
  // Camera Modal Styles
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cameraHeader: {
    width: '100%',
    paddingTop: 50,
    paddingHorizontal: 20,
    alignItems: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingBottom: 16,
  },
  cameraCloseBtn: {
    padding: 8,
  },
  cameraCloseText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  scannerBox: {
    width: 250,
    height: 250,
    backgroundColor: 'transparent',
    position: 'relative',
  },
  scannerCornerTopLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 30,
    height: 30,
    borderColor: '#34D399',
    borderTopWidth: 4,
    borderLeftWidth: 4,
  },
  scannerCornerTopRight: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 30,
    height: 30,
    borderColor: '#34D399',
    borderTopWidth: 4,
    borderRightWidth: 4,
  },
  scannerCornerBottomLeft: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 30,
    height: 30,
    borderColor: '#34D399',
    borderBottomWidth: 4,
    borderLeftWidth: 4,
  },
  scannerCornerBottomRight: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderColor: '#34D399',
    borderBottomWidth: 4,
    borderRightWidth: 4,
  },
  cameraFooter: {
    width: '100%',
    paddingBottom: 50,
    paddingTop: 20,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  cameraHint: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 20,
  },
  uploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  uploadBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 8,
  }
});
