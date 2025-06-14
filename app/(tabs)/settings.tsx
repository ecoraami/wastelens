import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useItems } from '@/contexts/ItemsContext';
import { StatsCard } from '@/components/StatsCard';
import { User, Settings as SettingsIcon, Bell, Shield, CircleHelp as HelpCircle, Star, Share2, Award, Target, TrendingUp, Recycle, Leaf, ChevronRight, Moon, Globe, Trash2 } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

export default function SettingsScreen() {
  const { stats, loading, clearAllData } = useItems();
  const { theme, toggleTheme, isDark } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [dataSharing, setDataSharing] = React.useState(false);

  if (loading || !stats) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>Loading settings...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleClearAllData = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all your snapped items and reset your goals. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete All', 
          style: 'destructive',
          onPress: () => {
            clearAllData();
            Alert.alert('Success', 'All data has been cleared.');
          }
        }
      ]
    );
  };

  const accountItems = [
    {
      icon: <User size={20} color={theme.colors.textSecondary} />,
      title: 'Profile',
      subtitle: 'Edit your personal information',
      onPress: () => {},
      showChevron: true,
    },
    {
      icon: <Target size={20} color={theme.colors.textSecondary} />,
      title: 'Goals',
      subtitle: 'Set and manage your waste goals',
      onPress: () => {},
      showChevron: true,
    },
    {
      icon: <Award size={20} color={theme.colors.textSecondary} />,
      title: 'Achievements',
      subtitle: 'View your progress and badges',
      onPress: () => {},
      showChevron: true,
    },
  ];

  const appItems = [
    {
      icon: <Bell size={20} color={theme.colors.textSecondary} />,
      title: 'Notifications',
      subtitle: 'Manage your notification preferences',
      onPress: () => {},
      hasSwitch: true,
      switchValue: notificationsEnabled,
      onSwitchChange: setNotificationsEnabled,
    },
    {
      icon: <Moon size={20} color={theme.colors.textSecondary} />,
      title: 'Dark Mode',
      subtitle: 'Switch between light and dark themes',
      onPress: toggleTheme,
      hasSwitch: true,
      switchValue: isDark,
      onSwitchChange: toggleTheme,
    },
    {
      icon: <Globe size={20} color={theme.colors.textSecondary} />,
      title: 'Language',
      subtitle: 'English',
      onPress: () => {},
      showChevron: true,
    },
    {
      icon: <Shield size={20} color={theme.colors.textSecondary} />,
      title: 'Privacy',
      subtitle: 'Data sharing and privacy settings',
      onPress: () => {},
      hasSwitch: true,
      switchValue: dataSharing,
      onSwitchChange: setDataSharing,
    },
  ];

  const supportItems = [
    {
      icon: <HelpCircle size={20} color={theme.colors.textSecondary} />,
      title: 'Help & Support',
      subtitle: 'Get help and contact support',
      onPress: () => {},
      showChevron: true,
    },
    {
      icon: <Star size={20} color={theme.colors.textSecondary} />,
      title: 'Rate App',
      subtitle: 'Rate Waste Lens on the App Store',
      onPress: () => {},
      showChevron: true,
    },
    {
      icon: <Share2 size={20} color={theme.colors.textSecondary} />,
      title: 'Share App',
      subtitle: 'Share Waste Lens with friends',
      onPress: () => {},
      showChevron: true,
    },
  ];

  const dangerItems = [
    {
      icon: <Trash2 size={20} color="#ef4444" />,
      title: 'Clear All Data',
      subtitle: 'Delete all your waste entries',
      onPress: handleClearAllData,
      showChevron: true,
      danger: true,
    },
  ];

  const renderMenuItem = (item: any, index: number) => (
    <TouchableOpacity
      key={index}
      style={[styles.menuItem, { backgroundColor: theme.colors.surface }]}
      onPress={item.onPress}
    >
      <View style={styles.menuItemLeft}>
        <View style={[
          styles.menuItemIcon, 
          { backgroundColor: theme.colors.background },
          item.danger && styles.dangerIcon
        ]}>
          {item.icon}
        </View>
        <View style={styles.menuItemContent}>
          <Text style={[
            styles.menuItemTitle, 
            { color: theme.colors.text },
            item.danger && styles.dangerText
          ]}>
            {item.title}
          </Text>
          <Text style={[styles.menuItemSubtitle, { color: theme.colors.textSecondary }]}>{item.subtitle}</Text>
        </View>
      </View>
      <View style={styles.menuItemRight}>
        {item.hasSwitch && (
          <Switch
            value={item.switchValue}
            onValueChange={item.onSwitchChange}
            trackColor={{ false: theme.colors.border, true: theme.colors.primaryLight }}
            thumbColor={item.switchValue ? theme.colors.primary : '#ffffff'}
          />
        )}
        {item.showChevron && (
          <ChevronRight size={16} color={theme.colors.textTertiary} />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.profileContainer}>
            <View style={[styles.avatar, { backgroundColor: theme.colors.primary }]}>
              <User size={32} color="#ffffff" />
            </View>
            <View style={styles.profileInfo}>
              <Text style={[styles.name, { color: theme.colors.text }]}>Eco Warrior</Text>
              <Text style={[styles.email, { color: theme.colors.textSecondary }]}>eco.warrior@example.com</Text>
            </View>
          </View>
        </View>

        {/* Achievement Badge */}
        <View style={styles.section}>
          <View style={[styles.achievementCard, { backgroundColor: theme.colors.surface }]}>
            <View style={[styles.achievementIcon, { backgroundColor: '#fef3c7' }]}>
              <Award size={24} color="#f59e0b" />
            </View>
            <View style={styles.achievementContent}>
              <Text style={[styles.achievementTitle, { color: theme.colors.text }]}>Waste Reduction Champion</Text>
              <Text style={[styles.achievementSubtitle, { color: theme.colors.textSecondary }]}>
                {stats.streak} day streak • Level 3
              </Text>
            </View>
          </View>
        </View>

        {/* Stats Overview */}
        <View style={styles.statsContainer}>
          <StatsCard
            title="Total Snapped"
            value={`${stats.totalWeight}g`}
            subtitle="All time"
            icon={<TrendingUp size={20} color={theme.colors.textSecondary} />}
          />
          <StatsCard
            title="Recycling Rate"
            value={`${Math.round(stats.recyclingRate)}%`}
            subtitle="Current rate"
            color={theme.colors.success}
            icon={<Recycle size={20} color={theme.colors.success} />}
          />
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Account</Text>
          {accountItems.map(renderMenuItem)}
        </View>

        {/* App Settings */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>App Settings</Text>
          {appItems.map(renderMenuItem)}
        </View>

        {/* Support */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Support</Text>
          {supportItems.map(renderMenuItem)}
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Danger Zone</Text>
          {dangerItems.map(renderMenuItem)}
        </View>

        {/* Environmental Impact - Moved to bottom */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Environmental Impact</Text>
          <View style={[styles.impactCard, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.impactRow}>
              <Leaf size={20} color="#3b82f6" />
              <View style={styles.impactContent}>
                <Text style={[styles.impactLabel, { color: theme.colors.textSecondary }]}>
                  CO₂ Impact This Month
                </Text>
                <Text style={[styles.impactValue, { color: "#3b82f6" }]}>
                  {stats.co2Saved.toFixed(1)}kg CO₂ saved
                </Text>
                <Text style={[styles.impactDescription, { color: theme.colors.textTertiary }]}>
                  Through proper waste sorting and recycling
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* App Info */}
        <View style={styles.section}>
          <View style={styles.appInfo}>
            <Text style={[styles.appName, { color: theme.colors.text }]}>Waste Lens</Text>
            <Text style={[styles.appVersion, { color: theme.colors.textSecondary }]}>Version 1.0.0</Text>
            <Text style={[styles.appDescription, { color: theme.colors.textSecondary }]}>
              Snap your waste, reduce your impact, and help save the planet one entry at a time.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    marginBottom: 4,
  },
  email: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  achievementCard: {
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    marginBottom: 4,
  },
  achievementSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    marginBottom: 16,
  },
  menuItem: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  dangerIcon: {
    backgroundColor: '#fef2f2',
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    marginBottom: 2,
  },
  dangerText: {
    color: '#ef4444',
  },
  menuItemSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  impactCard: {
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  impactRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  impactContent: {
    flex: 1,
  },
  impactLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    marginBottom: 4,
  },
  impactValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    marginBottom: 4,
  },
  impactDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    lineHeight: 16,
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  appName: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    marginBottom: 4,
  },
  appVersion: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    marginBottom: 12,
  },
  appDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
});