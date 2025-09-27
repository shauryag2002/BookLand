// React hook for Anna's Archive API with loading and error state management
import { useState, useCallback } from 'react';
import { 
  searchBooks, 
  downloadBook, 
  getBookDetails,
  validateSearchQuery,
  type LoadingStates,
  type ApiError,
  type AnnasArchiveSearchResponse,
  type AnnasArchiveDownloadResponse 
} from './annasArchive';
import type { AnnasArchiveBook, BackendApiFilters, DownloadResult } from '../types';

// Hook state interface
interface UseAnnasArchiveState {
  // Data
  searchResults: AnnasArchiveBook[];
  currentBook: AnnasArchiveBook | null;
  
  // Loading states
  isSearching: boolean;
  isDownloading: boolean;
  isLoadingDetails: boolean;
  downloadProgress: number;
  
  // Error states
  searchError: string | null;
  downloadError: string | null;
  detailsError: string | null;
  
  // Metadata
  totalResults: number;
  hasMore: boolean;
  lastSearchQuery: string;
}

// Initial state
const initialState: UseAnnasArchiveState = {
  searchResults: [],
  currentBook: null,
  isSearching: false,
  isDownloading: false,
  isLoadingDetails: false,
  downloadProgress: 0,
  searchError: null,
  downloadError: null,
  detailsError: null,
  totalResults: 0,
  hasMore: false,
  lastSearchQuery: '',
};

// Custom hook for Anna's Archive operations
export const useAnnasArchive = () => {
  const [state, setState] = useState<UseAnnasArchiveState>(initialState);

  // Search books with loading and error handling
  const search = useCallback(async (
    query: string, 
    filters: BackendApiFilters = {}
  ): Promise<{ success: boolean; error?: string }> => {
    
    // Validate query
    const validation = validateSearchQuery(query);
    if (!validation.isValid) {
      setState(prev => ({
        ...prev,
        searchError: validation.message || 'Invalid search query'
      }));
      return { success: false, error: validation.message };
    }

    // Clear previous errors and start loading
    setState(prev => ({
      ...prev,
      isSearching: true,
      searchError: null,
      searchResults: [],
      totalResults: 0,
      hasMore: false,
      lastSearchQuery: query
    }));

    try {
      const response = await searchBooks(query, filters);
      
      if (response.success && response.data) {
        setState(prev => ({
          ...prev,
          isSearching: false,
          searchResults: response.data?.books || [],
          totalResults: response.data?.totalResults || 0,
          hasMore: response.data?.hasMore || false
        }));
        return { success: true };
      } else {
        setState(prev => ({
          ...prev,
          isSearching: false,
          searchError: response.error || response.message || 'Search failed'
        }));
        return { success: false, error: response.error };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setState(prev => ({
        ...prev,
        isSearching: false,
        searchError: errorMessage
      }));
      return { success: false, error: errorMessage };
    }
  }, []);

  // Download book with progress tracking
  const download = useCallback(async (
    md5: string,
    format: string = 'pdf'
  ): Promise<{ success: boolean; result?: DownloadResult; error?: string }> => {
    
    setState(prev => ({
      ...prev,
      isDownloading: true,
      downloadError: null,
      downloadProgress: 0
    }));

    try {
      const result = await downloadBook(md5, format, (progress) => {
        setState(prev => ({
          ...prev,
          downloadProgress: progress
        }));
      });

      setState(prev => ({
        ...prev,
        isDownloading: false,
        downloadProgress: result.success ? 1 : 0,
        downloadError: result.success ? null : result.error || 'Download failed'
      }));

      return { success: result.success, result, error: result.error };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Download failed';
      setState(prev => ({
        ...prev,
        isDownloading: false,
        downloadProgress: 0,
        downloadError: errorMessage
      }));
      return { success: false, error: errorMessage };
    }
  }, []);

  // Get book details
  const fetchBookDetails = useCallback(async (
    md5: string
  ): Promise<{ success: boolean; book?: AnnasArchiveBook; error?: string }> => {
    
    setState(prev => ({
      ...prev,
      isLoadingDetails: true,
      detailsError: null,
      currentBook: null
    }));

    try {
      const response = await getBookDetails(md5);
      
      if (response.success && response.data) {
        setState(prev => ({
          ...prev,
          isLoadingDetails: false,
          currentBook: response.data
        }));
        return { success: true, book: response.data };
      } else {
        setState(prev => ({
          ...prev,
          isLoadingDetails: false,
          detailsError: response.error || 'Failed to fetch book details'
        }));
        return { success: false, error: response.error };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch details';
      setState(prev => ({
        ...prev,
        isLoadingDetails: false,
        detailsError: errorMessage
      }));
      return { success: false, error: errorMessage };
    }
  }, []);

  // Clear search results
  const clearSearch = useCallback(() => {
    setState(prev => ({
      ...prev,
      searchResults: [],
      searchError: null,
      totalResults: 0,
      hasMore: false,
      lastSearchQuery: ''
    }));
  }, []);

  // Clear download state
  const clearDownload = useCallback(() => {
    setState(prev => ({
      ...prev,
      downloadError: null,
      downloadProgress: 0
    }));
  }, []);

  // Clear all errors
  const clearErrors = useCallback(() => {
    setState(prev => ({
      ...prev,
      searchError: null,
      downloadError: null,
      detailsError: null
    }));
  }, []);

  // Reset all state
  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  return {
    // State
    ...state,
    
    // Actions
    search,
    download,
    fetchBookDetails,
    clearSearch,
    clearDownload,
    clearErrors,
    reset,
    
    // Computed values
    hasResults: state.searchResults.length > 0,
    isLoading: state.isSearching || state.isDownloading || state.isLoadingDetails,
    hasAnyError: !!(state.searchError || state.downloadError || state.detailsError)
  };
};

// Helper hook for UI state management
export const useAnnasArchiveUI = () => {
  const [uiState, setUIState] = useState({
    showFilters: false,
    selectedFormat: 'all',
    selectedLanguage: 'all',
    showDownloadModal: false,
    selectedBook: null as AnnasArchiveBook | null,
  });

  const toggleFilters = useCallback(() => {
    setUIState(prev => ({ ...prev, showFilters: !prev.showFilters }));
  }, []);

  const setSelectedFormat = useCallback((format: string) => {
    setUIState(prev => ({ ...prev, selectedFormat: format }));
  }, []);

  const setSelectedLanguage = useCallback((language: string) => {
    setUIState(prev => ({ ...prev, selectedLanguage: language }));
  }, []);

  const openDownloadModal = useCallback((book: AnnasArchiveBook) => {
    setUIState(prev => ({ 
      ...prev, 
      showDownloadModal: true, 
      selectedBook: book 
    }));
  }, []);

  const closeDownloadModal = useCallback(() => {
    setUIState(prev => ({ 
      ...prev, 
      showDownloadModal: false, 
      selectedBook: null 
    }));
  }, []);

  const resetUI = useCallback(() => {
    setUIState({
      showFilters: false,
      selectedFormat: 'all',
      selectedLanguage: 'all',
      showDownloadModal: false,
      selectedBook: null,
    });
  }, []);

  return {
    ...uiState,
    toggleFilters,
    setSelectedFormat,
    setSelectedLanguage,
    openDownloadModal,
    closeDownloadModal,
    resetUI,
  };
};