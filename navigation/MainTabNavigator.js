import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Svg, { Path, Circle, Rect, Polyline } from 'react-native-svg';

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
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M14 6h6a2 2 0 012 2v8a2 2 0 01-2 2h-4" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Circle cx="8" cy="6" r="3" fill={color} />
    <Path d="M13 13v6a1 1 0 01-1 1h-1a1 1 0 01-1-1v-4H8v4a1 1 0 01-1 1H6a1 1 0 01-1-1v-7c0-1.1.9-2 2-2h6z" fill={color} />
  </Svg>
);

const ScheduleIcon = ({ color }) => (
  <Svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="4" width="18" height="14" rx="2" stroke={color} strokeWidth="2" />
    <Path d="M3 10h18M8 4v14M14 4v14" stroke={color} strokeWidth="2" />
    <Circle cx="18" cy="16" r="6" fill={PRIMARY} stroke={color} strokeWidth="2" />
    <Polyline points="18 14 18 16 20 16" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ProfileIcon = ({ color }) => (
  <Svg width="22" height="22" viewBox="0 0 24 24" fill={color}>
    <Circle cx="12" cy="8" r="4" />
    <Path d="M4 20c0-4 3.582-7 8-7s8 3 8 7H4z" />
  </Svg>
);

// ── Custom Tab Button ─────────────────────────────────────────────────────────
const CustomTabBarButton = ({ children, onPress, accessibilityState, style, ...rest }) => {
  const isSelected = accessibilityState?.selected;
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        style,
        styles.tabButton,
        isSelected && styles.tabButtonActive,
      ]}
      {...rest}
    >
      {children}
    </TouchableOpacity>
  );
};

// ── Bottom Tab Navigator ──────────────────────────────────────────────────────
export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: true,
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: '#FFFFFF',
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
        options={{
          tabBarLabel: 'Home',
          tabBarButton: (props) => <CustomTabBarButton {...props} />,
        }}
      />
      <Tab.Screen
        name="MataKuliah"
        component={MataKuliahScreen}
        options={{
          tabBarLabel: 'Kelas',
          tabBarButton: (props) => <CustomTabBarButton {...props} />,
        }}
      />
      <Tab.Screen
        name="JadwalKelas"
        component={JadwalKelasScreen}
        options={{
          tabBarLabel: 'Jadwal kelas',
          tabBarButton: (props) => <CustomTabBarButton {...props} />,
        }}
      />
      <Tab.Screen
        name="Profil"
        component={ProfilScreen}
        options={{
          tabBarLabel: 'Profil',
          tabBarButton: (props) => <CustomTabBarButton {...props} />,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: PRIMARY,
    height: 70,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 0,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    paddingHorizontal: 8,
    paddingBottom: 6,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    marginVertical: 6,
    marginHorizontal: 4,
  },
  tabButtonActive: {
    backgroundColor: ACTIVE_BG,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
});
