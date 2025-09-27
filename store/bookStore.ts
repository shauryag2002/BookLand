import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { BookStore, Book } from '../types';

// Book store for managing application state
const useBookStore = create<BookStore>((set, get) => ({
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
  
  // Favorite books
  favoriteBooks: [],
  
  // Book reader state
  currentlyReading: null,
  readingProgress: {},
  
  // UI state
  isLoading: false,
  error: null,

  // Actions
  setBooks: (books: Book[]) => set({ books, filteredBooks: books }),
  
  setSearchQuery: (query: string) => {
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
  
  setCurrentBook: (book: Book | null) => set({ currentBook: book }),
  
  setLoading: (isLoading: boolean) => set({ isLoading }),
  setBookLoading: (isLoadingBook: boolean) => set({ isLoadingBook }),
  
  setError: (error: string | null) => set({ error }),
  
  // Download management
  addDownloadedBook: async (book: Book) => {
    const { downloadedBooks } = get();
    const updatedBooks = [...downloadedBooks, book];
    set({ downloadedBooks: updatedBooks });
    
    try {
      await AsyncStorage.setItem('downloadedBooks', JSON.stringify(updatedBooks));
    } catch (error) {
      console.error('Error saving downloaded books:', error);
    }
  },
  
  removeDownloadedBook: async (bookId: string) => {
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
        const parsed: Book[] = JSON.parse(stored);
        set({ downloadedBooks: parsed });
      }
    } catch (error) {
      console.error('Error loading downloaded books:', error);
    }
  },
  
  setDownloadProgress: (progress: number) => set({ downloadProgress: progress }),
  setIsDownloading: (isDownloading: boolean) => set({ isDownloading }),
  
  // Reading progress
  setCurrentlyReading: (book: Book | null) => set({ currentlyReading: book }),
  
  updateReadingProgress: async (bookId: string, progress: number) => {
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
        const parsed: Record<string, number> = JSON.parse(stored);
        set({ readingProgress: parsed });
      }
    } catch (error) {
      console.error('Error loading reading progress:', error);
    }
  },

  // Favorites management
  addFavoriteBook: async (book: Book) => {
    const { favoriteBooks } = get();
    const isAlreadyFavorite = favoriteBooks.some(fav => fav.id === book.id);
    if (!isAlreadyFavorite) {
      const updatedFavorites = [...favoriteBooks, book];
      set({ favoriteBooks: updatedFavorites });
      
      try {
        await AsyncStorage.setItem('favoriteBooks', JSON.stringify(updatedFavorites));
      } catch (error) {
        console.error('Error saving favorite book:', error);
      }
    }
  },

  removeFavoriteBook: async (bookId: string) => {
    const { favoriteBooks } = get();
    const updatedFavorites = favoriteBooks.filter(book => book.id !== bookId);
    set({ favoriteBooks: updatedFavorites });
    
    try {
      await AsyncStorage.setItem('favoriteBooks', JSON.stringify(updatedFavorites));
    } catch (error) {
      console.error('Error removing favorite book:', error);
    }
  },

  loadFavoriteBooks: async () => {
    try {
      const stored = await AsyncStorage.getItem('favoriteBooks');
      if (stored) {
        const parsed: Book[] = JSON.parse(stored);
        set({ favoriteBooks: parsed });
      }
    } catch (error) {
      console.error('Error loading favorite books:', error);
    }
  },

  isFavorite: (bookId: string): boolean => {
    const { favoriteBooks } = get();
    return favoriteBooks.some(book => book.id === bookId);
  },

  // Utility methods
  isBookDownloaded: (bookId: string): boolean => {
    const { downloadedBooks } = get();
    return downloadedBooks.some(book => book.id === bookId);
  },

  getBookFilePath: (bookId: string): string | undefined => {
    const { downloadedBooks } = get();
    const book = downloadedBooks.find(book => book.id === bookId);
    return book?.filePath;
  },
}));

export default useBookStore;