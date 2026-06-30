import React from 'react';
import AppText from '../components/AppText';
import {
  View,

  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path } from 'react-native-svg';

const BackIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M15 18L9 12L15 6" stroke="#4B5563" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
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

  const nilaiData = [
    { id: '1', course: 'Pemprograman Web + Praktikum', sks: '3', nilai: '3.50', huruf: 'AB' },
    { id: '2', course: 'Rekayasa perangkat lunak + Praktikum', sks: '3', nilai: '3.50', huruf: 'AB' },
    { id: '3', course: 'Jaringan komputer', sks: '3', nilai: '3.50', huruf: 'AB' },
    { id: '4', course: 'Akhlak', needsEval: true },
    { id: '5', course: 'Matematika diskrit', sks: '3', nilai: '3.50', huruf: 'AB' },
    { id: '6', course: 'Kalkukus 1', sks: '3', nilai: '3.50', huruf: 'AB' },
    { id: '7', course: 'Pemprograman Web + Praktikum', sks: '3', nilai: '3.50', huruf: 'AB' },
    { id: '8', course: 'Struktur data & Algoritma + Praktikum', sks: '3', nilai: '3.50', huruf: 'AB' },
    { id: '9', course: 'Organisasi komputer dan Sistem oprasi + praktikum', sks: '3', nilai: '3.50', huruf: 'AB' },
    { id: '10', course: 'Statistika dan probabilitas', sks: '3', nilai: '3.50', huruf: 'AB' },
    { id: '11', course: 'Kecerdasan Buatan', sks: '3', nilai: '3.50', huruf: 'AB' },
  ];

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
          <AppText style={styles.summaryText}>TOTAL SKS : 60</AppText>
        </View>
        <View style={styles.summaryRight}>
          <AppText style={styles.summaryText}>IPK : 3.22</AppText>
        </View>
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

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {nilaiData.map((item, index) => (
            <TableRow
              key={item.id}
              item={item}
              index={index}
              onEvalPress={() => navigation.navigate('Evaluasi')}
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
