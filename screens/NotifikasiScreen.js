import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path, Rect, Line } from 'react-native-svg';

const BackIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M15 18L9 12L15 6" stroke="#4B5563" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const TugasIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="4" width="18" height="16" rx="2" fill="#116E63" />
    <Path d="M8 9l2 2 4-4" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Line x1="8" y1="15" x2="16" y2="15" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const MateriIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M4 19.5A2.5 2.5 0 016.5 17H20" stroke="#116E63" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" fill="#116E63" />
    <Path d="M12 2v20" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const NotificationItem = ({ item }) => (
  <View style={styles.notifItem}>
    <View style={styles.iconCircle}>
      {item.type === 'tugas' ? <TugasIcon /> : <MateriIcon />}
    </View>
    <View style={styles.notifContent}>
      <Text style={styles.notifTitle}>
        <Text style={styles.boldText}>{item.titlePrefix}</Text>
        {item.titleSuffix}
      </Text>
      <Text style={styles.notifSubtitle}>{item.subtitle}</Text>
      <Text style={styles.notifDate}>{item.date}</Text>
    </View>
  </View>
);

export default function NotifikasiScreen() {
  const navigation = useNavigation();

  const notifications = [
    {
      id: '1',
      type: 'tugas',
      titlePrefix: 'Tugas baru dibagikan - ',
      titleSuffix: 'Jaringan komputer + Praktikum',
      subtitle: 'Cisco',
      date: '27 April 2026'
    },
    {
      id: '2',
      type: 'materi',
      titlePrefix: 'Materi baru dibagikan - ',
      titleSuffix: 'Jaringan komputer + Praktikum',
      subtitle: 'Pengenalan jenis jaringan',
      date: '27 April 2026'
    },
    {
      id: '3',
      type: 'tugas',
      titlePrefix: 'Tugas baru dibagikan - ',
      titleSuffix: 'Jaringan komputer + Praktikum',
      subtitle: 'Cisco',
      date: '27 April 2026'
    }
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerClickArea} onPress={() => navigation.goBack()}>
          <View style={styles.backBtn}>
            <BackIcon />
          </View>
          <Text style={styles.headerTitle}>Notifikasi</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.headerLine} />

      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {notifications.map(notif => (
            <NotificationItem key={notif.id} item={notif} />
          ))}
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
    backgroundColor: '#FFFFFF',
  },
  notifItem: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#D1E5E3',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  notifContent: {
    flex: 1,
    justifyContent: 'center',
  },
  notifTitle: {
    fontSize: 13,
    color: '#374151',
    lineHeight: 18,
    marginBottom: 4,
  },
  boldText: {
    fontWeight: '700',
    color: '#111827',
  },
  notifSubtitle: {
    fontSize: 12,
    color: '#4B5563',
    marginBottom: 8,
  },
  notifDate: {
    fontSize: 10,
    color: '#9CA3AF',
  }
});
