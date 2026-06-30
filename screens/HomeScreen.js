import { API_BASE_URL } from '../config/api';
import React, { useState, useRef, useCallback, useEffect } from 'react';
import AppText from '../components/AppText';
import {
  View,

  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Dimensions,
  StatusBar,
  FlatList,
  Animated,
  Platform,
  ActivityIndicator,
} from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');

// ── Color Palette ──────────────────────────────────────────────────────────────
const PRIMARY = '#116E63';
const BG = '#F8FAFC';

// ── Carousel constants ─────────────────────────────────────────────────────────
const CARD_WIDTH = width * 0.72;
const SIDE_PEEK = (width - CARD_WIDTH) / 2 - 12;
const CARD_GAP = 12;
const SNAP_INTERVAL = CARD_WIDTH + CARD_GAP;

// ── Icons ─────────────────────────────────────────────────────────────────────

const BellIcon = () => (
  <Svg width="32" height="32" viewBox="0 0 24 24" fill="#FBBF24">
    <Path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
  </Svg>
);

const SearchIcon = () => (
  <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <Path
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      stroke="white"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const CalendarSmallIcon = () => (
  <Svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="4" width="18" height="18" rx="2" stroke="white" strokeWidth="2" />
    <Path d="M3 10h18M8 2v4m8-4v4" stroke="white" strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const CalendarDarkIcon = () => (
  <Svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="4" width="18" height="18" rx="2" stroke="#10B981" strokeWidth="2" />
    <Path d="M3 10h18M8 2v4m8-4v4" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const ClockDarkIcon = () => (
  <Svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke="#10B981" strokeWidth="2" />
    <Path d="M12 6v6l4 2" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const CloseIcon = () => (
  <Svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <Path d="M18 6L6 18M6 6l12 12" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const UserAvatarIcon = () => (
  <Svg width="46" height="46" viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="12" fill="white" />
    <Path
      d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
      fill={PRIMARY}
    />
  </Svg>
);

const SoundIcon = () => (
  <Image
    source={require('../assets/entypo_sound.png')}
    style={{ width: 22, height: 22, tintColor: '#fff' }}
    resizeMode="contain"
  />
);

// ── Menu Icons ─────────────────────────────────────────────────────────────────

const IconMataKuliah = () => (
  <Svg width="42" height="42" viewBox="0 0 48 48">
    {/* Book Cover */}
    <Path d="M24 12 c-6-3 -14-1 -18 1 v 26 c4-2 12-4 18-1 c6-3 14-1 18 1 v -26 c-4-2 -12-4 -18-1 z" fill="#0F766E" />

    {/* Left Pages */}
    <Path d="M24 14 c-5-2 -12-1 -16 1 v 22 c4-2 11-3 16-1 z" fill="#F1F5F9" />
    {/* Right Pages */}
    <Path d="M24 14 c5-2 12-1 16 1 v 22 c-4-2 -11-3 -16-1 z" fill="#FFFFFF" />

    {/* Center crease */}
    <Path d="M24 14 v 22" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />

    {/* Page Text Lines Left */}
    <Path d="M12 22h8M12 26h8M12 30h5" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />

    {/* Page Text Lines Right */}
    <Path d="M28 22h8M28 26h8M28 30h5" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round" />

    {/* Bookmark */}
    <Path d="M16 10 v 14 l 3 -2 l 3 2 v -14 z" fill="#F43F5E" />
  </Svg>
);

const IconJadwal = () => (
  <Svg width="42" height="42" viewBox="0 0 48 48">
    {/* Calendar Body */}
    <Rect x="6" y="10" width="36" height="32" rx="4" fill="#EFF6FF" />

    {/* Calendar Header */}
    <Path d="M6 14 a4 4 0 0 1 4 -4 h28 a4 4 0 0 1 4 4 v8 h-36 z" fill="#F43F5E" />

    {/* Bindings/Rings */}
    <Rect x="12" y="6" width="4" height="8" rx="2" fill="#94A3B8" />
    <Rect x="32" y="6" width="4" height="8" rx="2" fill="#94A3B8" />

    {/* Header Text / Year */}
    <Rect x="20" y="14" width="8" height="3" rx="1.5" fill="#FDA4AF" />

    {/* Grid / Dates */}
    <Rect x="12" y="26" width="5" height="5" rx="1" fill="#CBD5E1" />
    <Rect x="21" y="26" width="5" height="5" rx="1" fill="#CBD5E1" />
    <Rect x="30" y="26" width="5" height="5" rx="1" fill="#CBD5E1" />

    <Rect x="12" y="34" width="5" height="5" rx="1" fill="#CBD5E1" />
    <Rect x="21" y="34" width="5" height="5" rx="1" fill="#34D399" />
    <Rect x="30" y="34" width="5" height="5" rx="1" fill="#CBD5E1" />
  </Svg>
);

const IconMateri = () => (
  <Svg width="42" height="42" viewBox="0 0 48 48">
    {/* Folder Back */}
    <Path d="M6 14c0-2 2-4 4-4h8l3 4h21c2 0 4 2 4 4v22c0 2-2 4-4 4H10c-2 0-4-2-4-4Z" fill="#F59E0B" />

    {/* Document 1 (Gray) */}
    <Rect x="12" y="8" width="18" height="24" rx="2" fill="#F8FAFC" transform="rotate(-8 21 20)" />
    <Path d="M16 14h10M16 18h10M16 22h6" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" transform="rotate(-8 21 20)" />

    {/* Document 2 (Blue) */}
    <Rect x="18" y="10" width="18" height="24" rx="2" fill="#DBEAFE" transform="rotate(5 27 22)" />
    <Circle cx="27" cy="17" r="4" fill="#93C5FD" transform="rotate(5 27 22)" />
    <Path d="M22 25h10M22 29h6" stroke="#93C5FD" strokeWidth="2.5" strokeLinecap="round" transform="rotate(5 27 22)" />

    {/* Folder Front */}
    <Path d="M4 26l4-5h36c1 0 2 1 2 2v17c0 2-2 4-4 4H8c-2 0-4-2-4-4Z" fill="#FBBF24" />
  </Svg>
);

const IconTugas = () => (
  <Svg width="42" height="42" viewBox="0 0 48 48">
    {/* Clipboard Base */}
    <Rect x="8" y="10" width="28" height="34" rx="3" fill="#C7D2FE" />

    {/* Paper */}
    <Rect x="12" y="14" width="20" height="26" rx="2" fill="#FFFFFF" />

    {/* Clipboard Clip */}
    <Rect x="16" y="6" width="12" height="6" rx="2" fill="#818CF8" />
    <Circle cx="22" cy="9" r="1.5" fill="#E0E7FF" />

    {/* Checklist Item 1 (Checked) */}
    <Rect x="15" y="18" width="5" height="5" rx="1.5" fill="#34D399" />
    <Path d="M16 20.5 l 1.5 1.5 l 2.5 -2.5" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <Path d="M22 20.5 h 7" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" />

    {/* Checklist Item 2 (Unchecked) */}
    <Rect x="15" y="26" width="5" height="5" rx="1.5" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="1" />
    <Path d="M22 28.5 h 7" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" />

    {/* Checklist Item 3 (Unchecked) */}
    <Rect x="15" y="34" width="5" height="5" rx="1.5" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="1" />
    <Path d="M22 36.5 h 4" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" />

    {/* Pencil */}
    <Path d="M32 18 h 5 v 12 h -5 z" fill="#FBBF24" transform="rotate(35, 34, 26)" />
    <Path d="M32 30 l 2.5 5 l 2.5 -5 z" fill="#FDBA74" transform="rotate(35, 34, 26)" />
    <Path d="M34.5 33 l 0 2" stroke="#475569" strokeWidth="2" strokeLinecap="round" transform="rotate(35, 34, 26)" />
    <Path d="M32 15 h 5 v 3 h -5 z" fill="#FCA5A5" transform="rotate(35, 34, 26)" />
  </Svg>
);

const IconProgress = () => (
  <Svg width="42" height="42" viewBox="0 0 48 48">
    <Rect x="6" y="8" width="36" height="32" rx="6" fill="#E0F2FE" />
    <Rect x="12" y="24" width="6" height="12" rx="2" fill="#34D399" />
    <Rect x="21" y="18" width="6" height="18" rx="2" fill="#FBBF24" />
    <Rect x="30" y="12" width="6" height="24" rx="2" fill="#F87171" />
    <Path d="M8 38h32" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />
  </Svg>
);

const IconNilai = () => (
  <Svg width="42" height="42" viewBox="0 0 48 48">
    {/* Paper Background */}
    <Rect x="6" y="4" width="36" height="40" rx="4" fill="#DBEAFE" />

    {/* Header */}
    <Rect x="12" y="10" width="14" height="5" rx="2.5" fill="#1E3A8A" />

    {/* Table Rows (Course + Grade blocks) */}
    <Rect x="12" y="20" width="16" height="4" rx="2" fill="#93C5FD" />
    <Rect x="32" y="19" width="6" height="6" rx="2" fill="#10B981" />

    <Rect x="12" y="28" width="12" height="4" rx="2" fill="#93C5FD" />
    <Rect x="32" y="27" width="6" height="6" rx="2" fill="#3B82F6" />

    <Rect x="12" y="36" width="18" height="4" rx="2" fill="#93C5FD" />
    <Rect x="32" y="35" width="6" height="6" rx="2" fill="#F59E0B" />
  </Svg>
);

const IconSertifikat = () => (
  <Svg width="42" height="42" viewBox="0 0 48 48">
    <Rect x="10" y="6" width="28" height="36" rx="4" fill="#FEF3C7" />
    <Circle cx="24" cy="20" r="6" fill="#F59E0B" />
    <Path d="M22 26l-2 8 4-2 4 2-2-8" fill="#F59E0B" />
    <Path d="M16 12h16M16 34h16M16 38h10" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const IconVerifikasi = () => (
  <Svg width="42" height="42" viewBox="0 0 48 48">
    <Rect x="8" y="10" width="32" height="28" rx="6" fill="#ECFDF5" />
    <Path d="M24 16 L28 20 L34 14" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx="24" cy="24" r="10" stroke="#059669" strokeWidth="2" fill="none" />
    <Path d="M24 30 L24 34" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
    <Path d="M14 24 L18 24" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

// ── MenuIcon Component ─────────────────────────────────────────────────────────
const MenuIcon = ({ icon, label, onPress, isLocked }) => (
  <TouchableOpacity style={styles.menuItem} activeOpacity={0.75} onPress={onPress}>
    <View style={styles.menuIconBox}>
      <View style={isLocked ? { opacity: 0.3, transform: [{ scale: 0.95 }] } : null}>{icon}</View>
      {isLocked && (
        <View style={styles.lockBadge}>
          <Svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <Path d="M19 11H5C3.89543 11 3 11.8954 3 13V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V13C21 11.8954 20.1046 11 19 11Z" fill="#374151" />
            <Path d="M7 11V7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7V11" stroke="#374151" strokeWidth="2.5" strokeLinecap="round" />
          </Svg>
        </View>
      )}
    </View>
    <AppText style={[styles.menuLabel, isLocked && { color: '#9CA3AF' }]}>{label}</AppText>
  </TouchableOpacity>
);

// ── SmoothDot Component ────────────────────────────────────────────────────────
const SmoothDot = ({ active, color = PRIMARY }) => {
  const animValue = useRef(new Animated.Value(active ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animValue, {
      toValue: active ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [active]);

  const width = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [7, 18],
  });

  const backgroundColor = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['#CBD5E1', color],
  });

  return <Animated.View style={[styles.dot, { width, backgroundColor }]} />;
};

// ── Animated Card Components ──────────────────────────────────────────────────
const AnimatedCourseCard = ({ item, index, activeIndex, scrollToIndex, navigation, coursesLength }) => {
  const isActive = index === activeIndex;
  const anim = useRef(new Animated.Value(isActive ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: isActive ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isActive]);

  const height = anim.interpolate({ inputRange: [0, 1], outputRange: [155, 190] });
  const marginTop = anim.interpolate({ inputRange: [0, 1], outputRange: [17.5, 0] });
  const opacity = anim.interpolate({ inputRange: [0, 1], outputRange: [0.55, 1] });

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={[
        styles.carouselCard,
        { marginRight: index === coursesLength - 1 ? SIDE_PEEK : CARD_GAP },
      ]}
      onPress={() => !isActive ? scrollToIndex(index) : navigation.navigate('DetailMataKuliah', { course: item })}
    >
      <Animated.Image
        source={{ uri: item.image }}
        style={[styles.carouselImage, { height, marginTop, opacity }]}
        resizeMode="cover"
      />
      {isActive && (
        <View style={styles.carouselTextBox}>
          <AppText style={styles.courseTitle}>{item.title}</AppText>
          <AppText style={styles.courseLecturer}>{item.lecturer}</AppText>
        </View>
      )}
    </TouchableOpacity>
  );
};

const AnimatedMateriCard = ({ item, index, activeIndex, scrollToIndex, materisLength }) => {
  const isActive = index === activeIndex;
  const anim = useRef(new Animated.Value(isActive ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: isActive ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isActive]);

  const height = anim.interpolate({ inputRange: [0, 1], outputRange: [130, 160] });
  const marginTop = anim.interpolate({ inputRange: [0, 1], outputRange: [15, 0] });
  const opacity = anim.interpolate({ inputRange: [0, 1], outputRange: [0.55, 1] });

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => scrollToIndex(index)}
      style={{ marginRight: index === materisLength - 1 ? SIDE_PEEK : CARD_GAP }}
    >
      <Animated.Image source={{ uri: item.image }} style={[styles.materiImageCard, { height, marginTop, opacity }]} />
    </TouchableOpacity>
  );
};

const AnimatedJadwalCard = ({ item, index, activeIndex, scrollToIndex, jadwalsLength }) => {
  const isActive = index === activeIndex;
  const anim = useRef(new Animated.Value(isActive ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: isActive ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isActive]);

  const scale = anim.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1] });
  const opacity = anim.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] });

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => scrollToIndex(index)}
      style={{ marginRight: index === jadwalsLength - 1 ? SIDE_PEEK : CARD_GAP }}
    >
      <Animated.View style={[styles.jadwalRegisteredCard, { transform: [{ scale }], opacity }]}>
        <Image source={{ uri: item.image }} style={styles.jrcImage} />
        <View style={styles.jrcContent}>
          <AppText style={styles.jrcTitle}>{item.title}</AppText>
          <View style={styles.jrcRow}>
            <CalendarDarkIcon />
            <AppText style={styles.jrcInfo}>{item.date}</AppText>
          </View>
          <View style={styles.jrcRow}>
            <ClockDarkIcon />
            <AppText style={styles.jrcInfo}>{item.time}</AppText>
          </View>
          <View style={styles.jrcDivider} />
          <View style={styles.jrcLecturerRow}>
            <Image source={{ uri: item.avatar }} style={styles.jrcAvatar} />
            <View>
              <AppText style={styles.jrcLecturerName}>{item.lecturer}</AppText>
              <AppText style={styles.jrcLecturerRole}>{item.role}</AppText>
            </View>
          </View>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

