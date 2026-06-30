import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
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

const faqs = [
  {
    question: 'Bagaimana cara mendaftar kelas di Ucademy?',
    answer: 'Pilih menu "Mata Kuliah" dari halaman utama. Cari mata kuliah yang Anda inginkan, lalu klik tombol "Gabung" atau masukkan token pendaftaran jika diminta oleh Dosen Anda.'
  },
  {
    question: 'Di mana saya bisa melihat jadwal kuliah?',
    answer: 'Jadwal kuliah dapat dilihat pada tab "Home" (Beranda) di bagian Jadwal Hari Ini. Anda juga dapat melihat kalender lengkap di menu Jadwal Kelas.'
  },
  {
    question: 'Bagaimana cara mengumpulkan tugas?',
    answer: 'Buka mata kuliah yang bersangkutan, lalu masuk ke tab "Tugas dan Kuis". Pilih tugas yang ingin dikerjakan, dan unggah file tugas Anda sebelum batas waktu yang ditentukan berakhir.'
  },
  {
    question: 'Kenapa saya tidak bisa mengubah NPM?',
    answer: 'NPM dan Tahun Angkatan adalah data permanen yang terkait dengan identitas akademik Anda. Jika terdapat kesalahan pencatatan, silakan hubungi admin akademik kampus.'
  }
];

export default function BantuanScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <ChevronLeft />
          <Text style={styles.headerTitle}>Bantuan (FAQ)</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.description}>
          Berikut adalah beberapa pertanyaan yang sering ditanyakan seputar penggunaan aplikasi Ucademy.
        </Text>

        <View style={styles.faqList}>
          {faqs.map((faq, index) => (
            <View key={index} style={styles.faqCard}>
              <Text style={styles.questionText}>{faq.question}</Text>
              <Text style={styles.answerText}>{faq.answer}</Text>
            </View>
          ))}
        </View>

        <View style={styles.contactContainer}>
          <Text style={styles.contactTitle}>Masih butuh bantuan?</Text>
          <Text style={styles.contactDesc}>
            Hubungi dukungan teknis kami melalui email di support@ucademy.id atau kunjungi pusat layanan mahasiswa.
          </Text>
        </View>
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
    paddingTop: 24,
    paddingBottom: 40,
  },
  description: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 22,
    marginBottom: 24,
  },
  faqList: {
    gap: 16,
  },
  faqCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  questionText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  answerText: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 20,
  },
  contactContainer: {
    marginTop: 32,
    padding: 16,
    backgroundColor: '#E0F2F1',
    borderRadius: 12,
  },
  contactTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: PRIMARY,
    marginBottom: 4,
  },
  contactDesc: {
    fontSize: 13,
    color: '#374151',
    lineHeight: 20,
  }
});
