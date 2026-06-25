import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Dimensions,
  StatusBar,
  FlatList,
  Animated,
} from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');

// ── Color Palette ──────────────────────────────────────────────────────────────
const PRIMARY = '#307B70';
const BG = '#F8FAFC';

// ── Carousel constants ─────────────────────────────────────────────────────────
const CARD_WIDTH = width * 0.72;
const SIDE_PEEK = (width - CARD_WIDTH) / 2 - 12;
const CARD_GAP = 12;
const SNAP_INTERVAL = CARD_WIDTH + CARD_GAP;

// ── Icons ─────────────────────────────────────────────────────────────────────

const BellIcon = () => (
  <Svg width="26" height="26" viewBox="0 0 24 24" fill="#FBBF24">
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
  <Svg width="36" height="36" viewBox="0 0 48 48">
    <Rect x="4" y="8" width="40" height="32" rx="6" fill="#DBEAFE" />
    <Rect x="6" y="10" width="36" height="24" rx="4" fill="#EFF6FF" />
    <Circle cx="24" cy="22" r="4" fill="#F87171" />
    <Path d="M18 32c0-3.3 2.7-6 6-6s6 2.7 6 6H18z" fill="#F87171" />
    <Circle cx="13" cy="20" r="3" fill="#FBBF24" />
    <Path d="M9 30c0-2.2 1.8-4 4-4s4 1.8 4 4H9z" fill="#FBBF24" />
    <Circle cx="35" cy="20" r="3" fill="#34D399" />
    <Path d="M31 30c0-2.2 1.8-4 4-4s4 1.8 4 4h-8z" fill="#34D399" />
  </Svg>
);

const IconJadwal = () => (
  <Svg width="36" height="36" viewBox="0 0 48 48">
    <Rect x="6" y="8" width="36" height="32" rx="6" fill="#FEF3C7" stroke="#D97706" strokeWidth="2" />
    <Path d="M6 18h36" stroke="#F87171" strokeWidth="6" />
    <Path d="M14 4v8m20-8v8" stroke="#92400E" strokeWidth="3" strokeLinecap="round" />
    <Rect x="12" y="24" width="5" height="5" rx="1.5" fill="#D1D5DB" />
    <Rect x="21" y="24" width="5" height="5" rx="1.5" fill="#D1D5DB" />
    <Rect x="30" y="24" width="5" height="5" rx="1.5" fill="#10B981" />
    <Rect x="12" y="32" width="5" height="5" rx="1.5" fill="#D1D5DB" />
    <Rect x="21" y="32" width="5" height="5" rx="1.5" fill="#D1D5DB" />
  </Svg>
);

const IconMateri = () => (
  <Svg width="36" height="36" viewBox="0 0 48 48">
    <Path d="M12 14l22-5 5 24-22 5z" fill="#FBBF24" stroke="#92400E" strokeWidth="2" strokeLinejoin="round" />
    <Path d="M8 18l22-5 5 24-22 5z" fill="#F472B6" stroke="#831843" strokeWidth="2" strokeLinejoin="round" />
    <Path d="M4 22l22-5 5 24-22 5z" fill="#60A5FA" stroke="#1D4ED8" strokeWidth="2" strokeLinejoin="round" />
  </Svg>
);

const IconTugas = () => (
  <Svg width="36" height="36" viewBox="0 0 48 48">
    <Rect x="6" y="6" width="36" height="36" rx="6" fill="#ECFDF5" stroke="#6B7280" strokeWidth="2" />
    <Path d="M14 22l5 5 10-10" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M14 32h16" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round" />
    <Circle cx="34" cy="16" r="7" fill="#FBBF24" stroke="#92400E" strokeWidth="2" />
    <Path d="M34 12v5l3 3" stroke="#92400E" strokeWidth="1.5" strokeLinecap="round" />
  </Svg>
);

const IconProgress = () => (
  <Svg width="36" height="36" viewBox="0 0 48 48">
    <Rect x="6" y="8" width="36" height="32" rx="6" fill="#E0F2FE" />
    <Rect x="12" y="24" width="6" height="12" rx="2" fill="#34D399" />
    <Rect x="21" y="18" width="6" height="18" rx="2" fill="#FBBF24" />
    <Rect x="30" y="12" width="6" height="24" rx="2" fill="#F87171" />
    <Path d="M8 38h32" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />
  </Svg>
);

