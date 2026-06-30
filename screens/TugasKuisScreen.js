import React, { useState } from 'react';
import AppText from '../components/AppText';
import {
  View,

  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  StatusBar
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path, Circle } from 'react-native-svg';

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

const ChevronRightIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path d="M9 18l6-6-6-6" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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

const AssignmentCard = ({ item }) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <Image source={item.avatar} style={styles.avatar} />
      <View style={styles.headerInfo}>
        <AppText style={styles.lecturerText}>{item.lecturer} - {item.course}</AppText>
        <AppText style={styles.dateText}>Diupload : {item.date}</AppText>
      </View>
    </View>
    <AppText style={styles.titleText}>{item.title}</AppText>
    <AppText style={styles.descText}>{item.desc}</AppText>
    <TouchableOpacity style={styles.btnLihat}>
      <AppText style={styles.btnLihatText}>Lihat tugas</AppText>
    </TouchableOpacity>
  </View>
);

export default function TugasKuisScreen() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);

  const courseTasks = [
    {
      id: 'c1',
      courseName: 'Pemrograman Web + Praktikum',
      dosen: 'Yulianto, M.Kom',
      nidn: '0412345678',
      tasks: [
        {
          id: '1',
          lecturer: 'Yulianto, M.Kom',
          course: 'Pemrograman Web + Praktikum',
          date: '16 Juni 2026 - 20.26',
          title: 'Tugas Akhir Semester: Aplikasi E-Commerce',
          desc: 'Buatlah aplikasi web e-commerce menggunakan React.js dan Node.js. Pastikan ada fitur keranjang dan checkout. Tenggat waktu 30 Juni 2026.',
          avatar: require('../assets/dosen.png')
        },
        {
          id: '2',
          lecturer: 'Yulianto, M.Kom',
          course: 'Pemrograman Web + Praktikum',
          date: '10 Juni 2026 - 13.00',
          title: 'Kuis 1: Dasar HTML & CSS',
          desc: 'Kerjakan soal pilihan ganda tentang struktur dasar HTML dan layouting dengan CSS.',
          avatar: require('../assets/dosen.png')
        }
      ]
    },
    {
      id: 'c2',
      courseName: 'Kalkulus 1',
      dosen: 'Dr. Ahmad Fauzi, M.Si.',
      nidn: '0498765432',
      tasks: [
        {
          id: '3',
          lecturer: 'Dr. Ahmad Fauzi, M.Si.',
          course: 'Kalkulus 1',
          date: '18 Juni 2026 - 08.00',
          title: 'Latihan Soal Limit dan Kontinuitas',
          desc: 'Kerjakan soal latihan bab 2 nomor 1 sampai 10 di kertas folio. Scan lalu kumpulkan dalam format PDF.',
          avatar: require('../assets/dosen.png')
        }
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

  const filteredCourses = courseTasks.filter(c =>
    c.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.dosen.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTasks = selectedCourse ? selectedCourse.tasks.filter(t =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.desc.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerClickArea} onPress={handleBack}>
          <View style={styles.backBtn}>
            <BackIcon />
          </View>
          <AppText style={styles.headerTitle}>{selectedCourse ? 'Daftar Tugas' : 'Tugas & Kuis kamu'}</AppText>
        </TouchableOpacity>
      </View>
      <View style={styles.headerLine} />

      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder={selectedCourse ? "Cari tugas..." : "Cari mata kuliah atau dosen..."}
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
            /* TASKS LIST VIEW */
            <>
              <View style={styles.selectedCourseHeader}>
                <AppText style={styles.selectedCourseTitle}>{selectedCourse.courseName}</AppText>
                <AppText style={styles.selectedCourseDosen}>{selectedCourse.dosen}</AppText>
              </View>

              {filteredTasks.length === 0 && (
                <AppText style={styles.emptyText}>Tidak ada tugas untuk saat ini.</AppText>
              )}
              {filteredTasks.map(task => (
                <AssignmentCard key={task.id} item={task} />
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
  // Course Card Styles (Matched with MateriScreen)
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
  // Assignment Card Styles
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#D1D5DB',
    marginRight: 10,
  },
  headerInfo: {
    flex: 1,
  },
  lecturerText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
  dateText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  titleText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    lineHeight: 18,
    marginBottom: 6,
  },
  descText: {
    fontSize: 12,
    color: '#4B5563',
    lineHeight: 16,
    marginBottom: 16,
  },
  btnLihat: {
    backgroundColor: '#116E63',
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  btnLihatText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  }
});
