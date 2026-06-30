import React from 'react';
import AppText from '../components/AppText';
import { View, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
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

const UcademyLogo = ({ size = 100 }) => (
  <Svg width={size} height={size} viewBox="0 0 50 49" fill="none">
    <Path d="M4.97611 15.7346L24.5408 27.3902C25.1715 27.7659 25.9574 27.7659 26.5881 27.3902L42.8232 17.7182C44.5687 16.6783 43.8313 14 41.7996 14H28.0164C26.9118 14 26.0164 13.1046 26.0164 12V3.4856C26.0164 1.94124 24.3404 0.979599 23.0071 1.75892L4.99048 12.2897C3.67585 13.0581 3.66794 14.9553 4.97611 15.7346Z" fill="#116E63" />
    <Path d="M8.26718 31.3216C7.90002 30.9626 8.1142 24.2909 8.26718 21L24.3301 29.9753C25.8391 30.8495 26.6321 30.72 28.0016 29.9753L44.0645 21V31.3216L27.5426 40.7457C26.4448 41.064 25.8394 41.105 24.789 40.7457C19.4347 37.7539 8.63433 31.6806 8.26718 31.3216Z" fill="#10B981" />
  </Svg>
);

export default function TentangKamiScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <ChevronLeft />
          <AppText style={styles.headerTitle}>Tentang Kami</AppText>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.logoContainer}>
          <View style={styles.logoWrapper}>
            <UcademyLogo size={80} />
          </View>
          <AppText style={styles.appName}>Ucademy</AppText>
          <AppText style={styles.appVersion}>Versi 1.0.0</AppText>
        </View>

        <View style={styles.card}>
          <AppText style={styles.cardTitle}>Apa itu Ucademy?</AppText>
          <AppText style={styles.cardDesc}>
            Ucademy adalah platform Learning Management System (LMS) modern yang dirancang khusus untuk mempermudah kegiatan belajar mengajar antara mahasiswa dan dosen. Kami bertujuan untuk menciptakan pengalaman akademik yang terintegrasi, interaktif, dan mudah diakses dari mana saja.
          </AppText>
        </View>

        <View style={styles.card}>
          <AppText style={styles.cardTitle}>Visi Kami</AppText>
          <AppText style={styles.cardDesc}>
            Menjadi platform pendidikan digital terdepan yang mendobrak batasan ruang dan waktu, serta memberdayakan setiap individu untuk meraih potensi akademik terbaiknya.
          </AppText>
        </View>

        <AppText style={styles.copyright}>
          © 2026 Ucademy. All rights reserved.
        </AppText>
      </ScrollView>
    </View>
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
    paddingTop: 54,
    paddingBottom: 16,
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
    marginBottom: 24,
  },
  logoWrapper: {
    marginBottom: 8,
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
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
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
    fontSize: 13,
    color: '#9CA3AF',
  }
});
