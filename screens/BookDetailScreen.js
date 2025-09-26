import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';

const BookDetailScreen = ({ route, navigation }) => {
  const { book } = route.params;

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <ScrollView className="flex-1">
        <View className="p-6">
          {/* Book Image and Basic Info */}
          <View className="items-center mb-6">
            <Image 
              source={{ uri: book.image }}
              className="w-40 h-60 rounded-lg shadow-lg"
              resizeMode="cover"
            />
            <Text className="text-2xl font-bold text-gray-900 dark:text-white mt-4 text-center">
              {book.title}
            </Text>
            <Text className="text-lg text-gray-600 dark:text-gray-300 mt-1 text-center">
              by {book.author}
            </Text>
            <Text className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-2">
              ${book.price}
            </Text>
          </View>

          {/* Description */}
          <View className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4">
            <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Description
            </Text>
            <Text className="text-base text-gray-700 dark:text-gray-300 leading-6">
              {book.description}
            </Text>
          </View>

          {/* Book Details */}
          <View className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4">
            <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Details
            </Text>
            <View className="space-y-2">
              <View className="flex-row justify-between">
                <Text className="text-gray-600 dark:text-gray-400">Author</Text>
                <Text className="text-gray-900 dark:text-white font-medium">{book.author}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-600 dark:text-gray-400">Price</Text>
                <Text className="text-gray-900 dark:text-white font-medium">${book.price}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-600 dark:text-gray-400">Format</Text>
                <Text className="text-gray-900 dark:text-white font-medium">Digital</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-600 dark:text-gray-400">Language</Text>
                <Text className="text-gray-900 dark:text-white font-medium">English</Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View className="space-y-3 mt-4">
            <TouchableOpacity className="bg-blue-600 dark:bg-blue-500 rounded-lg py-4 px-6">
              <Text className="text-white text-center text-lg font-semibold">
                Add to Cart
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity className="bg-gray-200 dark:bg-gray-700 rounded-lg py-4 px-6">
              <Text className="text-gray-900 dark:text-white text-center text-lg font-semibold">
                Add to Wishlist
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BookDetailScreen;