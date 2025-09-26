import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

const BookCard = ({ book, onPress }) => {
  return (
    <TouchableOpacity 
      onPress={onPress}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-4 mx-2"
    >
      <View className="flex-row">
        <Image 
          source={{ uri: book.image || 'https://via.placeholder.com/80x120/cccccc/000000?text=Book' }}
          className="w-16 h-24 rounded mr-3"
          resizeMode="cover"
        />
        <View className="flex-1">
          <Text className="text-lg font-bold text-gray-900 dark:text-white mb-1" numberOfLines={2}>
            {book.title || 'Sample Book Title'}
          </Text>
          <Text className="text-sm text-gray-600 dark:text-gray-300 mb-1" numberOfLines={1}>
            {book.author || 'Unknown Author'}
          </Text>
          <Text className="text-xs text-gray-500 dark:text-gray-400 mb-2" numberOfLines={2}>
            {book.description || 'A fascinating book that will captivate readers with its compelling narrative and rich character development.'}
          </Text>
          <Text className="text-lg font-bold text-blue-600 dark:text-blue-400">
            ${book.price || '9.99'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default BookCard;