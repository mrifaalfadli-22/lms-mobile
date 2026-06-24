import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  StatusBar,
  ImageBackground,
  Animated,
  TextInput
} from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import YoutubePlayer from 'react-native-youtube-iframe';

const { width, height } = Dimensions.get('window');

const PRIMARY = '#258A7A'; // Updated green to match the rest of the app
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
  const lecturer = course?.lecturer || "Yulianto M.Kom";

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [token, setToken] = useState('');
  const [hasJoined, setHasJoined] = useState(false);
  const [activeTab, setActiveTab] = useState('pertemuan');
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const openMeetingModal = (meeting) => {
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
    });
  };

  // Using dummy meetings matching the design
  const meetings = [
    { id: '1', title: 'Pertemuan 1', topic: 'Pengenalan dasar HTML', lecturer: 'Yulianto M.Kom' },
    { id: '2', title: 'Pertemuan 2', topic: 'Mengenal tag-tag dasar HTML', lecturer: 'Yulianto M.Kom' },
    { id: '3', title: 'Pertemuan 3', topic: 'Lorem ipsum dolor sit amet', lecturer: 'Yulianto M.Kom' },
    { id: '4', title: 'Pertemuan 4', topic: 'Lorem ipsum dolor sit amet', lecturer: 'Yulianto M.Kom' },
    { id: '5', title: 'Pertemuan 5', topic: 'Lorem ipsum dolor sit amet', lecturer: 'Yulianto M.Kom' },
    ...Array.from({ length: 11 }).map((_, index) => ({
      id: String(index + 6),
      title: `Pertemuan ${index + 6}`,
      topic: 'Lorem ipsum dolor sit amet',
      lecturer: 'Yulianto M.Kom'
    }))
  ];

  const assignments = [
    {
      id: '1',
      lecturer: 'Yulianto M.kom',
      action: 'Mengupload tugas',
      time: 'Hari ini - 09.00',
      title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam volutpat semper dui et lobortis.',
      desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam volutpat semper dui et lobortis.',
    },
    {
      id: '2',
      lecturer: 'Yulianto M.kom',
      action: 'Mengupload tugas',
      time: 'Hari ini - 09.00',
      title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam volutpat semper dui et lobortis.',
      desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam volutpat semper dui et lobortis.',
    }
  ];

  const materials = [
    {
      id: '1',
      title: 'Pertemuan 1',
      topic: 'Pengenalan dasar HTML',
      lecturer: 'Yulianto M.Kom',
      instruction: 'Pelajari materi berikut ini',
      type: 'file',
      files: [
        { type: 'ppt', name: 'Materi_Pertemuan_1.pptx' },
        { type: 'pdf', name: 'Rangkuman_HTML.pdf' }
      ],
    },
    {
      id: '2',
      title: 'Pertemuan 2',
      topic: 'Pengenalan framework CSS',
      lecturer: 'Yulianto M.Kom',
      instruction: 'Silahkan simak video berikut :',
      type: 'video',
      videoId: 'iee2TATGMyI', // YouTube video ID example
    }
  ];

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
          <Text style={styles.headerTitle}>Detail mata kuliah</Text>
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
            <Text style={styles.heroTitle}>{courseName}</Text>
            <Text style={styles.heroSubtitle}>{lecturer}</Text>
          </View>
        </View>

        {/* SPACER FOR PATTERN IN DESIGN */}
        <View style={styles.patternSpacer} />

        {/* MAIN CONTENT CONTAINER */}
        <View style={styles.contentContainer}>
          <Text style={styles.contentTitle}>Pemrograman web + {'\n'}Praktikum</Text>
          <Text style={styles.contentLecturer}>{lecturer}</Text>
          
          <Text style={styles.descriptionText}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam volutpat semper dui et lobortis.
          </Text>
          <Text style={styles.descriptionText}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam volutpat semper dui et lobortis.
          </Text>

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
              <Text style={styles.daftarButtonText}>{isRegistered ? 'Gabung' : 'Daftar'}</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.tabContainer}>
              <TouchableOpacity style={[styles.tabButton, activeTab === 'pertemuan' && styles.activeTabButton]} onPress={() => setActiveTab('pertemuan')}>
                <Text style={[styles.tabText, activeTab === 'pertemuan' && styles.activeTabText]}>Pertemuan</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.tabButton, activeTab === 'tugas' && styles.activeTabButton]} onPress={() => setActiveTab('tugas')}>
                <Text style={[styles.tabText, activeTab === 'tugas' && styles.activeTabText]}>Tugas dan kuis</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.tabButton, activeTab === 'materi' && styles.activeTabButton]} onPress={() => setActiveTab('materi')}>
                <Text style={[styles.tabText, activeTab === 'materi' && styles.activeTabText]}>Materi dibagikan</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* MEETING LIST OR TABS CONTENT */}
          {(!hasJoined || activeTab === 'pertemuan') && (
            <View style={styles.meetingList}>
              {meetings.map((item) => (
                <TouchableOpacity 
                  key={item.id} 
                  style={styles.meetingCard}
                  activeOpacity={0.7}
                  onPress={() => {
                    if (!hasJoined) {
                      openMeetingModal(item);
                    } else {
                      navigation.navigate('DetailSesi', { meeting: item, course: course });
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
                    <Text style={styles.meetingTitle}>{item.title}</Text>
                    <Text style={styles.meetingTopic}>{item.topic}</Text>
                    <Text style={styles.meetingLecturer}>{item.lecturer}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {hasJoined && activeTab === 'tugas' && (
            <View style={styles.assignmentList}>
              {assignments.map(item => (
                <View key={item.id} style={styles.assignmentCard}>
                  <View style={styles.assignmentHeaderInfo}>
                    <Image source={require('../assets/dosen.png')} style={styles.assignmentAvatar} />
                    <View>
                      <Text style={styles.assignmentLecturer}>{item.lecturer} <Text style={styles.assignmentAction}>{item.action}</Text></Text>
                      <Text style={styles.assignmentTime}>{item.time}</Text>
                    </View>
                  </View>
                  <Text style={styles.assignmentTitle}>{item.title}</Text>
                  <Text style={styles.assignmentDesc}>{item.desc}</Text>
                  <TouchableOpacity style={styles.lihatTugasBtn} activeOpacity={0.8}>
                    <Text style={styles.lihatTugasText}>Lihat tugas</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {hasJoined && activeTab === 'materi' && (
            <View style={styles.assignmentList}>
              {materials.map(item => (
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
                      <Text style={styles.meetingTitle}>{item.title}</Text>
                      <Text style={styles.meetingTopic}>{item.topic}</Text>
                      <Text style={styles.meetingLecturer}>{item.lecturer}</Text>
                    </View>
                  </View>

                  <View style={styles.materialCardBody}>
                    <Text style={styles.materialInstruction}>{item.instruction}</Text>
                    {item.type === 'file' ? (
                      <View style={styles.fileListContainer}>
                        {item.files?.map((file, index) => (
                          <View key={index} style={styles.fileItemRow}>
                            <Image 
                              source={file.type === 'ppt' ? require('../assets/Ppt.png') : require('../assets/Pdf.png')} 
                              style={styles.fileIcon} 
                              resizeMode="contain"
                            />
                            <Text style={styles.fileNameText} numberOfLines={1}>{file.name}</Text>
                          </View>
                        ))}
                      </View>
                    ) : item.type === 'video' ? (
                      <View style={styles.videoContainer}>
                        <YoutubePlayer
                          height={180}
                          play={false}
                          videoId={item.videoId}
                        />
                      </View>
                    ) : null}
                  </View>

                  {item.type === 'file' && (
                    <TouchableOpacity style={styles.downloadButton} activeOpacity={0.7}>
                      <Text style={styles.downloadButtonText}>Download</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}
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
          <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill}>
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
                    <Text style={styles.modalTokenMessage}>Masukkan token untuk melanjutkan</Text>
                    <TextInput 
                      style={styles.modalInput} 
                      value={token}
                      onChangeText={setToken}
                    />
                    <TouchableOpacity 
                      style={styles.modalDaftarButton}
                      activeOpacity={0.8}
                      onPress={() => {
                        closeMeetingModal();
                        setHasJoined(true);
                      }}
                    >
                      <Text style={styles.modalDaftarText}>Bergabung</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <TouchableOpacity style={styles.modalCloseBtn} onPress={closeMeetingModal} activeOpacity={0.8}>
                      <CloseIcon />
                    </TouchableOpacity>
                    <Text style={styles.modalMessage}>
                      Silahkan daftar untuk{'\n'}mengakses fitur
                    </Text>
                    <TouchableOpacity 
                      style={styles.modalDaftarButton}
                      activeOpacity={0.8}
                      onPress={() => {
                        closeMeetingModal();
                        navigation.navigate('Register');
                      }}
                    >
                      <Text style={styles.modalDaftarText}>Daftar</Text>
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
    color: '#9CA3AF',
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
