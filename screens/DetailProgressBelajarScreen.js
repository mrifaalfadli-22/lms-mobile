import React, { useState } from 'react';
import AppText from '../components/AppText';
import {
  View,

  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ImageBackground,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
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

  // We can access the passed course item, or default to some values
  const course = route?.params?.item || {
    title: 'Pemrograman Web + Praktikum',
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
              <AppText style={styles.statValue}>8 / 10</AppText>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statColumn}>
              <AppText style={styles.statLabel}>Tugas & Kuis selesai</AppText>
              <AppText style={styles.statValue}>10 / 10</AppText>
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
                <AppText style={styles.tugasTitle}>Tugas 1</AppText>
                <AppText style={styles.tugasDesc}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam volutpat semper dui et lobortis.
                </AppText>

                <View style={styles.gradeBox}>
                  <AppText style={styles.gradeLabel}>Nilai kamu</AppText>
                  <AppText style={styles.gradeValue}>80</AppText>
                </View>
              </View>
            )}
          </View>

          {/* Section: Sertifikat Kamu */}
          <AppText style={styles.sectionTitle}>Sertifikat kamu</AppText>
          <View style={styles.sertifikatCard}>
            <Image
              source={require('../assets/sertifikat.png')}
              style={styles.sertifikatImage}
              resizeMode="cover"
            />

            <View style={styles.sertifikatInfo}>
              <AppText style={styles.sertifikatTitle}>Kalkulus 1</AppText>
              <View style={styles.sertifikatDateRow}>
                <AppText style={styles.sertifikatDateLabel}>Tanggal terbit</AppText>
                <AppText style={styles.sertifikatDateValue}>10 Mei 2026</AppText>
              </View>
            </View>

            <TouchableOpacity style={styles.downloadBtn} activeOpacity={0.8}>
              <AppText style={styles.downloadBtnText}>Download</AppText>
            </TouchableOpacity>
          </View>

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
