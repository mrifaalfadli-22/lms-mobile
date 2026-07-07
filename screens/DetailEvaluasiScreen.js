import React, { useState, useEffect } from 'react';
import AppText from '../components/AppText';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  TextInput,
  Modal,
  Platform,
  ActivityIndicator,
import { useNavigation } from '@react-navigation/native';
import Svg, { Path, Circle } from 'react-native-svg';
import { API_BASE_URL } from '../config/api';
import { useNotification } from '../context/NotificationContext';

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

export default function DetailEvaluasiScreen({ route }) {
  const navigation = useNavigation();
  const item = route?.params?.item;
  const token = route?.params?.token;
  const user = route?.params?.user;
  const isRegistered = route?.params?.isRegistered;
  const { showError, showWarning } = useNotification();

  const [loading, setLoading] = useState(true);
  const [pages, setPages] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const API_URL = Platform.OS === 'android'
          ? `${API_BASE_URL}/api/pertanyaan-evaluasi/aktif`
          : `http://localhost:8000/api/pertanyaan-evaluasi/aktif`;

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
          const grouped = json.data || {};

          // Split into pages of max 5
          const newPages = [];
          Object.keys(grouped).forEach(cat => {
             const catQuestions = grouped[cat] || [];
             for (let i = 0; i < catQuestions.length; i += 5) {
                newPages.push({
                   kategori: cat,
                   questions: catQuestions.slice(i, i + 5)
                });
             }
          });

          setPages(newPages);
        }
      } catch (error) {
        console.error("Fetch Questions Error:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (token) {
        fetchQuestions();
    } else {
        setLoading(false);
    }
  }, [token]);

  const validatePage = () => {
    if (pages.length === 0) return true;
    
    const currentQuestions = pages[pageIndex].questions;
    const isAllAnswered = currentQuestions.every(q => {
        if (q.tipe_pertanyaan === 'teks') {
            return answers[q.id_pertanyaan] && answers[q.id_pertanyaan].trim() !== '';
        }
        return answers[q.id_pertanyaan] !== undefined;
    });

    if (!isAllAnswered) {
      showWarning('Harap isi semua pilihan pada pertanyaan sebelum melanjutkan.', 'Evaluasi Belum Lengkap');
      return false;
    }
    return true;
  };

  const handleSelect = (qId, value) => {
    setAnswers(prev => ({ ...prev, [qId]: value }));
  };

  const handleTextChange = (qId, text) => {
    setAnswers(prev => ({ ...prev, [qId]: text }));
  }

  const handleFinish = async () => {
    setSubmitting(true);
    
    // Format answers array
    const formattedAnswers = Object.keys(answers).map(id => {
      const value = answers[id];
      if (typeof value === 'number') {
         return { id_pertanyaan: id, skor: value };
      } else {
         return { id_pertanyaan: id, jawaban_teks: value };
      }
    });

    try {
      const API_URL = Platform.OS === 'android'
        ? `${API_BASE_URL}/api/jawaban-evaluasi`
        : `http://localhost:8000/api/jawaban-evaluasi`;

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          id_jadwal: item.id,
          jawaban: formattedAnswers
        })
      });

      const json = await response.json();
      if (json.status === 'success' || json.status === 201) {
        // Reset navigation stack to [Main, LihatNilai] so that back button goes to Beranda
        navigation.reset({
          index: 1,
          routes: [
            { name: 'Main', params: { user, isRegistered, token } },
            { name: 'LihatNilai', params: { token, user, isRegistered, refresh: Date.now() } }
          ],
        });
      } else {
        showError(json.message || 'Terjadi kesalahan saat menyimpan evaluasi.');
      }
    } catch (error) {
      console.error("Submit Evaluation Error:", error);
      showError('Terjadi kesalahan jaringan.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderQuestion = (q) => {
    if (q.tipe_pertanyaan === 'teks') {
        return (
            <View key={q.id_pertanyaan} style={styles.questionCard}>
              <AppText style={styles.questionText}>{q.teks_pertanyaan}</AppText>
              <TextInput
                style={styles.feedbackInput}
                placeholder="Tuliskan jawaban Anda di sini..."
                placeholderTextColor="#9CA3AF"
                multiline
                textAlignVertical="top"
                value={answers[q.id_pertanyaan] || ''}
                onChangeText={(text) => handleTextChange(q.id_pertanyaan, text)}
              />
            </View>
        );
    }
    
    return (
        <View key={q.id_pertanyaan} style={styles.questionCard}>
          <AppText style={styles.questionText}>{q.teks_pertanyaan}</AppText>
          <View style={styles.ratingRow}>
            <AppText style={styles.ratingLabelLeft}>Tidak{'\n'}puas</AppText>
            {[1, 2, 3, 4, 5].map((val) => (
              <TouchableOpacity
                key={val}
                activeOpacity={0.8}
                onPress={() => handleSelect(q.id_pertanyaan, val)}
                style={styles.radioBtn}
              >
                {answers[q.id_pertanyaan] === val ? <RadioChecked /> : <RadioUnchecked />}
              </TouchableOpacity>
            ))}
            <AppText style={styles.ratingLabelRight}>Sangat{'\n'}Puas</AppText>
          </View>
        </View>
    );
  };

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

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#116E63" />
        </View>
      ) : pages.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <AppText style={{ color: '#6B7280' }}>Tidak ada pertanyaan evaluasi.</AppText>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

            {/* Title & Progress */}
            <View style={styles.titleContainer}>
            <AppText style={styles.pageTitle}>{pages[pageIndex].kategori.replace(/_/g, ' ').toUpperCase()}</AppText>
            <AppText style={styles.pageSubtitle}>Isi form di bawah untuk dapat melihat nilai</AppText>
            <AppText style={styles.pageIndicator}>{pageIndex + 1} dari {pages.length}</AppText>
            </View>

            {/* Questions List */}
            <View style={styles.questionsContainer}>
            {pages[pageIndex].questions.map(renderQuestion)}
            </View>

            {/* Action Buttons */}
            <View style={styles.bottomActions}>
            <TouchableOpacity
                style={styles.btnSecondary}
                activeOpacity={0.7}
                onPress={() => {
                if (pageIndex === 0) {
                    navigation.goBack();
                } else {
                    setPageIndex(pageIndex - 1);
                }
                }}
            >
                <AppText style={styles.btnSecondaryText}>
                {pageIndex === 0 ? 'Keluar' : 'Kembali'}
                </AppText>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.btnPrimary}
                activeOpacity={0.8}
                onPress={() => {
                  if (validatePage()) {
                    if (pageIndex < pages.length - 1) {
                      setPageIndex(pageIndex + 1);
                    } else {
                      handleFinish();
                    }
                  }
                }}
                disabled={submitting}
            >
                {submitting ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                    <AppText style={styles.btnPrimaryText}>
                    {pageIndex < pages.length - 1 ? 'Lanjutkan' : 'Selesai'}
                    </AppText>
                )}
            </TouchableOpacity>
            </View>

        </ScrollView>
      )}
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
