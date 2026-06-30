import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ForumDiskusiScreen from '../screens/ForumDiskusiScreen';
import TugasKuisScreen from '../screens/TugasKuisScreen';
import MateriScreen from '../screens/MateriScreen';
import NotifikasiScreen from '../screens/NotifikasiScreen';
import ProgressBelajarScreen from '../screens/ProgressBelajarScreen';
import SertifikatScreen from '../screens/SertifikatScreen';
import LihatNilaiScreen from '../screens/LihatNilaiScreen';
import EvaluasiScreen from '../screens/EvaluasiScreen';
import DetailMataKuliahScreen from '../screens/DetailMataKuliahScreen';
import DetailSesiScreen from '../screens/DetailSesiScreen';
import DetailProgressBelajarScreen from '../screens/DetailProgressBelajarScreen';
import DetailEvaluasiScreen from '../screens/DetailEvaluasiScreen';
import VerifikasiSertifikatScreen from '../screens/VerifikasiSertifikatScreen';
import MainTabNavigator from './MainTabNavigator';

// New Settings Screens
import PasswordScreen from '../screens/PasswordScreen';
import BantuanScreen from '../screens/BantuanScreen';
import TentangKamiScreen from '../screens/TentangKamiScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Main" component={MainTabNavigator} />
      <Stack.Screen name="ForumDiskusi" component={ForumDiskusiScreen} />
      <Stack.Screen name="TugasKuis" component={TugasKuisScreen} />
      <Stack.Screen name="Materi" component={MateriScreen} />
      <Stack.Screen name="Notifikasi" component={NotifikasiScreen} />
      <Stack.Screen name="ProgressBelajar" component={ProgressBelajarScreen} />
      <Stack.Screen name="Sertifikat" component={SertifikatScreen} />
      <Stack.Screen name="LihatNilai" component={LihatNilaiScreen} />
      <Stack.Screen name="Evaluasi" component={EvaluasiScreen} />
      <Stack.Screen name="DetailMataKuliah" component={DetailMataKuliahScreen} />
      <Stack.Screen name="DetailSesi" component={DetailSesiScreen} />
      <Stack.Screen name="DetailProgressBelajar" component={DetailProgressBelajarScreen} />
      <Stack.Screen name="DetailEvaluasi" component={DetailEvaluasiScreen} />
      <Stack.Screen name="VerifikasiSertifikat" component={VerifikasiSertifikatScreen} />
      
      {/* Settings Screens */}
      <Stack.Screen name="Password" component={PasswordScreen} />
      <Stack.Screen name="Bantuan" component={BantuanScreen} />
      <Stack.Screen name="TentangKami" component={TentangKamiScreen} />
    </Stack.Navigator>
  );
}
