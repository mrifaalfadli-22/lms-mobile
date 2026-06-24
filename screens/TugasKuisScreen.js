import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ImageBackground, 
  ScrollView, 
  TextInput,
  Image,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
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

const AssignmentCard = ({ item }) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <Image source={item.avatar} style={styles.avatar} />
      <View style={styles.headerInfo}>
        <Text style={styles.lecturerText}>{item.lecturer} - {item.course}</Text>
        <Text style={styles.dateText}>Diupload : {item.date}</Text>
      </View>
    </View>
    <Text style={styles.titleText}>{item.title}</Text>
    <Text style={styles.descText}>{item.desc}</Text>
    <TouchableOpacity style={styles.btnLihat}>
      <Text style={styles.btnLihatText}>Lihat tugas</Text>
    </TouchableOpacity>
  </View>
);

export default function TugasKuisScreen() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');

  const newTasks = [
    {
      id: '1',
      lecturer: 'Yulianto M.kom',
      course: 'Pemprograman berbasis web',
      date: '16 Juni 2026 - 20.26',
      title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam volutpat semper dui et lobortis.',
      desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam volutpat semper dui et lobortis.',
      avatar: require('../assets/dosen.png')
    }
  ];

  const sharedTasks = [
    {
      id: '2',
      lecturer: 'Yulianto M.kom',
      course: 'Pemprograman berbasis web',
      date: '16 Juni 2026 - 20.26',
      title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam volutpat semper dui et lobortis.',
      desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam volutpat semper dui et lobortis.',
      avatar: require('../assets/dosen.png')
    },
    {
      id: '3',
      lecturer: 'Yulianto M.kom',
      course: 'Pemprograman berbasis web',
      date: '16 Juni 2026 - 20.26',
      title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam volutpat semper dui et lobortis.',
      desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam volutpat semper dui et lobortis.',
      avatar: require('../assets/dosen.png')
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
          <Text style={styles.headerTitle}>Tugas & Kuis kamu</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.headerLine} />

      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Cari tugas"
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <TouchableOpacity style={styles.searchBtn}>
              <SearchIcon />
            </TouchableOpacity>
          </View>

          {/* Tugas Baru */}
          <Text style={styles.sectionTitle}>Tugas baru</Text>
          {newTasks.map(task => (
            <AssignmentCard key={task.id} item={task} />
          ))}

          {/* Tugas Dibagikan */}
          <Text style={styles.sectionTitle}>Tugas dibagikan</Text>
          {sharedTasks.map(task => (
            <AssignmentCard key={task.id} item={task} />
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
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
    marginTop: 8,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#D1D5DB',
    marginRight: 10,
  },
  headerInfo: {
    flex: 1,
  },
  lecturerText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
  },
  dateText: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 2,
  },
  titleText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
    lineHeight: 18,
    marginBottom: 6,
  },
  descText: {
    fontSize: 11,
    color: '#4B5563',
    lineHeight: 16,
    marginBottom: 16,
  },
  btnLihat: {
    backgroundColor: '#116E63',
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  btnLihatText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  }
});
