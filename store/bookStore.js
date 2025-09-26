import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Book store for managing application state
const useBookStore = create((set, get) => ({
  // Books state
  books: [],
  filteredBooks: [],
  searchQuery: '',
  
  // Current book details
  currentBook: null,
  isLoadingBook: false,
  
  // Downloaded books
  downloadedBooks: [],
  isDownloading: false,
  downloadProgress: 0,
  
  // Book reader state
  currentlyReading: null,
  readingProgress: {},
  
  // UI state
  isLoading: false,
  error: null,

  // Actions
  setBooks: (books) => set({ books, filteredBooks: books }),
  
  setSearchQuery: (query) => {
    set({ searchQuery: query });
    const { books } = get();
    if (query.trim() === '') {
      set({ filteredBooks: books });
    } else {
      const filtered = books.filter(book =>
        book.title.toLowerCase().includes(query.toLowerCase()) ||
        book.author.toLowerCase().includes(query.toLowerCase())
      );
      set({ filteredBooks: filtered });
    }
  },
  
  setCurrentBook: (book) => set({ currentBook: book }),
  
  setLoading: (isLoading) => set({ isLoading }),
  setBookLoading: (isLoadingBook) => set({ isLoadingBook }),
  
  setError: (error) => set({ error }),
  
  // Download management
  addDownloadedBook: async (book) => {
    const { downloadedBooks } = get();
    const updatedBooks = [...downloadedBooks, book];
    set({ downloadedBooks: updatedBooks });
    
    try {
      await AsyncStorage.setItem('downloadedBooks', JSON.stringify(updatedBooks));
    } catch (error) {
      console.error('Error saving downloaded books:', error);
    }
  },
  
  removeDownloadedBook: async (bookId) => {
    const { downloadedBooks } = get();
    const updatedBooks = downloadedBooks.filter(book => book.id !== bookId);
    set({ downloadedBooks: updatedBooks });
    
    try {
      await AsyncStorage.setItem('downloadedBooks', JSON.stringify(updatedBooks));
    } catch (error) {
      console.error('Error removing downloaded book:', error);
    }
  },
  
  loadDownloadedBooks: async () => {
    try {
      const stored = await AsyncStorage.getItem('downloadedBooks');
      if (stored) {
        set({ downloadedBooks: JSON.parse(stored) });
      }
    } catch (error) {
      console.error('Error loading downloaded books:', error);
    }
  },
  
  setDownloadProgress: (progress) => set({ downloadProgress: progress }),
  setDownloading: (isDownloading) => set({ isDownloading }),
  
  // Reading progress
  setCurrentlyReading: (book) => set({ currentlyReading: book }),
  
  updateReadingProgress: async (bookId, progress) => {
    const { readingProgress } = get();
    const updatedProgress = { ...readingProgress, [bookId]: progress };
    set({ readingProgress: updatedProgress });
    
    try {
      await AsyncStorage.setItem('readingProgress', JSON.stringify(updatedProgress));
    } catch (error) {
      console.error('Error saving reading progress:', error);
    }
  },
  
  loadReadingProgress: async () => {
    try {
      const stored = await AsyncStorage.getItem('readingProgress');
      if (stored) {
        set({ readingProgress: JSON.parse(stored) });
      }
    } catch (error) {
      console.error('Error loading reading progress:', error);
    }
  },
}));

export default useBookStore;