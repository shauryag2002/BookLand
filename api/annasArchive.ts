// Anna's Archive Backend API Service
// This service handles communication with the backend API that scrapes Anna's Archive
import type { 
  AnnasArchiveBook, 
  DownloadResult, 
  ApiResponse, 
  BackendApiFilters 
} from '../types';

// Configuration
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

// Response interfaces for backend API
export interface AnnasArchiveSearchResponse {
  success: boolean;
  data?: {
    books: AnnasArchiveBook[];
    totalResults: number;
    hasMore: boolean;
  };
  error?: string;
  message?: string;
}

export interface AnnasArchiveDownloadResponse {
  success: boolean;
  data?: {
    downloadUrl: string;
    fileName: string;
    fileSize: string;
    format: string;
  };
  error?: string;
  message?: string;
}

// Loading states interface
export interface LoadingStates {
  search: boolean;
  download: boolean;
  downloadProgress: number;
}

// Error types
export type ApiErrorType = 'network' | 'server' | 'validation' | 'unknown';

export interface ApiError {
  type: ApiErrorType;
  message: string;
  details?: any;
}

// Search books using backend Anna's Archive API
export const searchBooks = async (
  query: string, 
  filters: BackendApiFilters = {}
): Promise<AnnasArchiveSearchResponse> => {
  try {
    if (!query.trim()) {
      return {
        success: false,
        error: 'Search query is required',
        message: 'Please enter a search term'
      };
    }

    const searchParams = new URLSearchParams();
    searchParams.append('query', query.trim());
    
    // Add filters if provided
    if (filters.format && filters.format.length > 0) {
      searchParams.append('formats', filters.format.join(','));
    }
    if (filters.language && filters.language.length > 0) {
      searchParams.append('languages', filters.language.join(','));
    }
    if (filters.filesize?.min) {
      searchParams.append('minSize', filters.filesize.min.toString());
    }
    if (filters.filesize?.max) {
      searchParams.append('maxSize', filters.filesize.max.toString());
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    const response = await fetch(`${API_BASE_URL}/api/annas/search?${searchParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Validate response structure
    if (!data || typeof data.success !== 'boolean') {
      throw new Error('Invalid response format from server');
    }

    return data;

  } catch (error) {
    console.error('Error searching Anna\'s Archive:', error);
    
    let apiError: ApiError;
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      apiError = {
        type: 'network',
        message: 'Network error - check your internet connection',
        details: error.message
      };
    } else if (error instanceof Error) {
      apiError = {
        type: error.message.includes('HTTP') ? 'server' : 'unknown',
        message: error.message,
        details: error
      };
    } else {
      apiError = {
        type: 'unknown',
        message: 'An unexpected error occurred',
        details: error
      };
    }

    return {
      success: false,
      error: apiError.message,
      message: getUserFriendlyErrorMessage(apiError)
    };
  }
};

// Download a book using backend API
export const downloadBook = async (
  md5: string,
  format: string = 'pdf',
  onProgress?: (progress: number) => void
): Promise<DownloadResult> => {
  try {
    if (!md5 || !format) {
      return {
        success: false,
        error: 'MD5 hash and format are required for download'
      };
    }

    // First, get the download URL from backend
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

    const response = await fetch(`${API_BASE_URL}/api/annas/download/${md5}/${format}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to get download URL: ${response.statusText}`);
    }

    const downloadInfo: AnnasArchiveDownloadResponse = await response.json();

    if (!downloadInfo.success || !downloadInfo.data?.downloadUrl) {
      throw new Error(downloadInfo.error || 'Failed to get download URL');
    }

    // Now download the actual file
    const fileResponse = await fetch(downloadInfo.data.downloadUrl, {
      method: 'GET',
    });

    if (!fileResponse.ok) {
      throw new Error(`Download failed: ${fileResponse.statusText}`);
    }

    // Handle progress tracking if callback provided
    if (onProgress && fileResponse.body) {
      const reader = fileResponse.body.getReader();
      const contentLength = parseInt(fileResponse.headers.get('content-length') || '0');
      let receivedLength = 0;

      const chunks: Uint8Array[] = [];
      
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;
        
        chunks.push(value);
        receivedLength += value.length;
        
        if (contentLength > 0) {
          const progress = receivedLength / contentLength;
          onProgress(Math.min(progress, 1));
        }
      }

      // Combine chunks (in a real implementation, you'd save this to device storage)
      const combinedChunks = new Uint8Array(receivedLength);
      let position = 0;
      for (const chunk of chunks) {
        combinedChunks.set(chunk, position);
        position += chunk.length;
      }
    }

    // In a real implementation, you would save the file to device storage
    // For now, return mock file path
    const fileName = downloadInfo.data.fileName || `book_${Date.now()}.${format}`;
    const mockFilePath = `file:///downloads/${fileName}`;

    return {
      success: true,
      filePath: mockFilePath,
      fileName: fileName
    };

  } catch (error) {
    console.error('Error downloading book:', error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Download failed'
    };
  }
};

// Get book details/metadata from backend
export const getBookDetails = async (md5: string): Promise<ApiResponse<AnnasArchiveBook>> => {
  try {
    if (!md5) {
      return {
        success: false,
        error: 'MD5 hash is required'
      };
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch(`${API_BASE_URL}/api/annas/details/${md5}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Error getting book details:', error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get book details'
    };
  }
};

// Utility function to get user-friendly error messages
export const getUserFriendlyErrorMessage = (error: ApiError): string => {
  switch (error.type) {
    case 'network':
      return 'Please check your internet connection and try again.';
    case 'server':
      return 'The server is experiencing issues. Please try again later.';
    case 'validation':
      return error.message;
    case 'unknown':
    default:
      return 'Something went wrong. Please try again.';
  }
};

// Utility function to validate search query
export const validateSearchQuery = (query: string): { isValid: boolean; message?: string } => {
  if (!query || !query.trim()) {
    return { isValid: false, message: 'Search query cannot be empty' };
  }
  
  if (query.trim().length < 2) {
    return { isValid: false, message: 'Search query must be at least 2 characters long' };
  }
  
  if (query.length > 100) {
    return { isValid: false, message: 'Search query is too long (max 100 characters)' };
  }
  
  return { isValid: true };
};

// Utility function to format file size
export const formatFileSize = (sizeString: string): string => {
  // Handle different size formats that might come from the API
  const normalizedSize = sizeString.toLowerCase();
  
  if (normalizedSize.includes('mb') || normalizedSize.includes('gb') || normalizedSize.includes('kb')) {
    return sizeString;
  }
  
  // If it's just a number, assume it's bytes and convert
  const bytes = parseInt(sizeString);
  if (!isNaN(bytes)) {
    if (bytes >= 1024 * 1024 * 1024) {
      return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
    } else if (bytes >= 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    } else if (bytes >= 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    } else {
      return `${bytes} bytes`;
    }
  }
  
  return sizeString;
};

// Available formats for filtering
export const SUPPORTED_FORMATS = ['pdf', 'epub', 'mobi', 'txt', 'doc', 'docx'] as const;
export type SupportedFormat = typeof SUPPORTED_FORMATS[number];

// Available languages for filtering  
export const SUPPORTED_LANGUAGES = [
  'en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'zh', 'ja', 'ko'
] as const;
export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];