import { Alert, Platform } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { API_BASE_URL } from '../config/api';

export const downloadMateri = async (filePath, title, setIsDownloading) => {
  try {
    if (setIsDownloading) setIsDownloading(true);

    const baseUrl = Platform.OS === 'android' ? API_BASE_URL : 'http://localhost:8000';
    const downloadUrl = `${baseUrl}/api/public/download?path=${encodeURIComponent(filePath)}&title=${encodeURIComponent(title)}`;

    let ext = filePath.split('.').pop().toLowerCase();
    
    // Fallback fileName if not given
    let fileNameRaw = filePath.split('/').pop().replace(/^[a-f0-9\-]+_/, '');
    const fileName = `${title}_${fileNameRaw}`.replace(/[^a-zA-Z0-9.\- _]/g, '_');

    let mimeType = 'application/octet-stream';
    if (ext === 'pdf') mimeType = 'application/pdf';
    else if (ext === 'ppt' || ext === 'pptx') mimeType = 'application/vnd.ms-powerpoint';
    else if (ext === 'doc' || ext === 'docx') mimeType = 'application/msword';
    else if (ext === 'xls' || ext === 'xlsx') mimeType = 'application/vnd.ms-excel';
    else if (ext === 'png') mimeType = 'image/png';
    else if (ext === 'jpg' || ext === 'jpeg') mimeType = 'image/jpeg';

    if (Platform.OS === 'android') {
      const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
      if (permissions.granted) {
        const fileUri = await FileSystem.StorageAccessFramework.createFileAsync(
          permissions.directoryUri,
          fileName,
          mimeType
        );
        
        // Download directly to a temp location first
        const tempUri = FileSystem.documentDirectory + fileName;
        const downloadRes = await FileSystem.downloadAsync(downloadUrl, tempUri);
        
        // Read the downloaded file as base64 and write it to SAF directory
        const base64 = await FileSystem.readAsStringAsync(downloadRes.uri, { encoding: FileSystem.EncodingType.Base64 });
        await FileSystem.writeAsStringAsync(fileUri, base64, { encoding: FileSystem.EncodingType.Base64 });
        
        // Clean up temp file
        await FileSystem.deleteAsync(downloadRes.uri, { idempotent: true });

        Alert.alert('Sukses', 'Materi berhasil disimpan ke perangkat.');
      }
    } else {
      const fileUri = FileSystem.documentDirectory + fileName;
      const downloadRes = await FileSystem.downloadAsync(downloadUrl, fileUri);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(downloadRes.uri, {
          mimeType: mimeType,
          dialogTitle: 'Unduh Materi'
        });
      } else {
        Alert.alert('Sukses', 'Materi berhasil diunduh ke aplikasi.');
      }
    }
  } catch (error) {
    console.error("Download error:", error);
    Alert.alert('Gagal', 'Terjadi kesalahan saat mengunduh materi.');
  } finally {
    if (setIsDownloading) setIsDownloading(false);
  }
};
