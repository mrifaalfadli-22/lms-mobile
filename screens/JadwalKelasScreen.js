import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, StatusBar, Modal } from 'react-native';
import Svg, { Polyline } from 'react-native-svg';
import { format, startOfWeek, addDays, isSameDay, subWeeks, addWeeks } from 'date-fns';
import { id } from 'date-fns/locale/id';

const ACTIVE_BG = '#258A7A'; // Same as HomeScreen/TabBar active color
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

export default function JadwalKelasScreen({ navigation }) {
  const [activeDate, setActiveDate] = useState(new Date());
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  
  // State untuk Modal Picker Bulan
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [pickerYear, setPickerYear] = useState(new Date().getFullYear());

  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
    'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
  ];

  const handleSelectMonth = (monthIndex) => {
    const newDate = new Date(pickerYear, monthIndex, 1);
    setCurrentWeekStart(startOfWeek(newDate, { weekStartsOn: 1 }));
    setShowMonthPicker(false);
  };

  // Week Navigation
  const handlePrevWeek = () => setCurrentWeekStart(prev => subWeeks(prev, 1));
  const handleNextWeek = () => setCurrentWeekStart(prev => addWeeks(prev, 1));

  // Hasilkan 7 hari ke depan mulai dari state minggu yang sedang dilihat
  const dates = Array.from({ length: 7 }).map((_, i) => {
    const date = addDays(currentWeekStart, i);
    return {
      date: date,
      day: format(date, 'd'),
      dayName: format(date, 'EEE', { locale: id }), // Sen, Sel, Rab, dll
    };
  });

  // Format untuk Header Bulan & Tahun
  const currentMonthYear = format(currentWeekStart, 'MMMM yyyy', { locale: id });
  
  // Format untuk sub-judul jadwal
  const isToday = isSameDay(activeDate, new Date());
  const scheduleTitle = isToday ? 'Jadwal hari ini' : `Jadwal ${format(activeDate, 'EEEE, d MMM', { locale: id })}`;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={BG} />
      
      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <ChevronLeft />
          <Text style={styles.headerTitle}>Jadwal</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* ── Month Selector (Dropdown Style) ── */}
        <TouchableOpacity style={styles.monthSelector} activeOpacity={0.7} onPress={() => {
          setPickerYear(currentWeekStart.getFullYear());
          setShowMonthPicker(true);
        }}>
          <Text style={styles.monthText}>{currentMonthYear}</Text>
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
                  <Text style={[styles.dayNumber, isActive && styles.textWhite]}>{item.day}</Text>
                  <Text style={[styles.dayName, isActive && styles.textWhite]}>{item.dayName}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity onPress={handleNextWeek} style={styles.weekNavBtn} activeOpacity={0.6}>
            <ChevronRightSmall color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* ── Jadwal Title ── */}
        <Text style={styles.sectionTitle}>{scheduleTitle}</Text>

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

      {/* ── Month Picker Modal ── */}
      <Modal visible={showMonthPicker} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowMonthPicker(false)}>
          <TouchableOpacity activeOpacity={1} style={styles.modalContent}>
            
            {/* Year Selector in Modal */}
            <View style={styles.modalYearRow}>
              <TouchableOpacity onPress={() => setPickerYear(y => y - 1)} style={styles.modalYearBtn}>
                <ChevronLeftSmall color="#111827" />
              </TouchableOpacity>
              <Text style={styles.modalYearText}>{pickerYear}</Text>
              <TouchableOpacity onPress={() => setPickerYear(y => y + 1)} style={styles.modalYearBtn}>
                <ChevronRightSmall color="#111827" />
              </TouchableOpacity>
            </View>

            {/* Month Grid */}
            <View style={styles.monthGrid}>
              {monthNames.map((m, i) => (
                <TouchableOpacity key={i} style={styles.monthGridItem} onPress={() => handleSelectMonth(i)} activeOpacity={0.7}>
                  <Text style={styles.monthGridText}>{m}</Text>
                </TouchableOpacity>
              ))}
            </View>

          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

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
