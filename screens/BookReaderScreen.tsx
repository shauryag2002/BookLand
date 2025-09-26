import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import useBookStore from '../store/bookStore';
import type { BookReaderScreenProps, Book } from '../types';

interface ReaderSettings {
  fontSize: number;
  backgroundColor: string;
  textColor: string;
}

interface WebViewMessage {
  type: 'navigation' | 'settings' | 'progress';
  action?: string;
  progress?: number;
}

const BookReaderScreen: React.FC<BookReaderScreenProps> = ({ route, navigation }) => {
  const { book, filePath } = route.params;
  const [readerSettings, setReaderSettings] = useState<ReaderSettings>({
    fontSize: 16,
    backgroundColor: '#ffffff',
    textColor: '#000000',
  });
  
  const { 
    updateReadingProgress, 
    readingProgress, 
    setCurrentlyReading 
  } = useBookStore();

  useEffect(() => {
    setCurrentlyReading(book);
  }, [book, setCurrentlyReading]);

  const handleReadingProgress = (progress: number): void => {
    updateReadingProgress(book.id, progress);
  };

  const handleBackPress = (): void => {
    Alert.alert(
      'Close Reader',
      'Are you sure you want to close the book?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Close', onPress: () => navigation.goBack() },
      ]
    );
  };

  const handleWebViewMessage = (event: any): void => {
    try {
      const message: WebViewMessage = JSON.parse(event.nativeEvent.data);
      if (message.type === 'progress' && typeof message.progress === 'number') {
        handleReadingProgress(message.progress);
      } else if (message.type === 'navigation') {
        // Handle page navigation
        console.log('Navigation:', message.action);
      } else if (message.type === 'settings') {
        // Handle settings toggle
        console.log('Toggle settings');
      }
    } catch (error) {
      console.warn('Error parsing WebView message:', error);
    }
  };

  // For PDF files
  if (filePath && filePath.endsWith('.pdf')) {
    return (
      <SafeAreaView className="flex-1 bg-gray-100 dark:bg-gray-900">
        <View className="flex-row justify-between items-center p-4 bg-white dark:bg-gray-800 shadow-sm">
          <TouchableOpacity 
            onPress={handleBackPress}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700"
          >
            <Text className="text-gray-800 dark:text-white font-medium">← Back</Text>
          </TouchableOpacity>
          
          <Text 
            className="text-lg font-semibold text-gray-800 dark:text-white flex-1 text-center mx-4"
            numberOfLines={1}
          >
            {book.title}
          </Text>
          
          <TouchableOpacity 
            onPress={() => {/* Open settings */}}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700"
          >
            <Text className="text-gray-800 dark:text-white">⚙️</Text>
          </TouchableOpacity>
        </View>

        <WebView
          source={{ uri: filePath }}
          style={{ flex: 1 }}
          onLoadProgress={({ nativeEvent }) => {
            handleReadingProgress(nativeEvent.progress);
          }}
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.warn('WebView error: ', nativeEvent);
            Alert.alert('Error', 'Unable to load the PDF file.');
          }}
        />
        
        <View className="p-4 bg-white dark:bg-gray-800">
          <View className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <View 
              className="bg-blue-500 h-2 rounded-full"
              style={{ 
                width: `${(readingProgress[book.id] || 0) * 100}%` 
              }}
            />
          </View>
          <Text className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">
            Progress: {Math.round((readingProgress[book.id] || 0) * 100)}%
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // For EPUB files - using a web-based EPUB reader
  const epubReaderHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>EPUB Reader</title>
      <style>
        body {
          margin: 0;
          padding: 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: ${readerSettings.fontSize}px;
          background-color: ${readerSettings.backgroundColor};
          color: ${readerSettings.textColor};
          line-height: 1.6;
        }
        .reader-container {
          max-width: 800px;
          margin: 0 auto;
        }
        .chapter {
          margin-bottom: 2rem;
        }
        .chapter h1, .chapter h2 {
          color: ${readerSettings.textColor};
          border-bottom: 1px solid #eee;
          padding-bottom: 0.5rem;
        }
        .controls {
          position: fixed;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0,0,0,0.8);
          padding: 10px 20px;
          border-radius: 25px;
          display: flex;
          gap: 15px;
        }
        .control-btn {
          background: #007AFF;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 15px;
          cursor: pointer;
        }
      </style>
    </head>
    <body>
      <div class="reader-container">
        <div class="chapter">
          <h1>${book.title}</h1>
          <p><strong>Author:</strong> ${book.author}</p>
          <hr>
          <p>This is a mock EPUB reader. In a real implementation, you would:</p>
          <ul>
            <li>Parse the EPUB file structure</li>
            <li>Extract and render HTML content</li>
            <li>Handle navigation between chapters</li>
            <li>Support text selection and highlighting</li>
            <li>Implement search functionality</li>
            <li>Save reading position</li>
          </ul>
          <p>For now, this shows how the reader interface would look.</p>
          
          <h2>Sample Chapter Content</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p>
          
          <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
          
          <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
        </div>
      </div>
      
      <div class="controls">
        <button class="control-btn" onclick="previousPage()">← Prev</button>
        <button class="control-btn" onclick="toggleSettings()">Settings</button>
        <button class="control-btn" onclick="nextPage()">Next →</button>
      </div>
      
      <script>
        function previousPage() {
          window.ReactNativeWebView?.postMessage(JSON.stringify({type: 'navigation', action: 'previous'}));
        }
        
        function nextPage() {
          window.ReactNativeWebView?.postMessage(JSON.stringify({type: 'navigation', action: 'next'}));
        }
        
        function toggleSettings() {
          window.ReactNativeWebView?.postMessage(JSON.stringify({type: 'settings', action: 'toggle'}));
        }
        
        // Simulate reading progress
        let scrollProgress = 0;
        window.addEventListener('scroll', () => {
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
          scrollProgress = scrollHeight > 0 ? scrollTop / scrollHeight : 0;
          
          window.ReactNativeWebView?.postMessage(JSON.stringify({
            type: 'progress', 
            progress: scrollProgress
          }));
        });
      </script>
    </body>
    </html>
  `;

  return (
    <SafeAreaView className="flex-1 bg-gray-100 dark:bg-gray-900">
      <View className="flex-row justify-between items-center p-4 bg-white dark:bg-gray-800 shadow-sm">
        <TouchableOpacity 
          onPress={handleBackPress}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700"
        >
          <Text className="text-gray-800 dark:text-white font-medium">← Back</Text>
        </TouchableOpacity>
        
        <Text 
          className="text-lg font-semibold text-gray-800 dark:text-white flex-1 text-center mx-4"
          numberOfLines={1}
        >
          {book.title}
        </Text>
        
        <TouchableOpacity 
          onPress={() => {/* Open settings */}}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700"
        >
          <Text className="text-gray-800 dark:text-white">⚙️</Text>
        </TouchableOpacity>
      </View>

      <WebView
        source={{ html: epubReaderHtml }}
        style={{ flex: 1 }}
        onMessage={handleWebViewMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />
    </SafeAreaView>
  );
};

export default BookReaderScreen;