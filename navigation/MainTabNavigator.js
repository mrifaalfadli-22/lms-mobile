import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Svg, { Path, Circle, Rect, Polyline, Mask, G } from 'react-native-svg';

import HomeScreen from '../screens/HomeScreen';
import MataKuliahScreen from '../screens/MataKuliahScreen';
import JadwalKelasScreen from '../screens/JadwalKelasScreen';
import ProfilScreen from '../screens/ProfilScreen';

const Tab = createBottomTabNavigator();
const PRIMARY = '#116E63';
const ACTIVE_BG = '#258A7A'; // Lighter teal for active state

// ── Tab Icons ─────────────────────────────────────────────────────────────────

const HomeIcon = ({ color }) => (
  <Svg width="22" height="22" viewBox="0 0 24 24" fill={color}>
    <Path d="M12 3L4 9v12h5v-7h6v7h5V9l-8-6z" />
  </Svg>
);

const PresentationIcon = ({ color }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill={color}>
    <Path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm-1 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z" />
  </Svg>
);

const ScheduleIcon = ({ color }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24">
    <Mask id="calendarMask">
      <Rect x="0" y="0" width="24" height="24" fill="white" />
      <Path d="M3 10 h18 M3 16 h18 M12 10 v12" stroke="black" strokeWidth="2" />
      <Circle cx="17" cy="17" r="7" fill="black" />
    </Mask>
    
    <Mask id="clockHandsMask">
      <Rect x="0" y="0" width="24" height="24" fill="white" />
      <Path d="M17 14 v 3.5 l 2 2" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </Mask>

    <Path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z" fill={color} mask="url(#calendarMask)" />
    <Circle cx="17" cy="17" r="5.5" fill={color} mask="url(#clockHandsMask)" />
  </Svg>
);

const ProfileIcon = ({ color }) => (
  <Svg width="22" height="22" viewBox="0 0 24 24" fill={color}>
    <Circle cx="12" cy="8" r="4" />
    <Path d="M4 20c0-4 3.582-7 8-7s8 3 8 7H4z" />
  </Svg>
);

// ── Bottom Tab Navigator ──────────────────────────────────────────────────────
export default function MainTabNavigator({ route }) {
  const isRegistered = route?.params?.isRegistered ?? route?.params?.params?.isRegistered ?? false;
  const user = route?.params?.user ?? route?.params?.params?.user ?? null;
  const token = route?.params?.token ?? route?.params?.params?.token ?? null;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: true,
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: '#FFFFFF',
        tabBarActiveBackgroundColor: ACTIVE_BG, // Native active background
        tabBarItemStyle: {
          borderRadius: 999, // Perfect pill shape natively!
          marginHorizontal: 8,
          marginVertical: 6,
        },
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({ color }) => {
          if (route.name === 'Home') return <HomeIcon color={color} />;
          if (route.name === 'MataKuliah') return <PresentationIcon color={color} />;
          if (route.name === 'JadwalKelas') return <ScheduleIcon color={color} />;
          if (route.name === 'Profil') return <ProfileIcon color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        initialParams={{ isRegistered, user, token }}
        options={{
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        name="MataKuliah"
        component={MataKuliahScreen}
        initialParams={{ isRegistered, user, token }}
        options={{
          tabBarLabel: 'Mata Kuliah',
        }}
      />
      {isRegistered && (
        <Tab.Screen
          name="JadwalKelas"
          component={JadwalKelasScreen}
          initialParams={{ isRegistered, user, token }}
          options={{
            tabBarLabel: 'Jadwal',
          }}
        />
      )}
      <Tab.Screen
        name="Profil"
        component={ProfilScreen}
        initialParams={{ isRegistered, user, token }}
        options={{
          tabBarLabel: 'Profil',
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: PRIMARY,
    height: 76,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 0,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
    marginBottom: 4,
  },
});
