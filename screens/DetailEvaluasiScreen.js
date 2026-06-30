import React, { useState } from 'react';
import AppText from '../components/AppText';
import {
  View,

  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  TextInput,
  Modal
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path, Circle } from 'react-native-svg';

const BackIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M15 18L9 12L15 6" stroke="#4B5563" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const RadioChecked = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="9" stroke="#116E63" strokeWidth="2" />
    <Circle cx="12" cy="12" r="5" fill="#116E63" />
  </Svg>
);

const RadioUnchecked = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="9" stroke="#D1D5DB" strokeWidth="2" />
  </Svg>
);

const PAGE_1_QUESTIONS = [
  { id: 'q1', text: 'Pengajar menyampaikan materi dengan jelas dan mudah dipahami.' },
  { id: 'q2', text: 'Pengajar menguasai materi kuliah dengan sangat baik.' },
  { id: 'q3', text: 'Pengajar memberikan contoh relevan saat menjelaskan konsep.' },
  { id: 'q4', text: 'Pengajar merespon pertanyaan mahasiswa dengan tanggap.' },
  { id: 'q5', text: 'Suasana kelas interaktif dan mendorong partisipasi aktif.' },
];

const PAGE_2_QUESTIONS = [
  { id: 'q6', text: 'Metode pengajaran yang digunakan menarik dan tidak membosankan.' },
  { id: 'q7', text: 'Tugas dan kuis yang diberikan sesuai dengan materi yang diajarkan.' },
  { id: 'q8', text: 'Pengajar memberikan umpan balik (feedback) yang membangun.' },
  { id: 'q9', text: 'Pengajar selalu hadir tepat waktu.' },
];

