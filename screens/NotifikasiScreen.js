import React, { useState, useEffect } from 'react';
import AppText from '../components/AppText';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import Svg, { Path, Rect, Line, Circle } from 'react-native-svg';
import { API_BASE_URL } from '../config/api';

const BackIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M15 18L9 12L15 6" stroke="#4B5563" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ForumIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="#116E63" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const SertifikatIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" stroke="#116E63" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export default function NotifikasiScreen({ route }) {
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = route?.params?.token || null;

  useEffect(() => {
    if (token) {
      loadNotifications(token);
    } else {
      setLoading(false);
    }
  }, [token]);

  const loadNotifications = async (userToken) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/notifikasi`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${userToken}`
        }
      });
      const json = await response.json();
      if (json.success) {
        setNotifications(json.data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePressNotif = async (notif) => {
    if (!notif.is_read) {
      try {
        await fetch(`${API_BASE_URL}/api/notifikasi/${notif.id_notifikasi}/read`, {
          method: 'PUT',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        
        // Update state locally (hilangkan dari daftar karena sudah dibaca)
        setNotifications(prev => prev.filter(n => n.id_notifikasi !== notif.id_notifikasi));
      } catch (error) {
        console.error(error);
      }
    }

    // Navigasi sesuai tipe
    if (notif.tipe === 'forum' && notif.id_referensi) {
      navigation.navigate('ForumDiskusi', { 
        meeting: { id: notif.id_referensi },
        userToken: token 
      });
    } else if (notif.tipe === 'sertifikat') {
      navigation.navigate('Sertifikat');
    }
  };

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerClickArea} onPress={() => navigation.goBack()}>
          <View style={styles.backBtn}>
            <BackIcon />
          </View>
          <AppText style={styles.headerTitle}>Notifikasi</AppText>
        </TouchableOpacity>
      </View>
      <View style={styles.headerLine} />

      <View style={styles.container}>
        {loading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#116E63" />
          </View>
        ) : notifications.length === 0 ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <AppText style={{ color: '#9CA3AF' }}>Belum ada notifikasi.</AppText>
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            {notifications.map((notif) => (
              <TouchableOpacity 
                key={notif.id_notifikasi} 
                style={[styles.notifItem, !notif.is_read && styles.notifItemUnread]}
                onPress={() => handlePressNotif(notif)}
                activeOpacity={0.7}
              >
                <View style={styles.iconCircle}>
                  {notif.tipe === 'sertifikat' ? <SertifikatIcon /> : <ForumIcon />}
                </View>
                <View style={styles.notifContent}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <AppText style={[styles.notifTitle, !notif.is_read && styles.boldText]}>
                      {notif.judul}
                    </AppText>
                    {!notif.is_read && <View style={styles.dotUnread} />}
                  </View>
                  <AppText style={styles.notifSubtitle}>{notif.pesan}</AppText>
                  <AppText style={styles.notifDate}>{formatDate(notif.created_at)}</AppText>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>
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
  notifItemUnread: {
    backgroundColor: '#F0FDF4',
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
    fontSize: 14,
    color: '#374151',
    lineHeight: 18,
    marginBottom: 4,
  },
  boldText: {
    fontWeight: '700',
    color: '#111827',
  },
  dotUnread: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    marginTop: 4,
  },
  notifSubtitle: {
    fontSize: 13,
    color: '#4B5563',
    marginBottom: 8,
  },
  notifDate: {
    fontSize: 12,
    color: '#9CA3AF',
  }
});
