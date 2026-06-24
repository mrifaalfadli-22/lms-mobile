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
import Svg, { Path } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

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

export default function DetailMataKuliahScreen({ navigation, route }) {
  const isRegistered = route?.params?.isRegistered || false;
  const course = route?.params?.course;
  const courseName = course?.title || "Pemrograman Web + Praktikum";
  const lecturer = course?.lecturer || "Yulianto M.Kom";

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [token, setToken] = useState('');
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

          {/* MEETING LIST */}
          <View style={styles.meetingList}>
            {meetings.map((item) => (
              <TouchableOpacity 
                key={item.id} 
                style={styles.meetingCard}
                activeOpacity={0.7}
                onPress={() => openMeetingModal(item)}
              >
                {/* Diagonal subtle gradient inside card using expo-linear-gradient */}
                <LinearGradient
                  colors={['#ffffff', '#E2EBE8']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={StyleSheet.absoluteFillObject}
                />

                {/* Left Green Line */}
                <View style={styles.meetingCardLine} />
                
                {/* Card Content */}
                <View style={styles.meetingCardContent}>
                  <Text style={styles.meetingTitle}>{item.title}</Text>
                  <Text style={styles.meetingTopic}>{item.topic}</Text>
                  <Text style={styles.meetingLecturer}>{item.lecturer}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
          
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
                        // Handle join logic here
                      }}
                    >
                      <Text style={styles.modalDaftarText}>Bergabung</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
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
    backgroundColor: '#F3F4F6',
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
});
