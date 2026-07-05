import React, { useState, useEffect } from 'react';
import AppText from '../components/AppText';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StatusBar,
  Image,
  Platform,
  Linking,
  ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path, Circle, Polyline, Line } from 'react-native-svg';
import { API_BASE_URL } from '../config/api';
import { downloadMateri } from '../utils/downloadHelper';

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

const MateriCard = ({ item }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = () => {
    if (item.filePath) {
      downloadMateri(item.filePath, item.judulMateri, setIsDownloading);
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        <Image
          source={
            item.type === 'ppt' ? require('../assets/ppt.png') :
              item.type === 'doc' ? require('../assets/doc.png') :
                item.type === 'xls' ? require('../assets/xls.png') :
                  item.type === 'pdf' ? require('../assets/pdf.png') :
                    require('../assets/other.png')
          }
          style={styles.fileIcon}
          resizeMode="contain"
        />
      </View>
      <View style={styles.cardContent}>
        <AppText style={styles.titleText}>{item.fileName}</AppText>
        <AppText style={styles.courseText}>{item.judulMateri}</AppText>
        <AppText style={styles.courseText}>{item.pertemuan}</AppText>
        <AppText style={styles.dateText}>{item.date}</AppText>
      </View>
      <TouchableOpacity style={styles.downloadBtn} onPress={handleDownload} activeOpacity={0.7} disabled={isDownloading}>
        {isDownloading ? <ActivityIndicator size="small" color="#6B7280" /> : <DownloadIcon />}
      </TouchableOpacity>
    </View>
  );
};

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
      <AppText style={styles.courseDosenText}>{course.dosen}</AppText>
    </View>
  </TouchableOpacity>
);

export default function MateriScreen({ route }) {
  const navigation = useNavigation();
  const isRegistered = route?.params?.isRegistered || false;
  const user = route?.params?.user || null;
  const token = route?.params?.token || null;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);

  const [courses, setCourses] = useState([]);
  const [materials, setMaterials] = useState([]);
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
          API_URL = Platform.OS === 'android'
            ? `${API_BASE_URL}/api/mahasiswa/mata-kuliah`
            : `http://localhost:8000/api/mahasiswa/mata-kuliah`;
          headers['Authorization'] = `Bearer ${token}`;
        } else {
          API_URL = Platform.OS === 'android'
            ? `${API_BASE_URL}/api/public/mata-kuliah`
            : `http://localhost:8000/api/public/mata-kuliah`;
        }

        const response = await fetch(API_URL, { headers });
        const json = await response.json();
        if (json.status === 'success') {
          // If registered, show 'diambil'. Else show 'tersedia'.
          const rawCourses = isRegistered ? (json.data.diambil || []) : (json.data.tersedia || []);
          const coursesWithMaterials = rawCourses.filter(c => c.has_materi);
          setCourses(coursesWithMaterials);
        }
      } catch (error) {
        console.error("Fetch Courses Error: ", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMataKuliah();
  }, [isRegistered, token]);

  const fetchMaterials = async (courseId) => {
    setIsLoading(true);
    try {
      const baseUrl = Platform.OS === 'android' ? API_BASE_URL : 'http://localhost:8000';
      const headers = { 'Accept': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`${baseUrl}/api/materi/jadwal/${courseId}`, { headers });
      const json = await response.json();
      if (json.status === 'success') {
        let allMaterials = [];
        json.data.forEach(materi => {
          if (materi.file_materi && materi.file_materi.length > 0) {
            materi.file_materi.forEach((filePath, index) => {
              let ext = filePath.split('.').pop().toLowerCase();
              let type = 'other';
              if (['pdf'].includes(ext)) type = 'pdf';
              else if (['ppt', 'pptx'].includes(ext)) type = 'ppt';
              else if (['doc', 'docx'].includes(ext)) type = 'doc';
              else if (['xls', 'xlsx'].includes(ext)) type = 'xls';

              // Extract filename
              let fileName = filePath.split('/').pop();
              fileName = fileName.replace(/^[a-f0-9\-]+_/, '');

              allMaterials.push({
                id: `${materi.id}_${index}`,
                judulMateri: materi.judul,
                pertemuan: materi.pertemuan,
                fileName: fileName,
                date: materi.tanggal || '-',
                type: type,
                filePath: filePath,
              });
            });
          }
        });
        setMaterials(allMaterials);
      }
    } catch (error) {
      console.error("Fetch Materials Error: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (selectedCourse) {
      setSelectedCourse(null);
      setSearchQuery('');
    } else {
      navigation.goBack();
    }
  };

  const filteredCourses = courses.filter(c => {
    const titleMatch = c.title ? c.title.toLowerCase().includes(searchQuery.toLowerCase()) : false;
    const dosenMatch = c.dosen ? c.dosen.toLowerCase().includes(searchQuery.toLowerCase()) : false;
    return titleMatch || dosenMatch;
  });

  const filteredMaterials = selectedCourse ? materials.filter(m =>
    (m.fileName && m.fileName.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (m.judulMateri && m.judulMateri.toLowerCase().includes(searchQuery.toLowerCase()))
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
              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#116E63" />
                  <AppText style={styles.loadingText}>Memuat data...</AppText>
                </View>
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
                        if (isRegistered && token) {
                          fetchMaterials(course.id);
                        } else {
                          // Optionally, public users don't see materials or use another API
                          // For now, if there is a public API, fetch it (but we assume it requires login for materials)
                        }
                      }}
                    />
                  ))}
                </>
              )}
            </>
          ) : (
            /* MATERIALS LIST VIEW */
            <>
              <View style={styles.selectedCourseHeader}>
                <AppText style={styles.selectedCourseTitle}>{selectedCourse.title}</AppText>
                <AppText style={styles.selectedCourseDosen}>{selectedCourse.dosen}</AppText>
              </View>

              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#116E63" />
                  <AppText style={styles.loadingText}>Memuat data...</AppText>
                </View>
              ) : (
                <>
                  {filteredMaterials.length === 0 && (
                    <AppText style={styles.emptyText}>Materi tidak ditemukan.</AppText>
                  )}
                  {filteredMaterials.map(materi => (
                    <MateriCard key={materi.id} item={{ ...materi, course: selectedCourse.title }} />
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
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  loadingText: {
    marginTop: 12,
    color: '#6B7280',
    fontSize: 14,
  },
  // Course Card Styles
  separator: {
    height: 1,
    backgroundColor: '#E5E7EB',
    width: '100%',
    marginTop: 8,
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
