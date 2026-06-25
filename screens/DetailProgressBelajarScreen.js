import React, { useState } from 'react';
import {
  View,
  Text,
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
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerClickArea} onPress={() => navigation.goBack()}>
            <View style={styles.backBtn}>
              <BackIcon />
            </View>
            <Text style={styles.headerTitle}>Progress belajar kamu</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.headerLine} />

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Top Summary Stats */}
          <View style={styles.statsCard}>
            <View style={styles.statColumn}>
              <Text style={styles.statLabel}>Absensi</Text>
              <Text style={styles.statValue}>8 / 10</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statColumn}>
              <Text style={styles.statLabel}>Tugas & Kuis selesai</Text>
              <Text style={styles.statValue}>10 / 10</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statColumn}>
              <Text style={styles.statLabel}>Ujian</Text>
              <Text style={styles.statValue}>2 / 2</Text>
            </View>
          </View>

          {/* Section: Nilai Tugas */}
          <Text style={styles.sectionTitle}>Nilai tugas kamu</Text>
          <View style={styles.card}>
            <TouchableOpacity 
              style={styles.cardHeader} 
              activeOpacity={0.7} 
              onPress={() => setIsTugasExpanded(!isTugasExpanded)}
            >
              <Text style={styles.courseTitle}>{course.title}</Text>
              {isTugasExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
            </TouchableOpacity>
            
            {isTugasExpanded && (
              <View style={styles.cardBody}>
                <Text style={styles.tugasTitle}>Tugas 1</Text>
                <Text style={styles.tugasDesc}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam volutpat semper dui et lobortis.
                </Text>
                
                <View style={styles.gradeBox}>
                  <Text style={styles.gradeLabel}>Nilai kamu</Text>
                  <Text style={styles.gradeValue}>80</Text>
                </View>
              </View>
            )}
          </View>

          {/* Section: Sertifikat Kamu */}
          <Text style={styles.sectionTitle}>Sertifikat kamu</Text>
          <View style={styles.sertifikatCard}>
            <Image 
              source={require('../assets/sertifikat.png')} 
              style={styles.sertifikatImage} 
              resizeMode="cover" 
            />
            
            <View style={styles.sertifikatInfo}>
              <Text style={styles.sertifikatTitle}>Kalkulus 1</Text>
              <View style={styles.sertifikatDateRow}>
                <Text style={styles.sertifikatDateLabel}>Tanggal terbit</Text>
                <Text style={styles.sertifikatDateValue}>10 Mei 2026</Text>
              </View>
            </View>
            
            <TouchableOpacity style={styles.downloadBtn} activeOpacity={0.8}>
              <Text style={styles.downloadBtnText}>Download</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </SafeAreaView>
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
    paddingTop: 12,
    paddingHorizontal: 20,
    paddingBottom: 16,
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
    backgroundColor: '#2E7D70',
    borderRadius: 12,
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: 'center',
    marginBottom: 32,
    elevation: 4,
    shadowColor: '#2E7D70',
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
    fontSize: 10,
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
    fontSize: 14,
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
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  tugasDesc: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 16,
  },
  gradeBox: {
    backgroundColor: '#2E7D70',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
    alignItems: 'center',
  },
  gradeLabel: {
    color: '#E2E8F0',
    fontSize: 10,
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
    fontSize: 12,
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
