import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  StatusBar,
  Image,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path } from 'react-native-svg';

const { width } = Dimensions.get('window');
const cardWidth = (width - 60) / 2; // 20 padding left, 20 padding right, 20 gap between cards

const BackIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M15 18L9 12L15 6" stroke="#4B5563" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const CertificateCard = ({ item }) => (
  <View style={styles.card}>
    <Image source={require('../assets/sertifikat.png')} style={styles.cardImage} resizeMode="cover" />
    <View style={styles.cardContent}>
      <Text style={styles.titleText}>{item.course}</Text>
      <View style={styles.dateRow}>
        <Text style={styles.dateLabel}>Tanggal terbit</Text>
        <Text style={styles.dateValue}>{item.date}</Text>
      </View>
    </View>
    <View style={styles.cardDivider} />
    <TouchableOpacity style={styles.downloadBtn} activeOpacity={0.7}>
      <Text style={styles.downloadBtnText}>Download</Text>
    </TouchableOpacity>
  </View>
);

export default function SertifikatScreen() {
  const navigation = useNavigation();

  const certificates = [
    { id: '1', course: 'Kalkulus 1', date: '10 Mei 2026' },
    { id: '2', course: 'Kalkulus 1', date: '10 Mei 2026' },
    { id: '3', course: 'Kalkulus 1', date: '10 Mei 2026' },
    { id: '4', course: 'Kalkulus 1', date: '10 Mei 2026' },
    { id: '5', course: 'Kalkulus 1', date: '10 Mei 2026' },
    { id: '6', course: 'Kalkulus 1', date: '10 Mei 2026' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerClickArea} onPress={() => navigation.goBack()}>
          <View style={styles.backBtn}>
            <BackIcon />
          </View>
          <Text style={styles.headerTitle}>Sertifikat</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.headerLine} />

      <View style={styles.container}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Sertifikat dari mata kuliah yang di selesaikan</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.gridContainer}>
            {certificates.map(cert => (
              <CertificateCard key={cert.id} item={cert} />
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
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
    paddingTop: 16,
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
  sectionHeader: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 14,
    color: '#374151',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  card: {
    width: cardWidth,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
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
    width: '100%',
    height: 100,
  },
  cardContent: {
    padding: 12,
  },
  titleText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateLabel: {
    fontSize: 9,
    color: '#9CA3AF',
  },
  dateValue: {
    fontSize: 9,
    fontWeight: '600',
    color: '#111827',
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    width: '100%',
  },
  downloadBtn: {
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  downloadBtnText: {
    fontSize: 11,
    color: '#4B5563',
    fontWeight: '500',
  }
});
