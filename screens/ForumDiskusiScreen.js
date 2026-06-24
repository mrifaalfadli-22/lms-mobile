import React, { useState, useRef } from 'react';
import { 
  View, Text, StyleSheet, TextInput, TouchableOpacity, 
  FlatList, KeyboardAvoidingView, Platform, ImageBackground, Image, Modal, Alert 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path, Circle } from 'react-native-svg';

// Icons
const BackIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M15 18L9 12L15 6" stroke="#4B5563" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const SendIcon = ({ disabled }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M2 21l21-9L2 3v7l15 2-15 2v7z" fill={disabled ? "#9CA3AF" : "#116E63"} />
  </Svg>
);

const CloseIcon = () => (
  <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <Path d="M18 6L6 18M6 6l12 12" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ReplyIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const EditIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const DeleteIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const DotsIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="5" r="2" fill="#9CA3AF" />
    <Circle cx="12" cy="12" r="2" fill="#9CA3AF" />
    <Circle cx="12" cy="19" r="2" fill="#9CA3AF" />
  </Svg>
);

export default function ForumDiskusiScreen({ route }) {
  const navigation = useNavigation();
  const topic = route?.params?.topic || "Pengenalan dasar HTML";

  const [messages, setMessages] = useState([
    {
      id: '1',
      text: 'Halo semuanya, jangan lupa pelajari materi HTML sebelum kelas dimulai ya.',
      sender: 'Yulianto M.Kom - 043213123',
      time: '10:00',
      isMe: false,
    },
    {
      id: '2',
      text: 'Lorem ipsum dolor sit amet',
      sender: 'Dimas Putra Pratama - 2110200',
      time: '5 Jam yang lalu',
      isMe: true,
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [editMsgId, setEditMsgId] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const flatListRef = useRef(null);

  const handleSend = () => {
    if (!inputText.trim()) return;

    if (editMsgId) {
      setMessages(messages.map(m => m.id === editMsgId ? { ...m, text: inputText, isEdited: true } : m));
      setEditMsgId(null);
    } else {
      const newMessage = {
        id: Date.now().toString(),
        text: inputText,
        sender: 'Dimas Putra Pratama - 2110200',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: true,
        read: false,
        replyTo: replyTo ? { ...replyTo } : null
      };
      setMessages([...messages, newMessage]);
    }

    setInputText('');
    setReplyTo(null);
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const openOptions = (msg) => {
    setSelectedMessage(msg);
    setModalVisible(true);
  };

  const handleReply = () => {
    setReplyTo(selectedMessage);
    setEditMsgId(null);
    setInputText('');
    setModalVisible(false);
  };

  const handleEdit = () => {
    setEditMsgId(selectedMessage.id);
    setInputText(selectedMessage.text);
    setReplyTo(null);
    setModalVisible(false);
  };

  const handleDelete = () => {
    Alert.alert("Hapus Pesan", "Anda yakin ingin menghapus pesan ini?", [
      { text: "Batal", style: "cancel" },
      { text: "Hapus", style: "destructive", onPress: () => {
          setMessages(messages.filter(m => m.id !== selectedMessage.id));
          setModalVisible(false);
        }
      }
    ]);
  };

  const renderMessage = ({ item }) => {
    return (
      <View style={styles.messageRow}>
        <Image source={require('../assets/dosen.png')} style={styles.avatar} />
        <View style={styles.messageContentWrapper}>
          <View style={[styles.messageBubble, item.isMe ? styles.messageBubbleMe : styles.messageBubbleOther]}>
            <View style={styles.bubbleHeader}>
              <Text style={styles.senderName}>{item.sender}</Text>
              <TouchableOpacity onPress={() => openOptions(item)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <DotsIcon />
              </TouchableOpacity>
            </View>
            
            {item.replyTo && (
              <View style={styles.replyBubble}>
                <Text style={styles.replySender}>{item.replyTo.sender}</Text>
                <Text style={styles.replyText} numberOfLines={1}>{item.replyTo.text}</Text>
              </View>
            )}

            <Text style={styles.messageText}>{item.text}</Text>
            
            <View style={styles.messageMeta}>
              {item.isEdited && <Text style={styles.editedText}>Diedit</Text>}
              <Text style={styles.messageTime}>{item.time}</Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.balasBtn} onPress={() => { setSelectedMessage(item); handleReply(); }}>
            <Text style={styles.balasText}>Balas</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center'}} onPress={() => navigation.goBack()}>
          <View style={styles.backBtn}>
            <BackIcon />
          </View>
          <Text style={styles.headerTitle}>Diskusi</Text>
        </TouchableOpacity>
      </View>

      {/* Chat Area */}
      <View style={styles.chatBackground}>
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.chatList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />
      </View>

      {/* Input Area */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.inputContainer}>
          {/* Action preview (Reply/Edit) */}
          {(replyTo || editMsgId) && (
            <View style={styles.actionPreview}>
              <View style={styles.actionPreviewBar} />
              <View style={styles.actionPreviewContent}>
                <Text style={styles.actionPreviewTitle}>
                  {editMsgId ? 'Edit Pesan' : `Membalas ${replyTo.sender}`}
                </Text>
                <Text style={styles.actionPreviewText} numberOfLines={1}>
                  {editMsgId ? messages.find(m => m.id === editMsgId)?.text : replyTo.text}
                </Text>
              </View>
              <TouchableOpacity style={styles.closeActionBtn} onPress={() => { setReplyTo(null); setEditMsgId(null); setInputText(''); }}>
                <CloseIcon />
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.inputRow}>
            <TextInput
              style={styles.textInput}
              placeholder="Ketik pesan..."
              placeholderTextColor="#9CA3AF"
              value={inputText}
              onChangeText={setInputText}
              multiline
            />
            <TouchableOpacity 
              style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]} 
              onPress={handleSend}
              disabled={!inputText.trim()}
            >
              <SendIcon disabled={!inputText.trim()} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* Options Modal */}
      <Modal transparent visible={modalVisible} animationType="fade" onRequestClose={() => setModalVisible(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.modalOption} onPress={handleReply}>
              <ReplyIcon />
              <Text style={styles.modalOptionText}>Balas</Text>
            </TouchableOpacity>
            
            {selectedMessage?.isMe && (
              <>
                <View style={styles.modalDivider} />
                <TouchableOpacity style={styles.modalOption} onPress={handleEdit}>
                  <EditIcon />
                  <Text style={styles.modalOptionText}>Edit</Text>
                </TouchableOpacity>
                <View style={styles.modalDivider} />
                <TouchableOpacity style={styles.modalOption} onPress={handleDelete}>
                  <DeleteIcon />
                  <Text style={[styles.modalOptionText, { color: '#EF4444' }]}>Hapus</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </TouchableOpacity>
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
    backgroundColor: '#F9FAFB',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    zIndex: 10,
  },
  backBtn: {
    padding: 4,
    marginRight: 12,
  },
  headerTitle: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '700',
  },
  chatBackground: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  chatList: {
    padding: 20,
    paddingBottom: 24,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
    backgroundColor: '#D1D5DB',
  },
  messageContentWrapper: {
    flex: 1,
  },
  messageBubble: {
    padding: 14,
    borderRadius: 10,
  },
  messageBubbleOther: {
    backgroundColor: '#F3F4F6', // Light gray
  },
  messageBubbleMe: {
    backgroundColor: '#E6F4F1', // Light teal/greenish to distinguish
  },
  bubbleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  senderName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  replyBubble: {
    backgroundColor: '#00000010',
    borderLeftWidth: 4,
    borderLeftColor: '#116E63',
    padding: 6,
    borderRadius: 6,
    marginBottom: 6,
  },
  replySender: {
    fontSize: 11,
    fontWeight: '600',
    color: '#116E63',
    marginBottom: 2,
  },
  replyText: {
    fontSize: 11,
    color: '#4B5563',
  },
  messageText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 8,
  },
  messageMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  editedText: {
    fontSize: 10,
    color: '#9CA3AF',
    fontStyle: 'italic',
    marginRight: 6,
  },
  messageTime: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  balasBtn: {
    marginTop: 8,
    marginLeft: 4,
  },
  balasText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111827',
  },
  inputContainer: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  actionPreview: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 8,
    overflow: 'hidden',
  },
  actionPreviewBar: {
    width: 4,
    backgroundColor: '#116E63',
  },
  actionPreviewContent: {
    flex: 1,
    padding: 10,
  },
  actionPreviewTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#116E63',
    marginBottom: 2,
  },
  actionPreviewText: {
    fontSize: 13,
    color: '#4B5563',
  },
  closeActionBtn: {
    padding: 12,
    justifyContent: 'center',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    fontSize: 14,
    minHeight: 48,
    maxHeight: 100,
    color: '#111827',
  },
  sendBtn: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  sendBtnDisabled: {
    opacity: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    width: 250,
    borderRadius: 12,
    paddingVertical: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  modalOptionText: {
    fontSize: 16,
    color: '#374151',
    marginLeft: 12,
  },
  modalDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
  },
});
