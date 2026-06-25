import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  TextInput,
  StatusBar,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path, Circle, Polyline, Line } from 'react-native-svg';

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

const DownloadIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Polyline points="7 10 12 15 17 10" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Line x1="12" y1="15" x2="12" y2="3" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const MateriCard = ({ item }) => (
  <View style={styles.card}>
    <View style={styles.iconContainer}>
      <Image
        source={item.type === 'ppt' ? require('../assets/ppt.png') : require('../assets/pdf.png')}
        style={styles.fileIcon}
        resizeMode="contain"
      />
    </View>
    <View style={styles.cardContent}>
      <Text style={styles.titleText}>{item.title}</Text>
      <Text style={styles.courseText}>{item.course}</Text>
      <Text style={styles.dateText}>{item.date}</Text>
    </View>
    <TouchableOpacity style={styles.downloadBtn}>
      <DownloadIcon />
    </TouchableOpacity>
  </View>
);

export default function MateriScreen() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');

  const newMateri = [
    {
      id: '1',
      title: 'Pengenalan dasar HTML',
      course: 'Pemprogaman web + Praktikum',
      date: '15 Juni 2026',
      type: 'ppt',
    },
    {
      id: '2',
      title: 'Limit dan Kontinuitas',
      course: 'Kalkulus 1',
      date: '15 Juni 2026',
      type: 'pdf',
    }
  ];

  const sharedMateri = [
    {
      id: '3',
      title: 'Pengenalan dasar HTML',
      course: 'Pemprogaman web + Praktikum',
      date: '15 Juni 2026',
      type: 'ppt',
    },
    {
      id: '4',
      title: 'Pengenalan dasar HTML',
      course: 'Pemprogaman web + Praktikum',
      date: '15 Juni 2026',
      type: 'pdf',
    },
    {
      id: '5',
      title: 'Pengenalan dasar HTML',
      course: 'Pemprogaman web + Praktikum',
      date: '15 Juni 2026',
      type: 'pdf',
    },
    {
      id: '6',
      title: 'Pengenalan dasar HTML',
      course: 'Pemprogaman web + Praktikum',
      date: '15 Juni 2026',
      type: 'pdf',
    },
    {
      id: '7',
      title: 'Pengenalan dasar HTML',
      course: 'Pemprogaman web + Praktikum',
      date: '15 Juni 2026',
      type: 'pdf',
    }
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerClickArea} onPress={() => navigation.goBack()}>
          <View style={styles.backBtn}>
            <BackIcon />
          </View>
          <Text style={styles.headerTitle}>Materi</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.headerLine} />

      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Cari materi / file"
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <TouchableOpacity style={styles.searchBtn}>
              <SearchIcon />
            </TouchableOpacity>
          </View>

          {/* Materi Terbaru */}
          <Text style={styles.sectionTitle}>Materi terbaru</Text>
          {newMateri.map(materi => (
            <MateriCard key={materi.id} item={materi} />
          ))}

          {/* Materi Dibagikan */}
          <Text style={styles.sectionTitle}>Materi dibagikan</Text>
          {sharedMateri.map(materi => (
            <MateriCard key={materi.id} item={materi} />
          ))}

        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 16,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
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
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingLeft: 16,
    paddingRight: 6,
    paddingVertical: 6,
    marginBottom: 24,
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
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
    marginTop: 8,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  iconContainer: {
    marginRight: 12,
  },
  fileIcon: {
    width: 40,
    height: 40,
  },
  cardContent: {
    flex: 1,
  },
  titleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  courseText: {
    fontSize: 10,
    color: '#4B5563',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  downloadBtn: {
    padding: 8,
  }
});
