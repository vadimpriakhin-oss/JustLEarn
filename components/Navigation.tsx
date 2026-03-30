import { useRouter, usePathname } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

const navItems: NavItem[] = [
  { label: 'Home', icon: '🏠', route: '/' },
  { label: 'Create', icon: '➕', route: '/screens/create' },
  { label: 'Quiz', icon: '📝', route: '/screens/quiz' },
];

export default function Navigation() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View style={styles.container}>
      {navItems.map((item) => {
        const isActive = pathname === item.route;
        return (
          <TouchableOpacity
            key={item.route}
            style={[styles.navItem, isActive && styles.navItemActive]}
            onPress={() => router.push(item.route as any)}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
          >
            <Text style={styles.navIcon}>{item.icon}</Text>
            <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: 'rgba(30, 30, 30, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 255, 204, 0.3)',
    paddingVertical: 8,
    paddingBottom: 24,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
    borderRadius: 8,
  },
  navItemActive: {
    backgroundColor: 'rgba(0, 255, 204, 0.1)',
  },
  navIcon: {
    fontSize: 22,
    marginBottom: 2,
  },
  navLabel: {
    fontSize: 11,
    color: '#999',
    fontWeight: '500',
  },
  navLabelActive: {
    color: '#00ffcc',
  },
});
