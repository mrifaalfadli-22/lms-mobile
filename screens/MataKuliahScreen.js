import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MataKuliahScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Mata Kuliah</Text>
      <Text style={styles.sub}>Halaman ini akan segera hadir</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F5F6FA' },
  text: { fontSize: 22, fontWeight: '700', color: '#116E63' },
  sub: { fontSize: 13, color: '#9CA3AF', marginTop: 8 },
});
