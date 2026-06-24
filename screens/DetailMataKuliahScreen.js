import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  StatusBar,
  SafeAreaView
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const PRIMARY = '#187A65'; // Adjusted dark green
const BG_COLOR = '#F5F5F5'; // Light grey/off-white

const ChevronLeft = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path
      d="M15 18L9 12L15 6"
      stroke="#111827"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default function DetailMataKuliahScreen({ navigation, route }) {
  const course = route?.params?.course;
  const courseName = course?.title || "Pemrograman Web + Praktikum";
  const lecturer = course?.lecturer || "Yulianto M.Kom";

  // Dummy 16 meetings
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
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* HEADER */}
      <SafeAreaView style={styles.headerSafeArea}>
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
      </SafeAreaView>

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
            colors={['rgba(24, 122, 101, 0)', 'rgba(24, 122, 101, 0.4)', 'rgba(24, 122, 101, 0.95)']}
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

          <TouchableOpacity style={styles.daftarButton} activeOpacity={0.8}>
            <Text style={styles.daftarButtonText}>Daftar</Text>
          </TouchableOpacity>

          {/* MEETING LIST */}
          <View style={styles.meetingList}>
            {meetings.map((item) => (
              <View key={item.id} style={styles.meetingCard}>
                {/* Diagonal subtle gradient inside card using expo-linear-gradient */}
                <LinearGradient
                  colors={['#ffffff', '#DDE6E2']}
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
              </View>
            ))}
          </View>
          
          {/* Bottom spacing */}
          <View style={{ height: 100 }} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff', // Background behind everything
  },
  headerSafeArea: {
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 8,
  },
  scroll: {
    flex: 1,
  },
  heroContainer: {
    height: 240,
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
    height: 30, // Spacer to simulate the gap where the pattern is visible in the design
    backgroundColor: '#ffffff', 
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingTop: 32,
    backgroundColor: BG_COLOR,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    marginTop: -40, // Pull it up over the spacer
    minHeight: Dimensions.get('window').height - 240,
  },
  contentTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
    lineHeight: 24,
  },
  contentLecturer: {
    fontSize: 13,
    color: '#9CA3AF',
    marginBottom: 16,
  },
  descriptionText: {
    fontSize: 12.5,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 10,
  },
  daftarButton: {
    backgroundColor: PRIMARY,
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 32,
  },
  daftarButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  meetingList: {
    gap: 14,
  },
  meetingCard: {
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center', // Center vertically
    overflow: 'hidden',
    position: 'relative',
    minHeight: 76,
    backgroundColor: '#ffffff',
  },
  meetingCardLine: {
    width: 3,
    height: 46, // Fixed height instead of percentage to avoid Android rendering crash
    backgroundColor: PRIMARY,
    borderRadius: 2,
    marginLeft: 14, // Indented from the left edge!
  },
  meetingCardContent: {
    paddingVertical: 14,
    paddingRight: 16,
    paddingLeft: 12, // Space between green line and text
    flex: 1,
    justifyContent: 'center',
  },
  meetingTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  meetingTopic: {
    fontSize: 12,
    color: '#4B5563',
    marginBottom: 4,
  },
  meetingLecturer: {
    fontSize: 10,
    color: '#9CA3AF',
  },
});
