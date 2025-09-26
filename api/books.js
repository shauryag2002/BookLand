// API functions for BookLand app

const API_BASE_URL = 'https://api.bookland.com'; // Replace with actual API URL

// Fetch books from API
export const fetchBooks = async (searchQuery = '') => {
  try {
    const response = await fetch(`${API_BASE_URL}/books?search=${searchQuery}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching books:', error);
    // Return sample data for now
    return getSampleBooks();
  }
};

// Get book details by ID
export const fetchBookDetails = async (bookId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/books/${bookId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching book details:', error);
    return null;
  }
};

// Sample books data (fallback)
export const getSampleBooks = () => [
  {
    id: '1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    description: 'A classic American novel set in the Jazz Age, exploring themes of wealth, love, and the American Dream.',
    price: '12.99',
    image: 'https://via.placeholder.com/80x120/4F46E5/FFFFFF?text=Gatsby'
  },
  {
    id: '2',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    description: 'A powerful story of racial injustice and childhood innocence in the American South.',
    price: '14.99',
    image: 'https://via.placeholder.com/80x120/EF4444/FFFFFF?text=Mockingbird'
  },
  {
    id: '3',
    title: '1984',
    author: 'George Orwell',
    description: 'A dystopian masterpiece about totalitarianism and the power of language.',
    price: '13.99',
    image: 'https://via.placeholder.com/80x120/10B981/FFFFFF?text=1984'
  },
  {
    id: '4',
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    description: 'A timeless romance exploring love, class, and social expectations in 19th century England.',
    price: '11.99',
    image: 'https://via.placeholder.com/80x120/F59E0B/FFFFFF?text=Pride'
  }
];