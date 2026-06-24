import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, StatusBar, FlatList, ImageBackground } from 'react-native';
import Svg, { Polyline, Path, Circle } from 'react-native-svg';

const BG = '#F8FAFC';

// Icon Chevron Left
const ChevronLeft = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Polyline points="15 18 9 12 15 6" stroke="#4B5563" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// Icon Up/Down Chevrons
const ChevronsUpDown = () => (
  <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <Polyline points="7 15 12 20 17 15" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Polyline points="7 9 12 4 17 9" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ClockIcon = () => (
  <Svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke="#9CA3AF" strokeWidth="2" />
    <Path d="M12 6v6l4 2" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const UsersIcon = () => (
  <Svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <Path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx="9" cy="7" r="4" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const MOCK_COURSES = Array(6).fill({
  title: 'Pemrograman Web + Praktikum',
  type: 'Kar A - Teknik Informatika',
  time: 'Kamis, 7.30 - 21.00',
  dosen: 'Yulianto M.kom',
}).map((item, idx) => ({ ...item, id: String(idx) }));

export default function MataKuliahScreen({ navigation, route }) {
  // For the purpose of this demonstration, we assume true. 
  // If we ever pass `isRegistered` we would read it from route params.
  const isRegistered = route?.params?.isRegistered || false;

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Image
        source={require('../assets/kosong.png')}
        style={styles.emptyImage}
        resizeMode="contain"
      />
      <Text style={styles.emptyText}>
        Kamu belum registrasi, yuk daftar untuk{'\n'}menggunakan fitur menarik{'\n'}lainnya
      </Text>
      <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('Register')}>
        <Text style={styles.registerLink}>Daftar</Text>
      </TouchableOpacity>
    </View>
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} activeOpacity={0.8} onPress={() => navigation.navigate('DetailMataKuliah', { course: item })}>
      <Image source={require('../assets/dosen.png')} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <View style={styles.cardRow}>
          <UsersIcon />
          <Text style={styles.cardInfo}>{item.type}</Text>
        </View>
        <View style={styles.cardRow}>
          <ClockIcon />
          <Text style={styles.cardInfo}>{item.time}</Text>
        </View>
        <View style={styles.dosenRow}>
          <Image source={require('../assets/dosen.png')} style={styles.dosenAvatar} />
          <View>
            <Text style={styles.dosenName}>{item.dosen}</Text>
            <Text style={styles.dosenRole}>Dosen pengampu</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const innerContent = (
    <View style={styles.content}>
      {/* ── Periode Selector ── */}
      <View style={styles.periodeRow}>
        <Text style={styles.periodeLabel}>Periode :</Text>
        <TouchableOpacity style={styles.periodeSelector} activeOpacity={0.7}>
          <Text style={styles.periodeText}>2024 Ganjil</Text>
          <ChevronsUpDown />
        </TouchableOpacity>
      </View>

      {isRegistered ? (
        <FlatList
          data={MOCK_COURSES}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        renderEmptyState()
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={BG} />
      
      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <ChevronLeft />
          <Text style={styles.headerTitle}>Mata kuliah diambil</Text>
        </TouchableOpacity>
      </View>

      {isRegistered ? (
        <ImageBackground
          source={require('../assets/bg-pattern.png')}
          style={styles.bgPattern}
          imageStyle={{ opacity: 0.3, resizeMode: 'cover' }}
        >
          {innerContent}
        </ImageBackground>
      ) : (
        <View style={styles.bgPattern}>
          {innerContent}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 54,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: BG,
    zIndex: 10,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 8,
  },
  bgPattern: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    flex: 1,
    paddingTop: 24,
  },
  periodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  periodeLabel: {
    fontSize: 14,
    color: '#111827',
    marginRight: 8,
  },
  periodeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  periodeText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginRight: 6,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    overflow: 'hidden',
  },
  cardImage: {
    width: 120,
    height: '100%',
    resizeMode: 'cover',
  },
  cardContent: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
    lineHeight: 20,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardInfo: {
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: 8,
  },
  dosenRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  dosenAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 8,
  },
  dosenName: {
    fontSize: 11,
    fontWeight: '600',
    color: '#111827',
  },
  dosenRole: {
    fontSize: 9,
    color: '#9CA3AF',
    marginTop: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 32,
    marginTop: 20,
  },
  emptyImage: {
    width: 250,
    height: 200,
    marginBottom: 24,
  },
  emptyText: {
    fontSize: 14,
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  registerLink: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    textDecorationLine: 'underline',
  },
});
