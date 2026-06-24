import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path, Rect, Polyline, Circle } from 'react-native-svg';

const BackIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M15 18L9 12L15 6" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const CalendarIcon = () => (
  <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="#116E63" strokeWidth="2" />
    <Path d="M16 2v4M8 2v4M3 10h18" stroke="#116E63" strokeWidth="2" />
  </Svg>
);

const DocumentIcon = () => (
  <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <Path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="#116E63" strokeWidth="2" strokeLinejoin="round"/>
    <Path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="#116E63" strokeWidth="2" strokeLinecap="round" />
  </Svg>
);



const ClipboardIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 4h6m-6 4h6" stroke="#116E63" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const MonitorIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Rect x="2" y="3" width="20" height="14" rx="2" ry="2" stroke="#9CA3AF" strokeWidth="2" />
    <Path d="M8 21h8m-4-4v4" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const CheckboxEmpty = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="3" width="18" height="18" rx="4" stroke="#6B7280" strokeWidth="2" />
  </Svg>
);

const CheckboxFilled = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="3" width="18" height="18" rx="4" fill="#116E63" />
    <Path d="M8 12.5L11 15.5L16 9.5" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export default function DetailSesiScreen({ route }) {
  const navigation = useNavigation();
  const [isRead, setIsRead] = useState(false);

  // Get data from params
  const meeting = route?.params?.meeting;
  const course = route?.params?.course;

  // Provide fallback values
  const courseTitle = course?.title || 'Pemrograman perangkat lunak';
  const meetingTitle = meeting?.title || 'Pertemuan 1';
  const topic = meeting?.topic || 'Pengenalan dasar HTML';
  const lecturer = meeting?.lecturer || course?.lecturer || 'Yulianto M.Kom';
  const timeInfo = meeting?.time || 'Rabu, 29 April 2026   06.30 - 08.10';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center'}} onPress={() => navigation.goBack()}>
          <View style={styles.backBtn}>
            <BackIcon />
          </View>
          <Text style={styles.headerTitle}>Detail sesi</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.headerLine} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Info Card */}
        <View style={styles.card}>
          <Text style={styles.courseTitle}>{courseTitle}</Text>
          <View style={styles.infoRow}>
            <CalendarIcon />
            <Text style={styles.infoText}>{timeInfo}</Text>
          </View>
          <View style={styles.infoRow}>
            <DocumentIcon />
            <Text style={styles.infoText}>{meetingTitle}</Text>
          </View>
        </View>

        {/* Topik sesi Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Topik sesi</Text>
          <Text style={styles.cardContentText}>{topic}</Text>
        </View>

        {/* Conference Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Conference</Text>
          <Text style={styles.linkText}>https://meet.google.com/pwz-ruvw-brd</Text>
        </View>

        {/* Materi Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Materi</Text>
          <Text style={styles.cardContentText}>
            Silakan pelajari materi berikut sebelum memulai sesi perkuliahan. Anda juga dapat mengunduh materi untuk dibaca secara offline.
          </Text>
          
          <View style={styles.fileListContainer}>
             <View style={styles.fileItemRow}>
                <Image source={require('../assets/Pdf.png')} style={styles.fileIcon} resizeMode="contain" />
                <View style={styles.fileTextContainer}>
                   <Text style={styles.fileNameText} numberOfLines={1}>Materi_Pertemuan_10.pdf</Text>
                   <Text style={styles.fileSizeText}>2.4 MB • PDF</Text>
                </View>
                <TouchableOpacity style={styles.downloadIconBtn}>
                  <Text style={styles.downloadLink}>Unduh</Text>
                </TouchableOpacity>
             </View>
             <View style={styles.fileItemRow}>
                <Image source={require('../assets/Ppt.png')} style={styles.fileIcon} resizeMode="contain" />
                <View style={styles.fileTextContainer}>
                   <Text style={styles.fileNameText} numberOfLines={1}>Presentasi_Bab_10.pptx</Text>
                   <Text style={styles.fileSizeText}>4.1 MB • PPTX</Text>
                </View>
                <TouchableOpacity style={styles.downloadIconBtn}>
                  <Text style={styles.downloadLink}>Unduh</Text>
                </TouchableOpacity>
             </View>
          </View>

          <View style={styles.attendanceDivider} />
          <TouchableOpacity 
            style={styles.attendanceContainer} 
            activeOpacity={0.7}
            onPress={() => setIsRead(!isRead)}
          >
            {isRead ? <CheckboxFilled /> : <CheckboxEmpty />}
            <Text style={styles.attendanceText}>Tandai saya telah membaca materi ini</Text>
          </TouchableOpacity>
        </View>

        {/* Tugas dan kuis Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Tugas dan kuis</Text>
          <View style={styles.taskItem}>
            <View style={styles.taskHeaderRow}>
               <View style={styles.taskIconContainer}>
                 <ClipboardIcon />
               </View>
               <View style={styles.taskHeaderTextContainer}>
                 <Text style={styles.taskTitle}>Tugas Praktikum 10 - Web Dinamis</Text>
                 <Text style={styles.taskDeadline}>Tenggat: 30 Apr 2026, 23:59</Text>
               </View>
            </View>
            <View style={styles.taskActionRow}>
               <View style={styles.statusBadgeUnfinished}>
                 <Text style={styles.statusBadgeTextUnfinished}>Belum dikumpulkan</Text>
               </View>
               <TouchableOpacity style={styles.uploadBtn}>
                  <Text style={styles.uploadBtnText}>Lihat Detail</Text>
               </TouchableOpacity>
            </View>
          </View>
        </View>



        {/* Forum diskusi Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Forum diskusi</Text>
          
          {/* Chat bubbles */}
          <View style={styles.chatContainer}>
            <View style={styles.chatRowLeft}>
              <Image source={require('../assets/dosen.png')} style={styles.avatar} />
              <View style={styles.chatBubbleLeft}>
                <Text style={styles.chatName}>Dimas Putra Pratama</Text>
                <Text style={styles.chatText}>Lorem ipsum dolor sit amet</Text>
                <Text style={styles.chatTime}>5 Jam yang lalu</Text>
              </View>
            </View>

            <View style={styles.chatRowRight}>
              <View style={styles.chatBubbleRight}>
                <Text style={styles.chatName}>Dimas Putra Pratama</Text>
                <Text style={styles.chatText}>Lorem ipsum dolor sit amet</Text>
                <Text style={styles.chatTime}>5 Jam yang lalu</Text>
              </View>
              <Image source={require('../assets/dosen.png')} style={styles.avatar} />
            </View>
          </View>

          <TouchableOpacity style={styles.forumLinkBtn} onPress={() => navigation.navigate('ForumDiskusi', { topic: topic })}>
            <Text style={styles.forumLinkText}>Lihat forum diskusi</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: 'transparent',
  },
  backBtn: {
    padding: 4,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  headerLine: {
    height: 1,
    backgroundColor: '#E5E7EB',
    width: '100%',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
    gap: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  courseTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    marginLeft: 10,
    fontSize: 13,
    color: '#4B5563',
    fontWeight: '400',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 10,
  },
  cardContentText: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 4,
  },
  linkText: {
    fontSize: 13,
    color: '#2563EB',
    textDecorationLine: 'underline',
  },
  fileListContainer: {
    marginTop: 12,
    gap: 12,
  },
  fileItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  fileIcon: {
    width: 28,
    height: 28,
  },
  fileTextContainer: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  fileNameText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  fileSizeText: {
    fontSize: 11,
    color: '#6B7280',
  },
  downloadLink: {
    fontSize: 12,
    fontWeight: '600',
    color: '#116E63',
  },
  attendanceDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginTop: 16,
    marginBottom: 12,
  },
  attendanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  attendanceText: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '500',
    marginLeft: 10,
  },
  taskItem: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 14,
    marginTop: 4,
  },
  taskHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  taskIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  taskHeaderTextContainer: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  taskDeadline: {
    fontSize: 12,
    color: '#EF4444', // Red for deadline
    fontWeight: '500',
  },
  taskActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
  },
  statusBadgeUnfinished: {
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusBadgeTextUnfinished: {
    fontSize: 11,
    color: '#DC2626',
    fontWeight: '600',
  },
  uploadBtn: {
    backgroundColor: '#116E63',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  uploadBtnText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  emptyStateIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  emptyStateTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
    marginBottom: 4,
  },
  emptyStateDesc: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 18,
  },
  chatContainer: {
    marginTop: 8,
    gap: 16,
  },
  chatRowLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginRight: 40,
  },
  chatRowRight: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    marginLeft: 40,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E5E7EB',
  },
  chatBubbleLeft: {
    backgroundColor: '#E5E5E5',
    borderRadius: 12,
    borderTopLeftRadius: 2,
    padding: 12,
    marginLeft: 8,
    flex: 1,
  },
  chatBubbleRight: {
    backgroundColor: '#E5E5E5',
    borderRadius: 12,
    borderTopRightRadius: 2,
    padding: 12,
    marginRight: 8,
    flex: 1,
  },
  chatName: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  chatText: {
    fontSize: 11,
    color: '#374151',
    marginBottom: 6,
  },
  chatTime: {
    fontSize: 9,
    color: '#9CA3AF',
    textAlign: 'right',
  },
  forumLinkBtn: {
    alignItems: 'center',
    marginTop: 20,
  },
  forumLinkText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#116E63',
    textDecorationLine: 'underline',
  },
});
