import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, SafeAreaView, RefreshControl, TouchableOpacity, Alert } from 'react-native';
import BookCard from '../components/BookCard';
import useBookStore from '../store/bookStore';

const MyLibraryScreen = ({ navigation }) => {
  const { 
    downloadedBooks, 
    loadDownloadedBooks,
    removeDownloadedBook,
    isLoading
  } = useBookStore();
  
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDownloadedBooks();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDownloadedBooks();
    setRefreshing(false);
  };

  const handleBookPress = (book) => {
    navigation.navigate('BookDetail', { book });
  };

  const handleBookDoubleTap = (book) => {
    Alert.alert(
      "Open Book",
      `Would you like to read "${book.title}"?`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Read Now",
          onPress: () => {
            // Navigate to book reader if the book has a file path
            if (book.filePath) {
              navigation.navigate('BookReader', { book, filePath: book.filePath });
            } else {
              navigation.navigate('BookDetail', { book });
            }
          }
        }
      ]
    );
  };

  const handleRemoveBook = (bookId) => {
    Alert.alert(
      "Remove Book",
      "Are you sure you want to remove this book from your library?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => removeDownloadedBook(bookId)
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
              📚 My Library
            </Text>
            <Text className="text-sm text-gray-600 dark:text-gray-400">
              {downloadedBooks.length} books
            </Text>
          </View>

          {/* Empty state */}
          {downloadedBooks.length === 0 && !isLoading ? (
            <View className="flex-1 justify-center items-center py-20">
              <Text className="text-6xl mb-4">📖</Text>
              <Text className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No Books Downloaded
              </Text>
              <Text className="text-gray-600 dark:text-gray-400 text-center px-8 mb-6">
                Download books from the Home tab to start building your personal library.
              </Text>
              <TouchableOpacity 
                onPress={() => navigation.navigate('Home')}
                className="bg-blue-600 px-6 py-3 rounded-lg"
              >
                <Text className="text-white font-medium">Browse Books</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View className="flex-1">
              <Text className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                Long press any book for quick actions
              </Text>
              
              <FlatList
                data={downloadedBooks}
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

export default MyLibraryScreen;