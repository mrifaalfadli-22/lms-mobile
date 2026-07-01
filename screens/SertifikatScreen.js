import React, { useState, useEffect } from 'react';
import AppText from '../components/AppText';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Image,
  Dimensions,
  Platform,
  ActivityIndicator,
  ImageBackground,
  Text
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path } from 'react-native-svg';
import { jsPDF } from 'jspdf';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import api, { API_BASE_URL } from '../config/api';

const { width } = Dimensions.get('window');
const cardWidth = (width - 60) / 2; // 20 padding left, 20 padding right, 20 gap between cards

const BackIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M15 18L9 12L15 6" stroke="#4B5563" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ChevronRightIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path d="M9 18l6-6-6-6" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const VerifyIcon = ({ color = "#116E63" }) => (
  <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <Path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const CourseCard = ({ course, onPress }) => (
  <TouchableOpacity style={styles.courseCard} onPress={onPress} activeOpacity={0.7}>
    <View style={styles.courseCardTop}>
      <View style={styles.courseIconBox}>
        <AppText style={styles.courseIconText}>{course.mkOnly ? course.mkOnly.substring(0, 2).toUpperCase() : 'MK'}</AppText>
      </View>
      <View style={styles.courseContent}>
        <AppText style={styles.courseTitleText}>{course.courseName}</AppText>
        <AppText style={styles.courseNidnText}>{course.prodi || 'Program Studi'} . {course.kelas || 'Kelas'}</AppText>
      </View>
      <ChevronRightIcon />
    </View>
    <View style={styles.courseCardDivider} />
    <View style={styles.courseCardBottom}>
      <AppText style={styles.courseDosenText}>{course.dosen}</AppText>
    </View>
  </TouchableOpacity>
);

const CertificateCard = ({ item, selectedCourse, onDownload }) => {
  const sertif = item.rawSertif;
  const baseUrl = Platform.OS === 'android' ? API_BASE_URL : 'http://localhost:8000';
  const bgUrl = sertif.template?.id_template 
    ? { uri: `${baseUrl}/api/template-sertifikat/${sertif.template.id_template}/download-background` } 
    : require('../assets/sertifikat.png');
  const layoutData = typeof sertif.template?.layout_data === 'string' 
    ? JSON.parse(sertif.template.layout_data) 
    : (sertif.template?.layout_data || []);

  const scale = (Dimensions.get('window').width - 48) / 1122;
  const scaledHeight = 794 * scale;

  const mhs = selectedCourse?.mahasiswaName || 'Download';

  const getVarText = (id) => {
    switch (id) {
      case 'nama_peserta': return mhs;
      case 'npm': return item.rawSertif?.peserta?.mahasiswa?.nomor_induk || '-';
      case 'nomor_sertifikat': return item.rawSertif?.nomor_sertifikat || '-';
      case 'mata_kuliah_kelas': return selectedCourse?.courseName || '-';
      case 'tanggal_terbit': return item.date;
      case 'status_kelulusan': return 'LULUS';
      case 'nilai_tugas': return '';
      default: return '';
    }
  };

  return (
    <View style={styles.card}>
      <ImageBackground
        source={bgUrl}
        style={[styles.cardImage, { height: scaledHeight }]}
        resizeMode="contain"
      >
        {layoutData.map((el, idx) => {
          if (el.isHidden) return null;
          return (
            <Text
              key={idx}
              style={{
                position: 'absolute',
                left: el.x * scale,
                top: el.y * scale,
                width: el.width * scale,
                height: el.height * scale,
                fontSize: Math.max(el.fontSize * scale, 6),
                color: el.color || '#000',
                fontWeight: el.fontWeight === 'bold' || el.fontWeight === 'semibold' ? 'bold' : 'normal',
                textAlign: el.textAlign || 'center',
                fontFamily: el.fontFamily ? `'${el.fontFamily}', sans-serif` : 'Arial, sans-serif',
              }}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {getVarText(el.id)}
            </Text>
          );
        })}
      </ImageBackground>
      <View style={styles.cardContent}>
        <AppText style={styles.titleText}>{item.title}</AppText>
        <View style={[styles.dateRow, { marginBottom: 6 }]}>
          <AppText style={styles.dateLabel}>Nomor Sertifikat</AppText>
          <AppText style={styles.dateValue}>{sertif.nomor_sertifikat || '-'}</AppText>
        </View>
        <View style={styles.dateRow}>
          <AppText style={styles.dateLabel}>Tanggal terbit</AppText>
          <AppText style={styles.dateValue}>{item.date}</AppText>
        </View>
      </View>
      <TouchableOpacity style={styles.downloadBtn} activeOpacity={0.8} onPress={() => onDownload(item)}>
        <AppText style={styles.downloadBtnText}>Unduh Sertifikat</AppText>
      </TouchableOpacity>
    </View>
  );
};

