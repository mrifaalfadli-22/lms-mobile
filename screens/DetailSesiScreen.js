import React, { useState, useEffect } from 'react';
import AppText from '../components/AppText';
import { View,  StyleSheet, ScrollView, TouchableOpacity, ImageBackground, Image, Platform, Linking, Modal } from 'react-native';
import { BlurView } from 'expo-blur';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path, Rect, Polyline, Circle } from 'react-native-svg';
import YoutubePlayer from 'react-native-youtube-iframe';
import * as Clipboard from 'expo-clipboard';

const CopyIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="#116E63" strokeWidth="2" />
    <Path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke="#116E63" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ChevronDown = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path d="M6 9l6 6 6-6" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ChevronUp = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path d="M18 15l-6-6-6 6" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

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
    <Path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="#116E63" strokeWidth="2" strokeLinejoin="round" />
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
  const [sessionMaterials, setSessionMaterials] = useState([]);
  const [tugasList, setTugasList] = useState([]);
  const [forumList, setForumList] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [presensiStatus, setPresensiStatus] = useState(null); // null | 'hadir' | 'izin' | 'sakit' | 'alpha'
  const [isMarkingPresensi, setIsMarkingPresensi] = useState(false);
  const [isTugasModalVisible, setIsTugasModalVisible] = useState(false);
  const [selectedTugas, setSelectedTugas] = useState(null);
  const [isForumExpanded, setIsForumExpanded] = useState(false);

  // Get data from params
  const meeting = route?.params?.meeting;
  const course = route?.params?.course;
  const userToken = route?.params?.userToken;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const baseUrl = Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://localhost:8000';
        
        // Fetch Materials
        const resMateri = await fetch(`${baseUrl}/api/materi/sesi/${meeting?.id}`, {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${userToken}`
          }
        });
        const jsonMateri = await resMateri.json();
        if (jsonMateri.status === 'success') {
          setSessionMaterials(jsonMateri.data || []);
        }

        // Fetch Tugas
        const resTugas = await fetch(`${baseUrl}/api/sesi/${meeting?.id}/tugas`, {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${userToken}`
          }
        });
        const jsonTugas = await resTugas.json();
        if (jsonTugas.success) {
          setTugasList(jsonTugas.data?.data || []);
        }

        // Fetch Forum
        const resForum = await fetch(`${baseUrl}/api/sesi/${meeting?.id}/forum`, {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${userToken}`
          }
        });
        const jsonForum = await resForum.json();
        if (jsonForum.success) {
          setForumList(jsonForum.data?.data || []);
        }
      } catch (error) {
        console.error(error);
      }
    };
    if (meeting?.id) fetchData();
  }, [meeting?.id, userToken]);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const baseUrl = Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://localhost:8000';
        const res = await fetch(`${baseUrl}/api/user`, {
          headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${userToken}` }
        });
        const json = await res.json();
        setCurrentUser(json);
      } catch (e) { console.error(e); }
    };
    if (userToken) fetchCurrentUser();
  }, [userToken]);

  useEffect(() => {
    const fetchPresensi = async () => {
      try {
        const baseUrl = Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://localhost:8000';
        const res = await fetch(`${baseUrl}/api/presensi/sesi/${meeting?.id}/saya`, {
          headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${userToken}` }
        });
        const json = await res.json();
        if (json.status === 'success' && json.data) {
          setPresensiStatus(json.data.status_kehadiran);
          if (json.data.status_kehadiran === 'hadir') setIsRead(true);
        }
      } catch (e) { console.error(e); }
    };
    if (meeting?.id && userToken) fetchPresensi();
  }, [meeting?.id, userToken]);

  const formatTugasDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    if (isNaN(date)) return dateString;
    const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"];
    const day = date.getDate().toString().padStart(2, '0');
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day} ${month} ${year}, ${hours}:${minutes}`;
  };

  // Provide fallback values
  const courseTitle = course?.title || 'Pemrograman perangkat lunak';
  const meetingTitle = meeting?.title || 'Pertemuan 1';
  const topic = meeting?.topic || 'Pengenalan dasar HTML';
  const lecturer = meeting?.lecturer || course?.lecturer || 'Yulianto M.Kom';
  const timeInfo = meeting?.time || 'Rabu, 29 April 2026   06.30 - 08.10';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => navigation.goBack()}>
          <View style={styles.backBtn}>
            <BackIcon />
          </View>
          <AppText style={styles.headerTitle}>Detail sesi</AppText>
        </TouchableOpacity>
      </View>
      <View style={styles.headerLine} />

      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* Info Card */}
        <View style={styles.card}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <AppText style={[styles.courseTitle, { marginBottom: 0, flex: 1, marginRight: 8 }]}>{courseTitle}</AppText>
            {meeting?.method && (
              <View style={[styles.methodBadge, meeting.method.toLowerCase() === 'synchronous' ? styles.badgeSync : styles.badgeAsync]}>
                <AppText style={[styles.methodBadgeText, meeting.method.toLowerCase() === 'synchronous' ? styles.badgeTextSync : styles.badgeTextAsync]}>
                  {meeting.method.toLowerCase() === 'synchronous' ? 'Synchronous' : 'Asynchronous'}
                </AppText>
              </View>
            )}
          </View>
          <View style={styles.infoRow}>
            <CalendarIcon />
            <AppText style={styles.infoText}>{timeInfo}</AppText>
          </View>
          <View style={styles.infoRow}>
            <DocumentIcon />
            <AppText style={styles.infoText}>{meetingTitle}</AppText>
          </View>
        </View>

        {/* Topik sesi Card */}
        <View style={styles.card}>
          <AppText style={styles.cardTitle}>Topik sesi</AppText>
          <AppText style={styles.cardContentText}>{topic}</AppText>
        </View>

        {/* Conference Card */}
        {meeting?.method?.toLowerCase() !== 'asynchronous' && (
          <View style={styles.card}>
            <AppText style={styles.cardTitle}>Link Gmeet/Zoom</AppText>
            {meeting?.link_kelas_daring ? (
              <AppText style={styles.linkText}>{meeting.link_kelas_daring}</AppText>
            ) : (
              <AppText style={styles.cardContentText}>Belum ada link conference yang dibagikan.</AppText>
            )}
          </View>
        )}

        {/* Materi Card */}
        <View style={styles.card}>
          <AppText style={styles.cardTitle}>Materi</AppText>
          <AppText style={styles.cardContentText}>
            {meeting?.rawMateri && meeting.rawMateri !== '-'
              ? meeting.rawMateri
              : 'Silakan pelajari materi berikut sebelum memulai sesi perkuliahan.'}
          </AppText>

          {/* Support embedded video if the string is a youtube link */}
          {meeting?.rawMateri && meeting.rawMateri.includes('youtube.com/watch?v=') && (
            <View style={{ marginTop: 12, borderRadius: 8, overflow: 'hidden' }}>
              <YoutubePlayer
                height={180}
                play={false}
                videoId={meeting.rawMateri.split('v=')[1]?.split('&')[0]}
              />
            </View>
          )}

          {meeting?.rawMateri && meeting.rawMateri.includes('youtu.be/') && (
            <View style={{ marginTop: 12, borderRadius: 8, overflow: 'hidden' }}>
              <YoutubePlayer
                height={180}
                play={false}
                videoId={meeting.rawMateri.split('youtu.be/')[1]?.split('?')[0]}
              />
            </View>
          )}

          {/* Dynamic Details from MateriPembelajaran */}
          {sessionMaterials.map((m, idx) => (
            <View key={`materi-info-${idx}`} style={{ marginTop: 12 }}>
              {m.judul_materi && (
                <AppText style={{ fontSize: 14, fontFamily: 'Outfit-SemiBold', color: '#1F2937', marginBottom: 4 }}>
                  {m.judul_materi}
                </AppText>
              )}
              {m.deskripsi && (
                <AppText style={{ fontSize: 13, fontFamily: 'Inter-Regular', color: '#4B5563', marginBottom: 8, lineHeight: 20 }}>
                  {m.deskripsi}
                </AppText>
              )}
            </View>
          ))}

          {/* Additional Videos from MateriPembelajaran */}
          {sessionMaterials.map((m, idx) => m.link_video_pembelajaran && (m.link_video_pembelajaran.includes('youtube.com/watch?v=') || m.link_video_pembelajaran.includes('youtu.be/')) ? (
            <View key={`video-${idx}`} style={{ marginTop: 12, borderRadius: 8, overflow: 'hidden' }}>
              <YoutubePlayer
                height={180}
                play={false}
                videoId={m.link_video_pembelajaran.includes('youtu.be/') ? m.link_video_pembelajaran.split('youtu.be/')[1]?.split('?')[0] : m.link_video_pembelajaran.split('v=')[1]?.split('&')[0]}
              />
            </View>
          ) : null)}

          <View style={styles.fileListContainer}>
            {sessionMaterials.flatMap(m => m.file_materi || []).map((file, index) => {
              const ext = file.split('.').pop().toLowerCase();
              const isPdf = ext === 'pdf';
              const isDocx = ext === 'docx' || ext === 'doc';
              const isXls = ext === 'xls' || ext === 'xlsx';
              const isPpt = ext === 'ppt' || ext === 'pptx';
              const fileName = file.split('/').pop().replace(/^[a-f0-9\-]+_/, '');

              let iconSource = require('../assets/other.png');
              if (isPdf) iconSource = require('../assets/pdf.png');
              else if (isDocx) iconSource = require('../assets/doc.png');
              else if (isXls) iconSource = require('../assets/xls.png');
              else if (isPpt) iconSource = require('../assets/ppt.png');

              return (
                <View key={index} style={styles.fileItemRow}>
                  <Image source={iconSource} style={styles.fileIcon} resizeMode="contain" />
                  <View style={styles.fileTextContainer}>
                    <AppText style={styles.fileNameText} numberOfLines={1}>{fileName}</AppText>
                    <AppText style={styles.fileSizeText}>{ext.toUpperCase()}</AppText>
                  </View>
                  <TouchableOpacity 
                    style={styles.downloadIconBtn}
                    onPress={() => {
                      const baseUrl = Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://localhost:8000';
                      Linking.openURL(`${baseUrl}/api/public/download?path=${file}&title=${encodeURIComponent(meetingTitle)}`);
                    }}
                  >
                    <AppText style={styles.downloadLink}>Unduh</AppText>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>

          {meeting?.method?.toLowerCase() !== 'synchronous' ? (
            <>
              <View style={styles.attendanceDivider} />
              {presensiStatus === 'hadir' ? (
                <View style={styles.attendanceContainer}>
                  <CheckboxFilled />
                  <AppText style={[styles.attendanceText, { color: '#116E63', fontWeight: '600' }]}>
                    ✓ Anda telah menandai kehadiran
                  </AppText>
                </View>
              ) : (
                <TouchableOpacity
                  style={[styles.attendanceContainer, isMarkingPresensi && { opacity: 0.5 }]}
                  activeOpacity={0.7}
                  disabled={isMarkingPresensi}
                  onPress={async () => {
                    setIsMarkingPresensi(true);
                    try {
                      const baseUrl = Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://localhost:8000';
                      const res = await fetch(`${baseUrl}/api/presensi/hadir-sendiri`, {
                        method: 'POST',
                        headers: {
                          'Accept': 'application/json',
                          'Content-Type': 'application/json',
                          'Authorization': `Bearer ${userToken}`
                        },
                        body: JSON.stringify({ id_sesi: meeting?.id })
                      });
                      const json = await res.json();
                      if (json.status === 'success') {
                        setPresensiStatus('hadir');
                        setIsRead(true);
                      }
                    } catch (e) { console.error(e); }
                    setIsMarkingPresensi(false);
                  }}
                >
                  <CheckboxEmpty />
                  <AppText style={styles.attendanceText}>
                    {isMarkingPresensi ? 'Menyimpan...' : 'Tandai saya telah membaca materi ini'}
                  </AppText>
                </TouchableOpacity>
              )}
            </>
          ) : (
            <>
              <View style={styles.attendanceDivider} />
              <View style={styles.attendanceContainer}>
                {presensiStatus === 'hadir' ? (
                  <>
                    <CheckboxFilled />
                    <AppText style={[styles.attendanceText, { color: '#116E63', fontWeight: '600' }]}>Hadir</AppText>
                  </>
                ) : presensiStatus === 'izin' ? (
                  <>
                    <CheckboxEmpty />
                    <AppText style={[styles.attendanceText, { color: '#F59E0B', fontWeight: '600' }]}>Izin</AppText>
                  </>
                ) : presensiStatus === 'sakit' ? (
                  <>
                    <CheckboxEmpty />
                    <AppText style={[styles.attendanceText, { color: '#3B82F6', fontWeight: '600' }]}>Sakit</AppText>
                  </>
                ) : presensiStatus === 'alpha' ? (
                  <>
                    <CheckboxEmpty />
                    <AppText style={[styles.attendanceText, { color: '#EF4444', fontWeight: '600' }]}>Alpha</AppText>
                  </>
                ) : (
                  <>
                    <CheckboxEmpty />
                    <AppText style={[styles.attendanceText, { color: '#9CA3AF' }]}>Belum diabsen oleh dosen</AppText>
                  </>
                )}
              </View>
            </>
          )}
        </View>

        {/* Tugas dan kuis Card */}
        <View style={styles.card}>
          <AppText style={styles.cardTitle}>Tugas dan kuis</AppText>
          {tugasList.length === 0 ? (
            <AppText style={styles.cardContentText}>Belum ada tugas yang dibagikan.</AppText>
          ) : (
            tugasList.map((tugas, index) => {
              const statusText = "Belum dikumpulkan"; // default status
              
              return (
                <View key={index} style={styles.taskItem}>
                  <View style={styles.taskHeaderRow}>
                    <View style={styles.taskIconContainer}>
                      <ClipboardIcon />
                    </View>
                    <View style={styles.taskHeaderTextContainer}>
                      <AppText style={styles.taskTitle}>{tugas.judul_tugas}</AppText>
                      <AppText style={styles.taskDeadline}>Tenggat: {formatTugasDate(tugas.batas_waktu)}</AppText>
                    </View>
                  </View>
                  <View style={styles.taskActionRow}>
                    <View style={styles.statusBadgeUnfinished}>
                      <AppText style={styles.statusBadgeTextUnfinished}>{statusText}</AppText>
                    </View>
                    <TouchableOpacity 
                      style={styles.uploadBtn}
                      onPress={() => {
                        setSelectedTugas(tugas);
                        setIsTugasModalVisible(true);
                      }}
                    >
                      <AppText style={styles.uploadBtnText}>Lihat Detail</AppText>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          )}
        </View>



        {/* Forum diskusi Card */}
        <View style={styles.card}>
          <TouchableOpacity 
            style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} 
            onPress={() => setIsForumExpanded(!isForumExpanded)}
            activeOpacity={0.7}
          >
            <AppText style={[styles.cardTitle, { marginBottom: 0 }]}>Forum diskusi</AppText>
            {isForumExpanded ? <ChevronUp /> : <ChevronDown />}
          </TouchableOpacity>

          {/* Collapsible Content */}
          {isForumExpanded && (
            <>
              <View style={[styles.chatContainer, { marginTop: 16 }]}>
                {forumList.length === 0 ? (
                  <AppText style={styles.cardContentText}>Belum ada diskusi di forum ini.</AppText>
                ) : (
                  forumList.slice(-2).map((msg, index) => {
                    const getInitials = (name) => {
                      if (!name) return 'A';
                      const names = name.split(' ').filter(n => n);
                      if (names.length === 0) return 'A';
                      if (names.length === 1) return names[0].substring(0, 1).toUpperCase();
                      return (names[0].substring(0, 1) + names[1].substring(0, 1)).toUpperCase();
                    };

                    const timeAgo = (dateString) => {
                      if (!dateString) return '';
                      const diff = new Date() - new Date(dateString);
                      const hours = Math.floor(diff / 3600000);
                      if (hours >= 24) return `${Math.floor(hours/24)} hari yang lalu`;
                      if (hours > 0) return `${hours} jam yang lalu`;
                      const mins = Math.floor(diff / 60000);
                      if (mins > 0) return `${mins} menit yang lalu`;
                      return 'Baru saja';
                    };

                    const isMe = currentUser && currentUser.id_user === msg.id_pengirim;
                    const avatarView = (
                      <View style={[styles.avatar, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#116E63' }]}>
                        <AppText style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>
                          {getInitials(msg.pengirim?.nama_lengkap)}
                        </AppText>
                      </View>
                    );

                    return isMe ? (
                      <View key={index} style={styles.chatRowRight}>
                        <View style={[styles.chatBubbleRight, { backgroundColor: '#D1FAE5' }]}>
                          <AppText style={styles.chatName}>{msg.pengirim?.nama_lengkap || 'Anonim'}</AppText>
                          <AppText style={styles.chatText}>{msg.isi_pesan}</AppText>
                          <AppText style={styles.chatTime}>{timeAgo(msg.waktu_kirim)}</AppText>
                        </View>
                        {avatarView}
                      </View>
                    ) : (
                      <View key={index} style={styles.chatRowLeft}>
                        {avatarView}
                        <View style={styles.chatBubbleLeft}>
                          <AppText style={styles.chatName}>{msg.pengirim?.nama_lengkap || 'Anonim'}</AppText>
                          <AppText style={styles.chatText}>{msg.isi_pesan}</AppText>
                          <AppText style={styles.chatTime}>{timeAgo(msg.waktu_kirim)}</AppText>
                        </View>
                      </View>
                    );
                  })
                )}
              </View>

              <TouchableOpacity style={styles.forumLinkBtn} onPress={() => navigation.navigate('ForumDiskusi', { meeting, userToken, topic })}>
                <AppText style={styles.forumLinkText}>Lihat forum diskusi</AppText>
              </TouchableOpacity>
            </>
          )}
        </View>

      </ScrollView>

      {/* Modal Detail Tugas */}
      <Modal
        visible={isTugasModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsTugasModalVisible(false)}
      >
        <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <AppText style={styles.modalTitle}>Detail Tugas</AppText>
              <TouchableOpacity onPress={() => setIsTugasModalVisible(false)} style={styles.closeModalBtn}>
                <AppText style={{ fontSize: 16, color: '#6B7280', fontWeight: 'bold' }}>X</AppText>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              {selectedTugas && (
                <>
                  <AppText style={styles.modalTaskTitle}>{selectedTugas.judul_tugas}</AppText>
                  <AppText style={styles.modalTaskDesc}>{selectedTugas.deskripsi_tugas || "Tidak ada deskripsi untuk tugas ini."}</AppText>
                  
                  <View style={styles.modalInfoRow}>
                    <AppText style={styles.modalInfoLabel}>Tenggat Waktu:</AppText>
                    <AppText style={styles.modalInfoValueRed}>{formatTugasDate(selectedTugas.batas_waktu)}</AppText>
                  </View>
                  
                  {selectedTugas.link_cbt && (
                    <View style={styles.modalInfoRow}>
                      <AppText style={styles.modalInfoLabel}>Link CBT:</AppText>
                      <TouchableOpacity onPress={() => Linking.openURL(selectedTugas.link_cbt)}>
                        <AppText style={styles.modalInfoValueBlue}>{selectedTugas.link_cbt}</AppText>
                      </TouchableOpacity>
                    </View>
                  )}

                  {selectedTugas.token_cbt && (
                    <View style={styles.modalInfoRow}>
                      <AppText style={styles.modalInfoLabel}>Token CBT:</AppText>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ backgroundColor: '#F3F4F6', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, marginRight: 8 }}>
                          <AppText style={styles.modalInfoValueBold}>{selectedTugas.token_cbt}</AppText>
                        </View>
                        <TouchableOpacity 
                          onPress={async () => {
                            await Clipboard.setStringAsync(selectedTugas.token_cbt);
                          }}
                          style={{ padding: 6, backgroundColor: '#ECFDF5', borderRadius: 6 }}
                        >
                          <CopyIcon />
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}

                  <View style={styles.modalInfoRow}>
                    <AppText style={styles.modalInfoLabel}>Status:</AppText>
                    <View style={styles.statusBadgeUnfinished}>
                      <AppText style={styles.statusBadgeTextUnfinished}>Belum dikumpulkan</AppText>
                    </View>
                  </View>
                </>
              )}
            </ScrollView>
          </View>
        </View>
        </BlurView>
      </Modal>
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
  },
  methodBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeSync: {
    backgroundColor: '#EFF6FF',
  },
  badgeAsync: {
    backgroundColor: '#F3F4F6',
  },
  methodBadgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  badgeTextSync: {
    color: '#2563EB',
  },
  badgeTextAsync: {
    color: '#4B5563',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#FFF',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  closeModalBtn: {
    padding: 4,
  },
  modalBody: {
    padding: 16,
  },
  modalTaskTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#116E63',
    marginBottom: 8,
  },
  modalTaskDesc: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 16,
  },
  modalInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalInfoLabel: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  modalInfoValueRed: {
    fontSize: 13,
    color: '#EF4444',
    fontWeight: '600',
  },
  modalInfoValueBlue: {
    fontSize: 13,
    color: '#2563EB',
    textDecorationLine: 'underline',
  },
  modalInfoValueBold: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F2937',
    letterSpacing: 1,
  },
});
