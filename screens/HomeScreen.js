import React, { useState, useRef, useCallback } from 'react';
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

// ── MenuIcon Component ─────────────────────────────────────────────────────────
const MenuIcon = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.menuItem} activeOpacity={0.75} onPress={onPress}>
    <View style={styles.menuIconBox}>{icon}</View>
    <Text style={styles.menuLabel}>{label}</Text>
  </TouchableOpacity>
);

// ── HomeScreen ────────────────────────────────────────────────────────────────
export default function HomeScreen({ navigation }) {
  const [searchText, setSearchText] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [adzanExpanded, setAdzanExpanded] = useState(true);
  const flatListRef = useRef(null);

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

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 60 });

  const scrollToIndex = (index) => {
    flatListRef.current?.scrollToIndex({ index, animated: true });
    setActiveIndex(index);
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
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <UserAvatarIcon />
            <View>
              <Text style={styles.greetText}>Halo sobat</Text>
              <TouchableOpacity style={styles.loginBtn} activeOpacity={0.8} onPress={() => navigation.navigate('Register')}>
                <Text style={styles.loginBtnText}>Daftar / Masuk</Text>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity style={styles.bellBtn} activeOpacity={0.8}>
            <BellIcon />
            <View style={styles.bellBadge}>
              <Text style={styles.bellBadgeText}>1</Text>
            </View>
          </TouchableOpacity>
        </View>

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

        {/* ── Jadwal Hari Ini Card ── */}
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

        {/* ── Menu Grid ── */}
        <View style={styles.menuGrid}>
          <MenuIcon icon={<IconMataKuliah />} label="Mata kuliah" onPress={() => navigation.navigate('MataKuliah')} />
          <MenuIcon icon={<IconJadwal />} label="Jadwal" onPress={() => navigation.navigate('JadwalKelas')} />
          <MenuIcon icon={<IconMateri />} label="Materi" />
          <MenuIcon icon={<IconTugas />} label={'Tugas\n&kuis'} />
        </View>

        {/* ── Rekomendasi Mata Kuliah ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Rekomendasi Mata kuliah</Text>
          {/* Dot indicators */}
          <View style={styles.dotRow}>
            {courses.map((_, i) => (
              <TouchableOpacity key={i} onPress={() => scrollToIndex(i)} activeOpacity={0.7}>
                <View
                  style={[
                    styles.dot,
                    activeIndex === i
                      ? { backgroundColor: PRIMARY, width: 18, borderRadius: 4 }
                      : { backgroundColor: '#CBD5E1' },
                  ]}
                />
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
          renderItem={({ item, index }) => {
            const isActive = index === activeIndex;
            return (
              <TouchableOpacity
                activeOpacity={0.9}
                style={[
                  styles.carouselCard,
                  { marginRight: index === courses.length - 1 ? SIDE_PEEK : CARD_GAP },
                ]}
                onPress={() => !isActive ? scrollToIndex(index) : navigation.navigate('DetailMataKuliah', { course: item })}
              >
                <Image
                  source={{ uri: item.image }}
                  style={[
                    styles.carouselImage,
                    isActive ? styles.carouselImageActive : styles.carouselImageInactive,
                  ]}
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
          }}
        />

        <View style={{ height: 24 }} />
      </ScrollView>

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
    backgroundColor: PRIMARY,
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
  menuItem: { alignItems: 'center', flex: 1 },
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
  carouselImage: { width: '100%', borderRadius: 20 },
  carouselImageActive: { height: 190 },
  carouselImageInactive: {
    height: 155,
    marginTop: 17.5,
    opacity: 0.55,
  },
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
});
