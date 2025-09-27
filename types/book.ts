// Core Book data model
export interface Book {
  id: string;
  title: string;
  author: string;
  description?: string;
  year?: number | null;
  pages?: number | null;
  cover?: string;
  image?: string;
  price?: string;
  isbn?: string[];
  language?: string[];
  subjects?: string[];
  publisher?: string[];
  openLibraryKey?: string;
  downloadLinks?: string[];
  filePath?: string;
  downloadDate?: Date;
  lastReadDate?: Date;
  readingProgress?: number;
  isFavorite?: boolean;
}

// Enhanced book data with additional fields
export interface EnhancedBook extends Book {
  format?: string;
  size?: string;
  md5?: string;
  fileName?: string;
}

// Search result from Open Library API
export interface OpenLibrarySearchResult {
  docs: OpenLibraryBook[];
  numFound: number;
  start: number;
  numFoundExact?: boolean;
}

// Open Library book structure
export interface OpenLibraryBook {
  key?: string;
  title?: string;
  author_name?: string[];
  first_publish_year?: number;
  number_of_pages_median?: number;
  publisher?: string[];
  language?: string[];
  subject?: string[];
  cover_i?: number;
  isbn?: string[];
}

// Open Library trending/subjects response
export interface OpenLibrarySubjectResponse {
  works?: OpenLibraryWork[];
  key?: string;
  name?: string;
  subject_type?: string;
  work_count?: number;
}

export interface OpenLibraryWork {
  key?: string;
  title?: string;
  authors?: Array<{
    name?: string;
    key?: string;
  }>;
  first_publish_year?: number;
  cover_id?: number;
}

// Anna's Archive search/download types
export interface AnnasArchiveBook {
  title: string;
  author: string;
  format: string;
  size: string;
  language: string;
  md5: string;
  downloadLinks: string[];
  // Additional fields that may come from backend
  isbn?: string;
  publisher?: string;
  year?: number;
  pages?: number;
  description?: string;
  coverUrl?: string;
  // Backend-specific fields
  mirrors?: string[];
  quality?: 'high' | 'medium' | 'low';
  uploadDate?: string;
  fileExtension?: string;
}

export interface DownloadResult {
  success: boolean;
  filePath?: string;
  fileName?: string;
  error?: string;
}

export interface DownloadProgress {
  progress: number;
  bookId: string;
}

// API response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface BackendApiFilters {
  format?: string[];
  language?: string[];
  filesize?: {
    min?: number;
    max?: number;
  };
  // Additional filter options
  quality?: ('high' | 'medium' | 'low')[];
  yearRange?: {
    from?: number;
    to?: number;
  };
  hasPreview?: boolean;
  sortBy?: 'relevance' | 'date' | 'size' | 'title' | 'author';
  sortOrder?: 'asc' | 'desc';
}