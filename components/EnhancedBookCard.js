import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import useBookStore from '../store/bookStore';

const EnhancedBookCard = ({ book, onPress, onFavoriteToggle, showFavoriteButton = true }) => {
  const { isFavorite, toggleFavorite } = useBookStore();
  const isBookFavorite = isFavorite(book.id);

  const handleFavoritePress = async () => {
    await toggleFavorite(book);
    if (onFavoriteToggle) {
      onFavoriteToggle(book, !isBookFavorite);
    }
  };

  return (
    <TouchableOpacity 
      onPress={onPress}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-4 mx-2"
    >
      <View className="flex-row">
        <Image 
          source={{ uri: book.cover || book.image || 'https://via.placeholder.com/80x120/cccccc/000000?text=Book' }}
          className="w-20 h-32 rounded mr-4"
          resizeMode="cover"
        />
        <View className="flex-1">
          <View className="flex-row justify-between items-start">
            <View className="flex-1">
              <Text className="text-lg font-bold text-gray-900 dark:text-white mb-1" numberOfLines={2}>
                {book.title || 'Sample Book Title'}
              </Text>
              <Text className="text-sm text-gray-600 dark:text-gray-300 mb-1" numberOfLines={1}>
                {book.author || 'Unknown Author'}
              </Text>
            </View>
            {showFavoriteButton && (
              <TouchableOpacity 
                onPress={handleFavoritePress}
                className="p-2 -mt-2 -mr-2"
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text className="text-xl">
                  {isBookFavorite ? '❤️' : '🤍'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
          
          {book.year && (
            <Text className="text-xs text-blue-600 dark:text-blue-400 mb-2">
              Published: {book.year}
            </Text>
          )}
          
          <Text className="text-xs text-gray-500 dark:text-gray-400 mb-2" numberOfLines={3}>
            {book.description || 'A fascinating book that will captivate readers with its compelling narrative and rich character development.'}
          </Text>
          
          {book.subjects && book.subjects.length > 0 && (
            <View className="flex-row flex-wrap mt-1">
              {book.subjects.slice(0, 2).map((subject, index) => (
                <View key={index} className="bg-gray-100 dark:bg-gray-700 rounded-full px-2 py-1 mr-1 mb-1">
                  <Text className="text-xs text-gray-600 dark:text-gray-300">{subject}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default EnhancedBookCard;