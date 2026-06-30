import React, { useState } from 'react';
import AppText from '../components/AppText';
import {
  View,

  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StatusBar,
  Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path, Circle, Polyline, Line } from 'react-native-svg';

const BackIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M15 18L9 12L15 6" stroke="#4B5563" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const SearchIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Circle cx="11" cy="11" r="8" stroke="#FFFFFF" strokeWidth="2" />
    <Path d="M21 21l-4.35-4.35" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const DownloadIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Polyline points="7 10 12 15 17 10" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Line x1="12" y1="15" x2="12" y2="3" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ChevronRightIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path d="M9 18l6-6-6-6" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const MateriCard = ({ item }) => (
  <View style={styles.card}>
    <View style={styles.iconContainer}>
      <Image
        source={item.type === 'ppt' ? require('../assets/ppt.png') : require('../assets/pdf.png')}
        style={styles.fileIcon}
        resizeMode="contain"
      />
    </View>
    <View style={styles.cardContent}>
      <AppText style={styles.titleText}>{item.title}</AppText>
      <AppText style={styles.courseText}>{item.course}</AppText>
      <AppText style={styles.dateText}>{item.date}</AppText>
    </View>
    <TouchableOpacity style={styles.downloadBtn}>
      <DownloadIcon />
    </TouchableOpacity>
  </View>
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

export default function MateriScreen() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);

  const courseMaterials = [
    {
      id: 'c1',
      courseName: 'Pemrograman Web + Praktikum',
      dosen: 'Rifa Alfadli, S.Kom., M.Kom.',
      nidn: '0412345678',
      materials: [
        { id: '1', title: 'Pengenalan dasar HTML', date: '15 Juni 2026', type: 'ppt' },
        { id: '3', title: 'CSS Dasar dan Layouting', date: '16 Juni 2026', type: 'pdf' },
        { id: '4', title: 'JavaScript DOM', date: '17 Juni 2026', type: 'pdf' },
        { id: '5', title: 'React JS Introduction', date: '18 Juni 2026', type: 'ppt' },
      ]
    },
    {
      id: 'c2',
      courseName: 'Kalkulus 1',
      dosen: 'Dr. Ahmad Fauzi, M.Si.',
      nidn: '0498765432',
      materials: [
        { id: '2', title: 'Limit dan Kontinuitas', date: '15 Juni 2026', type: 'pdf' },
        { id: '6', title: 'Turunan Dasar', date: '20 Juni 2026', type: 'pdf' },
        { id: '7', title: 'Aplikasi Turunan', date: '22 Juni 2026', type: 'ppt' },
      ]
    }
  ];

  const handleBack = () => {
    if (selectedCourse) {
      setSelectedCourse(null);
      setSearchQuery('');
    } else {
      navigation.goBack();
    }
  };

  const filteredCourses = courseMaterials.filter(c =>
    c.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.dosen.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMaterials = selectedCourse ? selectedCourse.materials.filter(m =>
    m.title.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerClickArea} onPress={handleBack}>
          <View style={styles.backBtn}>
            <BackIcon />
          </View>
          <AppText style={styles.headerTitle}>{selectedCourse ? 'Materi Mata Kuliah' : 'Materi'}</AppText>
        </TouchableOpacity>
      </View>
      <View style={styles.headerLine} />

      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder={selectedCourse ? "Cari materi..." : "Cari mata kuliah atau dosen..."}
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <TouchableOpacity style={styles.searchBtn}>
              <SearchIcon />
            </TouchableOpacity>
          </View>

          {!selectedCourse ? (
            /* COURSE LIST VIEW */
            <>
              {filteredCourses.length === 0 && (
                <AppText style={styles.emptyText}>Mata kuliah tidak ditemukan.</AppText>
              )}
              {filteredCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onPress={() => {
                    setSelectedCourse(course);
                    setSearchQuery('');
                  }}
                />
              ))}
            </>
          ) : (
            /* MATERIALS LIST VIEW */
            <>
              <View style={styles.selectedCourseHeader}>
                <AppText style={styles.selectedCourseTitle}>{selectedCourse.courseName}</AppText>
                <AppText style={styles.selectedCourseDosen}>{selectedCourse.dosen}</AppText>
              </View>

              {filteredMaterials.length === 0 && (
                <AppText style={styles.emptyText}>Materi tidak ditemukan.</AppText>
              )}
              {filteredMaterials.map(materi => (
                <MateriCard key={materi.id} item={{ ...materi, course: selectedCourse.courseName }} />
              ))}
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
    paddingTop: 54,
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
  headerLine: {
    height: 1,
    backgroundColor: '#E5E7EB',
    width: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingLeft: 16,
    paddingRight: 6,
    paddingVertical: 6,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
    paddingVertical: 8,
  },
  searchBtn: {
    backgroundColor: '#116E63',
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
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
    color: '#909090',
  },
  // Selected Course Header
  selectedCourseHeader: {
    marginBottom: 20,
    paddingBottom: 16,
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
  },
  // Material Card Styles
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  iconContainer: {
    marginRight: 12,
  },
  fileIcon: {
    width: 40,
    height: 40,
  },
  cardContent: {
    flex: 1,
  },
  titleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  courseText: {
    fontSize: 13,
    color: '#4B5563',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 13,
    color: '#909090',
  },
  downloadBtn: {
    padding: 8,
  }
});
