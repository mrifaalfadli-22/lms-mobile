import React from 'react';
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
} from 'react-native';
import Svg, { Path, Circle, Rect, G, Ellipse, Polygon } from 'react-native-svg';

const { width } = Dimensions.get('window');
const CARD_W = (width - 48 - 12) / 2;

// ── Icons ─────────────────────────────────────────────────────────────────────

const BellIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="white">
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

const CalendarIcon = () => (
  <Svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <Path
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      stroke="#116E63"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const ClockIcon = () => (
  <Svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="9" stroke="#116E63" strokeWidth="2" />
    <Path d="M12 7v5l3 3" stroke="#116E63" strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

// ── Menu Icons (Colorful approximations) ──────────────────────────────────────

const IconMataKuliah = () => (
  <Svg width="36" height="36" viewBox="0 0 40 40">
    <Rect x="4" y="8" width="32" height="24" rx="4" fill="#60A5FA" />
    <Rect x="6" y="10" width="28" height="18" rx="2" fill="#E0E7FF" />
    <Circle cx="20" cy="19" r="3" fill="#F87171" />
    <Path d="M16 26c0-2.2 2-4 4-4s4 1.8 4 4H16z" fill="#F87171" />
    <Circle cx="12" cy="16" r="2" fill="#FBBF24" />
    <Path d="M9 22c0-1.7 1.5-3 3-3s3 1.3 3 3H9z" fill="#FBBF24" />
    <Circle cx="28" cy="16" r="2" fill="#34D399" />
    <Path d="M25 22c0-1.7 1.5-3 3-3s3 1.3 3 3h-6z" fill="#34D399" />
  </Svg>
);

const IconJadwal = () => (
  <Svg width="36" height="36" viewBox="0 0 40 40">
    <Rect x="6" y="8" width="28" height="26" rx="4" fill="#F3F4F6" stroke="#4B5563" strokeWidth="2" />
    <Path d="M6 16h28" stroke="#F87171" strokeWidth="6" />
    <Path d="M12 5v6m16-6v6" stroke="#4B5563" strokeWidth="3" strokeLinecap="round" />
    <Rect x="10" y="20" width="4" height="4" rx="1" fill="#9CA3AF" />
    <Rect x="18" y="20" width="4" height="4" rx="1" fill="#9CA3AF" />
    <Rect x="26" y="20" width="4" height="4" rx="1" fill="#9CA3AF" />
    <Rect x="10" y="26" width="4" height="4" rx="1" fill="#9CA3AF" />
    <Rect x="18" y="26" width="4" height="4" rx="1" fill="#10B981" />
  </Svg>
);

const IconMateri = () => (
  <Svg width="36" height="36" viewBox="0 0 40 40">
    <Path d="M10 12l18-4 4 20-18 4z" fill="#FBBF24" stroke="#4B5563" strokeWidth="2" strokeLinejoin="round" />
    <Path d="M6 16l18-4 4 20-18 4z" fill="#F472B6" stroke="#4B5563" strokeWidth="2" strokeLinejoin="round" />
    <Path d="M2 20l18-4 4 20-18 4z" fill="#60A5FA" stroke="#4B5563" strokeWidth="2" strokeLinejoin="round" />
  </Svg>
);

const IconTugas = () => (
  <Svg width="36" height="36" viewBox="0 0 40 40">
    <Rect x="4" y="6" width="32" height="28" rx="4" fill="#E5E7EB" stroke="#4B5563" strokeWidth="2" />
    <Path d="M10 16l4 4 8-8" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M10 26h14" stroke="#4B5563" strokeWidth="3" strokeLinecap="round" />
    <Circle cx="28" cy="14" r="6" fill="#FBBF24" stroke="#4B5563" strokeWidth="2" />
    <Path d="M28 20v3" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const IconProgress = () => (
  <Svg width="36" height="36" viewBox="0 0 40 40">
    <Rect x="6" y="8" width="28" height="26" rx="4" fill="#E5E7EB" stroke="#4B5563" strokeWidth="2" />
    <Rect x="10" y="20" width="5" height="10" fill="#34D399" stroke="#4B5563" strokeWidth="1.5" />
    <Rect x="17" y="14" width="5" height="16" fill="#60A5FA" stroke="#4B5563" strokeWidth="1.5" />
    <Rect x="24" y="24" width="5" height="6" fill="#F87171" stroke="#4B5563" strokeWidth="1.5" />
    <Path d="M8 22l6-8 7 3 9-9" stroke="#FBBF24" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const IconNilai = () => (
  <Svg width="36" height="36" viewBox="0 0 40 40">
    <Circle cx="20" cy="16" r="12" fill="#E5E7EB" stroke="#4B5563" strokeWidth="2" />
    <Path d="M20 4a12 12 0 0112 12h-12z" fill="#F87171" stroke="#4B5563" strokeWidth="2" strokeLinejoin="round" />
    <Path d="M20 16L9.6 10A12 12 0 008 16z" fill="#60A5FA" stroke="#4B5563" strokeWidth="2" strokeLinejoin="round" />
    <Path d="M6 30c0-6 4-6 10-6h8c6 0 10 0 10 6v6H6v-6z" fill="#FBBF24" stroke="#4B5563" strokeWidth="2" strokeLinejoin="round" />
  </Svg>
);

const IconSertifikat = () => (
  <Svg width="36" height="36" viewBox="0 0 40 40">
    <Rect x="8" y="4" width="24" height="28" rx="2" fill="#F3F4F6" stroke="#4B5563" strokeWidth="2" />
    <Path d="M12 10h16M12 16h16M12 22h8" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round" />
    <Circle cx="28" cy="24" r="6" fill="#FBBF24" stroke="#4B5563" strokeWidth="2" />
    <Polygon points="28,20 29.5,23 33,23 30.5,25 31.5,28 28,26.5 24.5,28 25.5,25 23,23 26.5,23" fill="#10B981" />
  </Svg>
);

const MenuIcon = ({ icon, label }) => (
  <View style={styles.menuItem}>
    <View style={styles.menuIconBox}>{icon}</View>
    <Text style={styles.menuLabel}>{label}</Text>
  </View>
);

// ── Cards ─────────────────────────────────────────────────────────────────────

const ScheduleCard = ({ image, title, date, time, lecturer }) => (
  <View style={styles.scheduleCard}>
    <Image source={image} style={styles.scheduleCardImg} resizeMode="cover" />
    <View style={styles.scheduleCardBody}>
      <Text style={styles.scheduleCardTitle} numberOfLines={2}>{title}</Text>
      <View style={styles.scheduleCardMeta}>
        <CalendarIcon />
        <Text style={styles.scheduleCardMetaText}>{date}</Text>
      </View>
      <View style={styles.scheduleCardMeta}>
        <ClockIcon />
        <Text style={styles.scheduleCardMetaText}>{time}</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.lecturerRow}>
        <Image source={{ uri: 'https://i.pravatar.cc/80?img=11' }} style={styles.lecturerAvatar} />
        <View>
          <Text style={styles.lecturerName}>{lecturer}</Text>
          <Text style={styles.lecturerRole}>Dosen utama</Text>
        </View>
      </View>
    </View>
  </View>
);

const MateriCard = ({ image }) => (
  <View style={styles.materiCard}>
    <Image source={image} style={styles.materiCardImg} resizeMode="cover" />
  </View>
);

// ── HomeScreen ────────────────────────────────────────────────────────────────
export default function HomeScreen() {
  const suggestions = ['Kuis html', 'Materi kalkukus', 'Live class'];
  
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#116E63" />
      
      {/* ── Scrollable content ── */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header with Curved Bottom ── */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image
              source={{ uri: 'https://i.pravatar.cc/80?img=12' }}
              style={styles.avatar}
            />
            <View>
              <Text style={styles.greetText}>Selamat datang,</Text>
              <Text style={styles.nameText}>Dimas Putra Pratama</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.bellBtn}>
            <BellIcon />
            <View style={styles.bellDot} />
          </TouchableOpacity>
        </View>

        {/* ── Search Bar Area (Overlaps header) ── */}
        <View style={styles.searchSection}>
          <Text style={styles.searchLabel}>Hari ini mau belajar apa ?</Text>
          <View style={styles.searchBar}>
            <TextInput
              style={styles.searchInput}
              placeholder="Cari materi, topik, atau soal apapun"
              placeholderTextColor="#9CA3AF"
            />
            <TouchableOpacity style={styles.searchBtn}>
              <SearchIcon />
            </TouchableOpacity>
          </View>

          {/* Suggestion tags */}
          <View style={styles.tagsContainer}>
            <View style={styles.tagsRow}>
              <Text style={styles.tagsLabel}>Misal</Text>
              {suggestions.map((s, i) => (
                <TouchableOpacity key={i} style={styles.tag}>
                  <Text style={styles.tagText}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.tagsRowCenter}>
              <TouchableOpacity style={styles.tag}>
                <Text style={styles.tagText}>Materi pemprogram berbasis web</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* ── Progress Card ── */}
        <View style={styles.progressCard}>
          <View style={styles.progressCardLeft}>
            <Text style={styles.progressTitle}>Progress pembelajaran{'\n'}kamu</Text>
            <Text style={styles.progressDesc}>
              Kamu menyelesaikan 8 modul pembelajaran bulan ini. Pertahankan semangat kamu!
            </Text>
            <View style={styles.progressRow}>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: '67%' }]} />
              </View>
              <Text style={styles.progressPct}>67%</Text>
            </View>
            <TouchableOpacity style={styles.progressBtn}>
              <Text style={styles.progressBtnText}>Lihat progress</Text>
            </TouchableOpacity>
          </View>
          {/* Progress Illustration Box */}
          <View style={styles.progressIllustration}>
            <View style={styles.illustrationCircle}>
              {/* Abstract Illustration approximation */}
              <Svg width="110" height="110" viewBox="0 0 100 100">
                <Rect x="20" y="20" width="30" height="40" fill="#E5E7EB" />
                <Rect x="25" y="25" width="20" height="30" fill="#374151" />
                <Rect x="15" y="60" width="40" height="5" fill="#9CA3AF" />
                {/* Person */}
                <Circle cx="75" cy="45" r="8" fill="#F87171" />
                <Path d="M60 70c0-10 5-15 15-15s15 5 15 15H60z" fill="#FBBF24" />
                <Path d="M75 55l-10 5 5 10H85l5-10-10-5z" fill="#1F2937" />
              </Svg>
            </View>
          </View>
        </View>

        {/* ── Menu Grid ── */}
        <View style={styles.menuGrid}>
          <MenuIcon icon={<IconMataKuliah />} label="Mata kuliah" />
          <MenuIcon icon={<IconJadwal />} label="Jadwal" />
          <MenuIcon icon={<IconMateri />} label="Materi" />
          <MenuIcon icon={<IconTugas />} label={'Tugas\n&Kuis'} />
          <MenuIcon icon={<IconProgress />} label={'Progress\nbelajar'} />
          <MenuIcon icon={<IconNilai />} label="Lihat nilai" />
          <MenuIcon icon={<IconSertifikat />} label="Sertifikat" />
        </View>

        {/* ── Jadwal hari ini ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Jadwal hari ini</Text>
          <View style={styles.dotRow}>
            <View style={[styles.dot, { backgroundColor: PRIMARY }]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalScroll}
        >
          <ScheduleCard
            image={{ uri: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=500&q=80' }}
            title="Pemprograman Web + Praktikum"
            date="21 Januari 2026"
            time="08.10 - 9.10"
            lecturer="Yulianto M.kom"
          />
          <ScheduleCard
            image={{ uri: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&q=80' }}
            title="Pemprograman Web + Praktikum"
            date="21 Januari 2026"
            time="08.10 - 9.10"
            lecturer="Yulianto M.kom"
          />
        </ScrollView>

        {/* ── Materi terbaru ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Materi terbaru</Text>
          <View style={styles.dotRow}>
            <View style={[styles.dot, { backgroundColor: PRIMARY }]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[styles.horizontalScroll, { marginBottom: 100 }]}
        >
          <MateriCard image={{ uri: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=500&q=80' }} />
          <MateriCard image={{ uri: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=500&q=80' }} />
          <MateriCard image={{ uri: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=500&q=80' }} />
        </ScrollView>
      </ScrollView>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const PRIMARY = '#116E63';
const BG_COLOR = '#F9FAFB';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG_COLOR },

  // Header
  header: {
    backgroundColor: PRIMARY,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 54,
    paddingBottom: 40,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
    backgroundColor: '#ccc',
  },
  greetText: { color: 'rgba(255,255,255,0.85)', fontSize: 13, marginBottom: 2 },
  nameText: { color: '#fff', fontSize: 15, fontWeight: '700', letterSpacing: 0.2 },
  bellBtn: { position: 'relative', padding: 4, marginTop: 4 },
  bellDot: {
    position: 'absolute', top: 4, right: 4,
    width: 10, height: 10, borderRadius: 5,
    backgroundColor: '#F59E0B',
    borderWidth: 2, borderColor: PRIMARY,
  },

  // Scroll
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 30 },

  // Search Section
  searchSection: {
    marginTop: -24, // Pulls the search bar up over the header edge
    alignItems: 'center',
    zIndex: 10,
  },
  searchLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
    marginTop: 32,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    width: width - 48,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingLeft: 18,
    paddingRight: 6,
    paddingVertical: 6,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  searchInput: { flex: 1, fontSize: 13, color: '#374151', height: 40 },
  searchBtn: {
    backgroundColor: PRIMARY,
    width: 38, height: 38,
    borderRadius: 8,
    alignItems: 'center', justifyContent: 'center',
  },

  // Tags
  tagsContainer: { width: width - 48, marginTop: 16 },
  tagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tagsRowCenter: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  tagsLabel: { fontSize: 13, color: '#6B7280', marginRight: 4 },
  tag: {
    backgroundColor: '#E6EBE9',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  tagText: { fontSize: 11, color: '#6B7280', fontWeight: '500' },

  // Progress card
  progressCard: {
    backgroundColor: '#166E5B',
    marginHorizontal: 24,
    marginTop: 24,
    borderRadius: 20,
    flexDirection: 'row',
    padding: 20,
    elevation: 4,
    shadowColor: '#166E5B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  progressCardLeft: { flex: 1, paddingRight: 10, justifyContent: 'center' },
  progressTitle: {
    color: '#fff', fontSize: 16, fontWeight: '700', lineHeight: 22, marginBottom: 8,
  },
  progressDesc: { color: 'rgba(255,255,255,0.85)', fontSize: 11, lineHeight: 16, marginBottom: 16 },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  progressBarBg: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 6, height: 8,
  },
  progressBarFill: {
    backgroundColor: '#F59E0B', borderRadius: 6, height: 8,
  },
  progressPct: { color: '#fff', fontSize: 10, fontWeight: '700' },
  progressBtn: {
    backgroundColor: '#fff', borderRadius: 6,
    paddingHorizontal: 16, paddingVertical: 8, alignSelf: 'flex-start',
  },
  progressBtnText: { color: '#111827', fontSize: 11, fontWeight: '600' },
  progressIllustration: { width: 110, height: 110, justifyContent: 'center', alignItems: 'center' },
  illustrationCircle: {
    width: 110, height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden'
  },

  // Menu grid
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: 24,
    marginTop: 28,
    rowGap: 16,
    justifyContent: 'space-between',
  },
  menuItem: {
    width: (width - 48) / 4 - 8,
    alignItems: 'center',
  },
  menuIconBox: {
    width: 58, height: 58,
    backgroundColor: '#E5E7EB',
    borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 8,
  },
  menuLabel: {
    fontSize: 11, color: '#111827', textAlign: 'center', lineHeight: 15, fontWeight: '500'
  },

  // Section headers
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 24,
    marginTop: 28,
    marginBottom: 14,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#111827' },
  dotRow: { flexDirection: 'row', gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#D1D5DB' },

  // Horizontal scroll
  horizontalScroll: { paddingHorizontal: 24, gap: 14 },

  // Schedule card
  scheduleCard: {
    width: CARD_W + 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  scheduleCardImg: { width: '100%', height: 110 },
  scheduleCardBody: { padding: 14 },
  scheduleCardTitle: { fontSize: 12, fontWeight: '700', color: '#111827', marginBottom: 10, lineHeight: 18 },
  scheduleCardMeta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 5 },
  scheduleCardMetaText: { fontSize: 11, color: '#4B5563', fontWeight: '500' },
  divider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 10 },
  lecturerRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  lecturerAvatar: {
    width: 26, height: 26, borderRadius: 13, backgroundColor: '#E5E7EB',
  },
  lecturerName: { fontSize: 10, fontWeight: '600', color: '#111827', marginBottom: 2 },
  lecturerRole: { fontSize: 9, color: '#6B7280' },

  // Materi card
  materiCard: {
    width: CARD_W + 16,
    height: 160,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  materiCardImg: { width: '100%', height: '100%' },
});
