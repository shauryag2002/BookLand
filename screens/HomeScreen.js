import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, SafeAreaView, StatusBar, TouchableOpacity, RefreshControl } from 'react-native';
import EnhancedBookCard from '../components/EnhancedBookCard';
import useBookStore from '../store/bookStore';
import { searchBooksOpenLibrary, getTrendingBooks } from '../services/openLibraryApi';

const HomeScreen = ({ navigation }) => {
  const { 
    filteredBooks, 
    searchQuery, 
    isLoading, 
    setBooks, 
    setSearchQuery, 
    setLoading, 
    loadDownloadedBooks,
    loadReadingProgress,
    loadFavoriteBooks 
  } = useBookStore();
  
  const [refreshing, setRefreshing] = useState(false);
  const [searchMode, setSearchMode] = useState(false);

  useEffect(() => {
    // Initialize the store and load trending books
    initializeApp();
  }, []);

  const initializeApp = async () => {
    setLoading(true);
    try {
      // Load downloaded books, reading progress, and favorites from storage
      await loadDownloadedBooks();
      await loadReadingProgress();
      await loadFavoriteBooks();
      
      // Load trending books as default
      await loadTrendingBooks();
    } catch (error) {
      console.error('Error initializing app:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTrendingBooks = async () => {
    try {
      const trendingBooks = await getTrendingBooks(30);
      setBooks(trendingBooks);
    } catch (error) {
      console.error('Error loading trending books:', error);
      // Fallback to sample books if API fails
      setBooks(getSampleBooks());
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    
    if (query.trim() === '') {
      setSearchMode(false);
      await loadTrendingBooks();
      return;
    }

    if (query.length >= 3) {
      setSearchMode(true);
      setLoading(true);
      
      try {
        const searchResults = await searchBooksOpenLibrary(query, 30);
        setBooks(searchResults);
      } catch (error) {
        console.error('Error searching books:', error);
        // Show error message or fallback
      } finally {
        setLoading(false);
      }
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      if (searchMode) {
        await handleSearch(searchQuery);
      } else {
        await loadTrendingBooks();
      }
    } finally {
      setRefreshing(false);
    }
  };

  const handleBookPress = (book) => {
    navigation.navigate('BookDetail', { book });
  };

  // Fallback sample books
  const getSampleBooks = () => [
    {
      id: '1',
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      description: 'A classic American novel set in the Jazz Age, exploring themes of wealth, love, and the American Dream.',
      price: '12.99',
      cover: 'https://covers.openlibrary.org/b/id/8225261-L.jpg',
      year: 1925
    },
    {
      id: '2',
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      description: 'A powerful story of racial injustice and childhood innocence in the American South.',
      price: '14.99',
      cover: 'https://covers.openlibrary.org/b/id/8226651-L.jpg',
      year: 1960
    },
    {
      id: '3',
      title: '1984',
      author: 'George Orwell',
      description: 'A dystopian masterpiece about totalitarianism and the power of language.',
      price: '13.99',
      cover: 'https://covers.openlibrary.org/b/id/7222246-L.jpg',
      year: 1949
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <StatusBar style="auto" />
      <View className="p-4">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-gray-900 dark:text-white">
            📚 BookLand
          </Text>
        </View>

        {/* Search Bar */}
        <View className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-4 flex-row items-center">
          <TextInput
            className="flex-1 px-4 py-3 text-gray-900 dark:text-white text-base"
            placeholder={searchMode ? "Search books or authors..." : "Search books or browse trending..."}
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={handleSearch}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => handleSearch('')}
              className="p-3"
            >
              <Text className="text-gray-400 text-lg">×</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Section Title */}
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            {searchMode ? `Search Results (${filteredBooks.length})` : 'Trending Books'}
          </Text>
          {!searchMode && (
            <TouchableOpacity onPress={onRefresh}>
              <Text className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                Refresh
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Books List */}
        <FlatList
          data={filteredBooks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <EnhancedBookCard 
              book={item} 
              onPress={() => handleBookPress(item)}
              showFavoriteButton={true}
            />
          )}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#3B82F6']}
              tintColor="#3B82F6"
            />
          }
          ListEmptyComponent={
            isLoading ? (
              <View className="items-center py-8">
                <Text className="text-gray-500 dark:text-gray-400 text-base">
                  {searchMode ? 'Searching books...' : 'Loading trending books...'}
                </Text>
              </View>
            ) : (
              <View className="items-center py-8">
                <Text className="text-gray-500 dark:text-gray-400 text-base">
                  {searchMode 
                    ? `No books found for "${searchQuery}"`
                    : 'No books available'
                  }
                </Text>
                {searchMode && (
                  <TouchableOpacity
                    onPress={() => handleSearch('')}
                    className="mt-4 bg-blue-600 px-4 py-2 rounded-lg"
                  >
                    <Text className="text-white font-medium">Browse Trending</Text>
                  </TouchableOpacity>
                )}
              </View>
            )
          }
          contentContainerStyle={{
            paddingBottom: 20,
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;