// ── HomeScreen ────────────────────────────────────────────────────────────────
export default function HomeScreen({ navigation, route }) {
  const isRegistered = route?.params?.isRegistered || false;
  const user = route?.params?.user || null;
  const token = route?.params?.token || null;

  const [searchText, setSearchText] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeJadwalIndex, setActiveJadwalIndex] = useState(0);
  const [activeMateriIndex, setActiveMateriIndex] = useState(0);
  const [adzanExpanded, setAdzanExpanded] = useState(true);
  const [nextAdzan, setNextAdzan] = useState({ name: 'Memuat...', time: '--:--' });
  const flatListRef = useRef(null);
  const jadwalListRef = useRef(null);
  const materiListRef = useRef(null);

  const [modalVisible, setModalVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // State untuk data dinamis
  const [dashboardData, setDashboardData] = useState({
    progress: { percentage: 0, completed_modules: 0 },
    jadwalHariIni: [],
    materiTerbaru: []
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAdzan = async () => {
      try {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const url = `https://api.myquran.com/v2/sholat/jadwal/1301/${year}/${month}/${day}`;

        const response = await fetch(url);
        const json = await response.json();
        if (json.status && json.data?.jadwal) {
          const jadwal = json.data.jadwal;
          const currentMinutes = date.getHours() * 60 + date.getMinutes();

          const parseTime = (timeStr) => {
            const [h, m] = timeStr.split(':').map(Number);
            return h * 60 + m;
          };

          const prayerTimes = [
            { name: 'Subuh', time: jadwal.subuh, val: parseTime(jadwal.subuh) },
            { name: 'Dzuhur', time: jadwal.dzuhur, val: parseTime(jadwal.dzuhur) },
            { name: 'Ashar', time: jadwal.ashar, val: parseTime(jadwal.ashar) },
            { name: 'Maghrib', time: jadwal.maghrib, val: parseTime(jadwal.maghrib) },
            { name: 'Isya', time: jadwal.isya, val: parseTime(jadwal.isya) },
          ];

          let next = prayerTimes.find(p => p.val > currentMinutes);
          if (!next) next = { name: 'Subuh', time: jadwal.subuh }; // default next day

          setNextAdzan(next);
        }
      } catch (error) {
        console.log('Error fetching adzan:', error);
      }
    };

    fetchAdzan();
  }, []);

  useEffect(() => {
    if (isRegistered && token) {
      const fetchDashboard = async () => {
        setIsLoading(true);
        try {
          const API_URL = Platform.OS === 'android'
            ? `${API_BASE_URL}/api/mahasiswa/dashboard`
            : `http://localhost:8000/api/mahasiswa/dashboard`;

          const response = await fetch(API_URL, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });

          const json = await response.json();
          if (json.status === 'success') {
            setDashboardData({
              progress: json.data.progress,
              jadwalHariIni: json.data.jadwal_hari_ini,
              materiTerbaru: json.data.materi_terbaru
            });
          }
        } catch (error) {
          console.error("Dashboard Fetch Error: ", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchDashboard();
    }
  }, [isRegistered, token]);

  const openDaftarModal = () => {
    setModalVisible(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  const closeDaftarModal = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
    });
  };

  const jadwals = dashboardData.jadwalHariIni;
  const materis = dashboardData.materiTerbaru;

  const courses = [
    {
      id: '1',
      image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&q=80',
      title: 'Pemrograman Web',
      lecturer: 'Yulianto, M.Kom',
    },
    {
      id: '2',
      image: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=600&q=80',
      title: 'Kalkulus 1',
      lecturer: 'Dr. Fauzi Hamdan',
    },
    {
      id: '3',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&q=80',
      title: 'Basis Data',
      lecturer: 'Siti Rahma, S.T',
    },
  ];

  const suggestions = isRegistered
    ? ['Kuis html', 'Materi kalkukus', 'Live class']
    : ['Pemrograman Web', 'Kalkulus 1', 'Basis Data'];

  const today = new Date();
  const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const dateStr = `${dayNames[today.getDay()]}, ${today.getDate()} ${monthNames[today.getMonth()]}`;

  // ── Carousel handlers ──
  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index ?? 0);
    }
  }, []);

  const onViewableJadwalChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveJadwalIndex(viewableItems[0].index ?? 0);
    }
  }, []);

  const onViewableMateriChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveMateriIndex(viewableItems[0].index ?? 0);
    }
  }, []);

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 60 });

  const scrollToIndex = (index) => {
    flatListRef.current?.scrollToIndex({ index, animated: true });
    setActiveIndex(index);
  };

  const scrollToJadwalIndex = (index) => {
    jadwalListRef.current?.scrollToIndex({ index, animated: true });
    setActiveJadwalIndex(index);
  };

  const scrollToMateriIndex = (index) => {
    materiListRef.current?.scrollToIndex({ index, animated: true });
    setActiveMateriIndex(index);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={PRIMARY} />

      {/* ── Main scrollable content ── */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <LinearGradient
          colors={['#24665A', '#45A493']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.headerLeft}>
            <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('Profil')}>
              {isRegistered ? (
                user?.foto_profil ? (
                  <Image
                    source={{ uri: `${API_BASE_URL}/storage/${user.foto_profil}` }}
                    style={styles.avatarImage}
                  />
                ) : (
                  <View style={styles.avatarInitialContainer}>
                    <AppText style={styles.avatarInitialText}>
                      {(() => {
                        const name = user?.nama_lengkap || 'Mahasiswa';
                        const words = name.trim().split(/\s+/);
                        if (words.length > 1) return (words[0][0] + words[words.length - 1][0]).toUpperCase();
                        return name.substring(0, 2).toUpperCase();
                      })()}
                    </AppText>
                  </View>
                )
              ) : (
                <Image
                  source={require('../assets/guest-avatar-green.png')}
                  style={styles.avatarImage}
                />
              )}
            </TouchableOpacity>
            <View>
              {isRegistered ? (
                <>
                  <AppText style={styles.greetSubText}>Selamat datang,</AppText>
                  <AppText style={styles.greetText}>{user?.nama_lengkap || 'Mahasiswa'}</AppText>
                </>
              ) : (
                <>
                  <AppText style={styles.greetText}>Halo sobat</AppText>
                  <TouchableOpacity style={styles.loginBtn} activeOpacity={0.8} onPress={() => navigation.navigate('Register')}>
                    <AppText style={styles.loginBtnText}>Daftar / Masuk</AppText>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
          {isRegistered && (
            <TouchableOpacity style={styles.bellBtn} activeOpacity={0.8} onPress={() => navigation.navigate('Notifikasi')}>
              <BellIcon />
              <View style={styles.bellBadge}>
                <AppText style={styles.bellBadgeText}>1</AppText>
              </View>
            </TouchableOpacity>
          )}
        </LinearGradient>

        {/* ── Search Section ── */}
        <View style={styles.searchSection}>
          <AppText style={styles.searchLabel}>Hari ini mau belajar apa ?</AppText>
          <View style={styles.searchBar}>
            <TextInput
              style={styles.searchInput}
              placeholder="Cari materi, topik, atau soal apapun"
              placeholderTextColor="#9CA3AF"
              value={searchText}
              onChangeText={setSearchText}
            />
            <TouchableOpacity style={styles.searchBtn} activeOpacity={0.85}>
              <SearchIcon />
            </TouchableOpacity>
          </View>

          <View style={styles.tagsContainer}>
            <View style={styles.tagsRow}>
              <AppText style={styles.tagsLabel}>Misal</AppText>
              {suggestions.map((s, i) => (
                <TouchableOpacity key={i} style={styles.tag} activeOpacity={0.75}>
                  <AppText style={styles.tagText}>{s}</AppText>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.tagsRowCenter}>
              <TouchableOpacity style={styles.tag} activeOpacity={0.75}>
                <AppText style={styles.tagText}>
                  {isRegistered ? 'Materi pemprogram berbasis web' : 'Struktur Data & Algoritma'}
                </AppText>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* ── Progress Pembelajaran (Registered Only) ── */}
        {isRegistered && (
          <View style={styles.progressCard}>
            <View style={styles.progressLeft}>
              <AppText style={styles.progressTitle}>Progress pembelajaran{'\n'}kamu</AppText>
              <AppText style={styles.progressDesc}>
                Kamu menyelesaikan {dashboardData.progress.completed_modules} modul{'\n'}pembelajaran bulan ini. Pertahankan{'\n'}semangat kamu!
              </AppText>

              <View style={styles.progressBarContainer}>
                <View style={styles.progressBarBg}>
                  <View style={[styles.progressBarFill, { width: `${dashboardData.progress.percentage}%` }]} />
                </View>
                <AppText style={styles.progressPercent}>{dashboardData.progress.percentage}%</AppText>
              </View>

              <TouchableOpacity
                style={styles.progressBtn}
                activeOpacity={0.8}
                onPress={() => navigation.navigate('ProgressBelajar')}
              >
                <AppText style={styles.progressBtnText}>Lihat progress</AppText>
              </TouchableOpacity>
            </View>
            <View style={styles.progressRight}>
              <Image
                source={require('../assets/progress-illustration.png')}
                style={styles.progressIllustration}
              />
            </View>
          </View>
        )}

        {/* ── Menu Grid (Registered: right after progress card) ── */}
        {isRegistered && (
          <View style={styles.menuGridExpanded}>
            <MenuIcon icon={<IconMataKuliah />} label="Mata kuliah" onPress={() => navigation.navigate('MataKuliah')} />
            <MenuIcon icon={<IconJadwal />} label="Jadwal" onPress={() => navigation.navigate('JadwalKelas')} />
            <MenuIcon icon={<IconMateri />} label="Materi" onPress={() => navigation.navigate('Materi')} />
            <MenuIcon icon={<IconTugas />} label={"Tugas\n&Kuis"} onPress={() => navigation.navigate('TugasKuis')} />
            <MenuIcon icon={<IconProgress />} label={'Progress\nbelajar'} onPress={() => navigation.navigate('ProgressBelajar')} />
            <MenuIcon icon={<IconNilai />} label="Lihat nilai" onPress={() => navigation.navigate('LihatNilai')} />
            <MenuIcon icon={<IconSertifikat />} label="Sertifikat" onPress={() => navigation.navigate('Sertifikat')} />
            <MenuIcon icon={<IconVerifikasi />} label="Verifikasi" onPress={() => navigation.navigate('VerifikasiSertifikat')} />
          </View>
        )}

        {/* ── Jadwal Hari Ini ── */}
        {isRegistered ? (
          <View style={styles.jadwalRegisteredSection}>
            <View style={styles.sectionHeader}>
              <AppText style={styles.sectionTitle}>Jadwal hari ini</AppText>
              {isLoading && <ActivityIndicator size="small" color={PRIMARY} />}
              {jadwals.length > 1 && (
                <View style={styles.dotRow}>
                  {jadwals.map((_, i) => (
                    <TouchableOpacity key={i} onPress={() => scrollToJadwalIndex(i)} activeOpacity={0.7}>
                      <SmoothDot active={activeJadwalIndex === i} />
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {jadwals.length === 0 && !isLoading ? (
              <View style={{ padding: 20, alignItems: 'center' }}>
                <AppText style={{ color: '#6B7280', fontSize: 13 }}>Tidak ada jadwal perkuliahan hari ini.</AppText>
              </View>
            ) : (
              <FlatList
                ref={jadwalListRef}
                data={jadwals}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                snapToInterval={SNAP_INTERVAL}
                snapToAlignment="start"
                decelerationRate="fast"
                contentContainerStyle={styles.carouselContainer}
                initialScrollIndex={0}
                getItemLayout={(_, index) => ({
                  length: SNAP_INTERVAL,
                  offset: SNAP_INTERVAL * index,
                  index,
                })}
                onViewableItemsChanged={onViewableJadwalChanged}
                viewabilityConfig={viewabilityConfig.current}
                renderItem={({ item, index }) => (
                  <AnimatedJadwalCard
                    item={item}
                    index={index}
                    activeIndex={activeJadwalIndex}
                    scrollToIndex={scrollToJadwalIndex}
                    jadwalsLength={jadwals.length}
                  />
                )}
              />
            )}
          </View>
        ) : (
          <View style={styles.jadwalCard}>
            <View style={styles.jadwalCardTop}>
              <View>
                <AppText style={styles.jadwalCardSmall}>Jadwal hari ini</AppText>
                <AppText style={styles.jadwalCardDate}>{dateStr}</AppText>
              </View>
            </View>
            <AppText style={styles.jadwalInfo}>
              Kamu belum memilih mata kuliah, yuk isi untuk{'\n'}menggunakan fitur lainnya
            </AppText>
            <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('Register')}>
              <AppText style={styles.jadwalCTA}>Isi sekarang</AppText>
            </TouchableOpacity>
          </View>
        )}

        {/* ── Menu Grid (Guest: after Jadwal Card) ── */}
        {!isRegistered && (
          <View style={styles.menuGridExpanded}>
            <MenuIcon icon={<IconMataKuliah />} label="Mata kuliah" onPress={() => navigation.navigate('MataKuliah')} isLocked={false} />
            <MenuIcon icon={<IconJadwal />} label="Jadwal" isLocked onPress={openDaftarModal} />
            <MenuIcon icon={<IconMateri />} label="Materi" isLocked onPress={openDaftarModal} />
            <MenuIcon icon={<IconTugas />} label={"Tugas\n&kuis"} isLocked onPress={openDaftarModal} />
            <MenuIcon icon={<IconProgress />} label={'Progress\nbelajar'} isLocked onPress={openDaftarModal} />
            <MenuIcon icon={<IconNilai />} label="Lihat nilai" isLocked onPress={openDaftarModal} />
            <MenuIcon icon={<IconSertifikat />} label="Sertifikat" isLocked onPress={openDaftarModal} />
            <MenuIcon icon={<IconVerifikasi />} label="Verifikasi" onPress={() => navigation.navigate('VerifikasiSertifikat')} isLocked={false} />
          </View>
        )}

        {/* ── Materi Terbaru (Registered Only) ── */}
        {isRegistered && (
          <View style={styles.materiRegisteredSection}>
            <View style={styles.sectionHeader}>
              <AppText style={styles.sectionTitle}>Materi terbaru</AppText>
              {materis.length > 1 && (
                <View style={styles.dotRow}>
                  {materis.map((_, i) => (
                    <TouchableOpacity key={i} onPress={() => scrollToMateriIndex(i)} activeOpacity={0.7}>
                      <SmoothDot active={activeMateriIndex === i} />
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {materis.length === 0 && !isLoading ? (
              <View style={{ padding: 20, alignItems: 'center' }}>
                <AppText style={{ color: '#6B7280', fontSize: 13 }}>Belum ada materi terbaru.</AppText>
              </View>
            ) : (
              <FlatList
                ref={materiListRef}
                data={materis}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                snapToInterval={SNAP_INTERVAL}
                snapToAlignment="start"
                decelerationRate="fast"
                contentContainerStyle={styles.carouselContainer}
                initialScrollIndex={0}
                getItemLayout={(_, index) => ({
                  length: SNAP_INTERVAL,
                  offset: SNAP_INTERVAL * index,
                  index,
                })}
                onViewableItemsChanged={onViewableMateriChanged}
                viewabilityConfig={viewabilityConfig.current}
                renderItem={({ item, index }) => (
                  <AnimatedMateriCard
                    item={item}
                    index={index}
                    activeIndex={activeMateriIndex}
                    scrollToIndex={scrollToMateriIndex}
                    materisLength={materis.length}
                  />
                )}
              />
            )}
          </View>
        )}

        {/* ── Rekomendasi Mata Kuliah (Guest) ── */}
        {!isRegistered && (
          <>
            <View style={styles.sectionHeader}>
              <AppText style={styles.sectionTitle}>Rekomendasi Mata kuliah</AppText>
              {/* Dot indicators */}
              <View style={styles.dotRow}>
                {courses.map((_, i) => (
                  <TouchableOpacity key={i} onPress={() => scrollToIndex(i)} activeOpacity={0.7}>
                    <SmoothDot active={activeIndex === i} />
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* ── Carousel ── */}
            <FlatList
              ref={flatListRef}
              data={courses}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToInterval={SNAP_INTERVAL}
              snapToAlignment="start"
              decelerationRate="fast"
              contentContainerStyle={styles.carouselContainer}
              initialScrollIndex={0}
              getItemLayout={(_, index) => ({
                length: SNAP_INTERVAL,
                offset: SNAP_INTERVAL * index,
                index,
              })}
              onViewableItemsChanged={onViewableItemsChanged}
              viewabilityConfig={viewabilityConfig.current}
              renderItem={({ item, index }) => (
                <AnimatedCourseCard
                  item={item}
                  index={index}
                  activeIndex={activeIndex}
                  scrollToIndex={scrollToIndex}
                  navigation={navigation}
                  coursesLength={courses.length}
                />
              )}
            />
          </>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* ── Modal Pop-up Daftar ── */}
      {modalVisible && (
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            { opacity: fadeAnim, zIndex: 9999 }
          ]}
        >
          <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill}>
            <TouchableOpacity
              style={styles.modalOverlay}
              activeOpacity={1}
              onPress={closeDaftarModal}
            >
              <TouchableOpacity activeOpacity={1} style={styles.modalContentSmall}>
                <TouchableOpacity style={styles.modalCloseBtn} onPress={closeDaftarModal} activeOpacity={0.8}>
                  <CloseIcon />
                </TouchableOpacity>
                <AppText style={styles.modalMessage}>
                  Silahkan daftar untuk{'\n'}mengakses fitur
                </AppText>
                <TouchableOpacity
                  style={styles.modalDaftarButton}
                  activeOpacity={0.8}
                  onPress={() => {
                    closeDaftarModal();
                    navigation.navigate('Register');
                  }}
                >
                  <AppText style={styles.modalDaftarText}>Daftar</AppText>
                </TouchableOpacity>
              </TouchableOpacity>
            </TouchableOpacity>
          </BlurView>
        </Animated.View>
      )}

      {/* ── Floating Adzan Bar — Fixed absolute, always visible ── */}
      <View style={styles.adzanBarContainer} pointerEvents="box-none">
        {adzanExpanded ? (
          /* Expanded: pill + icon */
          <TouchableOpacity
            style={styles.adzanPill}
            activeOpacity={0.9}
            onPress={() => setAdzanExpanded(false)}
          >
            <AppText style={styles.adzanText}>{'>'} Adzan berikutnya : {nextAdzan.name} ({nextAdzan.time})</AppText>
          </TouchableOpacity>
        ) : null}

        {/* Icon circle — always visible, press to toggle */}
        <TouchableOpacity
          style={styles.adzanIconCircle}
          activeOpacity={0.85}
          onPress={() => setAdzanExpanded((prev) => !prev)}
        >
          <SoundIcon />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 24 },

  // ── Header ──
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    paddingTop: 54,
    paddingBottom: 36,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  greetText: { color: '#fff', fontSize: 16, fontWeight: '700', marginBottom: 6 },
  loginBtn: {
    backgroundColor: '#F5A623',
    paddingHorizontal: 16,
    paddingVertical: 5,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  loginBtnText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  bellBtn: { position: 'relative', padding: 4 },
  bellBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: PRIMARY,
  },
  bellBadgeText: { color: '#fff', fontSize: 9, fontWeight: 'bold' },

  // ── Search Section ──
  searchSection: {
    backgroundColor: BG,
    paddingHorizontal: 20,
    paddingTop: 26,
    paddingBottom: 10,
  },
  searchLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingLeft: 16,
    paddingRight: 6,
    paddingVertical: 6,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  searchInput: { flex: 1, fontSize: 14, color: '#6B7280', height: 40 },
  searchBtn: {
    backgroundColor: PRIMARY,
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagsContainer: { marginTop: 18 },
  tagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  tagsRowCenter: { flexDirection: 'row', justifyContent: 'center', marginTop: 8 },
  tagsLabel: { fontSize: 14, color: '#6B7280', marginRight: 2 },
  tag: {
    backgroundColor: '#E8EFEA',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  tagText: { fontSize: 12, color: '#6B7280', fontWeight: '500' },

  // ── Jadwal Card ──
  jadwalCard: {
    backgroundColor: PRIMARY,
    marginHorizontal: 18,
    marginTop: 20,
    borderRadius: 20,
    padding: 22,
  },
  jadwalCardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  jadwalCardSmall: { color: 'rgba(255,255,255,0.85)', fontSize: 13, marginBottom: 6 },
  jadwalCardDate: { color: '#fff', fontSize: 18, fontWeight: '700' },
  jadwalBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#1BAE89',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  jadwalBtnText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  jadwalInfo: { color: '#fff', fontSize: 13, lineHeight: 20, textAlign: 'center', marginBottom: 10 },
  jadwalCTA: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },

  // ── Menu Grid ──
  menuGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 18,
    marginTop: 24,
    backgroundColor: BG,
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  menuItem: { alignItems: 'center', width: '25%', marginBottom: 16 },
  menuIconBox: {
    width: 58,
    height: 58,
    backgroundColor: '#E5E7EB',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  menuLabel: { fontSize: 13, color: '#111827', textAlign: 'center', lineHeight: 16, fontWeight: '500' },
  lockBadge: {
    position: 'absolute',
    bottom: -6,
    right: -2,
    backgroundColor: '#ffffff',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  // ── Section Header ──
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 18,
    marginTop: 26,
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#111827' },
  dotRow: { flexDirection: 'row', gap: 5, alignItems: 'center' },
  dot: { width: 7, height: 7, borderRadius: 3.5 },

  // ── Carousel ──
  carouselContainer: { paddingLeft: SIDE_PEEK },
  carouselCard: { width: CARD_WIDTH, alignItems: 'center' },
  carouselImage: { width: '100%', height: 190, borderRadius: 20 },
  carouselTextBox: { marginTop: 14, alignItems: 'center' },
  courseTitle: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 4 },
  courseLecturer: { fontSize: 13, color: '#6B7280' },

  // ── Floating Adzan Bar ── (absolute, fixed position on screen)
  adzanBarContainer: {
    position: 'absolute',
    // Fixed at a specific distance from bottom — always visible
    bottom: height * 0.05,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 999,
  },
  adzanPill: {
    backgroundColor: PRIMARY,
    paddingVertical: 10,
    paddingLeft: 16,
    paddingRight: 20,
    borderTopLeftRadius: 24,
    borderBottomLeftRadius: 24,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  adzanText: { color: '#fff', fontSize: 11, fontWeight: '600' },
  adzanIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -14,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },

  // ── Registered User Specific Styles ──
  avatarImage: { width: 46, height: 46, borderRadius: 23, borderWidth: 2, borderColor: '#fff' },
  avatarInitialContainer: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  avatarInitialText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: PRIMARY,
  },
  greetSubText: { color: 'rgba(255,255,255,0.85)', fontSize: 14, marginBottom: 2 },

  progressCard: {
    backgroundColor: PRIMARY,
    marginHorizontal: 18,
    marginTop: 24,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLeft: { flex: 1, paddingRight: 16 },
  progressTitle: { color: '#fff', fontSize: 16, fontWeight: '700', marginBottom: 8, lineHeight: 22 },
  progressDesc: { color: 'rgba(255,255,255,0.9)', fontSize: 13, lineHeight: 18, marginBottom: 14 },
  progressBarContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  progressBarBg: { flex: 1, height: 8, backgroundColor: '#FFFFFF', borderRadius: 4, marginRight: 8, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#F5A623', borderRadius: 4 },
  progressPercent: { color: '#fff', fontSize: 13, fontWeight: '700' },
  progressBtn: { backgroundColor: '#fff', paddingVertical: 10, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  progressBtnText: { color: '#4B5563', fontSize: 13, fontWeight: '800' },
  progressRight: { width: 110, height: 110, borderRadius: 55, backgroundColor: '#fff', overflow: 'hidden' },
  progressIllustration: { width: '100%', height: '100%' },

  menuGridExpanded: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: 18,
    marginTop: 24,
    backgroundColor: BG,
    paddingVertical: 10,
    paddingHorizontal: 4,
  },

  jadwalRegisteredSection: { marginTop: 8 },
  jadwalCarouselContent: { paddingLeft: 18, paddingRight: 18, gap: 16 },
  jadwalRegisteredCard: { width: CARD_WIDTH, backgroundColor: '#fff', borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: '#E5E7EB' },
  jrcImage: { width: '100%', height: 130 },
  jrcContent: { padding: 16 },
  jrcTitle: { fontSize: 14, fontWeight: '700', color: '#111827', marginBottom: 10 },
  jrcRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6, gap: 6 },
  jrcInfo: { fontSize: 12, color: '#4B5563' },
  jrcDivider: { height: 1, backgroundColor: '#E5E7EB', marginVertical: 12 },
  jrcLecturerRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  jrcAvatar: { width: 32, height: 32, borderRadius: 16 },
  jrcLecturerName: { fontSize: 12, fontWeight: '700', color: '#111827' },
  jrcLecturerRole: { fontSize: 10, color: '#6B7280' },

  materiRegisteredSection: {
    marginTop: 24,
    marginBottom: 8,
  },
  materiCarouselContent: { paddingLeft: 18, paddingRight: 18, gap: 16 },
  materiImageCard: {
    width: CARD_WIDTH,
    height: 160,
    borderRadius: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalContentSmall: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 24,
    paddingTop: 36,
    paddingBottom: 24,
    borderRadius: 16,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    position: 'relative',
    overflow: 'visible',
  },
  modalCloseBtn: {
    position: 'absolute',
    top: -14,
    right: -14,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  modalMessage: {
    fontSize: 15,
    fontWeight: '500',
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  modalDaftarButton: {
    backgroundColor: PRIMARY,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  modalDaftarText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});
