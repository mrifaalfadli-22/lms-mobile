import React, { useState, useEffect } from 'react';
import AppText from '../components/AppText';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Image,
  Modal,
  Platform,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path, Circle } from 'react-native-svg';
import { API_BASE_URL } from '../config/api';

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
      <AppText style={styles.linearProgressLabel}>{label}</AppText>
      {total ? (
        <AppText style={styles.linearProgressText}>{current} / {total}</AppText>
      ) : (
        <AppText style={styles.linearProgressText}>{progress}%</AppText>
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
      <AppText style={styles.titleText}>{item.title}</AppText>
      <View style={styles.subtitleRow}>
        <UsersIcon />
        <AppText style={styles.subtitleText}>{item.classInfo} - {item.major}</AppText>
      </View>
      <View style={styles.progressColumn}>
        <LinearProgress 
          label="Absensi" 
          current={item.absensi_current || 0} 
          total={item.absensi_total || 0} 
          progress={item.absensi_total ? Math.round(((item.absensi_current || 0)/(item.absensi_total || 1)) * 100) : 0} 
          color="#1D4ED8" 
        />
        <LinearProgress 
          label="Tugas" 
          current={item.tugas_current || 0} 
          total={item.tugas_total || 0} 
          progress={item.tugas_total ? Math.round(((item.tugas_current || 0)/(item.tugas_total || 1)) * 100) : 0} 
          color="#1D4ED8" 
        />
      </View>
    </View>
  </TouchableOpacity>
);

export default function ProgressBelajarScreen({ route }) {
  const navigation = useNavigation();
  const token = route?.params?.token || null;
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPeriode, setSelectedPeriode] = useState(new Date().getFullYear().toString());

  const [progressData, setProgressData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [periodes, setPeriodes] = useState([new Date().getFullYear().toString()]);

  useEffect(() => {
    const fetchProgress = async () => {
      setIsLoading(true);
      try {
        const baseUrl = Platform.OS === 'android' ? API_BASE_URL : 'http://localhost:8000';
        const response = await fetch(`${baseUrl}/api/mahasiswa/progress-belajar`, {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        const json = await response.json();
        if (json.status === 'success') {
          setProgressData(json.data || []);
          const uniquePeriodes = [...new Set((json.data || []).map(item => item.periode))].filter(Boolean);
          if (uniquePeriodes.length > 0) {
            setPeriodes(uniquePeriodes);
            if (!uniquePeriodes.includes(selectedPeriode)) {
                setSelectedPeriode(uniquePeriodes[0]);
            }
          }
        }
      } catch (error) {
        console.error("Fetch Progress Error: ", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (token) {
      fetchProgress();
    }
  }, [token]);

  const handleSelectPeriode = (periode) => {
    setSelectedPeriode(periode);
    setModalVisible(false);
  };

  const filteredData = progressData.filter(d => d.periode === selectedPeriode);

  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerClickArea} onPress={() => navigation.goBack()}>
          <View style={styles.backBtn}>
            <BackIcon />
          </View>
          <AppText style={styles.headerTitle}>Progress belajar</AppText>
        </TouchableOpacity>
      </View>
      <View style={styles.headerLine} />

      <View style={styles.container}>
        <View style={styles.filterRow}>
          <AppText style={styles.filterLabel}>Periode : </AppText>
          <TouchableOpacity style={styles.dropdownBtn} onPress={() => setModalVisible(true)}>
            <AppText style={styles.dropdownText}>{selectedPeriode}</AppText>
            <DropdownIcon />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {isLoading ? (
            <ActivityIndicator size="large" color="#116E63" style={{ marginTop: 40 }} />
          ) : filteredData.length === 0 ? (
            <AppText style={{ textAlign: 'center', marginTop: 40, color: '#9CA3AF' }}>Tidak ada data progress belajar pada periode ini.</AppText>
          ) : (
            filteredData.map(data => (
              <ProgressCard
                key={data.id}
                item={data}
                onPress={() => navigation.navigate('DetailProgressBelajar', { item: data, token })}
              />
            ))
          )}
        </ScrollView>
      </View>

      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            <AppText style={styles.modalTitle}>Pilih Periode</AppText>
            {periodes.map((p, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.periodeOption, selectedPeriode === p && styles.periodeOptionSelected, index === periodes.length - 1 && { borderBottomWidth: 0 }]}
                onPress={() => handleSelectPeriode(p)}
              >
                <AppText style={[styles.periodeOptionText, selectedPeriode === p && styles.periodeOptionTextSelected]}>{p}</AppText>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

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
    fontSize: 14,
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
    fontSize: 13,
    color: '#858585',
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
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  linearProgressText: {
    fontSize: 13,
    color: '#858585',
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
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    width: '100%',
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
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    alignItems: 'center',
  },
  periodeOptionSelected: {
    backgroundColor: '#F0FDF4',
    borderBottomColor: 'transparent',
    borderRadius: 8,
  },
  periodeOptionText: {
    fontSize: 15,
    color: '#4B5563',
  },
  periodeOptionTextSelected: {
    color: '#116E63',
    fontWeight: '700',
  }
});
