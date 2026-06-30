import React, { useState, useEffect } from 'react';
import AppText from '../components/AppText';
import {
  View,

  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import Svg, { Path, Circle } from 'react-native-svg';

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

const EvaluasiCard = ({ item, onPress }) => (
  <TouchableOpacity
    style={styles.card}
    activeOpacity={0.8}
    onPress={onPress}
    disabled={item.status === 'Selesai'}
  >
    <AppText style={styles.lecturerText}>{item.lecturer}</AppText>
    <AppText style={styles.courseText}>{item.course}</AppText>
    {item.status === 'Selesai' ? (
      <AppText style={styles.scoreText}>Nilai: {item.score}</AppText>
    ) : (
      <AppText style={styles.statusText}>*{item.status}</AppText>
    )}
  </TouchableOpacity>
);

export default function EvaluasiScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const [searchQuery, setSearchQuery] = useState('');

  const [evaluasiData, setEvaluasiData] = useState([
    { id: '1', lecturer: 'Yulianto S.Kom., M.kom', course: 'Pemprograman Web + Praktikum', status: 'Belum mengisi' },
    { id: '2', lecturer: 'Yulianto S.Kom., M.kom', course: 'Pemprograman Web + Praktikum', status: 'Belum mengisi' },
    { id: '3', lecturer: 'Yulianto S.Kom., M.kom', course: 'Pemprograman Web + Praktikum', status: 'Belum mengisi' },
    { id: '4', lecturer: 'Yulianto S.Kom., M.kom', course: 'Pemprograman Web + Praktikum', status: 'Belum mengisi' },
    { id: '5', lecturer: 'Yulianto S.Kom., M.kom', course: 'Pemprograman Web + Praktikum', status: 'Belum mengisi' },
    { id: '6', lecturer: 'Yulianto S.Kom., M.kom', course: 'Pemprograman Web + Praktikum', status: 'Belum mengisi' },
  ]);

  useEffect(() => {
    // We can remove the route param listener because we will use a direct callback
  }, []);

  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerClickArea} onPress={() => navigation.goBack()}>
          <View style={styles.backBtn}>
            <BackIcon />
          </View>
          <AppText style={styles.headerTitle}>Evaluasi</AppText>
        </TouchableOpacity>
      </View>
      <View style={styles.headerLine} />

      <View style={styles.container}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Cari pengajar"
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={styles.searchBtn}>
            <SearchIcon />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {evaluasiData.map(data => (
            <EvaluasiCard
              key={data.id}
              item={data}
              onPress={() => navigation.navigate('DetailEvaluasi', {
                item: data,
                onComplete: (completedId, score) => {
                  setEvaluasiData(prev => prev.map(i => i.id === completedId ? { ...i, status: 'Selesai', score } : i));
                }
              })}
            />
          ))}
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
    backgroundColor: '#F9FAFB',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 24,
    paddingLeft: 16,
    paddingRight: 6,
    paddingVertical: 6,
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
    width: 36,
    height: 36,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  lecturerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  courseText: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 12,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#EF4444',
  },
  scoreText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#116E63',
  }
});
