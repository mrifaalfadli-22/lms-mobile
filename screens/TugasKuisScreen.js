import React, { useState, useEffect } from 'react';
import AppText from '../components/AppText';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  StatusBar,
  Platform,
  ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path, Circle } from 'react-native-svg';
import { API_BASE_URL } from '../config/api';

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
    <View style={styles.courseCardTop}>
      <View style={styles.courseIconBox}>
        <AppText style={styles.courseIconText}>{course?.title ? course.title.substring(0, 2).toUpperCase() : 'MK'}</AppText>
      </View>
      <View style={styles.courseContent}>
        <AppText style={styles.courseTitleText}>{course.title}</AppText>
        <AppText style={styles.courseNidnText}>{(course.prodi || 'Program Studi')} . {(course.kelas || 'Kelas')}</AppText>
      </View>
      <ChevronRightIcon />
    </View>
    <View style={styles.courseCardDivider} />
    <View style={styles.courseCardBottom}>
      <AppText style={styles.courseDosenText}>{course.dosen || 'Dosen tidak diketahui'}</AppText>
    </View>
  </TouchableOpacity>
);

const AssignmentCard = ({ item, course, onPress }) => {
  const isDinilai = item.nilai !== null && item.nilai !== undefined;
  const isDikerjakan = item.status_pengerjaan === 'Sudah Dikerjakan';

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.headerInfo}>
          <AppText style={styles.dateText}>
            Batas waktu : {new Date(item.batas_waktu).toLocaleDateString('id-ID')}, {new Date(item.batas_waktu).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false }).replace(/\./g, ':')}
          </AppText>
        </View>
      </View>
      <AppText style={styles.titleText}>{item.judul_tugas}</AppText>
      <AppText style={styles.descText}>{item.deskripsi_tugas}</AppText>

      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.btnLihat} onPress={onPress}>
          <AppText style={styles.btnLihatText}>Lihat tugas</AppText>
        </TouchableOpacity>

        {isDikerjakan ? (
          <View style={[styles.statusBadge, { backgroundColor: isDinilai ? '#E0F2F1' : '#E5E7EB' }]}>
            <AppText style={[styles.statusText, { color: isDinilai ? '#116E63' : '#4B5563' }]}>
              {isDinilai ? `Sudah Dinilai - ${item.nilai}` : 'Sudah Dikerjakan'}
            </AppText>
          </View>
        ) : (
          <View style={[styles.statusBadge, { backgroundColor: '#FEE2E2' }]}>
            <AppText style={[styles.statusText, { color: '#DC2626' }]}>Belum Dikerjakan</AppText>
          </View>
        )}
      </View>
    </View>
  );
};

export default function TugasKuisScreen({ route }) {
  const navigation = useNavigation();
  const isRegistered = route?.params?.isRegistered || false;
  const user = route?.params?.user || null;
  const token = route?.params?.token || null;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);

  const [courses, setCourses] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchMataKuliah = async () => {
      setIsLoading(true);
      try {
        let API_URL = '';
        let headers = {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        };

        if (isRegistered && token) {
          API_URL = `${API_BASE_URL}/api/mahasiswa/mata-kuliah`;
          headers['Authorization'] = `Bearer ${token}`;
        } else {
          API_URL = `${API_BASE_URL}/api/public/mata-kuliah`;
        }

        const response = await fetch(API_URL, { headers });
        const json = await response.json();
        if (json.status === 'success') {
          const rawCourses = isRegistered ? (json.data.diambil || []) : (json.data.tersedia || []);
          const coursesWithTasks = rawCourses.filter(c => c.has_tugas);
          setCourses(coursesWithTasks);
        }
      } catch (error) {
        console.error("Fetch Courses Error: ", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMataKuliah();
  }, [isRegistered, token]);

  const fetchTasks = async (courseId) => {
    setIsLoading(true);
    try {
      const baseUrl = API_BASE_URL;
      const headers = { 'Accept': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`${baseUrl}/api/tugas/jadwal/${courseId}`, { headers });
      const json = await response.json();
      if (json.status === 'success') {
        setTasks(json.data || []);
      }
    } catch (error) {
      console.error("Fetch Tasks Error: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (selectedCourse) {
      setSelectedCourse(null);
      setSearchQuery('');
      setTasks([]);
    } else {
      navigation.goBack();
    }
  };

  const filteredCourses = courses.filter(c =>
    (c.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.dosen || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTasks = tasks.filter(t =>
    (t.judul_tugas || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (t.deskripsi_tugas || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              {isLoading ? (
                <ActivityIndicator size="large" color="#116E63" style={{ marginTop: 20 }} />
              ) : (
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
                        fetchTasks(course.id);
                      }}
                    />
                  ))}
                </>
              )}
            </>
          ) : (
            /* TASKS LIST VIEW */
            <>
              <View style={styles.selectedCourseHeader}>
                <AppText style={styles.selectedCourseTitle}>{selectedCourse.title}</AppText>
                <AppText style={styles.selectedCourseDosen}>{selectedCourse.dosen}</AppText>
              </View>

              {isLoading ? (
                <ActivityIndicator size="large" color="#116E63" style={{ marginTop: 20 }} />
              ) : (
                <>
                  {filteredTasks.length === 0 && (
                    <AppText style={styles.emptyText}>Tidak ada tugas untuk saat ini.</AppText>
                  )}
                  {filteredTasks.map(task => (
                    <AssignmentCard
                      key={task.id_tugas}
                      item={task}
                      course={selectedCourse}
                      onPress={() => {
                        const meeting = {
                          ...task.sesi_pertemuan,
                          ...task.sesiPertemuan,
                          id: task.id_sesi
                        };
                        navigation.navigate('DetailSesi', { meeting, course: selectedCourse, userToken: token });
                      }}
                    />
                  ))}
                </>
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
  courseDosenText: {
    fontSize: 14,
    color: '#4B5563',
  },
  courseNidnText: {
    fontSize: 13,
    color: '#909090',
  },
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
  subtitleText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#111827',
  },
  dateText: {
    fontSize: 12,
    color: '#be3147ff',
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
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  btnLihat: {
    backgroundColor: '#116E63',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  btnLihatText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  statusBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  }
});
