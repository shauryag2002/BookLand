import React from 'react';
import { View, Text } from 'react-native';

// Simple test component to verify NativeWind is working
export default function NativeWindTest() {
  return (
    <View className="flex-1 bg-blue-500 items-center justify-center p-4">
      <Text className="text-white text-2xl font-bold mb-4">
        NativeWind is Working! 🎉
      </Text>
      <Text className="text-white text-center text-base opacity-80">
        This component uses Tailwind CSS classes through NativeWind
      </Text>
      <View className="bg-white rounded-lg p-3 mt-4">
        <Text className="text-gray-800 text-sm font-medium">
          Classes used: flex-1, bg-blue-500, items-center, justify-center, 
          text-white, text-2xl, font-bold, rounded-lg, etc.
        </Text>
      </View>
    </View>
  );
}