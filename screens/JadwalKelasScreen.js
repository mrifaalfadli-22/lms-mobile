import React, { useState } from 'react';
import AppText from '../components/AppText';
import { View, StyleSheet, TouchableOpacity, Image, StatusBar, Modal, FlatList, ImageBackground, Platform, ActivityIndicator } from 'react-native';
import { BlurView } from 'expo-blur';
import Svg, { Polyline, Path, Circle } from 'react-native-svg';
import { format, startOfWeek, addDays, isSameDay, subWeeks, addWeeks } from 'date-fns';
import { id } from 'date-fns/locale/id';

import { useFocusEffect } from '@react-navigation/native';
import { API_BASE_URL } from '../config/api';

const ACTIVE_BG = '#116E63';
const PRIMARY = '#116E63';
const BG = '#F8FAFC';

// Icon Chevron Left
const ChevronLeft = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Polyline points="15 18 9 12 15 6" stroke="#4B5563" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// Icon Chevron Down
const ChevronDown = () => (
  <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <Polyline points="6 9 12 15 18 9" stroke="#111827" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// Small Chevrons for Navigation
const ChevronLeftSmall = ({ color = "#4B5563" }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Polyline points="15 18 9 12 15 6" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ChevronRightSmall = ({ color = "#4B5563" }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Polyline points="9 18 15 12 9 6" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const UsersIcon = () => (
  <Svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <Path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx="9" cy="7" r="4" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ClockRedIcon = () => (
  <Svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke="#EF4444" strokeWidth="2" />
    <Path d="M12 6v6l4 2" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export default function JadwalKelasScreen({ navigation, route }) {
  const isRegistered = route?.params?.isRegistered || false;
  const token = route?.params?.token || null;
  const user = route?.params?.user || null;

  const [activeDate, setActiveDate] = useState(new Date());
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [schedulesData, setSchedulesData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // State untuk Modal Picker Bulan
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [pickerYear, setPickerYear] = useState(new Date().getFullYear());

  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
    'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
  ];

  useFocusEffect(
    React.useCallback(() => {
      const fetchJadwal = async () => {
        if (!isRegistered || !token) return;
        setIsLoading(true);
        try {
          const API_URL = Platform.OS === 'android' 
            ? `${API_BASE_URL}/api/mahasiswa/jadwal-kelas` 
            : `http://localhost:8000/api/mahasiswa/jadwal-kelas`;
            
          const response = await fetch(API_URL, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json'
            }
          });
          const json = await response.json();
          if (json.status === 'success') {
            setSchedulesData(json.data);
          }
        } catch (error) {
          console.error("Fetch jadwal error:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchJadwal();
    }, [isRegistered, token])
  );

  const handleSelectMonth = (monthIndex) => {
    const newDate = new Date(pickerYear, monthIndex, 1);
    setCurrentWeekStart(startOfWeek(newDate, { weekStartsOn: 1 }));
    setShowMonthPicker(false);
  };

  // Week Navigation
  const handlePrevWeek = () => setCurrentWeekStart(prev => subWeeks(prev, 1));
  const handleNextWeek = () => setCurrentWeekStart(prev => addWeeks(prev, 1));

  const dates = Array.from({ length: 7 }).map((_, i) => {
    const date = addDays(currentWeekStart, i);
    return {
      date: date,
      day: format(date, 'd'),
      dayName: format(date, 'EEE', { locale: id }),
    };
  });

  const currentMonthYear = format(currentWeekStart, 'MMMM yyyy', { locale: id });

  const isToday = isSameDay(activeDate, new Date());
  const scheduleTitle = isToday ? 'Jadwal hari ini' : `Jadwal ${format(activeDate, 'EEEE, d MMM', { locale: id })}`;

  const activeDateString = format(activeDate, 'yyyy-MM-dd');
  const displayedSchedules = schedulesData.filter(item => item.date === activeDateString);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => navigation.navigate('DetailSesi', { 
        meeting: { ...item, title: item.pertemuan },
        course: { title: item.course },
        userToken: token 
      })}
    >
      <Image source={require('../assets/dosen.jpg')} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <AppText style={styles.cardTitle}>{item.title}</AppText>
        <View style={styles.cardRow}>
          <UsersIcon />
          <AppText style={styles.cardInfo}>{item.pertemuan}</AppText>
        </View>
        <View style={styles.cardRow}>
          <ClockRedIcon />
          <AppText style={styles.cardInfo}>{item.time}</AppText>
        </View>
        <View style={styles.dosenRow}>
          <Image source={{ uri: item.avatar }} style={styles.dosenAvatar} />
          <View>
            <AppText style={styles.dosenName}>{item.dosen}</AppText>
            <AppText style={styles.dosenRole}>{item.role}</AppText>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const innerContent = (
    <View style={styles.content}>
      {/* ── Month Selector (Dropdown Style) ── */}
      <TouchableOpacity style={styles.monthSelector} activeOpacity={0.7} onPress={() => {
        setPickerYear(currentWeekStart.getFullYear());
        setShowMonthPicker(true);
      }}>
        <AppText style={styles.monthText}>{currentMonthYear}</AppText>
        <ChevronDown />
      </TouchableOpacity>

      {/* ── Date Picker & Navigasi Minggu ── */}
      <View style={styles.datePickerContainer}>
        <TouchableOpacity onPress={handlePrevWeek} style={styles.weekNavBtn} activeOpacity={0.6}>
          <ChevronLeftSmall color="#9CA3AF" />
        </TouchableOpacity>

        <View style={styles.dateRow}>
          {dates.map((item, index) => {
            const isActive = isSameDay(item.date, activeDate);
            return (
              <TouchableOpacity
                key={index}
                style={[styles.dateCard, isActive && styles.dateCardActive]}
                onPress={() => setActiveDate(item.date)}
                activeOpacity={0.7}
              >
                <AppText style={[styles.dayNumber, isActive && styles.textWhite]}>{item.day}</AppText>
                <AppText style={[styles.dayName, isActive && styles.textWhite]}>{item.dayName}</AppText>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity onPress={handleNextWeek} style={styles.weekNavBtn} activeOpacity={0.6}>
          <ChevronRightSmall color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      {/* ── Jadwal Title ── */}
      <AppText style={styles.sectionTitle}>{scheduleTitle}</AppText>

      {isRegistered ? (
        isLoading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color={PRIMARY} />
          </View>
        ) : (
          <FlatList
            data={displayedSchedules}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => (
              <View style={[styles.emptyState, { paddingTop: 40 }]}>
                <AppText style={styles.emptyText}>Tidak ada jadwal kelas pada tanggal ini.</AppText>
              </View>
            )}
          />
        )
      ) : (
        <View style={styles.emptyState}>
          <Image
            source={require('../assets/kosong.png')}
            style={styles.emptyImage}
            resizeMode="contain"
          />
          <AppText style={styles.emptyText}>
            Kamu belum registrasi, yuk daftar untuk{'\n'}menggunakan fitur menarik{'\n'}lainnya
          </AppText>
          <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('Register')}>
            <AppText style={styles.registerLink}>Daftar</AppText>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={BG} />

      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <ChevronLeft />
          <AppText style={styles.headerTitle}>Jadwal</AppText>
        </TouchableOpacity>
      </View>

      {isRegistered ? (
        <ImageBackground
          source={require('../assets/bg-pattern.png')}
          style={styles.bgPattern}
          imageStyle={{ opacity: 0.3, resizeMode: 'cover' }}
        >
          {innerContent}
        </ImageBackground>
      ) : (
        <View style={styles.bgPattern}>
          {innerContent}
        </View>
      )}

      {/* ── Month Picker Modal ── */}
      <Modal visible={showMonthPicker} transparent animationType="fade">
        <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill}>
          <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowMonthPicker(false)}>
            <TouchableOpacity activeOpacity={1} style={styles.modalContent}>
              <View style={styles.modalYearRow}>
                <TouchableOpacity onPress={() => setPickerYear(y => y - 1)} style={styles.modalYearBtn}>
                  <ChevronLeftSmall color="#111827" />
                </TouchableOpacity>
                <AppText style={styles.modalYearText}>{pickerYear}</AppText>
                <TouchableOpacity onPress={() => setPickerYear(y => y + 1)} style={styles.modalYearBtn}>
                  <ChevronRightSmall color="#111827" />
                </TouchableOpacity>
              </View>
              <View style={styles.monthGrid}>
                {monthNames.map((m, i) => (
                  <TouchableOpacity key={i} style={styles.monthGridItem} onPress={() => handleSelectMonth(i)} activeOpacity={0.7}>
                    <AppText style={styles.monthGridText}>{m}</AppText>
                  </TouchableOpacity>
                ))}
              </View>
            </TouchableOpacity>
          </TouchableOpacity>
        </BlurView>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },
  bgPattern: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 54,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: BG,
    zIndex: 10,
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
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  monthText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginRight: 6,
  },
  datePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
    paddingHorizontal: 12,
  },
  weekNavBtn: {
    padding: 4,
  },
  dateRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 4,
  },
  dateCard: {
    flex: 1,
    height: 60,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    marginHorizontal: 2,
  },
  dateCardActive: {
    backgroundColor: ACTIVE_BG,
  },
  dayNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  dayName: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  textWhite: {
    color: '#FFFFFF',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    overflow: 'hidden',
  },
  cardImage: {
    width: 120,
    height: '100%',
    resizeMode: 'cover',
  },
  cardContent: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
    lineHeight: 20,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardInfo: {
    fontSize: 14,
    color: '#909090',
    marginLeft: 8,
  },
  dosenRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  dosenAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 8,
  },
  dosenName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  dosenRole: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingBottom: 80,
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

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  modalYearRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingHorizontal: 10,
  },
  modalYearBtn: {
    padding: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  modalYearText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  monthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  monthGridItem: {
    width: '30%',
    aspectRatio: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    marginBottom: 12,
  },
  monthGridText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
  },
});
