// Open Library API service for fetching book data
import type { 
  Book, 
  OpenLibrarySearchResult, 
  OpenLibraryBook, 
  OpenLibrarySubjectResponse,
  OpenLibraryWork 
} from '../types';

const OPEN_LIBRARY_BASE = 'https://openlibrary.org';
const OPEN_LIBRARY_COVERS = 'https://covers.openlibrary.org';

// Search books using Open Library API
export const searchBooksOpenLibrary = async (query: string, limit: number = 20): Promise<Book[]> => {
  try {
    const response = await fetch(
      `${OPEN_LIBRARY_BASE}/search.json?q=${encodeURIComponent(query)}&limit=${limit}&fields=key,title,author_name,first_publish_year,number_of_pages_median,publisher,language,subject,cover_i,isbn`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: OpenLibrarySearchResult = await response.json();
    
    return data.docs.map((book: OpenLibraryBook): Book => ({
      id: book.key || `ol-${Math.random().toString(36).substr(2, 9)}`,
      title: book.title || 'Unknown Title',
      author: book.author_name?.[0] || 'Unknown Author',
      year: book.first_publish_year || null,
      pages: book.number_of_pages_median || null,
      publisher: book.publisher ? [book.publisher[0]] : ['Unknown Publisher'],
      language: book.language || ['en'],
      subjects: book.subject?.slice(0, 5) || [],
      isbn: book.isbn || [],
      openLibraryKey: book.key,
      cover: book.cover_i 
        ? `${OPEN_LIBRARY_COVERS}/b/id/${book.cover_i}-L.jpg`
        : 'https://via.placeholder.com/300x450/cccccc/000000?text=No+Cover',
      // Generate description from subjects
      description: book.subject?.slice(0, 3).join(', ') || 'No description available.',
    }));
  } catch (error) {
    console.error('Error fetching books from Open Library:', error);
    throw error;
  }
};

// Get detailed book information by Open Library key
export const getBookDetails = async (openLibraryKey: string): Promise<Book> => {
  try {
    const response = await fetch(`${OPEN_LIBRARY_BASE}${openLibraryKey}.json`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const book: any = await response.json();
    
    // Fetch additional work details if available
    let workDetails: any = null;
    if (book.works && book.works.length > 0) {
      try {
        const workResponse = await fetch(`${OPEN_LIBRARY_BASE}${book.works[0].key}.json`);
        if (workResponse.ok) {
          workDetails = await workResponse.json();
        }
      } catch (workError) {
        console.warn('Could not fetch work details:', workError);
      }
    }
    
    const authorName = book.authors?.[0]?.key ? await getAuthorName(book.authors[0].key) : 'Unknown Author';
    
    return {
      id: book.key || openLibraryKey,
      title: book.title || 'Unknown Title',
      author: authorName,
      isbn: book.isbn_13 || book.isbn_10 || [],
      publisher: book.publishers ? [book.publishers[0]] : ['Unknown Publisher'],
      year: book.publish_date ? parseInt(book.publish_date) : null,
      pages: book.number_of_pages || null,
      language: book.languages ? [book.languages[0]?.key?.replace('/languages/', '') || 'en'] : ['en'],
      subjects: workDetails?.subjects?.slice(0, 10) || book.subjects?.slice(0, 10) || [],
      description: workDetails?.description?.value || workDetails?.description || book.description?.value || book.description || 'No description available.',
      cover: book.covers?.[0] 
        ? `${OPEN_LIBRARY_COVERS}/b/id/${book.covers[0]}-L.jpg`
        : 'https://via.placeholder.com/300x450/cccccc/000000?text=No+Cover',
      openLibraryKey: book.key,
    };
  } catch (error) {
    console.error('Error fetching book details:', error);
    throw error;
  }
};

// Get author name by key
export const getAuthorName = async (authorKey: string): Promise<string> => {
  try {
    const response = await fetch(`${OPEN_LIBRARY_BASE}${authorKey}.json`);
    if (!response.ok) {
      return 'Unknown Author';
    }
    const author: any = await response.json();
    return author.name || 'Unknown Author';
  } catch (error) {
    console.warn('Error fetching author name:', error);
    return 'Unknown Author';
  }
};

// Get trending books from Open Library
export const getTrendingBooks = async (limit: number = 50): Promise<Book[]> => {
  try {
    const response = await fetch(`${OPEN_LIBRARY_BASE}/trending/daily.json?limit=${limit}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: { works?: OpenLibraryWork[] } = await response.json();
    
    return data.works?.map((work: OpenLibraryWork): Book => ({
      id: work.key || `trending-${Math.random().toString(36).substr(2, 9)}`,
      title: work.title || 'Unknown Title',
      author: work.authors?.[0]?.name || 'Unknown Author',
      year: work.first_publish_year || null,
      cover: work.cover_id 
        ? `${OPEN_LIBRARY_COVERS}/b/id/${work.cover_id}-L.jpg`
        : 'https://via.placeholder.com/300x450/cccccc/000000?text=No+Cover',
      openLibraryKey: work.key,
      description: 'Trending book from Open Library.',
    })) || [];
  } catch (error) {
    console.error('Error fetching trending books:', error);
    return [];
  }
};

// Get subjects (categories)
export const getSubjects = async (): Promise<string[]> => {
  const popularSubjects: string[] = [
    'Science Fiction',
    'Fantasy',
    'Romance',
    'Mystery',
    'Thriller',
    'Biography',
    'History',
    'Science',
    'Philosophy',
    'Poetry',
    'Fiction',
    'Non-fiction',
    'Young Adult',
    'Children',
    'Horror',
    'Adventure',
    'Drama',
    'Comedy',
    'Self-help',
    'Business',
  ];
  
  return popularSubjects;
};

// Search books by subject
export const searchBooksBySubject = async (subject: string, limit: number = 20): Promise<Book[]> => {
  try {
    const response = await fetch(
      `${OPEN_LIBRARY_BASE}/subjects/${subject.toLowerCase().replace(/\s+/g, '_')}.json?limit=${limit}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: OpenLibrarySubjectResponse = await response.json();
    
    return data.works?.map((work: OpenLibraryWork): Book => ({
      id: work.key || `subject-${Math.random().toString(36).substr(2, 9)}`,
      title: work.title || 'Unknown Title',
      author: work.authors?.[0]?.name || 'Unknown Author',
      year: work.first_publish_year || null,
      cover: work.cover_id 
        ? `${OPEN_LIBRARY_COVERS}/b/id/${work.cover_id}-L.jpg`
        : 'https://via.placeholder.com/300x450/cccccc/000000?text=No+Cover',
      openLibraryKey: work.key,
      description: `A book in the ${subject} category.`,
    })) || [];
  } catch (error) {
    console.error('Error fetching books by subject:', error);
    return [];
  }
};