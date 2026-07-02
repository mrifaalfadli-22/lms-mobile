import React, { useState, useEffect } from 'react';
import AppText from '../components/AppText';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
  ActivityIndicator,
  Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import Svg, { Path, Polyline } from 'react-native-svg';
import { BlurView } from 'expo-blur';
import { API_BASE_URL } from '../config/api';

const BackIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M15 18L9 12L15 6" stroke="#4B5563" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ChevronsUpDown = () => (
  <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <Polyline points="7 15 12 20 17 15" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Polyline points="7 9 12 4 17 9" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const TableRow = ({ item, index, onEvalPress }) => {
  const isEven = index % 2 === 0;
  return (
    <View style={[styles.tableRow, isEven ? styles.rowEven : styles.rowOdd]}>
      <View style={styles.colCourse}>
        <AppText style={styles.courseText}>{item.course}</AppText>
      </View>

      {item.needsEval ? (
        <TouchableOpacity style={styles.colEval} activeOpacity={0.7} onPress={onEvalPress}>
          <AppText style={styles.evalText}>Silahkan isi evaluasi untuk melihat nilai</AppText>
        </TouchableOpacity>
      ) : (
        <>
          <View style={styles.colSKS}>
            <AppText style={styles.valueText}>{item.sks}</AppText>
          </View>
          <View style={styles.colNilai}>
            <AppText style={styles.valueText}>{item.nilai}</AppText>
          </View>
          <View style={styles.colHuruf}>
            <AppText style={styles.valueText}>{item.huruf}</AppText>
          </View>
        </>
      )}
    </View>
  );
};

export default function LihatNilaiScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { token } = route.params || {};

  const [loading, setLoading] = useState(true);
  const [allNilaiData, setAllNilaiData] = useState([]);
  const [periods, setPeriods] = useState(['Semua']);
  const [selectedPeriod, setSelectedPeriod] = useState('Semua');
  const [modalPeriodeVisible, setModalPeriodeVisible] = useState(false);

  useEffect(() => {
    const fetchNilai = async () => {
      try {
        const API_URL = Platform.OS === 'android'
          ? `${API_BASE_URL}/api/mahasiswa/nilai`
          : `http://localhost:8000/api/mahasiswa/nilai`;

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
          const data = json.data || [];
          setAllNilaiData(data);
          
          const uniquePeriods = Array.from(new Set(data.map(item => item.periode).filter(Boolean))).sort().reverse();
          setPeriods(['Semua', ...uniquePeriods]);
        }
      } catch (error) {
        console.error("Fetch Nilai Error: ", error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchNilai();
    } else {
      setLoading(false);
    }
  }, [token]);

  const filteredData = selectedPeriod === 'Semua' 
    ? allNilaiData 
    : allNilaiData.filter(item => item.periode === selectedPeriod);

  let totalSKS = 0;
  let totalPoints = 0;

  filteredData.forEach(item => {
    if (!item.needsEval) {
      const sks = parseFloat(item.sks) || 0;
      const nilai = parseFloat(item.nilai) || 0;
      totalSKS += sks;
      totalPoints += (sks * nilai);
    }
  });

  const ipk = totalSKS > 0 ? (totalPoints / totalSKS).toFixed(2) : '0.00';

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
            {periods.map((periode, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.periodeOption,
                  selectedPeriod === periode && styles.periodeOptionActive
                ]}
                onPress={() => {
                  setSelectedPeriod(periode);
                  setModalPeriodeVisible(false);
                }}
              >
                <AppText style={[
                  styles.periodeOptionText,
                  selectedPeriod === periode && styles.periodeOptionTextActive
                ]}>
                  {periode === 'Semua' ? 'Semua Periode' : periode}
                </AppText>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </BlurView>
    </Modal>
  );

  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerClickArea} onPress={() => navigation.goBack()}>
          <View style={styles.backBtn}>
            <BackIcon />
          </View>
          <AppText style={styles.headerTitle}>Lihat nilai</AppText>
        </TouchableOpacity>
      </View>

      <View style={styles.summaryContainer}>
        <View style={styles.summaryLeft}>
          <AppText style={styles.summaryText}>TOTAL SKS : {totalSKS}</AppText>
        </View>
        <View style={styles.summaryRight}>
          <AppText style={styles.summaryText}>IPK : {ipk}</AppText>
        </View>
      </View>

      <View style={styles.periodeRow}>
        <AppText style={styles.periodeLabel}>Periode :</AppText>
        <TouchableOpacity
          style={styles.periodeSelector}
          activeOpacity={0.7}
          onPress={() => setModalPeriodeVisible(true)}
        >
          <AppText style={styles.periodeText}>{selectedPeriod === 'Semua' ? 'Semua Periode' : selectedPeriod}</AppText>
          <ChevronsUpDown />
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        {/* Table Header */}
        <View style={styles.tableHeader}>
          <View style={styles.colCourse}>
            <AppText style={styles.tableHeaderLabel}>Mata kuliah</AppText>
          </View>
          <View style={styles.colSKS}>
            <AppText style={styles.tableHeaderLabelCenter}>SKS</AppText>
          </View>
          <View style={styles.colNilai}>
            <AppText style={styles.tableHeaderLabelCenter}>Nilai</AppText>
          </View>
          <View style={styles.colHuruf}>
            <AppText style={styles.tableHeaderLabelCenter}>Huruf</AppText>
          </View>
        </View>

        {loading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 40 }}>
            <ActivityIndicator size="large" color="#116E63" />
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {filteredData.length === 0 ? (
              <View style={{ alignItems: 'center', marginTop: 40 }}>
                <AppText style={{ color: '#6B7280' }}>Tidak ada data nilai untuk periode ini.</AppText>
              </View>
            ) : (
              filteredData.map((item, index) => (
                <TableRow
                  key={item.id}
                  item={item}
                  index={index}
                  onEvalPress={() => navigation.navigate('Evaluasi')}
                />
              ))
            )}
          </ScrollView>
        )}
      </View>
      {renderPeriodeModal()}
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
  summaryContainer: {
    flexDirection: 'row',
    height: 48,
  },
  summaryLeft: {
    flex: 1,
    backgroundColor: '#116E63',
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryRight: {
    flex: 1,
    backgroundColor: '#F59E0B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  periodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#F9FAFB',
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
    color: '#116E63',
  },
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },
  tableHeaderLabel: {
    fontSize: 14,
    color: '#374151',
  },
  tableHeaderLabelCenter: {
    fontSize: 14,
    color: '#374151',
    textAlign: 'center',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  rowEven: {
    backgroundColor: '#FFFFFF',
  },
  rowOdd: {
    backgroundColor: '#EAF4F4',
  },
  colCourse: {
    flex: 2.5,
    paddingRight: 8,
  },
  colSKS: {
    flex: 0.8,
  },
  colNilai: {
    flex: 1,
  },
  colHuruf: {
    flex: 0.8,
  },
  colEval: {
    flex: 2.6,
  },
  courseText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 16,
  },
  valueText: {
    fontSize: 14,
    color: '#111827',
    textAlign: 'center',
  },
  evalText: {
    fontSize: 12,
    color: '#EF4444',
    textAlign: 'center',
  }
});
