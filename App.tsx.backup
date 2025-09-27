import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Text } from 'react-native';
import HomeScreen from './screens/HomeScreen';
import MyLibraryScreen from './screens/MyLibraryScreen';
import FavoritesScreen from './screens/FavoritesScreen';
import SettingsScreen from './screens/SettingsScreen';
import BookDetailScreen from './screens/BookDetailScreen';
import BookReaderScreen from './screens/BookReaderScreen';
import type { RootStackParamList, MainTabParamList, TabBarIconProps } from './types';

// Import NativeWind styles
import './global.css';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// Tab Bar Icon Component
const TabBarIcon: React.FC<TabBarIconProps> = ({ focused, icon, size = 20 }) => (
  <Text style={{ fontSize: size, opacity: focused ? 1 : 0.6 }}>
    {icon}
  </Text>
);

// Main Tab Navigator
function MainTabNavigator(): React.ReactElement {
  return (
    <Tab.Navigator
      id={undefined}
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb',
          paddingVertical: 8,
          height: 60,
        },
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: '#6b7280',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginBottom: 4,
        },
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} icon="🏠" />
          ),
        }}
      />
      <Tab.Screen 
        name="MyLibrary" 
        component={MyLibraryScreen}
        options={{
          title: 'My Library',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} icon="📚" />
          ),
        }}
      />
      <Tab.Screen 
        name="Favorites" 
        component={FavoritesScreen}
        options={{
          title: 'Favorites',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} icon="❤️" />
          ),
        }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{
          title: 'Settings',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} icon="⚙️" />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App(): React.ReactElement {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator
        id={undefined}
        initialRouteName="MainTabs"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#f9fafb',
          },
          headerTintColor: '#111827',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="MainTabs" 
          component={MainTabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="BookDetail" 
          component={BookDetailScreen}
          options={{ 
            title: 'Book Details'
          }}
        />
        <Stack.Screen 
          name="BookReader" 
          component={BookReaderScreen}
          options={{ 
            headerShown: false,
            presentation: 'modal',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}