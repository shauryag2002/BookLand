import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, SafeAreaView, Alert, Modal } from 'react-native';
import useBookStore from '../store/bookStore';
import { getBookDetails } from '../services/openLibraryApi';
import { useAnnasArchive, useAnnasArchiveUI } from '../api/useAnnasArchive';
import type { BookDetailScreenProps, EnhancedBook, AnnasArchiveBook } from '../types';

const BookDetailScreen: React.FC<BookDetailScreenProps> = ({ route, navigation }) => {
  const { book } = route.params;
  const [enrichedBook, setEnrichedBook] = useState<EnhancedBook>(book);
  
  // Use the new Anna's Archive hooks
  const {
    searchResults,
    isSearching,
    isDownloading,
    downloadProgress,
    searchError,
    downloadError,
    search,
    download,
    clearErrors
  } = useAnnasArchive();
  
  const {
    showDownloadModal,
    selectedBook,
    openDownloadModal,
    closeDownloadModal
  } = useAnnasArchiveUI();
  
  const { 
    addDownloadedBook, 
    setIsDownloading,
    setDownloadProgress,
    downloadedBooks,
    addFavoriteBook,
    removeFavoriteBook,
    isFavorite,
    isBookDownloaded
  } = useBookStore();

  const isBookFavorite = isFavorite(enrichedBook.id);
  const bookDownloaded = isBookDownloaded(enrichedBook.id);

  useEffect(() => {
    // Enrich book data with Open Library details if we have the key
    const enrichBookData = async (): Promise<void> => {
      if (book.openLibraryKey) {
        try {
          const detailedBook = await getBookDetails(book.openLibraryKey);
          setEnrichedBook({ ...book, ...detailedBook });
        } catch (error) {
          console.warn('Could not enrich book data:', error);
        }
      }
    };

    enrichBookData();
  }, [book]);

  const handleDownload = async (): Promise<void> => {    
    try {
      // Clear any previous errors
      clearErrors();
      
      // Search for the book on Anna's Archive using the new backend API
      const result = await search(`${enrichedBook.title} ${enrichedBook.author}`.trim());
      
      if (result.success && searchResults.length > 0) {
        // Open the download modal with results
        openDownloadModal(searchResults[0]); // Use the first result or let user choose
      } else {
        Alert.alert(
          'Not Found', 
          result.error || 'This book is not available for download.',
          [{ text: 'OK', style: 'default' }]
        );
      }
    } catch (error) {
      console.error('Error searching for downloads:', error);
      Alert.alert(
        'Search Error', 
        'Failed to search for downloads. Please check your internet connection and try again.',
        [{ text: 'OK', style: 'default' }]
      );
    }
  };

  const handleDownloadFormat = async (downloadBookOption: AnnasArchiveBook): Promise<void> => {
    closeDownloadModal();
    
    // Update the global store's download state
    setIsDownloading(true);
    setDownloadProgress(0);

    try {
      // Start download with the new backend API
      const result = await download(downloadBookOption.md5, downloadBookOption.format);
      
      if (result.success && result.result) {
        // Create enhanced book object with download info
        const downloadedBook: EnhancedBook = {
          ...enrichedBook,
          md5: downloadBookOption.md5,
          format: downloadBookOption.format,
          size: downloadBookOption.size,
          filePath: result.result.filePath,
          fileName: result.result.fileName,
          downloadDate: new Date(),
        };

        // Add to downloaded books
        await addDownloadedBook(downloadedBook);
        
        Alert.alert(
          'Download Complete', 
          `Successfully downloaded "${downloadBookOption.title}"`,
          [
            { text: 'OK', style: 'default' },
            { text: 'Open Book', style: 'default', onPress: () => handleReadBook() }
          ]
        );
      } else {
        Alert.alert(
          'Download Failed', 
          result.error || 'The download could not be completed. Please try again.',
          [{ text: 'OK', style: 'default' }]
        );
      }
    } catch (error) {
      console.error('Error downloading book:', error);
      Alert.alert(
        'Download Error', 
        'An error occurred during download. Please check your internet connection and try again.',
        [{ text: 'OK', style: 'default' }]
      );
    } finally {
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  };

  const handleReadBook = (): void => {
    const downloadedBook = downloadedBooks.find(db => db.id === enrichedBook.id);
    if (downloadedBook) {
      navigation.navigate('BookReader', { 
        book: downloadedBook, 
        filePath: downloadedBook.filePath 
      });
    }
  };

  const handleToggleFavorite = async (): Promise<void> => {
    if (isBookFavorite) {
      await removeFavoriteBook(enrichedBook.id);
    } else {
      await addFavoriteBook(enrichedBook);
    }
  };

  // Format display values
  const getPublisher = (): string => {
    if (!enrichedBook.publisher) return 'Unknown Publisher';
    return Array.isArray(enrichedBook.publisher) 
      ? enrichedBook.publisher[0] 
      : enrichedBook.publisher;
  };

  const getLanguage = (): string => {
    if (!enrichedBook.language || enrichedBook.language.length === 0) return 'Unknown';
    const lang = Array.isArray(enrichedBook.language) 
      ? enrichedBook.language[0] 
      : enrichedBook.language;
    return lang.toUpperCase();
  };

  const getISBN = (): string => {
    if (!enrichedBook.isbn || enrichedBook.isbn.length === 0) return 'N/A';
    return Array.isArray(enrichedBook.isbn) 
      ? enrichedBook.isbn[0] 
      : enrichedBook.isbn;
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <ScrollView className="flex-1">
        <View className="p-6">
          {/* Book Image and Basic Info */}
          <View className="items-center mb-6">
            <Image 
              source={{ uri: enrichedBook.cover || enrichedBook.image }}
              className="w-48 h-72 rounded-lg shadow-lg"
              resizeMode="cover"
            />
            <Text className="text-2xl font-bold text-gray-900 dark:text-white mt-4 text-center">
              {enrichedBook.title}
            </Text>
            <Text className="text-lg text-gray-600 dark:text-gray-300 mt-1 text-center">
              by {enrichedBook.author}
            </Text>
            {enrichedBook.year && (
              <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Published: {enrichedBook.year}
              </Text>
            )}
          </View>

          {/* Description */}
          <View className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4">
            <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Description
            </Text>
            <Text className="text-base text-gray-700 dark:text-gray-300 leading-6">
              {enrichedBook.description}
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
                <Text className="text-gray-900 dark:text-white font-medium">{enrichedBook.author}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-600 dark:text-gray-400">Publisher</Text>
                <Text className="text-gray-900 dark:text-white font-medium">{getPublisher()}</Text>
              </View>
              {enrichedBook.pages && (
                <View className="flex-row justify-between">
                  <Text className="text-gray-600 dark:text-gray-400">Pages</Text>
                  <Text className="text-gray-900 dark:text-white font-medium">{enrichedBook.pages}</Text>
                </View>
              )}
              <View className="flex-row justify-between">
                <Text className="text-gray-600 dark:text-gray-400">Language</Text>
                <Text className="text-gray-900 dark:text-white font-medium">{getLanguage()}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-600 dark:text-gray-400">ISBN</Text>
                <Text className="text-gray-900 dark:text-white font-medium">{getISBN()}</Text>
              </View>
            </View>
          </View>

          {/* Subjects/Categories */}
          {enrichedBook.subjects && enrichedBook.subjects.length > 0 && (
            <View className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4">
              <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Categories
              </Text>
              <View className="flex-row flex-wrap">
                {enrichedBook.subjects.slice(0, 10).map((subject, index) => (
                  <View key={index} className="bg-blue-100 dark:bg-blue-900 rounded-full px-3 py-1 mr-2 mb-2">
                    <Text className="text-blue-800 dark:text-blue-200 text-sm">{subject}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Download Progress */}
          {isDownloading && (
            <View className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4">
              <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Downloading...
              </Text>
              <View className="bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-2">
                <View 
                  className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${downloadProgress * 100}%` }}
                />
              </View>
              <Text className="text-center text-sm text-gray-600 dark:text-gray-400">
                {Math.round(downloadProgress * 100)}% complete
              </Text>
            </View>
          )}

          {/* Action Buttons */}
          <View className="space-y-3 mt-4">
            {bookDownloaded ? (
              <TouchableOpacity 
                className="bg-green-600 dark:bg-green-500 rounded-lg py-4 px-6"
                onPress={handleReadBook}
              >
                <Text className="text-white text-center text-lg font-semibold">
                  📖 Read Book
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                className={`${isDownloading ? 'bg-gray-400' : 'bg-blue-600 dark:bg-blue-500'} rounded-lg py-4 px-6`}
                onPress={handleDownload}
                disabled={isDownloading}
              >
                <Text className="text-white text-center text-lg font-semibold">
                  {isDownloading ? 'Downloading...' : '📥 Download Book'}
                </Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              className={`${isBookFavorite ? 'bg-red-600 dark:bg-red-500' : 'bg-gray-200 dark:bg-gray-700'} rounded-lg py-4 px-6`}
              onPress={handleToggleFavorite}
            >
              <Text className={`${isBookFavorite ? 'text-white' : 'text-gray-900 dark:text-white'} text-center text-lg font-semibold`}>
                {isBookFavorite ? '❤️ Remove from Favorites' : '🤍 Add to Favorites'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Download Options Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showDownloadModal}
        onRequestClose={closeDownloadModal}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white dark:bg-gray-800 rounded-lg p-6 m-4 max-w-sm w-full">
            <Text className="text-xl font-bold text-gray-900 dark:text-white mb-4 text-center">
              Download Options
            </Text>
            
            {/* Show search error if any */}
            {searchError && (
              <View className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-4">
                <Text className="text-red-800 dark:text-red-200 text-sm text-center">
                  {searchError}
                </Text>
              </View>
            )}
            
            {isSearching ? (
              <View className="py-8">
                <Text className="text-center text-gray-600 dark:text-gray-400">
                  Searching for available formats...
                </Text>
              </View>
            ) : searchResults.length > 0 ? (
              <ScrollView className="max-h-64">
                {searchResults.map((download, index) => (
                  <TouchableOpacity
                    key={`${download.md5}-${index}`}
                    className="border border-gray-200 dark:border-gray-600 rounded-lg p-3 mb-2"
                    onPress={() => handleDownloadFormat(download)}
                  >
                    <View className="flex-row justify-between items-center">
                      <View className="flex-1">
                        <Text className="font-semibold text-gray-900 dark:text-white">
                          {download.format.toUpperCase()}
                        </Text>
                        <Text className="text-sm text-gray-600 dark:text-gray-400">
                          Size: {download.size} • {download.language}
                        </Text>
                        {download.quality && (
                          <Text className="text-xs text-gray-500 dark:text-gray-500">
                            Quality: {download.quality}
                          </Text>
                        )}
                      </View>
                      <Text className="text-blue-600 dark:text-blue-400 font-medium">
                        Download
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            ) : (
              <View className="py-8">
                <Text className="text-center text-gray-600 dark:text-gray-400">
                  No download options found for this book.
                </Text>
              </View>
            )}
            
            {/* Show download error if any */}
            {downloadError && (
              <View className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-4">
                <Text className="text-red-800 dark:text-red-200 text-sm text-center">
                  {downloadError}
                </Text>
              </View>
            )}
            
            <TouchableOpacity
              className="bg-gray-200 dark:bg-gray-700 rounded-lg py-3 px-4 mt-4"
              onPress={closeDownloadModal}
            >
              <Text className="text-gray-800 dark:text-white text-center font-medium">
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default BookDetailScreen;