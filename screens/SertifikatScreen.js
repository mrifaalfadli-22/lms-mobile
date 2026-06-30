import React, { useState } from 'react';
import AppText from '../components/AppText';
import {
  View,

  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Image,
  Dimensions
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path } from 'react-native-svg';

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
    <View style={styles.courseIconBox}>
      <AppText style={styles.courseIconText}>{course.courseName.substring(0, 2).toUpperCase()}</AppText>
    </View>
    <View style={styles.courseContent}>
      <AppText style={styles.courseTitleText}>{course.courseName}</AppText>
      <AppText style={styles.courseDosenText}>{course.dosen}</AppText>
      <AppText style={styles.courseNidnText}>NIDN: {course.nidn}</AppText>
    </View>
    <ChevronRightIcon />
  </TouchableOpacity>
);

const CertificateCard = ({ item }) => (
  <View style={styles.card}>
    <Image source={require('../assets/sertifikat.png')} style={styles.cardImage} resizeMode="cover" />
    <View style={styles.cardContent}>
      <AppText style={styles.titleText} numberOfLines={2}>{item.title}</AppText>
      <View style={styles.dateRow}>
        <AppText style={styles.dateLabel}>Tanggal terbit</AppText>
        <AppText style={styles.dateValue}>{item.date}</AppText>
      </View>
    </View>
    <View style={styles.cardDivider} />
    <TouchableOpacity style={styles.downloadBtn} activeOpacity={0.7}>
      <AppText style={styles.downloadBtnText}>Download</AppText>
    </TouchableOpacity>
  </View>
);

export default function SertifikatScreen() {
  const navigation = useNavigation();
  const [selectedCourse, setSelectedCourse] = useState(null);

  const courseCertificates = [
    {
      id: 'c1',
      courseName: 'Pemrograman Web + Praktikum',
      dosen: 'Yulianto, M.Kom',
      nidn: '0412345678',
      certificates: [
        { id: '1', title: 'Sertifikat Kelulusan Utama', date: '10 Mei 2026' },
        { id: '2', title: 'Sertifikat Praktikum', date: '12 Mei 2026' }
      ]
    },
    {
      id: 'c2',
      courseName: 'Kalkulus 1',
      dosen: 'Dr. Ahmad Fauzi, M.Si.',
      nidn: '0498765432',
      certificates: [
        { id: '3', title: 'Sertifikat Kelulusan', date: '10 Mei 2026' }
      ]
    }
  ];

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
                <View style={styles.gridContainer}>
                  {selectedCourse.certificates.map(cert => (
                    <CertificateCard key={cert.id} item={cert} />
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
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  card: {
    width: cardWidth,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 100,
  },
  cardContent: {
    padding: 12,
  },
  titleText: {
    fontSize: 13,
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
    color: '#909090',
  },
  dateValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    width: '100%',
  },
  downloadBtn: {
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  downloadBtnText: {
    fontSize: 13,
    color: '#4B5563',
    fontWeight: '500',
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
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
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
  courseDosenText: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 2,
  },
  courseNidnText: {
    fontSize: 13,
    color: '#9CA3AF',
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
