import { Alert, Platform } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';

export const downloadCertificate = async (sertif, course, API_BASE_URL, setIsDownloading) => {
  try {
    if (setIsDownloading) setIsDownloading(true);

    const baseUrl = Platform.OS === 'android' ? API_BASE_URL : 'http://localhost:8000';
    const bgUrl = sertif.template?.id_template
      ? `${baseUrl}/api/template-sertifikat/${sertif.template.id_template}/download-background`
      : '';

    const layoutData = sertif.template?.layout_data || [];

    let avgNilai = 0;
    let predikat = "-";
    if (sertif.daftar_nilai && sertif.daftar_nilai.length > 0) {
      let total = 0;
      sertif.daftar_nilai.forEach(n => {
        total += parseFloat(n.nilai) || 0;
      });
      avgNilai = total / sertif.daftar_nilai.length;
      if (avgNilai >= 85) predikat = "A";
      else if (avgNilai >= 80) predikat = "A-";
      else if (avgNilai >= 75) predikat = "B+";
      else if (avgNilai >= 70) predikat = "B";
      else if (avgNilai >= 65) predikat = "B-";
      else if (avgNilai >= 60) predikat = "C+";
      else if (avgNilai >= 55) predikat = "C";
      else if (avgNilai >= 40) predikat = "D";
    }
    const avgStrVal = avgNilai % 1 === 0 ? avgNilai : avgNilai.toFixed(1);

    const getVarText = (id) => {
      switch (id) {
        case 'nama_peserta': return course?.mahasiswaName || sertif.peserta?.mahasiswa?.nama_lengkap || sertif.peserta?.nama_lengkap || '-';
        case 'npm': return course?.npm || sertif.peserta?.mahasiswa?.nomor_induk || sertif.peserta?.nim || '-';
        case 'nomor_sertifikat': return sertif.nomor_sertifikat || '-';
        case 'mata_kuliah_kelas': 
          if (course?.mkOnly) return course.mkOnly;
          if (course?.courseName) return course.courseName;
          return sertif.peserta?.jadwal?.mata_kuliah?.nama_mk || sertif.peserta?.jadwal?.mataKuliah?.nama_mk || `${course?.title || ''} ${course?.classInfo ? '- ' + course.classInfo : ''}`.trim() || '-';
        case 'nama_dosen': return course?.lecturer || course?.dosen || sertif.peserta?.jadwal?.dosen?.nama_lengkap || '-';
        case 'tanggal_terbit': return sertif.tanggal_terbit ? new Date(sertif.tanggal_terbit).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-';
        case 'status_kelulusan': return 'LULUS';
        case 'nilai_tugas': return `Nilai: ${avgStrVal} (${predikat})`;
        default: return '';
      }
    };

    const getTipeLabel = (tipe) => {
      if (tipe === 'kelulusan') return 'Kelulusan';
      if (tipe === 'nilai') return 'Daftar Nilai';
      return 'Pelatihan';
    };
    const tipeLabel = getTipeLabel(sertif.tipe_sertifikat);
    
    // Resolve mk and mhs names for file title
    let mk = course?.mkOnly || course?.courseName || course?.title || sertif.peserta?.jadwal?.mata_kuliah?.nama_mk || sertif.peserta?.jadwal?.mataKuliah?.nama_mk || '';
    let mhs = course?.mahasiswaName || sertif.peserta?.mahasiswa?.nama_lengkap || sertif.peserta?.nama_lengkap || 'Download';
    
    const namaFileBase = `Sertifikat ${tipeLabel} - ${mk} - ${mhs}`;
    const namaFile = `${namaFileBase}.pdf`;

    const html = `
      <html>
        <head>
          <meta name="viewport" content="width=1122, initial-scale=1.0, maximum-scale=1.0">
          <style>
            @page { size: A4 landscape; margin: 0; }
            body { margin: 0; padding: 0; }
            .container {
              width: 1122px;
              height: 794px;
              position: relative;
              background-image: url('${bgUrl}');
              background-size: cover;
              background-repeat: no-repeat;
            }
            .text-element {
              position: absolute;
              display: flex;
              align-items: center;
              overflow: hidden;
            }
            .text-content {
              display: block;
              width: 100%;
              line-height: 1.3;
              overflow: hidden;
            }
          </style>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Lora:ital,wght@0,400;0,600;0,700;1,400&family=Merriweather:ital,wght@0,400;0,700;1,400&family=Montserrat:ital,wght@0,400;0,600;0,700;1,400&family=Open+Sans:ital,wght@0,400;0,600;0,700;1,400&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Poppins:ital,wght@0,400;0,600;0,700;1,400&family=Roboto:ital,wght@0,400;0,500;0,700;1,400&display=swap" rel="stylesheet">
        </head>
        <body>
          <div class="container">
            ${layoutData.map(item => {
      if (item.isHidden) return '';
      if (item.id === 'qr_code') {
        return `
                  <div class="text-element" style="left: ${item.x}px; top: ${item.y}px; width: ${item.width}px; height: ${item.height}px;">
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=${item.width}x${item.height}&data=${sertif.nomor_sertifikat}" style="width: 100%; height: 100%;" />
                  </div>
                `;
      }
      if (item.id === 'daftar_nilai') {
        return `
                  <div class="text-element" style="left: ${item.x}px; top: ${item.y}px; width: ${item.width}px; height: ${item.height}px; align-items: flex-start; overflow: visible;">
                    <table style="width: 100%; border-collapse: collapse; font-size: ${item.fontSize}px; color: ${item.color || '#000'}; font-family: '${item.fontFamily || 'Arial'}', sans-serif;">
                      <thead>
                        <tr style="border-bottom: 2px solid ${item.color || '#000'};">
                          <th style="padding: 4px; text-align: left;">Pertemuan</th>
                          <th style="padding: 4px; text-align: left;">Tugas</th>
                          <th style="padding: 4px; text-align: center;">Nilai</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${sertif.daftar_nilai && sertif.daftar_nilai.length > 0 ? sertif.daftar_nilai.map(n => `
                          <tr style="border-bottom: 1px solid #ccc;">
                            <td style="padding: 4px;">Pertemuan Ke-${n.pertemuan}</td>
                            <td style="padding: 4px;">${n.tugas}</td>
                            <td style="padding: 4px; text-align: center;">${n.nilai}</td>
                          </tr>
                        `).join('') : `<tr><td colspan="3" style="text-align:center; padding: 4px;">Tidak ada nilai tugas</td></tr>`}
                      </tbody>
                      ${sertif.daftar_nilai && sertif.daftar_nilai.length > 0 ? `
                      <tfoot>
                        <tr style="border-top: 2px solid ${item.color || '#000'}; font-weight: bold;">
                          <td colspan="2" style="padding: 4px; text-align: right;">Rata-rata Nilai Akhir</td>
                          <td style="padding: 4px; text-align: center;">${avgStrVal} (${predikat})</td>
                        </tr>
                      </tfoot>` : ''}
                    </table>
                  </div>
                `;
      }
      const fontWeight = item.fontWeight === 'semibold' ? 600 : (item.fontWeight || 'normal');
      return `
                <div class="text-element" style="left: ${item.x}px; top: ${item.y}px; width: ${item.width}px; height: ${item.height}px;">
                  <span class="text-content" style="text-align: ${item.textAlign || 'center'}; font-size: ${item.fontSize}px; color: ${item.color || '#000'}; font-weight: ${fontWeight}; font-family: '${item.fontFamily || 'Arial'}', sans-serif;">
                    ${getVarText(item.id)}
                  </span>
                </div>
              `;
    }).join('')}
          </div>
        </body>
      </html>
    `;

    const { base64 } = await Print.printToFileAsync({
      html,
      width: 842,
      height: 595,
      base64: true
    });

    if (Platform.OS === 'android') {
      const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
      if (permissions.granted) {
        const fileUri = await FileSystem.StorageAccessFramework.createFileAsync(
          permissions.directoryUri,
          namaFileBase,
          'application/pdf'
        );
        await FileSystem.writeAsStringAsync(fileUri, base64, {
          encoding: FileSystem.EncodingType.Base64
        });
        Alert.alert('Sukses', 'Sertifikat berhasil disimpan ke perangkat.');
      }
    } else {
      const fileUri = FileSystem.documentDirectory + namaFile;
      await FileSystem.writeAsStringAsync(fileUri, base64, {
        encoding: FileSystem.EncodingType.Base64
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          UTI: 'com.adobe.pdf',
          mimeType: 'application/pdf',
          dialogTitle: 'Unduh Sertifikat'
        });
      } else {
        Alert.alert('Gagal', 'Fitur berbagi tidak tersedia di perangkat ini');
      }
    }
  } catch (error) {
    console.error("Download error:", error);
    Alert.alert('Gagal', 'Terjadi kesalahan saat mengunduh sertifikat.');
  } finally {
    if (setIsDownloading) setIsDownloading(false);
  }
};
