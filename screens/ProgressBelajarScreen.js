import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  StatusBar,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path, Circle } from 'react-native-svg';

const BackIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M15 18L9 12L15 6" stroke="#4B5563" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const UsersIcon = () => (
  <Svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <Path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx="9" cy="7" r="4" stroke="#9CA3AF" strokeWidth="2" />
    <Path d="M23 21v-2a4 4 0 00-3-3.87" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M16 3.13a4 4 0 010 7.75" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const DropdownIcon = () => (
  <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <Path d="M6 9l6 6 6-6" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const LinearProgress = ({ label, current, total, progress, color = '#116E63' }) => (
  <View style={styles.linearProgressContainer}>
    <View style={styles.linearProgressHeader}>
      <Text style={styles.linearProgressLabel}>{label}</Text>
      {total ? (
        <Text style={styles.linearProgressText}>{current} / {total}</Text>
      ) : (
        <Text style={styles.linearProgressText}>{progress}%</Text>
      )}
    </View>
    <View style={styles.linearProgressBarBg}>
      <View style={[styles.linearProgressBarFill, { width: `${progress}%`, backgroundColor: color }]} />
    </View>
  </View>
);

const ProgressCard = ({ item, onPress }) => (
  <TouchableOpacity style={styles.card} activeOpacity={0.8} onPress={onPress}>
    <Image source={{ uri: item.image }} style={styles.cardImage} resizeMode="cover" />
    <View style={styles.cardContent}>
      <Text style={styles.titleText}>{item.title}</Text>
      <View style={styles.subtitleRow}>
        <UsersIcon />
        <Text style={styles.subtitleText}>{item.classInfo} - {item.major}</Text>
      </View>
      <View style={styles.progressColumn}>
        <LinearProgress label="Absensi" current="5" total="8" progress={62.5} color="#1D4ED8" />
        <LinearProgress label="Tugas" current="5" total="8" progress={62.5} color="#1D4ED8" />
        <LinearProgress label="Ujian" progress={50} color="#1D4ED8" />
      </View>
    </View>
  </TouchableOpacity>
);

export default function ProgressBelajarScreen() {
  const navigation = useNavigation();

  const progressData = [
    {
      id: '1',
      title: 'Pemprograman Web + Praktikum',
      classInfo: 'Kar A',
      major: 'Teknik Informatika',
      image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&q=80'
    },
    {
      id: '2',
      title: 'Pemprograman Web + Praktikum',
      classInfo: 'Kar A',
      major: 'Teknik Informatika',
      image: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=600&q=80'
    },
    {
      id: '3',
      title: 'Pemprograman Web + Praktikum',
      classInfo: 'Kar A',
      major: 'Teknik Informatika',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&q=80'
    },
    {
      id: '4',
      title: 'Pemprograman Web + Praktikum',
      classInfo: 'Kar A',
      major: 'Teknik Informatika',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&q=80'
    },
    {
      id: '5',
      title: 'Pemprograman Web + Praktikum',
      classInfo: 'Kar A',
      major: 'Teknik Informatika',
      image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&q=80'
    }
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerClickArea} onPress={() => navigation.goBack()}>
          <View style={styles.backBtn}>
            <BackIcon />
          </View>
          <Text style={styles.headerTitle}>Progress belajar</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.headerLine} />

      <View style={styles.container}>
        <View style={styles.filterRow}>
          <Text style={styles.filterLabel}>Periode : </Text>
          <TouchableOpacity style={styles.dropdownBtn}>
            <Text style={styles.dropdownText}>2024 Ganjil</Text>
            <DropdownIcon />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {progressData.map(data => (
            <ProgressCard 
              key={data.id} 
              item={data} 
              onPress={() => navigation.navigate('DetailProgressBelajar', { item: data })} 
            />
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
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
    paddingTop: 16,
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
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  filterLabel: {
    fontSize: 14,
    color: '#4B5563',
  },
  dropdownBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginRight: 4,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    flexDirection: 'row',
    minHeight: 140,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    overflow: 'hidden',
  },
  cardImage: {
    width: 100,
    height: '100%',
  },
  cardContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 4,
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  subtitleText: {
    fontSize: 9,
    color: '#9CA3AF',
    marginLeft: 6,
  },
  progressColumn: {
    gap: 8,
    marginTop: 4,
  },
  linearProgressContainer: {
    width: '100%',
  },
  linearProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  linearProgressLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#374151',
  },
  linearProgressText: {
    fontSize: 10,
    color: '#6B7280',
  },
  linearProgressBarBg: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  linearProgressBarFill: {
    height: '100%',
    borderRadius: 3,
  }
});
