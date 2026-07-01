import React, { useState, useEffect } from 'react';
import AppText from '../components/AppText';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ImageBackground,
  StatusBar,
  Platform,
  ActivityIndicator,
  Linking,
  Dimensions,
  Text,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { API_BASE_URL } from '../config/api';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { jsPDF } from 'jspdf';
import Svg, { Path } from 'react-native-svg';

const BackIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path
      d="M15 18L9 12L15 6"
      stroke="#4B5563"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const ChevronDownIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path d="M6 9l6 6 6-6" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ChevronUpIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path d="M18 15l-6-6-6 6" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export default function DetailProgressBelajarScreen({ route }) {
  const navigation = useNavigation();
  const [isTugasExpanded, setIsTugasExpanded] = useState(true);

  const course = route?.params?.item || {
    title: 'Mata Kuliah',
  };
  const token = route?.params?.token || null;

  const [tugasList, setTugasList] = useState([]);
  const [sertifikatList, setSertifikatList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'web') {
      const linkId = 'cert-google-fonts';
      if (!document.getElementById(linkId)) {
        const link = document.createElement('link');
        link.id = linkId;
        link.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Lora:ital,wght@0,400;0,600;0,700;1,400&family=Merriweather:ital,wght@0,400;0,700;1,400&family=Montserrat:ital,wght@0,400;0,600;0,700;1,400&family=Open+Sans:ital,wght@0,400;0,600;0,700;1,400&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Poppins:ital,wght@0,400;0,600;0,700;1,400&family=Roboto:ital,wght@0,400;0,500;0,700;1,400&display=swap";
        link.rel = "stylesheet";
        document.head.appendChild(link);
      }
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const baseUrl = Platform.OS === 'android' ? API_BASE_URL : 'http://localhost:8000';

        // Fetch Tugas
        if (course.id) {
          const resTugas = await fetch(`${baseUrl}/api/tugas/jadwal/${course.id}`, {
            headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${token}` }
          });
          const jsonTugas = await resTugas.json();
          if (jsonTugas.status === 'success') setTugasList(jsonTugas.data || []);
        }

        // Fetch Sertifikat
        if (course.id_peserta) {
          const resSertifikat = await fetch(`${baseUrl}/api/sertifikat/peserta/${course.id_peserta}`, {
            headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${token}` }
          });
          const jsonSertifikat = await resSertifikat.json();
          if (jsonSertifikat.status === 'success') setSertifikatList(jsonSertifikat.data || []);
        }

      } catch (error) {
        console.error("Error fetching detail:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (token) fetchData();
  }, [course.id, course.id_peserta, token]);

  const handleDownload = async (sertif) => {
    try {
      const baseUrl = Platform.OS === 'android' ? API_BASE_URL : 'http://localhost:8000';
      const bgUrl = sertif.template?.id_template 
        ? `${baseUrl}/api/template-sertifikat/${sertif.template.id_template}/download-background` 
        : '';

      const layoutData = sertif.template?.layout_data || [];

      const getVarText = (id) => {
        switch (id) {
          case 'nama_peserta': return sertif.peserta?.mahasiswa?.nama_lengkap || '-';
          case 'npm': return sertif.peserta?.mahasiswa?.nomor_induk || '-';
          case 'nomor_sertifikat': return sertif.nomor_sertifikat || '-';
          case 'mata_kuliah_kelas': return `${course.title || ''} ${course.classInfo ? '- ' + course.classInfo : ''}`.trim() || '-';
          case 'tanggal_terbit': return sertif.tanggal_terbit ? new Date(sertif.tanggal_terbit).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-';
          case 'status_kelulusan': return 'LULUS';
          case 'nilai_tugas': return '';
          default: return '';
        }
      };

      if (Platform.OS === 'web') {
        const canvas = document.createElement('canvas');
        canvas.width = 1122;
        canvas.height = 794;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 1122, 794);

        if (bgUrl) {
          await new Promise((resolve, reject) => {
            const img = new window.Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
              const hRatio = 1122 / img.width;
              const vRatio = 794 / img.height;
              const ratio = Math.max(hRatio, vRatio);
              const cx = (1122 - img.width * ratio) / 2;
              const cy = (794 - img.height * ratio) / 2;
              ctx.drawImage(img, 0, 0, img.width, img.height, cx, cy, img.width * ratio, img.height * ratio);
              resolve();
            };
            img.onerror = () => resolve(); // continue even if bg fails
            img.src = bgUrl;
          });
        }

        layoutData.forEach((el) => {
          if (el.isHidden) return;
          ctx.save();
          const text = getVarText(el.id);
          const fontWeight = el.fontWeight === 'semibold' ? '600' : (el.fontWeight || 'normal');
          const fontFamily = el.fontFamily || 'Arial';
          ctx.font = `${fontWeight} ${el.fontSize}px '${fontFamily}', sans-serif`;
          ctx.fillStyle = el.color || '#000000';
          ctx.textAlign = el.textAlign || 'center';
          ctx.textBaseline = 'middle';

          let cx = el.x + el.width / 2;
          if (el.textAlign === 'left') cx = el.x;
          else if (el.textAlign === 'right') cx = el.x + el.width;
          const cy = el.y + el.height / 2;

          // Multi-line word wrap to match Admin exactly
          const words = text.toString().split(" ");
          const lines = [];
          let current = "";
          words.forEach((word) => {
            const test = current ? `${current} ${word}` : word;
            if (ctx.measureText(test).width > el.width && current) {
              lines.push(current);
              current = word;
            } else {
              current = test;
            }
          });
          if (current) lines.push(current);

          const lineH = el.fontSize * 1.3;
          const startY = cy - ((lines.length - 1) * lineH) / 2;

          lines.forEach((line, i) => {
            ctx.fillText(line, cx, startY + i * lineH);
          });
          ctx.restore();
        });

        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
        pdf.addImage(imgData, 'JPEG', 0, 0, 297, 210);
        const getTipeLabel = (tipe) => {
            if (tipe === 'kelulusan') return 'Kelulusan';
            if (tipe === 'nilai') return 'Daftar Nilai';
            return 'Pelatihan';
        };
        const tipeLabel = getTipeLabel(sertif.tipe_sertifikat);
        const mk = course.title || '';
        const mhs = sertif.peserta?.mahasiswa?.nama_lengkap || 'Download';
        const namaFile = `Sertifikat ${tipeLabel} - ${mk} - ${mhs}.pdf`;

        pdf.save(namaFile);
        return;
      }

      const html = `
        <html>
          <head>
            <style>
              @page { size: A4 landscape; margin: 0; }
              body { margin: 0; padding: 0; }
              .container {
                width: 1122px;
                height: 794px;
                position: relative;
                background-image: url('${bgUrl}');
                background-size: cover;
                background-repeat: no-repeat;
              }
              .text-element {
                position: absolute;
                display: flex;
                align-items: center;
                overflow: hidden;
              }
              .text-content {
                display: block;
                width: 100%;
                line-height: 1.3;
                overflow: hidden;
              }
            </style>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Lora:ital,wght@0,400;0,600;0,700;1,400&family=Merriweather:ital,wght@0,400;0,700;1,400&family=Montserrat:ital,wght@0,400;0,600;0,700;1,400&family=Open+Sans:ital,wght@0,400;0,600;0,700;1,400&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Poppins:ital,wght@0,400;0,600;0,700;1,400&family=Roboto:ital,wght@0,400;0,500;0,700;1,400&display=swap" rel="stylesheet">
          </head>
          <body>
            <div class="container">
              ${layoutData.map(item => {
        if (item.isHidden) return '';
        const fontWeight = item.fontWeight === 'semibold' ? 600 : (item.fontWeight || 'normal');
        return `
                  <div class="text-element" style="left: ${item.x}px; top: ${item.y}px; width: ${item.width}px; height: ${item.height}px;">
                    <span class="text-content" style="text-align: ${item.textAlign || 'center'}; font-size: ${item.fontSize}px; color: ${item.color || '#000'}; font-weight: ${fontWeight}; font-family: '${item.fontFamily || 'Arial'}', sans-serif;">
                      ${getVarText(item.id)}
                    </span>
                  </div>
                `;
              }).join('')}
            </div>
          </body>
        </html>
      `;

        const { uri } = await Print.printToFileAsync({
          html,
          width: 1122,
          height: 794,
          base64: false
        });

        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(uri, {
            UTI: '.pdf',
            mimeType: 'application/pdf',
            dialogTitle: 'Unduh Sertifikat'
          });
        } else {
          Alert.alert('Gagal', 'Fitur berbagi tidak tersedia di perangkat ini');
        }
      } catch (e) {
        console.error(e);
        Alert.alert('Gagal', 'Gagal mengunduh sertifikat.');
      }
    };

    return (
      <ImageBackground
        source={require('../assets/bg-pattern.png')}
        style={styles.container}
        resizeMode="cover"
      >
        <View style={styles.safeArea}>
          <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.headerClickArea} onPress={() => navigation.goBack()}>
              <View style={styles.backBtn}>
                <BackIcon />
              </View>
              <AppText style={styles.headerTitle}>Progress belajar kamu</AppText>
            </TouchableOpacity>
          </View>
          <View style={styles.headerLine} />

          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

            {/* Top Summary Stats */}
            <View style={styles.statsCard}>
              <View style={styles.statColumn}>
                <AppText style={styles.statLabel}>Absensi</AppText>
                <AppText style={styles.statValue}>{course.absensi_current || 0} / {course.absensi_total || 0}</AppText>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statColumn}>
                <AppText style={styles.statLabel}>Tugas & Kuis selesai</AppText>
                <AppText style={styles.statValue}>{course.tugas_current || 0} / {course.tugas_total || 0}</AppText>
              </View>
            </View>

            {/* Section: Nilai Tugas */}
            <AppText style={styles.sectionTitle}>Nilai tugas kamu</AppText>
            <View style={styles.card}>
              <TouchableOpacity
                style={styles.cardHeader}
                activeOpacity={0.7}
                onPress={() => setIsTugasExpanded(!isTugasExpanded)}
              >
                <AppText style={styles.courseTitle}>{course.title}</AppText>
                {isTugasExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
              </TouchableOpacity>

              {isTugasExpanded && (
                <View style={styles.cardBody}>
                  {isLoading ? (
                    <ActivityIndicator size="small" color="#116E63" />
                  ) : tugasList.length === 0 ? (
                    <AppText style={{ color: '#6B7280', fontSize: 14 }}>Belum ada data tugas.</AppText>
                  ) : (
                    tugasList.map((tugas, index) => (
                      <View key={tugas.id_tugas} style={{ marginBottom: 20 }}>
                        <AppText style={styles.tugasTitle}>{tugas.judul_tugas || `Tugas ${index + 1}`}</AppText>
                        <AppText style={styles.tugasDesc} numberOfLines={2}>
                          {tugas.deskripsi_tugas || '-'}
                        </AppText>
                        <View style={[styles.gradeBox, { backgroundColor: tugas.nilai !== null ? '#116E63' : '#F3F4F6' }]}>
                          <AppText style={[styles.gradeLabel, { color: tugas.nilai !== null ? '#E2E8F0' : '#4B5563' }]}>Nilai kamu</AppText>
                          <AppText style={[styles.gradeValue, { color: tugas.nilai !== null ? '#FFFFFF' : '#111827' }]}>{tugas.nilai !== null ? Math.ceil(tugas.nilai) : '-'}</AppText>
                        </View>
                      </View>
                    ))
                  )}
                </View>
              )}
            </View>

            {/* Section: Sertifikat Kamu */}
            <AppText style={styles.sectionTitle}>Sertifikat kamu</AppText>
            {isLoading ? (
              <ActivityIndicator size="small" color="#116E63" style={{ marginBottom: 40 }} />
            ) : sertifikatList.length === 0 ? (
              <AppText style={{ color: '#6B7280', fontSize: 14, marginBottom: 40 }}>Belum ada sertifikat.</AppText>
            ) : (
              sertifikatList.map((sertif, index) => {
                const baseUrl = Platform.OS === 'android' ? API_BASE_URL : 'http://localhost:8000';
                const bgUrl = sertif.template?.file_background
                  ? { uri: `${baseUrl}/storage/${sertif.template.file_background}` }
                  : require('../assets/sertifikat.png');

                const screenWidth = Dimensions.get('window').width - 64; // assuming 32px padding on each side
                const BASE_WIDTH = 1123;
                const BASE_HEIGHT = 794;
                const scale = screenWidth / BASE_WIDTH;
                const scaledHeight = BASE_HEIGHT * scale;

                const layoutData = sertif.template?.layout_data || [];

                const getVarText = (id) => {
                  switch (id) {
                    case 'nama_peserta': return sertif.peserta?.mahasiswa?.nama_lengkap || '-';
                    case 'npm': return sertif.peserta?.mahasiswa?.nomor_induk || '-';
                    case 'nomor_sertifikat': return sertif.nomor_sertifikat || '-';
                    case 'mata_kuliah_kelas': return `${course.title || ''} ${course.classInfo ? '- ' + course.classInfo : ''}`.trim() || '-';
                    case 'tanggal_terbit': return sertif.tanggal_terbit ? new Date(sertif.tanggal_terbit).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-';
                    case 'status_kelulusan': return 'LULUS';
                    case 'nilai_tugas': return '';
                    default: return '';
                  }
                };

                return (
                  <View key={sertif.id_sertifikat} style={[styles.sertifikatCard, { marginBottom: index < sertifikatList.length - 1 ? 24 : 40 }]}>
                    <ImageBackground
                      source={bgUrl}
                      style={[styles.sertifikatImage, { height: scaledHeight }]}
                      resizeMode="contain"
                    >
                      {layoutData.map((item, idx) => {
                        if (item.isHidden) return null;
                        return (
                          <Text
                            key={idx}
                            style={{
                              position: 'absolute',
                              left: item.x * scale,
                              top: item.y * scale,
                              width: item.width * scale,
                              height: item.height * scale,
                              fontSize: Math.max(item.fontSize * scale, 6),
                              color: item.color || '#000',
                              fontWeight: item.fontWeight === 'bold' || item.fontWeight === 'semibold' ? 'bold' : 'normal',
                              textAlign: item.textAlign || 'center',
                              fontFamily: item.fontFamily ? `'${item.fontFamily}', sans-serif` : 'Arial, sans-serif',
                            }}
                            numberOfLines={1}
                            adjustsFontSizeToFit
                          >
                            {getVarText(item.id)}
                          </Text>
                        );
                      })}
                    </ImageBackground>
                    <View style={styles.sertifikatInfo}>
                      <AppText style={styles.sertifikatTitle}>
                        {sertif.tipe_sertifikat === 'pelatihan' ? 'Sertifikat Pelatihan' : sertif.tipe_sertifikat === 'kelulusan' ? 'Sertifikat Kelulusan' : sertif.tipe_sertifikat === 'nilai' ? 'Daftar Nilai' : (sertif.template?.nama_template || course.title)}
                      </AppText>

                      <View style={[styles.sertifikatDateRow, { marginBottom: 6 }]}>
                        <AppText style={styles.sertifikatDateLabel}>Nomor Sertifikat</AppText>
                        <AppText style={styles.sertifikatDateValue}>
                          {sertif.nomor_sertifikat || '-'}
                        </AppText>
                      </View>

                      <View style={styles.sertifikatDateRow}>
                        <AppText style={styles.sertifikatDateLabel}>Tanggal terbit</AppText>
                        <AppText style={styles.sertifikatDateValue}>
                          {new Date(sertif.tanggal_terbit).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </AppText>
                      </View>
                    </View>
                    <TouchableOpacity style={styles.downloadBtn} activeOpacity={0.8} onPress={() => handleDownload(sertif)}>
                      <AppText style={styles.downloadBtnText}>Unduh Sertifikat</AppText>
                    </TouchableOpacity>
                  </View>
                );
              })
            )}

          </ScrollView>
        </View>
      </ImageBackground>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F9FAFB', // Fallback color
    },
    safeArea: {
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: 54,
      paddingHorizontal: 20,
      paddingBottom: 16,
      backgroundColor: '#FFFFFF',
    },
    headerClickArea: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    backBtn: {
      padding: 4,
      marginRight: 12,
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
      paddingHorizontal: 20,
      paddingTop: 24,
      paddingBottom: 40,
    },
    statsCard: {
      backgroundColor: '#116E63',
      borderRadius: 12,
      flexDirection: 'row',
      paddingVertical: 16,
      paddingHorizontal: 8,
      alignItems: 'center',
      marginBottom: 32,
      elevation: 4,
      shadowColor: '#116E63',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
    },
    statColumn: {
      flex: 1,
      alignItems: 'center',
      paddingHorizontal: 4,
    },
    statDivider: {
      width: 1,
      height: '100%',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    statLabel: {
      color: '#E2E8F0',
      fontSize: 12,
      marginBottom: 8,
      textAlign: 'center',
    },
    statValue: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '700',
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: '#111827',
      marginBottom: 16,
    },
    card: {
      backgroundColor: '#FFFFFF',
      borderRadius: 12,
      padding: 16,
      marginBottom: 32,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    courseTitle: {
      fontSize: 15,
      fontWeight: '600',
      color: '#111827',
      flex: 1,
      paddingRight: 16,
    },
    cardBody: {
      marginTop: 16,
      position: 'relative',
    },
    avatarIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      position: 'absolute',
      top: -24,
      right: 0,
      borderWidth: 2,
      borderColor: '#FFFFFF',
    },
    tugasTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: '#111827',
      marginBottom: 8,
    },
    tugasDesc: {
      fontSize: 14,
      color: '#4B5563',
      lineHeight: 20,
      marginBottom: 16,
    },
    gradeBox: {
      backgroundColor: '#116E63',
      borderRadius: 8,
      paddingVertical: 12,
      paddingHorizontal: 16,
      alignSelf: 'flex-start',
      alignItems: 'center',
    },
    gradeLabel: {
      color: '#E2E8F0',
      fontSize: 13,
      marginBottom: 2,
    },
    gradeValue: {
      color: '#FFFFFF',
      fontSize: 20,
      fontWeight: '700',
    },
    sertifikatCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: 12,
      overflow: 'hidden',
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
    },
    sertifikatImage: {
      width: '100%',
      height: 180,
    },
    sertifikatInfo: {
      padding: 16,
    },
    sertifikatTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: '#111827',
      marginBottom: 12,
    },
    sertifikatDateRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    sertifikatDateLabel: {
      fontSize: 13,
      color: '#6B7280',
    },
    sertifikatDateValue: {
      fontSize: 13,
      fontWeight: '600',
      color: '#111827',
    },
    downloadBtn: {
      borderTopWidth: 1,
      borderTopColor: '#F3F4F6',
      paddingVertical: 14,
      alignItems: 'center',
    },
    downloadBtnText: {
      color: '#4B5563',
      fontSize: 13,
      fontWeight: '600',
    },
  });