export default function SertifikatScreen({ route }) {
  const navigation = useNavigation();
  const token = route?.params?.token || null;
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseCertificates, setCourseCertificates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

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
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/sertifikat/grouped`, {
        headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${token}` }
      });
      const json = await res.json();
      if (json.status === 'success') {
        const formatted = json.data.data.map(p => {
          const mk = p.jadwal?.mata_kuliah?.nama_mk || '';
          const kelas = p.jadwal?.kelas?.nama_kelas || '';
          const prodi = p.jadwal?.prodi || 'Program Studi';
          return {
            id: p.id_peserta,
            courseName: `${mk} ${kelas ? '+ ' + kelas : ''}`.trim(),
            mkOnly: mk,
            prodi: prodi,
            kelas: kelas,
            dosen: p.jadwal?.dosen?.nama_lengkap || '-',
            nidn: p.jadwal?.dosen?.nomor_induk || '-',
            mahasiswaName: p.mahasiswa?.nama_lengkap || 'Tanpa Nama',
            certificates: (p.sertifikat || []).map(s => {
              const getTipeLabel = (tipe) => {
                  if (tipe === 'kelulusan') return 'Kelulusan';
                  if (tipe === 'nilai') return 'Daftar Nilai';
                  return 'Pelatihan';
              };
              return {
                id: s.id_sertifikat,
                title: `Sertifikat ${getTipeLabel(s.tipe_sertifikat)}`,
                date: s.tanggal_terbit ? new Date(s.tanggal_terbit).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-',
                rawSertif: s,
              };
            })
          };
        });
        setCourseCertificates(formatted);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (certItem) => {
    setIsDownloading(true);
    try {
      const sertif = certItem.rawSertif;
      const baseUrl = Platform.OS === 'android' ? API_BASE_URL : 'http://localhost:8000';
      const bgUrl = sertif.template?.id_template 
        ? `${baseUrl}/api/template-sertifikat/${sertif.template.id_template}/download-background` 
        : '';
      const layoutData = typeof sertif.template?.layout_data === 'string'
        ? JSON.parse(sertif.template.layout_data)
        : (sertif.template?.layout_data || []);

      const getTipeLabel = (tipe) => {
          if (tipe === 'kelulusan') return 'Kelulusan';
          if (tipe === 'nilai') return 'Daftar Nilai';
          return 'Pelatihan';
      };
      const tipeLabel = getTipeLabel(sertif.tipe_sertifikat);
      const mk = selectedCourse?.mkOnly || '';
      const mhs = selectedCourse?.mahasiswaName || 'Download';
      const namaFile = `Sertifikat ${tipeLabel} - ${mk} - ${mhs}.pdf`;

      const getVarText = (id) => {
        switch (id) {
          case 'nama_peserta': return mhs;
          case 'npm': return selectedCourse?.rawSertif?.peserta?.mahasiswa?.nomor_induk || '-'; // We might not have NPM, fallback to -
          case 'nomor_sertifikat': return sertif.nomor_sertifikat || '-';
          case 'mata_kuliah_kelas': return selectedCourse?.courseName || '-';
          case 'tanggal_terbit': return certItem.date;
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
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (bgUrl) {
          await new Promise((resolve, reject) => {
            const img = new window.Image();
            img.crossOrigin = 'Anonymous';
            img.onload = () => {
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
              resolve();
            };
            img.onerror = () => reject(new Error('Gagal memuat background'));
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
              ${layoutData.map(el => {
                if (el.isHidden) return '';
                const fontWeight = el.fontWeight === 'semibold' ? '600' : (el.fontWeight || 'normal');
                return `
                  <div class="text-element" style="left: ${el.x}px; top: ${el.y}px; width: ${el.width}px; height: ${el.height}px;">
                    <span class="text-content" style="text-align: ${el.textAlign || 'center'}; font-size: ${el.fontSize}px; color: ${el.color || '#000'}; font-weight: ${fontWeight}; font-family: '${el.fontFamily || 'Arial'}', sans-serif;">
                      ${getVarText(el.id)}
                    </span>
                  </div>
                `;
              }).join('')}
            </div>
          </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({ html, width: 1122, height: 794, base64: false });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      }
    } catch (err) {
      console.error(err);
      alert('Gagal mendownload sertifikat');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleBack = () => {
    if (selectedCourse) {
      setSelectedCourse(null);
    } else {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerClickArea} onPress={handleBack}>
          <View style={styles.backBtn}>
            <BackIcon />
          </View>
          <AppText style={styles.headerTitle}>{selectedCourse ? 'Daftar Sertifikat' : 'Sertifikat'}</AppText>
        </TouchableOpacity>
        
        {!selectedCourse && (
          <TouchableOpacity 
            style={styles.verifyBtnHeader} 
            onPress={() => navigation.navigate('VerifikasiSertifikat')}
            activeOpacity={0.8}
          >
            <VerifyIcon color="#FFFFFF" />
            <AppText style={styles.verifyBtnHeaderText}>Verifikasi</AppText>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.headerLine} />

      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          {!selectedCourse ? (
            /* COURSE LIST VIEW */
            <>
              <View style={styles.sectionHeader}>
                <AppText style={styles.sectionTitle}>Sertifikat dari mata kuliah yang di selesaikan</AppText>
              </View>
              {isLoading ? (
                <ActivityIndicator size="large" color="#116E63" style={{ marginTop: 40 }} />
              ) : (
                <>
                  {courseCertificates.length === 0 && (
                    <AppText style={styles.emptyText}>Mata kuliah tidak ditemukan.</AppText>
                  )}
                  {courseCertificates.map((course) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      onPress={() => setSelectedCourse(course)}
                    />
                  ))}
                </>
              )}
            </>
          ) : (
            /* CERTIFICATES LIST VIEW */
            <>
              <View style={styles.selectedCourseHeader}>
                <AppText style={styles.selectedCourseTitle}>{selectedCourse.courseName}</AppText>
                <AppText style={styles.selectedCourseDosen}>{selectedCourse.dosen}</AppText>
              </View>

              {selectedCourse.certificates.length === 0 ? (
                <AppText style={styles.emptyText}>Belum ada sertifikat diterbitkan.</AppText>
              ) : (
                <View style={styles.listContainer}>
                  {selectedCourse.certificates.map(cert => (
                    <CertificateCard key={cert.id} item={cert} selectedCourse={selectedCourse} onDownload={handleDownload} />
                  ))}
                </View>
              )}
            </>
          )}

        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 54, // Consistent 54px top padding
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: '#F9FAFB',
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
  verifyBtnHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#116E63',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#116E63',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  verifyBtnHeaderText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 6,
  },
  headerLine: {
    height: 1,
    backgroundColor: '#E5E7EB',
    width: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  sectionHeader: {
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 14,
    color: '#4B5563',
    fontWeight: '500'
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  listContainer: {
    padding: 24,
    paddingTop: 0,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 180,
  },
  cardContent: {
    padding: 16,
  },
  titleText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateLabel: {
    fontSize: 13,
    color: '#6B7280',
  },
  dateValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
  downloadBtn: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
  },
  downloadBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#116E63',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#9CA3AF',
    fontSize: 14,
  },
  // Course Card Styles
  courseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    flexDirection: 'column',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  courseCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  courseCardDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginHorizontal: 16,
  },
  courseCardBottom: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FAFAFA',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  courseIconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#E0F2F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  courseIconText: {
    color: '#116E63',
    fontSize: 16,
    fontWeight: 'bold',
  },
  courseContent: {
    flex: 1,
  },
  courseTitleText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  courseNidnText: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  courseDosenText: {
    fontSize: 14,
    color: '#4B5563',
  },
  // Selected Course Header
  selectedCourseHeader: {
    marginBottom: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  selectedCourseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  selectedCourseDosen: {
    fontSize: 14,
    color: '#4B5563',
  }
});
