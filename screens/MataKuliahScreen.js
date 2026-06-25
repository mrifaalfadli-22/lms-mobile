import React, { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, StyleSheet, TouchableOpacity, Image, StatusBar, FlatList, ImageBackground, Platform, ActivityIndicator, Modal } from 'react-native';
import Svg, { Polyline, Path, Circle } from 'react-native-svg';

const BG = '#F8FAFC';
const PRIMARY = '#116E63';

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

  const [activeTab, setActiveTab] = useState('diambil'); // 'diambil' | 'tersedia'
  const [coursesData, setCoursesData] = useState({
    diambil: [],
    tersedia: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPeriode, setSelectedPeriode] = useState('2024/2025');
  const [modalPeriodeVisible, setModalPeriodeVisible] = useState(false);

  const PERIODES = ['2023/2024', '2024/2025', '2025/2026', '2026/2027'];

  useFocusEffect(
    useCallback(() => {
      if (isRegistered && token) {
        const fetchMataKuliah = async () => {
          setIsLoading(true);
          try {
            const API_URL = Platform.OS === 'android' 
              ? 'http://10.0.2.2:8000/api/mahasiswa/mata-kuliah' 
              : 'http://localhost:8000/api/mahasiswa/mata-kuliah';
              
            const response = await fetch(API_URL, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
              }
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
      }
    }, [isRegistered, token])
  );

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

  const renderItem = ({ item }) => {
    const isDiambil = activeTab === 'diambil';
    return (
      <TouchableOpacity style={styles.card} activeOpacity={0.8} onPress={() => navigation.navigate('DetailMataKuliah', { course: item, isRegistered, user, token, isDiambil })}>
      <Image source={{ uri: item?.image || 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&q=80' }} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={2}>{item?.title || 'Judul Tidak Tersedia'}</Text>
        <View style={styles.cardRow}>
          <UsersIcon />
          <Text style={styles.cardInfo} numberOfLines={1}>{item?.type || 'Tipe Tidak Tersedia'}</Text>
        </View>
        <View style={styles.cardRow}>
          <ClockIcon />
          <Text style={styles.cardInfo}>{item?.time || 'Waktu Tidak Tersedia'}</Text>
        </View>
        <View style={styles.dosenRow}>
          <Image source={{ uri: item?.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80' }} style={styles.dosenAvatar} />
          <View>
            <Text style={styles.dosenName} numberOfLines={1}>{item?.dosen || 'Dosen Tidak Tersedia'}</Text>
            <Text style={styles.dosenRole}>{item?.role || 'Dosen pengampu'}</Text>
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
        <Text style={[styles.tabText, activeTab === 'diambil' && styles.tabTextActive]}>Diambil</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.tabButton, activeTab === 'tersedia' && styles.tabButtonActive]}
        onPress={() => setActiveTab('tersedia')}
        activeOpacity={0.8}
      >
        <Text style={[styles.tabText, activeTab === 'tersedia' && styles.tabTextActive]}>Tersedia</Text>
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
      <TouchableOpacity 
        style={styles.modalOverlay} 
        activeOpacity={1} 
        onPress={() => setModalPeriodeVisible(false)}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Pilih Periode</Text>
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
              <Text style={[
                styles.periodeOptionText,
                selectedPeriode === periode && styles.periodeOptionTextActive
              ]}>
                {periode}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );

  // Filter berdasarkan tab aktif (diambil/tersedia)
  const sourceData = activeTab === 'diambil' ? coursesData.diambil : coursesData.tersedia;
  const safeSourceData = Array.isArray(sourceData) ? sourceData : [];
  
  // Filter berdasarkan periode yang dipilih
  const currentData = safeSourceData.filter(item => {
    if (!item || !item.tahun) return true; // Jika data lama tidak memiliki tahun, tampilkan saja
    return item.tahun === selectedPeriode;
  });

  const innerContent = (
    <View style={styles.content}>
      {/* ── Tabs ── */}
      {isRegistered && renderTabs()}

      {/* ── Periode Selector ── */}
      <View style={styles.periodeRow}>
        <Text style={styles.periodeLabel}>Periode :</Text>
        <TouchableOpacity 
          style={styles.periodeSelector} 
          activeOpacity={0.7}
          onPress={() => setModalPeriodeVisible(true)}
        >
          <Text style={styles.periodeText}>{selectedPeriode}</Text>
          <ChevronsUpDown />
        </TouchableOpacity>
      </View>

      {isRegistered ? (
        isLoading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color={PRIMARY} />
          </View>
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
            <Text style={{ color: '#6B7280', fontSize: 14 }}>
              Tidak ada kelas {activeTab === 'diambil' ? 'yang diambil' : 'yang tersedia'}.
            </Text>
          </View>
        )
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
          <Text style={styles.headerTitle}>Mata Kuliah</Text>
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
});
