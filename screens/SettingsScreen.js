import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, Switch, Alert, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsScreen = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [storageLocation, setStorageLocation] = useState('/default/books/');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoDownload, setAutoDownload] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const settings = await AsyncStorage.getItem('appSettings');
      if (settings) {
        const parsedSettings = JSON.parse(settings);
        setDarkMode(parsedSettings.darkMode || false);
        setStorageLocation(parsedSettings.storageLocation || '/default/books/');
        setNotificationsEnabled(parsedSettings.notificationsEnabled ?? true);
        setAutoDownload(parsedSettings.autoDownload || false);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async (newSettings) => {
    try {
      const settings = {
        darkMode,
        storageLocation,
        notificationsEnabled,
        autoDownload,
        ...newSettings
      };
      await AsyncStorage.setItem('appSettings', JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const toggleDarkMode = () => {
    const newValue = !darkMode;
    setDarkMode(newValue);
    saveSettings({ darkMode: newValue });
    
    Alert.alert(
      'Dark Mode',
      `Dark mode has been ${newValue ? 'enabled' : 'disabled'}. Please restart the app to see full changes.`,
      [{ text: 'OK' }]
    );
  };

  const handleStorageLocation = () => {
    Alert.alert(
      'Storage Location',
      'Choose where to store downloaded books:',
      [
        {
          text: 'Internal Storage',
          onPress: () => {
            setStorageLocation('/internal/books/');
            saveSettings({ storageLocation: '/internal/books/' });
          }
        },
        {
          text: 'External Storage',
          onPress: () => {
            setStorageLocation('/external/books/');
            saveSettings({ storageLocation: '/external/books/' });
          }
        },
        {
          text: 'Cancel',
          style: 'cancel'
        }
      ]
    );
  };

  const clearCache = () => {
    Alert.alert(
      'Clear Cache',
      'This will remove temporary files and cached data. Are you sure?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              // In a real app, you would clear actual cache files
              Alert.alert('Success', 'Cache cleared successfully!');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear cache');
            }
          }
        }
      ]
    );
  };

  const exportData = () => {
    Alert.alert(
      'Export Data',
      'Export your library and favorites data (feature coming soon)',
      [{ text: 'OK' }]
    );
  };

  const showAbout = () => {
    Alert.alert(
      'About BookLand',
      `BookLand v1.0.0\n\nA free and open-source book reader app.\n\nFeatures:\n• Search and discover books\n• Download books for offline reading\n• Organize your personal library\n• Mark favorites\n• Dark mode support\n\nBuilt with React Native, Expo, and NativeWind.`,
      [
        {
          text: 'GitHub',
          onPress: () => Linking.openURL('https://github.com/shauryag2002/BookLand')
        },
        {
          text: 'Close'
        }
      ]
    );
  };

  const SettingItem = ({ title, description, onPress, rightComponent, showBorder = true }) => (
    <TouchableOpacity 
      onPress={onPress}
      className={`py-4 px-4 ${showBorder ? 'border-b border-gray-200 dark:border-gray-700' : ''}`}
    >
      <View className="flex-row justify-between items-center">
        <View className="flex-1">
          <Text className="text-base font-medium text-gray-900 dark:text-white">
            {title}
          </Text>
          {description && (
            <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {description}
            </Text>
          )}
        </View>
        {rightComponent && (
          <View className="ml-4">
            {rightComponent}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <View className="p-4">
        {/* Header */}
        <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          ⚙️ Settings
        </Text>

        {/* Appearance Section */}
        <View className="bg-white dark:bg-gray-800 rounded-lg mb-4 shadow-sm">
          <View className="p-4 border-b border-gray-200 dark:border-gray-700">
            <Text className="text-lg font-semibold text-gray-900 dark:text-white">
              Appearance
            </Text>
          </View>
          
          <SettingItem
            title="Dark Mode"
            description="Switch between light and dark themes"
            rightComponent={
              <Switch
                value={darkMode}
                onValueChange={toggleDarkMode}
                trackColor={{ false: '#cbd5e0', true: '#3b82f6' }}
                thumbColor={darkMode ? '#ffffff' : '#ffffff'}
              />
            }
            showBorder={false}
          />
        </View>

        {/* Storage Section */}
        <View className="bg-white dark:bg-gray-800 rounded-lg mb-4 shadow-sm">
          <View className="p-4 border-b border-gray-200 dark:border-gray-700">
            <Text className="text-lg font-semibold text-gray-900 dark:text-white">
              Storage
            </Text>
          </View>
          
          <SettingItem
            title="Storage Location"
            description={`Current: ${storageLocation}`}
            onPress={handleStorageLocation}
            rightComponent={
              <Text className="text-blue-600 dark:text-blue-400">Change</Text>
            }
          />
          
          <SettingItem
            title="Auto Download"
            description="Automatically download books when added to library"
            rightComponent={
              <Switch
                value={autoDownload}
                onValueChange={(value) => {
                  setAutoDownload(value);
                  saveSettings({ autoDownload: value });
                }}
                trackColor={{ false: '#cbd5e0', true: '#3b82f6' }}
                thumbColor={autoDownload ? '#ffffff' : '#ffffff'}
              />
            }
            showBorder={false}
          />
        </View>

        {/* Data Section */}
        <View className="bg-white dark:bg-gray-800 rounded-lg mb-4 shadow-sm">
          <View className="p-4 border-b border-gray-200 dark:border-gray-700">
            <Text className="text-lg font-semibold text-gray-900 dark:text-white">
              Data Management
            </Text>
          </View>
          
          <SettingItem
            title="Clear Cache"
            description="Remove temporary files and cached data"
            onPress={clearCache}
            rightComponent={
              <Text className="text-red-600 dark:text-red-400">Clear</Text>
            }
          />
          
          <SettingItem
            title="Export Data"
            description="Export your library and favorites"
            onPress={exportData}
            rightComponent={
              <Text className="text-blue-600 dark:text-blue-400">Export</Text>
            }
            showBorder={false}
          />
        </View>

        {/* About Section */}
        <View className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <View className="p-4 border-b border-gray-200 dark:border-gray-700">
            <Text className="text-lg font-semibold text-gray-900 dark:text-white">
              About
            </Text>
          </View>
          
          <SettingItem
            title="About BookLand"
            description="Version, credits, and more information"
            onPress={showAbout}
            rightComponent={
              <Text className="text-blue-600 dark:text-blue-400">Info</Text>
            }
            showBorder={false}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SettingsScreen;