const IconNilai = () => (
  <Svg width="36" height="36" viewBox="0 0 48 48">
    <Circle cx="24" cy="24" r="18" fill="#FEE2E2" />
    <Path d="M16 24l6 6 12-12" stroke="#EF4444" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const IconSertifikat = () => (
  <Svg width="36" height="36" viewBox="0 0 48 48">
    <Rect x="10" y="6" width="28" height="36" rx="4" fill="#FEF3C7" />
    <Circle cx="24" cy="20" r="6" fill="#F59E0B" />
    <Path d="M22 26l-2 8 4-2 4 2-2-8" fill="#F59E0B" />
    <Path d="M16 12h16M16 34h16M16 38h10" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />
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
    <Text style={[styles.menuLabel, isLocked && { color: '#9CA3AF' }]}>{label}</Text>
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
          <Text style={styles.courseTitle}>{item.title}</Text>
          <Text style={styles.courseLecturer}>{item.lecturer}</Text>
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
          <Text style={styles.jrcTitle}>{item.title}</Text>
          <View style={styles.jrcRow}>
            <CalendarDarkIcon />
            <Text style={styles.jrcInfo}>{item.date}</Text>
          </View>
          <View style={styles.jrcRow}>
            <ClockDarkIcon />
            <Text style={styles.jrcInfo}>{item.time}</Text>
          </View>
          <View style={styles.jrcDivider} />
          <View style={styles.jrcLecturerRow}>
            <Image source={{ uri: item.avatar }} style={styles.jrcAvatar} />
            <View>
              <Text style={styles.jrcLecturerName}>{item.lecturer}</Text>
              <Text style={styles.jrcLecturerRole}>{item.role}</Text>
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
  const [searchText, setSearchText] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeJadwalIndex, setActiveJadwalIndex] = useState(0);
  const [activeMateriIndex, setActiveMateriIndex] = useState(0);
  const [adzanExpanded, setAdzanExpanded] = useState(true);
  const flatListRef = useRef(null);
  const jadwalListRef = useRef(null);
  const materiListRef = useRef(null);

  const [modalVisible, setModalVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

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

  const jadwals = [
    {
      id: 'j1',
      image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&q=80',
      title: 'Pemrograman Web + Praktikum',
      date: '21 Januari 2026',
      time: '08.10 - 9.10',
      lecturer: 'Yulianto M.kom',
      role: 'Dosen utama',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80',
    },
    {
      id: 'j2',
      image: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=600&q=80',
      title: 'Kalkulus Lanjut',
      date: '23 Januari 2026',
      time: '10.15 - 11.45',
      lecturer: 'Dr. Fauzi Hamdan',
      role: 'Dosen utama',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80',
    },
    {
      id: 'j3',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&q=80',
      title: 'Basis Data Terdistribusi',
      date: '25 Januari 2026',
      time: '13.00 - 15.00',
      lecturer: 'Siti Rahma, S.T',
      role: 'Asisten Dosen',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80',
    }
  ];

  const materis = [
    { id: 'm1', image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=80' },
    { id: 'm2', image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&q=80' },
    { id: 'm3', image: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=600&q=80' },
  ];

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

  const suggestions = ['Kuis html', 'Materi kalkukus', 'Live class'];

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
            {isRegistered ? (
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop' }} 
                style={styles.avatarImage} 
              />
            ) : (
              <UserAvatarIcon />
            )}
            <View>
              {isRegistered ? (
                <>
                  <Text style={styles.greetSubText}>Selamat datang,</Text>
                  <Text style={styles.greetText}>Dimas Putra Pratama</Text>
                </>
              ) : (
                <>
                  <Text style={styles.greetText}>Halo sobat</Text>
                  <TouchableOpacity style={styles.loginBtn} activeOpacity={0.8} onPress={() => navigation.navigate('Register')}>
                    <Text style={styles.loginBtnText}>Daftar / Masuk</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
          {isRegistered && (
            <TouchableOpacity style={styles.bellBtn} activeOpacity={0.8} onPress={() => navigation.navigate('Notifikasi')}>
              <BellIcon />
              <View style={styles.bellBadge}>
                <Text style={styles.bellBadgeText}>1</Text>
              </View>
            </TouchableOpacity>
          )}
        </LinearGradient>

        {/* ── Search Section ── */}
        <View style={styles.searchSection}>
          <Text style={styles.searchLabel}>Hari ini mau belajar apa ?</Text>
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
              <Text style={styles.tagsLabel}>Misal</Text>
              {suggestions.map((s, i) => (
                <TouchableOpacity key={i} style={styles.tag} activeOpacity={0.75}>
                  <Text style={styles.tagText}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.tagsRowCenter}>
              <TouchableOpacity style={styles.tag} activeOpacity={0.75}>
                <Text style={styles.tagText}>Materi pemprogram berbasis web</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* ── Progress Pembelajaran (Registered Only) ── */}
        {isRegistered && (
          <View style={styles.progressCard}>
            <View style={styles.progressLeft}>
              <Text style={styles.progressTitle}>Progress pembelajaran{'\n'}kamu</Text>
              <Text style={styles.progressDesc}>
                Kamu menyelesaikan 8 modul{'\n'}pembelajaran bulan ini. Pertahankan{'\n'}semangat kamu!
              </Text>
              
              <View style={styles.progressBarContainer}>
                <View style={styles.progressBarBg}>
                  <View style={[styles.progressBarFill, { width: '67%' }]} />
                </View>
                <Text style={styles.progressPercent}>67%</Text>
              </View>

              <TouchableOpacity 
                style={styles.progressBtn} 
                activeOpacity={0.8}
                onPress={() => navigation.navigate('ProgressBelajar')}
              >
                <Text style={styles.progressBtnText}>Lihat progress</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.progressRight}>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&q=80' }} 
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
            <View style={[styles.menuItem, { opacity: 0 }]} />
          </View>
        )}

        {/* ── Jadwal Hari Ini ── */}
        {isRegistered ? (
          <View style={styles.jadwalRegisteredSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Jadwal hari ini</Text>
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
          </View>
        ) : (
          <View style={styles.jadwalCard}>
            <View style={styles.jadwalCardTop}>
              <View>
                <Text style={styles.jadwalCardSmall}>Jadwal hari ini</Text>
                <Text style={styles.jadwalCardDate}>{dateStr}</Text>
              </View>
              <TouchableOpacity style={styles.jadwalBtn} activeOpacity={0.8} onPress={() => navigation.navigate('JadwalKelas')}>
                <CalendarSmallIcon />
                <Text style={styles.jadwalBtnText}>lihat jadwal</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.jadwalInfo}>
              Kamu belum memilih mata kuliah, yuk isi untuk{'\n'}menggunakan fitur lainnya
            </Text>
            <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('Register')}>
              <Text style={styles.jadwalCTA}>Isi sekarang</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── Menu Grid (Guest: after Jadwal Card) ── */}
        {!isRegistered && (
          <View style={styles.menuGridExpanded}>
            <MenuIcon icon={<IconMataKuliah />} label="Mata kuliah" onPress={() => navigation.navigate('MataKuliah')} />
            <MenuIcon icon={<IconJadwal />} label="Jadwal" onPress={() => navigation.navigate('JadwalKelas')} />
            <MenuIcon icon={<IconMateri />} label="Materi" isLocked onPress={openDaftarModal} />
            <MenuIcon icon={<IconTugas />} label={"Tugas\n&kuis"} isLocked onPress={openDaftarModal} />
            <MenuIcon icon={<IconProgress />} label={'Progress\nbelajar'} isLocked onPress={openDaftarModal} />
            <MenuIcon icon={<IconNilai />} label="Lihat nilai" isLocked onPress={openDaftarModal} />
            <MenuIcon icon={<IconSertifikat />} label="Sertifikat" isLocked onPress={openDaftarModal} />
            <View style={[styles.menuItem, { opacity: 0 }]} />
          </View>
        )}
        {/* ── Materi Terbaru (Registered Only) ── */}
        {isRegistered && (
          <View style={styles.materiRegisteredSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Materi terbaru</Text>
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
          </View>
        )}

        {/* ── Rekomendasi Mata Kuliah (Guest) ── */}
        {!isRegistered && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Rekomendasi Mata kuliah</Text>
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
          <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill}>
            <TouchableOpacity 
              style={styles.modalOverlay} 
              activeOpacity={1} 
              onPress={closeDaftarModal}
            >
              <TouchableOpacity activeOpacity={1} style={styles.modalContentSmall}>
                <TouchableOpacity style={styles.modalCloseBtn} onPress={closeDaftarModal} activeOpacity={0.8}>
                  <CloseIcon />
                </TouchableOpacity>
                <Text style={styles.modalMessage}>
                  Silahkan daftar untuk{'\n'}mengakses fitur
                </Text>
                <TouchableOpacity 
                  style={styles.modalDaftarButton}
                  activeOpacity={0.8}
                  onPress={() => {
                    closeDaftarModal();
                    navigation.navigate('Register');
                  }}
                >
                  <Text style={styles.modalDaftarText}>Daftar</Text>
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
            <Text style={styles.adzanText}>{'>'} Adzan berikutnya : Dzuhur (12.10)</Text>
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
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: PRIMARY,
  },
  bellBadgeText: { color: '#fff', fontSize: 8, fontWeight: 'bold' },

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
  searchInput: { flex: 1, fontSize: 13, color: '#6B7280', height: 40 },
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
  tagsLabel: { fontSize: 13, color: '#6B7280', marginRight: 2 },
  tag: {
    backgroundColor: '#E8EFEA',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  tagText: { fontSize: 11, color: '#6B7280', fontWeight: '500' },

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
  jadwalCardSmall: { color: 'rgba(255,255,255,0.85)', fontSize: 12, marginBottom: 6 },
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
  jadwalBtnText: { color: '#fff', fontSize: 11, fontWeight: '600' },
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
  menuLabel: { fontSize: 12, color: '#111827', textAlign: 'center', lineHeight: 16, fontWeight: '500' },
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
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#111827' },
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
  greetSubText: { color: 'rgba(255,255,255,0.85)', fontSize: 13, marginBottom: 2 },
  
  progressCard: {
    backgroundColor: '#35645B',
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
  progressDesc: { color: 'rgba(255,255,255,0.9)', fontSize: 11, lineHeight: 18, marginBottom: 14 },
  progressBarContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  progressBarBg: { flex: 1, height: 8, backgroundColor: '#FFFFFF', borderRadius: 4, marginRight: 8, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#F5A623', borderRadius: 4 },
  progressPercent: { color: '#fff', fontSize: 11, fontWeight: '700' },
  progressBtn: { backgroundColor: '#fff', paddingVertical: 10, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  progressBtnText: { color: '#4B5563', fontSize: 12, fontWeight: '700' },
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
