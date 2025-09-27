// Example component demonstrating Anna's Archive backend integration
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, SafeAreaView } from 'react-native';
import { useAnnasArchive } from '../api/useAnnasArchive';
import { formatFileSize, SUPPORTED_FORMATS } from '../api/annasArchive';
import type { AnnasArchiveBook } from '../types';

const AnnasArchiveSearchDemo: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFormat, setSelectedFormat] = useState<string>('all');
  
  const {
    searchResults,
    isSearching,
    isDownloading,
    downloadProgress,
    searchError,
    downloadError,
    totalResults,
    hasResults,
    search,
    download,
    clearSearch,
    clearErrors
  } = useAnnasArchive();

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      Alert.alert('Invalid Query', 'Please enter a search term');
      return;
    }

    const filters = selectedFormat !== 'all' ? { format: [selectedFormat] } : {};
    await search(searchQuery, filters);
  };

  const handleDownloadBook = async (book: AnnasArchiveBook) => {
    const result = await download(book.md5, book.format);
    
    if (result.success) {
      Alert.alert(
        'Download Complete',
        `Successfully downloaded "${book.title}"`,
        [{ text: 'OK', style: 'default' }]
      );
    }
  };

  const renderBookItem = (book: AnnasArchiveBook, index: number) => (
    <View 
      key={`${book.md5}-${index}`}
      className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-3 border border-gray-200 dark:border-gray-700"
    >
      <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
        {book.title}
      </Text>
      <Text className="text-sm text-gray-600 dark:text-gray-400 mb-2">
        by {book.author}
      </Text>
      
      <View className="flex-row flex-wrap gap-2 mb-3">
        <View className="bg-blue-100 dark:bg-blue-900/20 px-2 py-1 rounded">
          <Text className="text-xs text-blue-800 dark:text-blue-200">
            {book.format.toUpperCase()}
          </Text>
        </View>
        <View className="bg-green-100 dark:bg-green-900/20 px-2 py-1 rounded">
          <Text className="text-xs text-green-800 dark:text-green-200">
            {formatFileSize(book.size)}
          </Text>
        </View>
        <View className="bg-purple-100 dark:bg-purple-900/20 px-2 py-1 rounded">
          <Text className="text-xs text-purple-800 dark:text-purple-200">
            {book.language}
          </Text>
        </View>
        {book.quality && (
          <View className="bg-yellow-100 dark:bg-yellow-900/20 px-2 py-1 rounded">
            <Text className="text-xs text-yellow-800 dark:text-yellow-200">
              {book.quality} quality
            </Text>
          </View>
        )}
      </View>

      {book.description && (
        <Text className="text-sm text-gray-700 dark:text-gray-300 mb-3" numberOfLines={2}>
          {book.description}
        </Text>
      )}

      <TouchableOpacity
        className="bg-blue-600 dark:bg-blue-500 rounded-lg py-2 px-4"
        onPress={() => handleDownloadBook(book)}
        disabled={isDownloading}
      >
        <Text className="text-white text-center font-medium">
          {isDownloading ? 'Downloading...' : 'Download'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <View className="flex-1 p-4">
        <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          Anna's Archive Search
        </Text>

        {/* Search Input */}
        <View className="mb-4">
          <TextInput
            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white"
            placeholder="Search for books (e.g., 'Python programming')"
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            editable={!isSearching}
          />
        </View>

        {/* Format Filter */}
        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Format Filter:
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-2">
              <TouchableOpacity
                className={`px-3 py-2 rounded-lg ${
                  selectedFormat === 'all' 
                    ? 'bg-blue-600' 
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}
                onPress={() => setSelectedFormat('all')}
              >
                <Text className={`text-sm font-medium ${
                  selectedFormat === 'all'
                    ? 'text-white'
                    : 'text-gray-700 dark:text-gray-300'
                }`}>
                  All
                </Text>
              </TouchableOpacity>
              {SUPPORTED_FORMATS.map((format) => (
                <TouchableOpacity
                  key={format}
                  className={`px-3 py-2 rounded-lg ${
                    selectedFormat === format 
                      ? 'bg-blue-600' 
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                  onPress={() => setSelectedFormat(format)}
                >
                  <Text className={`text-sm font-medium ${
                    selectedFormat === format
                      ? 'text-white'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}>
                    {format.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Search Button */}
        <TouchableOpacity
          className={`rounded-lg py-4 px-6 mb-4 ${
            isSearching 
              ? 'bg-gray-400' 
              : 'bg-blue-600 dark:bg-blue-500'
          }`}
          onPress={handleSearch}
          disabled={isSearching}
        >
          <Text className="text-white text-center text-lg font-semibold">
            {isSearching ? 'Searching...' : 'Search Books'}
          </Text>
        </TouchableOpacity>

        {/* Error Messages */}
        {searchError && (
          <View className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-4">
            <Text className="text-red-800 dark:text-red-200 text-sm">
              Search Error: {searchError}
            </Text>
            <TouchableOpacity
              className="mt-2"
              onPress={clearErrors}
            >
              <Text className="text-red-600 dark:text-red-400 text-sm font-medium">
                Dismiss
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {downloadError && (
          <View className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-4">
            <Text className="text-red-800 dark:text-red-200 text-sm">
              Download Error: {downloadError}
            </Text>
          </View>
        )}

        {/* Download Progress */}
        {isDownloading && (
          <View className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-4">
            <Text className="text-blue-800 dark:text-blue-200 text-sm font-medium mb-2">
              Downloading... {Math.round(downloadProgress * 100)}%
            </Text>
            <View className="bg-blue-200 dark:bg-blue-700 rounded-full h-2">
              <View 
                className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${downloadProgress * 100}%` }}
              />
            </View>
          </View>
        )}

        {/* Results */}
        {hasResults && (
          <View className="mb-4">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-lg font-semibold text-gray-900 dark:text-white">
                Results ({totalResults})
              </Text>
              <TouchableOpacity
                onPress={clearSearch}
                className="bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded"
              >
                <Text className="text-gray-700 dark:text-gray-300 text-sm">
                  Clear
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Results List */}
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {searchResults.map((book, index) => renderBookItem(book, index))}
          
          {!isSearching && !hasResults && searchQuery && (
            <View className="flex-1 justify-center items-center py-12">
              <Text className="text-gray-500 dark:text-gray-400 text-center">
                No books found for "{searchQuery}"
                {selectedFormat !== 'all' && ` in ${selectedFormat.toUpperCase()} format`}.
                Try a different search term or format.
              </Text>
            </View>
          )}
          
          {!searchQuery && !hasResults && (
            <View className="flex-1 justify-center items-center py-12">
              <Text className="text-gray-500 dark:text-gray-400 text-center">
                Enter a search term to find books from Anna's Archive.
                {'\n\n'}
                This demo shows integration with the backend API at:
                {'\n'}
                <Text className="text-blue-600 dark:text-blue-400 font-mono text-sm">
                  /api/annas/search?query=...
                </Text>
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default AnnasArchiveSearchDemo;