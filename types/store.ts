import type { Book } from './book';

// Store state interface
export interface BookStoreState {
  // Books state
  books: Book[];
  filteredBooks: Book[];
  searchQuery: string;
  
  // Current book details
  currentBook: Book | null;
  isLoadingBook: boolean;
  
  // Downloaded books
  downloadedBooks: Book[];
  isDownloading: boolean;
  downloadProgress: number;
  
  // Favorite books
  favoriteBooks: Book[];
  
  // Book reader state
  currentlyReading: Book | null;
  readingProgress: Record<string, number>; // bookId -> progress (0-1)
  
  // UI state
  isLoading: boolean;
  error: string | null;
}

// Store actions interface
export interface BookStoreActions {
  // Book management
  setBooks: (books: Book[]) => void;
  setSearchQuery: (query: string) => void;
  setCurrentBook: (book: Book | null) => void;
  
  // Loading states
  setLoading: (isLoading: boolean) => void;
  setBookLoading: (isLoadingBook: boolean) => void;
  setError: (error: string | null) => void;
  
  // Download management
  addDownloadedBook: (book: Book) => Promise<void>;
  removeDownloadedBook: (bookId: string) => Promise<void>;
  loadDownloadedBooks: () => Promise<void>;
  setDownloadProgress: (progress: number) => void;
  setIsDownloading: (isDownloading: boolean) => void;
  
  // Favorites management
  addFavoriteBook: (book: Book) => Promise<void>;
  removeFavoriteBook: (bookId: string) => Promise<void>;
  loadFavoriteBooks: () => Promise<void>;
  isFavorite: (bookId: string) => boolean;
  
  // Reading progress
  updateReadingProgress: (bookId: string, progress: number) => Promise<void>;
  loadReadingProgress: () => Promise<void>;
  setCurrentlyReading: (book: Book | null) => void;
  
  // Utility actions
  isBookDownloaded: (bookId: string) => boolean;
  getBookFilePath: (bookId: string) => string | undefined;
}

// Complete store interface (state + actions)
export interface BookStore extends BookStoreState, BookStoreActions {}

// AsyncStorage keys
export const STORAGE_KEYS = {
  DOWNLOADED_BOOKS: 'downloadedBooks',
  FAVORITE_BOOKS: 'favoriteBooks', 
  READING_PROGRESS: 'readingProgress',
  CURRENTLY_READING: 'currentlyReading'
} as const;

export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];