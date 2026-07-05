import { API_BASE_URL } from '../config/api';
import React, { useState, useEffect, useCallback } from 'react';
import AppText from '../components/AppText';
import { useFocusEffect } from '@react-navigation/native';
import { View, StyleSheet, TouchableOpacity, Image, StatusBar, FlatList, ImageBackground, Platform, ActivityIndicator, Modal, TextInput, ScrollView } from 'react-native';
import Svg, { Polyline, Path, Circle, Rect, Line } from 'react-native-svg';
import { BlurView } from 'expo-blur';

const BG = '#F8FAFC';
const PRIMARY = '#116E63';

// Icon Search
const SearchIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Circle cx="11" cy="11" r="8" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Line x1="16.5" y1="16.5" x2="22" y2="22" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// Icon Filter
const FilterIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Line x1="4" y1="21" x2="4" y2="14" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Line x1="4" y1="10" x2="4" y2="3" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Line x1="12" y1="21" x2="12" y2="12" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Line x1="12" y1="8" x2="12" y2="3" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Line x1="20" y1="21" x2="20" y2="16" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Line x1="20" y1="12" x2="20" y2="3" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Line x1="1" y1="14" x2="7" y2="14" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Line x1="9" y1="8" x2="15" y2="8" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Line x1="17" y1="16" x2="23" y2="16" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const CloseIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M18 6L6 18M6 6l12 12" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const CheckboxEmpty = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="3" width="18" height="18" rx="4" stroke="#6B7280" strokeWidth="2" />
  </Svg>
);

const CheckboxFilled = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="3" width="18" height="18" rx="4" fill="#116E63" />
    <Path d="M8 12.5L11 15.5L16 9.5" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ChevronDown = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Polyline points="6 9 12 15 18 9" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ChevronUp = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Polyline points="18 15 12 9 6 15" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

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

