import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, SafeAreaView, Alert, Modal } from 'react-native';
import useBookStore from '../store/bookStore';
import { getBookDetails } from '../services/openLibraryApi';
import { searchBooksAnnasArchive, getDownloadLinks, downloadBook } from '../services/annasArchiveApi';

const BookDetailScreen = ({ route, navigation }) => {
  const { book } = route.params;
  const [enrichedBook, setEnrichedBook] = useState(book);
  const [availableDownloads, setAvailableDownloads] = useState([]);
  const [isLoadingDownloads, setIsLoadingDownloads] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  
  const { 
    isDownloading, 
    downloadProgress, 
    addDownloadedBook, 
    setDownloading, 
    setDownloadProgress,
    downloadedBooks,
    favoriteBooks,
    toggleFavorite,
    isFavorite 
  } = useBookStore();

  const isBookDownloaded = downloadedBooks.some(downloadedBook => 
    downloadedBook.id === enrichedBook.id
  );

  const isBookFavorite = isFavorite(enrichedBook.id);

  useEffect(() => {
    // Enrich book data with Open Library details if we have the key
    const enrichBookData = async () => {
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

  const handleDownload = async () => {
    setIsLoadingDownloads(true);
    setShowDownloadModal(true);
    
    try {
      // Search for the book on Anna's Archive
      const searchResults = await searchBooksAnnasArchive(
        enrichedBook.title, 
        enrichedBook.author
      );
      
      if (searchResults.success && searchResults.results.length > 0) {
        setAvailableDownloads(searchResults.results);
      } else {
        Alert.alert('Not Found', 'This book is not available for download.');
        setShowDownloadModal(false);
      }
    } catch (error) {
      console.error('Error searching for downloads:', error);
      Alert.alert('Error', 'Failed to search for downloads. Please try again.');
      setShowDownloadModal(false);
    } finally {
      setIsLoadingDownloads(false);
    }
  };

  const handleDownloadFormat = async (downloadOption) => {
    setShowDownloadModal(false);
    setDownloading(true);
    setDownloadProgress(0);

    try {
      // Get download links
      const linksResult = await getDownloadLinks(downloadOption.md5, downloadOption.format);
      
      if (!linksResult.success || linksResult.downloadLinks.length === 0) {
        Alert.alert('Error', 'No download links available.');
        setDownloading(false);
        return;
      }

      // Start download with the first available link
      const downloadResult = await downloadBook(
        linksResult.downloadLinks[0].url,
        (progress) => {
          setDownloadProgress(progress);
        }
      );

      if (downloadResult.success) {
        // Add to downloaded books
        const downloadedBook = {
          ...enrichedBook,
          filePath: downloadResult.filePath,
          fileName: downloadResult.fileName,
          format: downloadOption.format,
          downloadDate: new Date().toISOString(),
        };
        
        await addDownloadedBook(downloadedBook);
        Alert.alert('Success', 'Book downloaded successfully!');
      } else {
        Alert.alert('Error', 'Download failed. Please try again.');
      }
    } catch (error) {
      console.error('Error downloading book:', error);
      Alert.alert('Error', 'Download failed. Please try again.');
    } finally {
      setDownloading(false);
      setDownloadProgress(0);
    }
  };

  const handleReadBook = () => {
    const downloadedBook = downloadedBooks.find(db => db.id === enrichedBook.id);
    if (downloadedBook) {
      navigation.navigate('BookReader', { 
        book: downloadedBook, 
        filePath: downloadedBook.filePath 
      });
    }
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
              {enrichedBook.publisher && (
                <View className="flex-row justify-between">
                  <Text className="text-gray-600 dark:text-gray-400">Publisher</Text>
                  <Text className="text-gray-900 dark:text-white font-medium">{enrichedBook.publisher}</Text>
                </View>
              )}
              {enrichedBook.pages && (
                <View className="flex-row justify-between">
                  <Text className="text-gray-600 dark:text-gray-400">Pages</Text>
                  <Text className="text-gray-900 dark:text-white font-medium">{enrichedBook.pages}</Text>
                </View>
              )}
              {enrichedBook.language && (
                <View className="flex-row justify-between">
                  <Text className="text-gray-600 dark:text-gray-400">Language</Text>
                  <Text className="text-gray-900 dark:text-white font-medium">{enrichedBook.language.toUpperCase()}</Text>
                </View>
              )}
              {enrichedBook.isbn && (
                <View className="flex-row justify-between">
                  <Text className="text-gray-600 dark:text-gray-400">ISBN</Text>
                  <Text className="text-gray-900 dark:text-white font-medium">{enrichedBook.isbn}</Text>
                </View>
              )}
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
            {isBookDownloaded ? (
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
              onPress={() => toggleFavorite(enrichedBook)}
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
        onRequestClose={() => setShowDownloadModal(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white dark:bg-gray-800 rounded-lg p-6 m-4 max-w-sm w-full">
            <Text className="text-xl font-bold text-gray-900 dark:text-white mb-4 text-center">
              Download Options
            </Text>
            
            {isLoadingDownloads ? (
              <View className="py-8">
                <Text className="text-center text-gray-600 dark:text-gray-400">
                  Searching for available formats...
                </Text>
              </View>
            ) : (
              <ScrollView className="max-h-64">
                {availableDownloads.map((download, index) => (
                  <TouchableOpacity
                    key={index}
                    className="border border-gray-200 dark:border-gray-600 rounded-lg p-3 mb-2"
                    onPress={() => handleDownloadFormat(download)}
                  >
                    <View className="flex-row justify-between items-center">
                      <View className="flex-1">
                        <Text className="font-semibold text-gray-900 dark:text-white">
                          {download.format}
                        </Text>
                        <Text className="text-sm text-gray-600 dark:text-gray-400">
                          Size: {download.size} • {download.language}
                        </Text>
                      </View>
                      <Text className="text-blue-600 dark:text-blue-400 font-medium">
                        Download
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
            
            <TouchableOpacity
              className="bg-gray-200 dark:bg-gray-700 rounded-lg py-3 px-4 mt-4"
              onPress={() => setShowDownloadModal(false)}
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