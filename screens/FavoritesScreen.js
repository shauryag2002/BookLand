import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, SafeAreaView, RefreshControl, TouchableOpacity, Alert } from 'react-native';
import BookCard from '../components/BookCard';
import useBookStore from '../store/bookStore';

const FavoritesScreen = ({ navigation }) => {
  const { 
    favoriteBooks, 
    loadFavoriteBooks,
    removeFavoriteBook,
    isLoading
  } = useBookStore();
  
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadFavoriteBooks();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadFavoriteBooks();
    setRefreshing(false);
  };

  const handleBookPress = (book) => {
    navigation.navigate('BookDetail', { book });
  };

  const handleBookDoubleTap = (book) => {
    Alert.alert(
      "Book Details",
      `"${book.title}" by ${book.author}`,
      [
        {
          text: "Remove from Favorites",
          style: "destructive",
          onPress: () => removeFavoriteBook(book.id)
        },
        {
          text: "View Details",
          onPress: () => navigation.navigate('BookDetail', { book })
        },
        {
          text: "Cancel",
          style: "cancel"
        }
      ]
    );
  };

  const renderBookItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleBookPress(item)}
      onLongPress={() => handleBookDoubleTap(item)}
    >
      <BookCard book={item} onPress={() => handleBookPress(item)} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
        <View className="p-4">
          {/* Header */}
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-2xl font-bold text-gray-900 dark:text-white">
              ❤️ Favorites
            </Text>
            <Text className="text-sm text-gray-600 dark:text-gray-400">
              {favoriteBooks.length} books
            </Text>
          </View>

          {/* Empty state */}
          {favoriteBooks.length === 0 && !isLoading ? (
            <View className="flex-1 justify-center items-center py-20">
              <Text className="text-6xl mb-4">💝</Text>
              <Text className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No Favorite Books Yet
              </Text>
              <Text className="text-gray-600 dark:text-gray-400 text-center px-8 mb-6">
                Start marking books as favorites to see them here. You can add favorites from book details.
              </Text>
              <TouchableOpacity 
                onPress={() => navigation.navigate('Home')}
                className="bg-red-600 px-6 py-3 rounded-lg"
              >
                <Text className="text-white font-medium">Discover Books</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View className="flex-1">
              <Text className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                Long press any book for quick actions
              </Text>
              
              <FlatList
                data={favoriteBooks}
                renderItem={renderBookItem}
                keyExtractor={(item) => item.id.toString()}
                refreshControl={
                  <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
              />
            </View>
          )}
        </View>
      </SafeAreaView>
  );
};

export default FavoritesScreen;