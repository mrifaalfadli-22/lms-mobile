import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, StatusBar } from 'react-native';
import Svg, { Polyline } from 'react-native-svg';

const BG = '#F8FAFC';

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

export default function MataKuliahScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={BG} />
      
      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <ChevronLeft />
          <Text style={styles.headerTitle}>Mata kuliah diambil</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* ── Periode Selector ── */}
        <View style={styles.periodeRow}>
          <Text style={styles.periodeLabel}>Periode :</Text>
          <TouchableOpacity style={styles.periodeSelector} activeOpacity={0.7}>
            <Text style={styles.periodeText}>2024 Ganjil</Text>
            <ChevronsUpDown />
          </TouchableOpacity>
        </View>

        {/* ── Empty State ── */}
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
      </View>
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
  content: {
    flex: 1,
    paddingTop: 24,
  },
  periodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 40,
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
