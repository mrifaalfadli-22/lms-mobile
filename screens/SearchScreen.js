import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Image,
  Platform,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Svg, { Path } from 'react-native-svg';
import { API_BASE_URL } from '../config/api';

const PRIMARY = '#167A61';
const BG = '#F9FAFB';

const BackIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M15 18L9 12L15 6" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const SearchIcon = () => (
  <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <Path d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export default function SearchScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  
  const [searchQuery, setSearchQuery] = useState(route.params?.query || '');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const userToken = route.params?.userToken || null;

  useEffect(() => {
    if (searchQuery.trim() && userToken) {
      fetchSearchResults(searchQuery.trim(), userToken);
    }
  }, [userToken]);

  const fetchSearchResults = async (query, token) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/mahasiswa/search?q=${encodeURIComponent(query)}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      const json = await response.json();
      if (json.status === 'success') {
        const { mata_kuliah, materi } = json.data;
        const combined = [
          ...mata_kuliah.map(item => ({ ...item, typeTitle: 'Mata Kuliah' })),
          ...materi.map(item => ({ ...item, typeTitle: 'Materi' }))
        ];
        setResults(combined);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim() && userToken) {
      fetchSearchResults(searchQuery.trim(), userToken);
    }
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.resultCard}
        activeOpacity={0.8}
        onPress={() => {
          if (item.typeTitle === 'Mata Kuliah') {
            navigation.navigate('DetailMataKuliah', { 
              course: { ...item },
              isDiambil: item.isDiambil,
              isRegistered: true,
              token: userToken
            });
          } else {
            navigation.navigate('DetailSesi', {
              meeting: { id: item.id_sesi }, 
              course: { title: item.course },
              userToken: userToken
            });
          }
        }}
      >
        <Image source={{ uri: item.image }} style={styles.resultImage} />
        <View style={styles.resultContent}>
          <Text style={styles.resultType}>{item.typeTitle}</Text>
          <Text style={styles.resultTitle} numberOfLines={2}>{item.title}</Text>
          {item.course ? <Text style={styles.resultSubtitle} numberOfLines={1}>{item.course}</Text> : null}
          {item.lecturer ? <Text style={styles.resultSubtitle} numberOfLines={1}>{item.lecturer}</Text> : null}
          {item.typeTitle === 'Mata Kuliah' && (
            <View style={{ marginTop: 2 }}>
              <Text style={styles.resultSubtitle} numberOfLines={1}>Fakultas {item.fakultas}</Text>
              <Text style={styles.resultSubtitle} numberOfLines={1}>{item.prodi} • {item.kelas}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <BackIcon />
        </TouchableOpacity>
        <View style={styles.searchBar}>
          <SearchIcon />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari materi atau mata kuliah..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearchSubmit}
            returnKeyType="search"
            autoFocus={true}
          />
        </View>
      </View>

      {/* Results */}
      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={PRIMARY} />
          <Text style={styles.loadingText}>Mencari...</Text>
        </View>
      ) : results.length > 0 ? (
        <FlatList
          data={results}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>Tidak ada hasil yang ditemukan untuk "{searchQuery}"</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG, paddingTop: Platform.OS === 'android' ? 25 : 0 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6'
  },
  backBtn: { padding: 8, marginRight: 8 },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44
  },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 14, color: '#111827' },
  listContainer: { padding: 16, paddingBottom: 32 },
  resultCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3
  },
  resultImage: { width: 80, height: 80, borderRadius: 8, marginRight: 12 },
  resultContent: { flex: 1, justifyContent: 'center' },
  resultType: { fontSize: 11, color: PRIMARY, fontWeight: '700', marginBottom: 4, textTransform: 'uppercase' },
  resultTitle: { fontSize: 14, color: '#111827', fontWeight: '700', marginBottom: 4 },
  resultSubtitle: { fontSize: 12, color: '#6B7280', marginBottom: 2 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  loadingText: { marginTop: 12, color: '#6B7280', fontSize: 14 },
  emptyText: { color: '#6B7280', fontSize: 14, textAlign: 'center' }
});
