import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, SafeAreaView, StatusBar } from 'react-native';
import BookCard from '../components/BookCard';

const HomeScreen = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');

  // Sample book data
  const sampleBooks = [
    {
      id: '1',
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      description: 'A classic American novel set in the Jazz Age, exploring themes of wealth, love, and the American Dream.',
      price: '12.99',
      image: 'https://via.placeholder.com/80x120/4F46E5/FFFFFF?text=Gatsby'
    },
    {
      id: '2',
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      description: 'A powerful story of racial injustice and childhood innocence in the American South.',
      price: '14.99',
      image: 'https://via.placeholder.com/80x120/EF4444/FFFFFF?text=Mockingbird'
    },
    {
      id: '3',
      title: '1984',
      author: 'George Orwell',
      description: 'A dystopian masterpiece about totalitarianism and the power of language.',
      price: '13.99',
      image: 'https://via.placeholder.com/80x120/10B981/FFFFFF?text=1984'
    },
    {
      id: '4',
      title: 'Pride and Prejudice',
      author: 'Jane Austen',
      description: 'A timeless romance exploring love, class, and social expectations in 19th century England.',
      price: '11.99',
      image: 'https://via.placeholder.com/80x120/F59E0B/FFFFFF?text=Pride'
    }
  ];

  const filteredBooks = sampleBooks.filter(book =>
    book.title.toLowerCase().includes(searchText.toLowerCase()) ||
    book.author.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleBookPress = (book) => {
    navigation.navigate('BookDetail', { book });
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <StatusBar style="auto" />
      <View className="p-4">
        {/* Header */}
        <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          📚 BookLand
        </Text>

        {/* Search Bar */}
        <View className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-4">
          <TextInput
            className="px-4 py-3 text-gray-900 dark:text-white text-base"
            placeholder="Search books or authors..."
            placeholderTextColor="#9CA3AF"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        {/* Books List */}
        <FlatList
          data={filteredBooks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <BookCard 
              book={item} 
              onPress={() => handleBookPress(item)}
            />
          )}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="items-center py-8">
              <Text className="text-gray-500 dark:text-gray-400 text-base">
                No books found matching "{searchText}"
              </Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;