import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

const BG = '#F8FAFC';
const PRIMARY = '#116E63';

const ChevronLeft = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M15 18l-6-6 6-6" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export default function TentangKamiScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <ChevronLeft />
          <Text style={styles.headerTitle}>Tentang Kami</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.logoContainer}>
          <Image 
            source={require('../assets/icon.png')} 
            style={styles.logo} 
            resizeMode="contain" 
          />
          <Text style={styles.appName}>Ucademy</Text>
          <Text style={styles.appVersion}>Versi 1.0.0</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Apa itu Ucademy?</Text>
          <Text style={styles.cardDesc}>
            Ucademy adalah platform Learning Management System (LMS) modern yang dirancang khusus untuk mempermudah kegiatan belajar mengajar antara mahasiswa dan dosen. Kami bertujuan untuk menciptakan pengalaman akademik yang terintegrasi, interaktif, dan mudah diakses dari mana saja.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Visi Kami</Text>
          <Text style={styles.cardDesc}>
            Menjadi platform pendidikan digital terdepan yang mendobrak batasan ruang dan waktu, serta memberdayakan setiap individu untuk meraih potensi akademik terbaiknya.
          </Text>
        </View>

        <Text style={styles.copyright}>
          © 2026 Ucademy. All rights reserved.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BG,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
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
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: PRIMARY,
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 14,
    color: '#6B7280',
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  cardDesc: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 22,
  },
  copyright: {
    textAlign: 'center',
    marginTop: 24,
    fontSize: 12,
    color: '#9CA3AF',
  }
});