export default function DetailEvaluasiScreen({ route }) {
  const navigation = useNavigation();
  const item = route?.params?.item;

  const [page, setPage] = useState(1);
  const [answers, setAnswers] = useState({});
  const [feedback, setFeedback] = useState('');
  const [errorModalVisible, setErrorModalVisible] = useState(false);

  const validatePage = () => {
    const currentQuestions = page === 1 ? PAGE_1_QUESTIONS : PAGE_2_QUESTIONS;
    const isAllAnswered = currentQuestions.every(q => answers[q.id] !== undefined);

    if (!isAllAnswered) {
      setErrorModalVisible(true);
      return false;
    }
    return true;
  };

  const handleSelect = (qId, value) => {
    setAnswers(prev => ({ ...prev, [qId]: value }));
  };

  const handleFinish = () => {
    // Generate a dummy score between 80 and 100 based on answers
    const totalSelected = Object.values(answers).reduce((acc, val) => acc + val, 0);
    const maxScore = 45; // 9 questions * 5 max
    const percentage = totalSelected / maxScore;
    let finalScore = Math.floor(70 + (percentage * 30));
    if (isNaN(finalScore)) finalScore = 95; // default if skipped

    // Pass data back via callback and pop screen
    if (route.params?.onComplete) {
      route.params.onComplete(item?.id, finalScore);
    }
    navigation.goBack();
  };

  const renderQuestion = (q) => (
    <View key={q.id} style={styles.questionCard}>
      <AppText style={styles.questionText}>{q.text}</AppText>
      <View style={styles.ratingRow}>
        <AppText style={styles.ratingLabelLeft}>Tidak{'\n'}puas</AppText>
        {[1, 2, 3, 4, 5].map((val) => (
          <TouchableOpacity
            key={val}
            activeOpacity={0.8}
            onPress={() => handleSelect(q.id, val)}
            style={styles.radioBtn}
          >
            {answers[q.id] === val ? <RadioChecked /> : <RadioUnchecked />}
          </TouchableOpacity>
        ))}
        <AppText style={styles.ratingLabelRight}>Sangat{'\n'}Puas</AppText>
      </View>
    </View>
  );

  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerClickArea} onPress={() => navigation.goBack()}>
          <View style={styles.backBtn}>
            <BackIcon />
          </View>
          <AppText style={styles.headerTitle}>Evaluasi</AppText>
        </TouchableOpacity>
      </View>
      <View style={styles.headerLine} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Title & Progress */}
        <View style={styles.titleContainer}>
          <AppText style={styles.pageTitle}>Evaluasi pengajar</AppText>
          <AppText style={styles.pageSubtitle}>Isi form di bawah untuk dapat melihat nilai</AppText>
          <AppText style={styles.pageIndicator}>{page} dari 2</AppText>
        </View>

        {/* Questions List */}
        {page === 1 ? (
          <View style={styles.questionsContainer}>
            {PAGE_1_QUESTIONS.map(renderQuestion)}
          </View>
        ) : (
          <View style={styles.questionsContainer}>
            {PAGE_2_QUESTIONS.map(renderQuestion)}

            {/* Feedback Input */}
            <View style={styles.questionCard}>
              <AppText style={styles.questionText}>Kesan, pesan, atau kritik</AppText>
              <TextInput
                style={styles.feedbackInput}
                placeholder="Tuliskan pendapat Anda di sini..."
                placeholderTextColor="#9CA3AF"
                multiline
                textAlignVertical="top"
                value={feedback}
                onChangeText={setFeedback}
              />
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.bottomActions}>
          <TouchableOpacity
            style={styles.btnSecondary}
            activeOpacity={0.7}
            onPress={() => {
              if (page === 1) {
                navigation.goBack();
              } else {
                setPage(1);
              }
            }}
          >
            <AppText style={styles.btnSecondaryText}>
              {page === 1 ? 'Keluar dari evaluasi' : 'Kembali'}
            </AppText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnPrimary}
            activeOpacity={0.8}
            onPress={() => {
              if (validatePage()) {
                if (page === 1) {
                  setPage(2);
                } else {
                  handleFinish();
                }
              }
            }}
          >
            <AppText style={styles.btnPrimaryText}>
              {page === 1 ? 'Lanjutkan' : 'Selesai'}
            </AppText>
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* Error Modal */}
      <Modal visible={errorModalVisible} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <AppText style={styles.modalTitle}>Evaluasi Belum Lengkap</AppText>
            <AppText style={styles.modalDesc}>Harap isi semua pilihan pada pertanyaan sebelum melanjutkan.</AppText>
            <TouchableOpacity
              style={styles.modalBtn}
              activeOpacity={0.8}
              onPress={() => setErrorModalVisible(false)}
            >
              <AppText style={styles.modalBtnText}>Mengerti</AppText>
            </TouchableOpacity>
          </View>
        </View>
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
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  titleContainer: {
    marginBottom: 24,
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  pageSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 12,
  },
  pageIndicator: {
    fontSize: 13,
    color: '#9CA3AF',
    textAlign: 'right',
  },
  questionsContainer: {
    gap: 16,
    marginBottom: 32,
  },
  questionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  questionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 18,
    lineHeight: 20,
  },
  ratingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingLabelLeft: {
    fontSize: 12,
    color: '#116E63',
    fontWeight: '600',
    textAlign: 'left',
    width: 40,
  },
  ratingLabelRight: {
    fontSize: 12,
    color: '#116E63',
    fontWeight: '600',
    textAlign: 'right',
    width: 40,
  },
  radioBtn: {
    padding: 6,
  },
  feedbackInput: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    height: 100,
    padding: 12,
    fontSize: 14,
    color: '#111827',
  },
  bottomActions: {
    flexDirection: 'row',
    gap: 12,
  },
  btnSecondary: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  btnSecondaryText: {
    color: '#4B5563',
    fontSize: 14,
    fontWeight: '600',
  },
  btnPrimary: {
    flex: 1,
    backgroundColor: '#116E63',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  btnPrimaryText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
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
    padding: 24,
    alignItems: 'center',
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
    marginBottom: 12,
    textAlign: 'center',
  },
  modalDesc: {
    fontSize: 14,
    color: '#4B5563',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  modalBtn: {
    backgroundColor: '#116E63',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    width: '100%',
    alignItems: 'center',
  },
  modalBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  }
});