export default function MataKuliahScreen({ navigation, route }) {
  const isRegistered = route?.params?.isRegistered || false;
  const user = route?.params?.user || null;
  const token = route?.params?.token || null;

  const [activeTab, setActiveTab] = useState(isRegistered ? 'diambil' : 'tersedia'); // 'diambil' | 'tersedia'
  const [coursesData, setCoursesData] = useState({
    diambil: [],
    tersedia: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPeriode, setSelectedPeriode] = useState('2025/2026');
  const [modalPeriodeVisible, setModalPeriodeVisible] = useState(false);

  // Filter & Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [modalFilterVisible, setModalFilterVisible] = useState(false);
  const [selectedHari, setSelectedHari] = useState([]);
  const [selectedDosen, setSelectedDosen] = useState([]);
  const [selectedKelas, setSelectedKelas] = useState([]);
  const [selectedFakultas, setSelectedFakultas] = useState([]);
  const [selectedProdi, setSelectedProdi] = useState([]);
  const [expandedAccordions, setExpandedAccordions] = useState(['Fakultas', 'Program Studi', 'Hari', 'Dosen', 'Kelas']);

  const PERIODES = ['2023/2024', '2024/2025', '2025/2026', '2026/2027'];

  useFocusEffect(
    useCallback(() => {
      const fetchMataKuliah = async () => {
        setIsLoading(true);
        try {
          let API_URL = '';
          let headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          };

          if (isRegistered && token) {
            API_URL = Platform.OS === 'android'
              ? `${API_BASE_URL}/api/mahasiswa/mata-kuliah`
              : `http://localhost:8000/api/mahasiswa/mata-kuliah`;
            headers['Authorization'] = `Bearer ${token}`;
          } else {
            API_URL = Platform.OS === 'android'
              ? `${API_BASE_URL}/api/public/mata-kuliah`
              : `http://localhost:8000/api/public/mata-kuliah`;
          }

          const response = await fetch(API_URL, {
            method: 'GET',
            headers: headers
          });

          const json = await response.json();
          if (json.status === 'success') {
            setCoursesData({
              diambil: json.data.diambil,
              tersedia: json.data.tersedia
            });
          }
        } catch (error) {
          console.error("Mata Kuliah Fetch Error: ", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchMataKuliah();
    }, [isRegistered, token])
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Image
        source={require('../assets/kosong.png')}
        style={styles.emptyImage}
        resizeMode="contain"
      />
      <AppText style={styles.emptyText}>
        Kamu belum registrasi, yuk daftar untuk{'\n'}menggunakan fitur menarik{'\n'}lainnya
      </AppText>
      <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('Register')}>
        <AppText style={styles.registerLink}>Daftar</AppText>
      </TouchableOpacity>
    </View>
  );

  const renderItem = ({ item }) => {
    const isDiambil = activeTab === 'diambil';
    return (
      <TouchableOpacity style={styles.card} activeOpacity={0.8} onPress={() => navigation.navigate('DetailMataKuliah', { course: item, isRegistered, user, token, isDiambil })}>
        <Image source={{ uri: item?.image || 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&q=80' }} style={styles.cardImage} />
        <View style={styles.cardContent}>
          <AppText style={styles.cardTitle} numberOfLines={2}>{item?.title || 'Judul Tidak Tersedia'}</AppText>
          <View style={styles.cardRow}>
            <UsersIcon />
            <AppText style={styles.cardInfo} numberOfLines={1}>{item?.type || 'Tipe Tidak Tersedia'}</AppText>
          </View>
          <View style={styles.cardRow}>
            <ClockIcon />
            <AppText style={styles.cardInfo}>{item?.time || 'Waktu Tidak Tersedia'}</AppText>
          </View>
          <View style={styles.dosenRow}>
            <Image source={{ uri: item?.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80' }} style={styles.dosenAvatar} />
            <View>
              <AppText style={styles.dosenName} numberOfLines={1}>{item?.dosen || 'Dosen Tidak Tersedia'}</AppText>
              <AppText style={styles.dosenRole}>{item?.role || 'Dosen pengampu'}</AppText>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderTabs = () => (
    <View style={styles.tabContainer}>
      <TouchableOpacity
        style={[styles.tabButton, activeTab === 'diambil' && styles.tabButtonActive]}
        onPress={() => setActiveTab('diambil')}
        activeOpacity={0.8}
      >
        <AppText style={[styles.tabText, activeTab === 'diambil' && styles.tabTextActive]}>Diambil</AppText>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tabButton, activeTab === 'tersedia' && styles.tabButtonActive]}
        onPress={() => setActiveTab('tersedia')}
        activeOpacity={0.8}
      >
        <AppText style={[styles.tabText, activeTab === 'tersedia' && styles.tabTextActive]}>Tersedia</AppText>
      </TouchableOpacity>
    </View>
  );

  const renderPeriodeModal = () => (
    <Modal
      transparent={true}
      visible={modalPeriodeVisible}
      animationType="fade"
      onRequestClose={() => setModalPeriodeVisible(false)}
    >
      <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalPeriodeVisible(false)}
        >
          <View style={styles.modalContent}>
            <AppText style={styles.modalTitle}>Pilih Periode</AppText>
            {PERIODES.map((periode, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.periodeOption,
                  selectedPeriode === periode && styles.periodeOptionActive
                ]}
                onPress={() => {
                  setSelectedPeriode(periode);
                  setModalPeriodeVisible(false);
                }}
              >
                <AppText style={[
                  styles.periodeOptionText,
                  selectedPeriode === periode && styles.periodeOptionTextActive
                ]}>
                  {periode}
                </AppText>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </BlurView>
    </Modal>
  );

  // Filter berdasarkan tab aktif (diambil/tersedia)
  const sourceData = activeTab === 'diambil' ? coursesData.diambil : coursesData.tersedia;
  const safeSourceData = Array.isArray(sourceData) ? sourceData : [];

  const filterOptions = {
    Fakultas: [...new Set(safeSourceData.map(item => item.fakultas).filter(Boolean))],
    'Program Studi': [...new Set(safeSourceData.map(item => item.prodi).filter(Boolean))],
    Hari: [...new Set(safeSourceData.map(item => item.hari).filter(Boolean))],
    Dosen: [...new Set(safeSourceData.map(item => item.dosen).filter(Boolean))],
    Kelas: [...new Set(safeSourceData.map(item => item.kelas).filter(Boolean))]
  };

  const currentData = safeSourceData.filter(item => {
    if (item.tahun && item.tahun !== selectedPeriode) return false;
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const titleMatch = item.title?.toLowerCase().includes(q);
      const dosenMatch = item.dosen?.toLowerCase().includes(q);
      if (!titleMatch && !dosenMatch) return false;
    }

    if (selectedHari.length > 0 && !selectedHari.includes(item.hari)) return false;
    if (selectedDosen.length > 0 && !selectedDosen.includes(item.dosen)) return false;
    if (selectedKelas.length > 0 && !selectedKelas.includes(item.kelas)) return false;
    if (selectedFakultas.length > 0 && !selectedFakultas.includes(item.fakultas)) return false;
    if (selectedProdi.length > 0 && !selectedProdi.includes(item.prodi)) return false;

    return true;
  });

  const toggleCheckbox = (type, value) => {
    let current, setter;
    if (type === 'Hari') { current = selectedHari; setter = setSelectedHari; }
    else if (type === 'Dosen') { current = selectedDosen; setter = setSelectedDosen; }
    else if (type === 'Kelas') { current = selectedKelas; setter = setSelectedKelas; }
    else if (type === 'Fakultas') { current = selectedFakultas; setter = setSelectedFakultas; }
    else { current = selectedProdi; setter = setSelectedProdi; }

    if (current.includes(value)) {
      setter(current.filter(item => item !== value));
    } else {
      setter([...current, value]);
    }
  };

  const renderFilterModal = () => (
    <Modal
      transparent={true}
      visible={modalFilterVisible}
      animationType="slide"
      onRequestClose={() => setModalFilterVisible(false)}
    >
      <View style={styles.bottomSheetOverlay}>
        <View style={styles.bottomSheetContainer}>
          <View style={styles.bottomSheetHeader}>
            <View style={{ width: 24 }} />
            <AppText style={styles.bottomSheetTitle}>Urutkan dan Filter</AppText>
            <TouchableOpacity onPress={() => setModalFilterVisible(false)}>
              <CloseIcon />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.bottomSheetContent} showsVerticalScrollIndicator={false}>
            {Object.keys(filterOptions).map((type) => {
              const isExpanded = expandedAccordions.includes(type);
              const options = filterOptions[type];
              
              let currentSelected = [];
              if (type === 'Hari') currentSelected = selectedHari;
              if (type === 'Dosen') currentSelected = selectedDosen;
              if (type === 'Kelas') currentSelected = selectedKelas;
              if (type === 'Fakultas') currentSelected = selectedFakultas;
              if (type === 'Program Studi') currentSelected = selectedProdi;

              return (
                <View key={type} style={styles.accordionContainer}>
                  <TouchableOpacity
                    style={styles.accordionHeader}
                    activeOpacity={0.7}
                    onPress={() => {
                      if (isExpanded) {
                        setExpandedAccordions(expandedAccordions.filter(t => t !== type));
                      } else {
                        setExpandedAccordions([...expandedAccordions, type]);
                      }
                    }}
                  >
                    <AppText style={styles.accordionTitle}>{type}</AppText>
                    {isExpanded ? <ChevronUp /> : <ChevronDown />}
                  </TouchableOpacity>
                  
                  {isExpanded && (
                    <View style={styles.accordionContent}>
                      {options.length === 0 ? (
                        <AppText style={styles.noFilterText}>Tidak ada opsi {type.toLowerCase()}</AppText>
                      ) : (
                        options.map((option, idx) => (
                          <TouchableOpacity
                            key={idx}
                            style={styles.checkboxRow}
                            activeOpacity={0.7}
                            onPress={() => toggleCheckbox(type, option)}
                          >
                            <AppText style={styles.checkboxLabel}>{option}</AppText>
                            {currentSelected.includes(option) ? <CheckboxFilled /> : <CheckboxEmpty />}
                          </TouchableOpacity>
                        ))
                      )}
                    </View>
                  )}
                </View>
              );
            })}
          </ScrollView>

          <View style={styles.bottomSheetFooter}>
            <TouchableOpacity
              style={styles.btnTampilkan}
              activeOpacity={0.8}
              onPress={() => setModalFilterVisible(false)}
            >
              <AppText style={styles.btnTampilkanText}>
                Tampilkan {currentData.length} Hasil
              </AppText>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.btnHapusFilter}
              activeOpacity={0.7}
              onPress={() => {
                setSelectedHari([]);
                setSelectedDosen([]);
                setSelectedKelas([]);
                setSelectedFakultas([]);
                setSelectedProdi([]);
              }}
            >
              <AppText style={styles.btnHapusFilterText}>Hapus Filter</AppText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const activeFiltersCount = selectedHari.length + selectedDosen.length + selectedKelas.length + selectedFakultas.length + selectedProdi.length;

  const innerContent = (
    <View style={styles.content}>
      {/* ── Search Bar ── */}
      <View style={styles.searchRow}>
        <View style={styles.searchBar}>
          <SearchIcon />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari mata kuliah atau dosen..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity
          style={styles.filterBtn}
          activeOpacity={0.7}
          onPress={() => setModalFilterVisible(true)}
        >
          <FilterIcon />
          {activeFiltersCount > 0 && (
            <View style={styles.badgeContainer}>
              <AppText style={styles.badgeText}>{activeFiltersCount}</AppText>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* ── Tabs ── */}
      {renderTabs()}

      {/* ── Periode Selector ── */}
      <View style={styles.periodeRow}>
        <AppText style={styles.periodeLabel}>Periode :</AppText>
        <TouchableOpacity
          style={styles.periodeSelector}
          activeOpacity={0.7}
          onPress={() => setModalPeriodeVisible(true)}
        >
          <AppText style={styles.periodeText}>{selectedPeriode}</AppText>
          <ChevronsUpDown />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={PRIMARY} />
        </View>
      ) : activeTab === 'diambil' && !isRegistered ? (
        renderEmptyState()
      ) : currentData.length > 0 ? (
        <FlatList
          data={currentData}
          keyExtractor={(item, index) => item?.id ? item.id.toString() : index.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={{ flex: 1, alignItems: 'center', paddingTop: 40 }}>
          <AppText style={{ color: '#6B7280', fontSize: 14 }}>
            Tidak ada kelas {activeTab === 'diambil' ? 'yang diambil' : 'yang tersedia'}.
          </AppText>
        </View>
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
          <AppText style={styles.headerTitle}>Mata Kuliah</AppText>
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

      {renderPeriodeModal()}
      {renderFilterModal()}
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
    paddingTop: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#E5E7EB',
    borderRadius: 10,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabButtonActive: {
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  tabTextActive: {
    color: PRIMARY,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
    textAlign: 'center',
  },
  periodeOption: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    alignItems: 'center',
  },
  periodeOptionActive: {
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
    borderBottomWidth: 0,
  },
  periodeOptionText: {
    fontSize: 14,
    color: '#4B5563',
  },
  periodeOptionTextActive: {
    fontWeight: '700',
    color: PRIMARY,
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
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#111827',
  },
  filterBtn: {
    width: 48,
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  badgeContainer: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    paddingHorizontal: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  bottomSheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  bottomSheetContainer: {
    backgroundColor: '#FFFFFF', // Changed to white
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '75%',
  },
  bottomSheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB', // Lighter border
  },
  bottomSheetTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827', // Dark text
  },
  bottomSheetContent: {
    flex: 1,
  },
  accordionContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB', // Lighter border
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 18,
  },
  accordionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827', // Dark text
  },
  accordionContent: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  checkboxRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  checkboxLabel: {
    fontSize: 13,
    color: '#4B5563', // Gray text
  },
  noFilterText: {
    fontSize: 13,
    color: '#9CA3AF',
    fontStyle: 'italic',
    paddingVertical: 8,
  },
  bottomSheetFooter: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB', // Lighter border
  },
  btnTampilkan: {
    backgroundColor: PRIMARY, // Brand color for primary action
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  btnTampilkanText: {
    color: '#FFFFFF', // White text
    fontSize: 14,
    fontWeight: '700',
  },
  btnHapusFilter: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: 'center',
  },
  btnHapusFilterText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '600',
  },
});
