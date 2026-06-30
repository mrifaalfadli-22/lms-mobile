import React, { useState, useRef, useEffect } from 'react';
import AppText from '../components/AppText';
import {
  View,

  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  StatusBar,
  ImageBackground,
  Animated,
  TextInput,
  Alert,
  Platform
} from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import YoutubePlayer from 'react-native-youtube-iframe';

const { width, height } = Dimensions.get('window');

const PRIMARY = '#116E63'; // Updated green to match the rest of the app
const BG_COLOR = '#F9FAFB';

const ChevronLeft = () => (
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

const CloseIcon = () => (
  <Svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <Path d="M18 6L6 18M6 6l12 12" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);


const YoutubePlayIcon = () => (
  <Svg width="40" height="28" viewBox="0 0 48 32" fill="none">
    <Path d="M46.5 5.5A5.8 5.8 0 0 0 42.4 1.4C38.8 0.5 24 0.5 24 0.5S9.2 0.5 5.6 1.4A5.8 5.8 0 0 0 1.5 5.5C0.5 9.2 0.5 16 0.5 16s0 6.8 1 10.5a5.8 5.8 0 0 0 4.1 4.1C9.2 31.5 24 31.5 24 31.5s14.8 0 18.4-1c2.2-.6 4-2.4 4.5-4.6 1-3.7 1-10.4 1-10.4s0-6.8-1-10z" fill="#FF0000" />
    <Path d="M19 22.5l13-6.5-13-6.5v13z" fill="#FFF" />
  </Svg>
);

export default function DetailMataKuliahScreen({ navigation, route }) {
  const isRegistered = route?.params?.isRegistered || false;
  const course = route?.params?.course;
  const courseName = course?.title || "Pemrograman Web + Praktikum";
  const lecturer = course?.dosen || course?.lecturer || "Yulianto M.Kom";
  const userToken = route?.params?.token;
  const isDiambil = route?.params?.isDiambil || false;

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [enrollToken, setEnrollToken] = useState('');
  const [hasJoined, setHasJoined] = useState(isDiambil);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [activeTab, setActiveTab] = useState('pertemuan');
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [meetings, setMeetings] = useState([]);
  const [isLoadingMeetings, setIsLoadingMeetings] = useState(true);
  const [materials, setMaterials] = useState([]);
  const [isLoadingMaterials, setIsLoadingMaterials] = useState(false);
  const [assignments, setAssignments] = useState([]);
  const [isLoadingAssignments, setIsLoadingAssignments] = useState(false);

  useEffect(() => {
    if (course?.id) {
      const fetchMeetings = async () => {
        setIsLoadingMeetings(true);
        try {
          let API_URL = '';
          let headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          };

          if (isRegistered && userToken) {
            API_URL = Platform.OS === 'android'
              ? `http://10.0.2.2:8000/api/sesi-pertemuan/jadwal/${course.id}`
              : `http://localhost:8000/api/sesi-pertemuan/jadwal/${course.id}`;
            headers['Authorization'] = `Bearer ${userToken}`;
          } else {
            API_URL = Platform.OS === 'android'
              ? `http://10.0.2.2:8000/api/public/sesi-pertemuan/jadwal/${course.id}`
              : `http://localhost:8000/api/public/sesi-pertemuan/jadwal/${course.id}`;
          }

          const response = await fetch(API_URL, {
            method: 'GET',
            headers: headers
          });

          const json = await response.json();
          if (json.status === 'success') {
            const fetchedMeetings = json.data.map(sesi => {
              const dateObj = new Date(sesi.tanggal_pelaksanaan);
              const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
              const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

              const dayName = days[dateObj.getDay()];
              const dateNum = dateObj.getDate();
              const monthName = months[dateObj.getMonth()];
              const year = dateObj.getFullYear();

              const jamMulai = sesi.jam_mulai ? sesi.jam_mulai.substring(0, 5) : '';
              const jamBerakhir = sesi.jam_berakhir ? sesi.jam_berakhir.substring(0, 5) : '';
              const timeString = `${dayName}, ${dateNum} ${monthName} ${year}   ${jamMulai} - ${jamBerakhir}`;

              return {
                id: sesi.id_sesi,
                title: sesi.judul_sesi || `Pertemuan ${sesi.pertemuan_ke}`,
                topic: sesi.materi || '-',
                lecturer: lecturer,
                method: sesi.metode_pertemuan,
                time: timeString,
                link_kelas_daring: sesi.link_kelas_daring,
                rawMateri: sesi.materi
              };
            });
            setMeetings(fetchedMeetings);
          }
        } catch (error) {
          console.error("Fetch Meetings Error: ", error);
          Alert.alert("Fetch Error", error.message || error.toString());
        } finally {
          setIsLoadingMeetings(false);
        }
      };

      const fetchMaterials = async () => {
        setIsLoadingMaterials(true);
        try {
          const baseUrl = Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://localhost:8000';
          const response = await fetch(`${baseUrl}/api/materi/jadwal/${course.id}`, {
            headers: {
              'Accept': 'application/json',
              'Authorization': `Bearer ${userToken}`
            }
          });
          const json = await response.json();
          if (json.status === 'success') {
            setMaterials(json.data);
          }
        } catch (error) {
          console.error("Fetch Materials Error: ", error);
        } finally {
          setIsLoadingMaterials(false);
        }
      };

      const fetchAssignments = async () => {
        setIsLoadingAssignments(true);
        try {
          const baseUrl = Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://localhost:8000';
          const response = await fetch(`${baseUrl}/api/tugas/jadwal/${course.id}`, {
            headers: {
              'Accept': 'application/json',
              'Authorization': `Bearer ${userToken}`
            }
          });
          const json = await response.json();
          if (json.status === 'success') {
            const fetchedAssignments = json.data.map(tugas => {
              const meetingTitle = tugas.sesi_pertemuan?.judul_sesi || `Pertemuan ${tugas.sesi_pertemuan?.pertemuan_ke || '-'}`;
              const topic = tugas.sesi_pertemuan?.materi || '-';

              // Format time
              let timeStr = '-';
              if (tugas.batas_waktu) {
                const dateObj = new Date(tugas.batas_waktu);
                const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
                const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
                const dayName = days[dateObj.getDay()];
                const dateNum = dateObj.getDate();
                const monthName = months[dateObj.getMonth()];
                const year = dateObj.getFullYear();
                const hh = String(dateObj.getHours()).padStart(2, '0');
                const mm = String(dateObj.getMinutes()).padStart(2, '0');
                timeStr = `${dayName}, ${dateNum} ${monthName} ${year} - ${hh}.${mm}`;
              }

              return {
                id: tugas.id_tugas,
                meetingTitle: meetingTitle,
                topic: topic,
                lecturer: lecturer,
                action: 'Membagikan tugas',
                time: timeStr,
                title: tugas.judul_tugas,
                desc: tugas.deskripsi_tugas,
                id_sesi: tugas.id_sesi
              };
            });
            setAssignments(fetchedAssignments);
          }
        } catch (error) {
          console.error("Fetch Assignments Error: ", error);
        } finally {
          setIsLoadingAssignments(false);
        }
      };

      fetchMeetings();
      if (isRegistered && userToken) {
        fetchMaterials();
        fetchAssignments();
      }
    }
  }, [course?.id, userToken, lecturer, isRegistered]);

  const openMeetingModal = (meeting) => {
    if (!isRegistered) {
      setModalVisible(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }).start();
      return;
    }

    setSelectedMeeting(meeting);
    setModalVisible(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  const closeMeetingModal = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
      setEnrollToken('');
    });
  };

  const handleEnroll = async () => {
    if (!enrollToken.trim()) {
      Alert.alert('Gagal', 'Silakan masukkan token terlebih dahulu.');
      return;
    }

    setIsEnrolling(true);
    try {
      const API_URL = Platform.OS === 'android'
        ? 'http://10.0.2.2:8000/api/peserta-kelas/enroll'
        : 'http://localhost:8000/api/peserta-kelas/enroll';

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify({ token_enrollment: enrollToken })
      });

      const json = await response.json();
      if (json.success) {
        Alert.alert('Sukses', 'Anda berhasil bergabung ke kelas ini.');
        setHasJoined(true);
        closeMeetingModal();
        navigation.goBack(); // Trigger refresh on MataKuliahScreen
      } else {
        Alert.alert('Gagal', json.message || 'Token tidak valid atau sudah terdaftar.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Terjadi kesalahan jaringan.');
    } finally {
      setIsEnrolling(false);
    }
  };





  return (
    <ImageBackground
      source={require('../assets/bg-pattern.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <ChevronLeft />
          <AppText style={styles.headerTitle}>Detail mata kuliah</AppText>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* HERO IMAGE SECTION */}
        <View style={styles.heroContainer}>
          <Image
            source={require('../assets/dosen.png')}
            style={styles.heroImage}
            resizeMode="cover"
          />
          {/* Gradient Overlay using expo-linear-gradient */}
          <LinearGradient
            colors={['transparent', 'rgba(37, 138, 122, 0.4)', 'rgba(37, 138, 122, 0.9)']}
            style={styles.gradientOverlay}
          />
          <View style={styles.heroTextContainer}>
            <AppText style={styles.heroTitle}>{courseName}</AppText>
            <AppText style={styles.heroSubtitle}>{lecturer}</AppText>
          </View>
        </View>

        {/* SPACER FOR PATTERN IN DESIGN */}
        <View style={styles.patternSpacer} />

        {/* MAIN CONTENT CONTAINER */}
        <View style={styles.contentContainer}>
          <AppText style={styles.contentTitle}>{courseName}</AppText>
          <AppText style={styles.contentLecturer}>{lecturer}</AppText>

          <AppText style={styles.descriptionText}>
            {course?.deskripsi || 'Tidak ada deskripsi tersedia.'}
          </AppText>

          {!hasJoined ? (
            <TouchableOpacity
              style={styles.daftarButton}
              activeOpacity={0.8}
              onPress={() => {
                if (isRegistered) {
                  openMeetingModal(null);
                } else {
                  navigation.navigate('Register');
                }
              }}
            >
              <AppText style={styles.daftarButtonText}>{isRegistered ? 'Gabung' : 'Daftar'}</AppText>
            </TouchableOpacity>
          ) : (
            <View style={styles.tabContainer}>
              <TouchableOpacity style={[styles.tabButton, activeTab === 'pertemuan' && styles.activeTabButton]} onPress={() => setActiveTab('pertemuan')}>
                <AppText style={[styles.tabText, activeTab === 'pertemuan' && styles.activeTabText]}>Pertemuan</AppText>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.tabButton, activeTab === 'tugas' && styles.activeTabButton]} onPress={() => setActiveTab('tugas')}>
                <AppText style={[styles.tabText, activeTab === 'tugas' && styles.activeTabText]}>Tugas dan kuis</AppText>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.tabButton, activeTab === 'materi' && styles.activeTabButton]} onPress={() => setActiveTab('materi')}>
                <AppText style={[styles.tabText, activeTab === 'materi' && styles.activeTabText]}>Materi dibagikan</AppText>
              </TouchableOpacity>
            </View>
          )}

          {/* MEETING LIST OR TABS CONTENT */}
          {(!hasJoined || activeTab === 'pertemuan') && (
            <View style={styles.meetingList}>
              {isLoadingMeetings ? (
                <AppText style={{ textAlign: 'center', color: '#9CA3AF', marginVertical: 20 }}>Memuat pertemuan...</AppText>
              ) : meetings.length > 0 ? (
                meetings.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.meetingCard}
                    activeOpacity={0.7}
                    onPress={() => {
                      if (!hasJoined) {
                        openMeetingModal(item);
                      } else {
                        navigation.navigate('DetailSesi', { meeting: item, course: course, userToken: userToken });
                      }
                    }}
                  >
                    <LinearGradient
                      colors={['#ffffff', '#E2EBE8']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={StyleSheet.absoluteFillObject}
                    />
                    <View style={styles.meetingCardLine} />
                    <View style={styles.meetingCardContent}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                        <AppText style={[styles.meetingTitle, { flex: 1, marginBottom: 0, marginRight: 8 }]}>{item.title}</AppText>
                        {!!item.method ? (
                          <View style={[styles.methodBadge, item.method.toLowerCase() === 'synchronous' ? styles.badgeSync : styles.badgeAsync]}>
                            <AppText style={[styles.methodBadgeText, item.method.toLowerCase() === 'synchronous' ? styles.badgeTextSync : styles.badgeTextAsync]}>
                              {item.method.toLowerCase() === 'synchronous' ? 'Synchronous' : 'Asynchronous'}
                            </AppText>
                          </View>
                        ) : null}
                      </View>
                      <AppText style={styles.meetingTopic}>{item.topic}</AppText>
                      <AppText style={styles.meetingLecturer}>{lecturer}</AppText>
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                <AppText style={{ textAlign: 'center', color: '#9CA3AF', marginVertical: 20 }}>Belum ada sesi pertemuan yang dibuat.</AppText>
              )}
            </View>
          )}

          {hasJoined && activeTab === 'tugas' && (
            <View style={styles.assignmentList}>
              {isLoadingAssignments ? (
                <AppText style={{ textAlign: 'center', color: '#9CA3AF', marginVertical: 20 }}>Memuat tugas...</AppText>
              ) : assignments.length > 0 ? (
                assignments.map(item => (
                  <View key={item.id} style={styles.materialCard}>
                    <View style={styles.materialCardHeader}>
                      <LinearGradient
                        colors={['#F8F9FA', '#C9E2D8']}
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 1, y: 0.5 }}
                        style={StyleSheet.absoluteFillObject}
                      />
                      <View style={styles.meetingCardLine} />
                      <View style={styles.meetingCardContent}>
                        <AppText style={styles.meetingTitle}>{item.meetingTitle}</AppText>
                        <AppText style={styles.meetingTopic}>{item.topic}</AppText>
                        <AppText style={styles.meetingLecturer}>{item.lecturer}</AppText>
                      </View>
                    </View>

                    <View style={styles.materialCardBody}>
                      <View style={styles.assignmentHeaderInfo}>
                        <Image source={{ uri: course?.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80' }} style={styles.assignmentAvatar} />
                        <View>
                          <AppText style={styles.assignmentLecturer}>{item.lecturer} <AppText style={styles.assignmentAction}>{item.action}</AppText></AppText>
                          <AppText style={styles.assignmentTime}>{item.time}</AppText>
                        </View>
                      </View>
                      <AppText style={styles.assignmentTitle}>{item.title}</AppText>
                      <AppText style={styles.assignmentDesc}>{item.desc}</AppText>
                      <TouchableOpacity
                        style={styles.lihatTugasBtn}
                        activeOpacity={0.8}
                        onPress={() => {
                          const meeting = meetings.find(m => m.id === item.id_sesi);
                          if (meeting) {
                            navigation.navigate('DetailSesi', { meeting: meeting, course: course, userToken: userToken });
                          }
                        }}
                      >
                        <AppText style={styles.lihatTugasText}>Lihat tugas</AppText>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              ) : (
                <AppText style={{ textAlign: 'center', color: '#9CA3AF', marginVertical: 20 }}>Belum ada tugas yang dibagikan.</AppText>
              )}
            </View>
          )}

          {hasJoined && activeTab === 'materi' && (
            <View style={styles.assignmentList}>
              {isLoadingMaterials ? (
                <AppText style={{ textAlign: 'center', color: '#9CA3AF', marginVertical: 20 }}>Memuat materi...</AppText>
              ) : materials.length > 0 ? (
                materials.map((item, index) => (
                  <View key={item.id || index} style={styles.materialCard}>
                    <View style={styles.materialCardHeader}>
                      <LinearGradient
                        colors={['#F8F9FA', '#C9E2D8']}
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 1, y: 0.5 }}
                        style={StyleSheet.absoluteFillObject}
                      />
                      <View style={styles.meetingCardLine} />
                      <View style={styles.meetingCardContent}>
                        <AppText style={styles.meetingTitle}>{item.pertemuan}</AppText>
                        <AppText style={styles.meetingTopic}>{item.judul}</AppText>
                        <AppText style={styles.meetingLecturer}>{lecturer}</AppText>
                      </View>
                    </View>

                    <View style={styles.materialCardBody}>
                      <AppText style={styles.materialInstruction}>{item.deskripsi || 'Pelajari materi berikut ini'}</AppText>

                      {!!(item.file_materi && item.file_materi.length > 0) ? (
                        <View style={styles.fileListContainer}>
                          {item.file_materi.map((file, idx) => {
                            const ext = file.split('.').pop().toLowerCase();
                            const isPdf = ext === 'pdf';
                            const isDocx = ext === 'docx' || ext === 'doc';
                            const isXls = ext === 'xls' || ext === 'xlsx';
                            const isPpt = ext === 'ppt' || ext === 'pptx';
                            const fileName = file.split('/').pop().replace(/^[a-f0-9\-]+_/, '');

                            let iconSource = require('../assets/other.png');
                            if (isPdf) iconSource = require('../assets/pdf.png');
                            else if (isDocx) iconSource = require('../assets/doc.png');
                            else if (isXls) iconSource = require('../assets/xls.png');
                            else if (isPpt) iconSource = require('../assets/ppt.png');

                            return (
                              <View key={idx} style={styles.fileItemRow}>
                                <Image
                                  source={iconSource}
                                  style={styles.fileIcon}
                                  resizeMode="contain"
                                />
                                <View style={{ flex: 1, marginRight: 8 }}>
                                  <AppText style={styles.fileNameText} numberOfLines={1}>{fileName}</AppText>
                                </View>
                                <TouchableOpacity
                                  style={{ paddingHorizontal: 8, paddingVertical: 4 }}
                                  onPress={() => {
                                    const baseUrl = Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://localhost:8000';
                                    Linking.openURL(`${baseUrl}/api/public/download?path=${file}&title=${encodeURIComponent(item.title)}`);
                                  }}
                                >
                                  <AppText style={{ fontSize: 12, fontWeight: '600', color: '#116E63' }}>Unduh</AppText>
                                </TouchableOpacity>
                              </View>
                            );
                          })}
                        </View>
                      ) : null}

                      {!!(item.link_video && (item.link_video.includes('youtube.com/watch?v=') || item.link_video.includes('youtu.be/'))) ? (
                        <View style={styles.videoContainer}>
                          <YoutubePlayer
                            height={180}
                            play={false}
                            videoId={item.link_video.includes('youtu.be/') ? item.link_video.split('youtu.be/')[1]?.split('?')[0] : item.link_video.split('v=')[1]?.split('&')[0]}
                          />
                        </View>
                      ) : null}
                    </View>
                  </View>
                ))
              ) : (
                <AppText style={{ textAlign: 'center', color: '#9CA3AF', marginVertical: 20 }}>Belum ada materi dibagikan</AppText>
              )}
            </View>
          )}

          {/* Bottom spacing */}
          <View style={{ height: 24 }} />
        </View>
      </ScrollView>

      {/* MEETING MODAL POPUP (CUSTOM ANIMATED FOR SMOOTH BLUR) */}
      {modalVisible && (
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            { opacity: fadeAnim }
          ]}
        >
          <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill}>
            <TouchableOpacity
              style={styles.modalOverlay}
              activeOpacity={1}
              onPress={closeMeetingModal}
            >
              <TouchableOpacity activeOpacity={1} style={isRegistered ? styles.modalTokenContent : styles.modalContentSmall}>
                {isRegistered ? (
                  <>
                    <TouchableOpacity style={styles.modalCloseBtn} onPress={closeMeetingModal} activeOpacity={0.8}>
                      <CloseIcon />
                    </TouchableOpacity>
                    <AppText style={styles.modalTokenMessage}>Masukkan token untuk melanjutkan</AppText>
                    <TextInput
                      style={styles.modalInput}
                      value={enrollToken}
                      onChangeText={setEnrollToken}
                      placeholder="Masukkan Token..."
                      placeholderTextColor="#9CA3AF"
                      autoCapitalize="characters"
                    />
                    <TouchableOpacity
                      style={[styles.modalDaftarButton, isEnrolling && { opacity: 0.7 }]}
                      activeOpacity={0.8}
                      onPress={handleEnroll}
                      disabled={isEnrolling}
                    >
                      <AppText style={styles.modalDaftarText}>
                        {isEnrolling ? 'Memproses...' : 'Bergabung'}
                      </AppText>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <TouchableOpacity style={styles.modalCloseBtn} onPress={closeMeetingModal} activeOpacity={0.8}>
                      <CloseIcon />
                    </TouchableOpacity>
                    <AppText style={styles.modalMessage}>
                      Silahkan daftar untuk{'\n'}mengakses fitur
                    </AppText>
                    <TouchableOpacity
                      style={styles.modalDaftarButton}
                      activeOpacity={0.8}
                      onPress={() => {
                        closeMeetingModal();
                        navigation.navigate('Register');
                      }}
                    >
                      <AppText style={styles.modalDaftarText}>Daftar</AppText>
                    </TouchableOpacity>
                  </>
                )}
              </TouchableOpacity>
            </TouchableOpacity>
          </BlurView>
        </Animated.View>
      )}

    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff', // Fallback color
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 54, // Matches the spacing for status bar as in JadwalKelasScreen
    paddingBottom: 16,
    backgroundColor: 'transparent',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 8,
  },
  scroll: {
    flex: 1,
  },
  heroContainer: {
    height: 250,
    width: '100%',
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  heroTextContainer: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  heroTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
  },
  heroSubtitle: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '400',
  },
  patternSpacer: {
    height: 35, // Spacer to expose the background pattern before the content card starts
    backgroundColor: 'transparent',
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingTop: 32,
    backgroundColor: BG_COLOR,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    minHeight: height - 250,
  },
  contentTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
    lineHeight: 26,
  },
  contentLecturer: {
    fontSize: 14,
    color: '#909090',
    marginBottom: 16,
  },
  descriptionText: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 22,
    marginBottom: 12,
  },
  daftarButton: {
    backgroundColor: PRIMARY,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 32,
  },
  daftarButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  meetingList: {
    gap: 16,
  },
  meetingCard: {
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
    minHeight: 80,
    backgroundColor: '#ffffff',
  },
  meetingCardLine: {
    width: 3.5,
    height: 50,
    backgroundColor: PRIMARY,
    borderRadius: 2,
    marginLeft: 16,
  },
  meetingCardContent: {
    paddingVertical: 16,
    paddingRight: 16,
    paddingLeft: 14,
    flex: 1,
    justifyContent: 'center',
  },
  meetingTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  meetingTopic: {
    fontSize: 12.5,
    color: '#4B5563',
    marginBottom: 4,
  },
  meetingLecturer: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  methodBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeSync: {
    backgroundColor: '#EFF6FF',
  },
  badgeAsync: {
    backgroundColor: '#F3F4F6',
  },
  methodBadgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  badgeTextSync: {
    color: '#2563EB',
  },
  badgeTextAsync: {
    color: '#4B5563',
  },

  // MODAL STYLES
  modalOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContentSmall: {
    width: '80%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    alignItems: 'center',
  },
  modalMessage: {
    fontSize: 15,
    color: '#374151',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  modalTokenContent: {
    width: '85%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingTop: 36,
    paddingBottom: 24,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    alignItems: 'center',
  },
  modalCloseBtn: {
    position: 'absolute',
    top: -12,
    right: -12,
    backgroundColor: PRIMARY,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    zIndex: 10,
  },
  modalTokenMessage: {
    fontSize: 14,
    color: '#111827',
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
  modalInput: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    height: 44,
    paddingHorizontal: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  modalDaftarButton: {
    backgroundColor: PRIMARY,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 32,
    width: '100%',
    alignItems: 'center',
  },
  modalDaftarText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    marginTop: 12,
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTabButton: {
    borderBottomColor: PRIMARY,
  },
  tabText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#111827',
    fontWeight: '600',
  },
  assignmentList: {
    gap: 16,
  },
  assignmentCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  assignmentHeaderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  assignmentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
  },
  assignmentLecturer: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111827',
  },
  assignmentAction: {
    fontWeight: '400',
    color: '#6B7280',
  },
  assignmentTime: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 2,
  },
  assignmentTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
    lineHeight: 20,
  },
  assignmentDesc: {
    fontSize: 12,
    color: '#4B5563',
    lineHeight: 18,
    marginBottom: 16,
  },
  lihatTugasBtn: {
    backgroundColor: PRIMARY,
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  lihatTugasText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  materialCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  materialCardHeader: {
    flexDirection: 'row',
    position: 'relative',
    minHeight: 80,
  },
  materialCardBody: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: '#ffffff',
  },
  materialInstruction: {
    fontSize: 12,
    color: '#374151',
    marginBottom: 12,
    fontWeight: '500',
  },
  fileListContainer: {
    gap: 12,
  },
  fileItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  fileIcon: {
    width: 32,
    height: 32,
  },
  fileNameText: {
    marginLeft: 12,
    fontSize: 13,
    color: '#374151',
    fontWeight: '500',
    flex: 1,
  },
  videoContainer: {
    width: '100%',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#000000',
  },
  downloadButton: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingVertical: 12,
    alignItems: 'center',
  },
  downloadButtonText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
});
