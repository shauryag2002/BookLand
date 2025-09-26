import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, SafeAreaView, TouchableOpacity, RefreshControl } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import EnhancedBookCard from '../components/EnhancedBookCard';
import useBookStore from '../store/bookStore';
import { searchBooksOpenLibrary, getTrendingBooks } from '../services/openLibraryApi';
import type { HomeScreenProps, Book } from '../types';

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
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
  
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [searchMode, setSearchMode] = useState<boolean>(false);

  useEffect(() => {
    // Initialize the store and load trending books
    initializeApp();
  }, []);

  const initializeApp = async (): Promise<void> => {
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

  const loadTrendingBooks = async (): Promise<void> => {
    try {
      const trendingBooks = await getTrendingBooks(30);
      setBooks(trendingBooks);
    } catch (error) {
      console.error('Error loading trending books:', error);
      // Fallback to sample books if API fails
      setBooks(getSampleBooks());
    }
  };

  const handleSearch = async (query: string): Promise<void> => {
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

  const onRefresh = async (): Promise<void> => {
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

  const handleBookPress = (book: Book): void => {
    navigation.navigate('BookDetail', { book });
  };

  // Fallback sample books
  const getSampleBooks = (): Book[] => [
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

  const renderBookItem = ({ item }: { item: Book }) => (
    <EnhancedBookCard
      book={item}
      onPress={() => handleBookPress(item)}
    />
  );

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

        {/* Search Input */}
        <View className="mb-6">
          <TextInput
            className="bg-white dark:bg-gray-800 rounded-lg px-4 py-3 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700"
            placeholder="Search for books..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>

        {/* Section Title */}
        <View className="mb-4">
          <Text className="text-lg font-semibold text-gray-900 dark:text-white">
            {searchMode ? `Search Results (${filteredBooks.length})` : 'Trending Books'}
          </Text>
        </View>

        {/* Books List */}
        <FlatList
          data={filteredBooks}
          renderItem={renderBookItem}
          keyExtractor={(item: any) => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={() => (
            <View className="flex-1 justify-center items-center py-20">
              <Text className="text-gray-500 dark:text-gray-400 text-center">
                {isLoading ? 'Loading books...' : 'No books found'}
              </Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;