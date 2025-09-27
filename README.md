# BookLand
Simple free to use book store

This is a React Native app built with [Expo](https://expo.dev) featuring a book store interface with search functionality and book details.

## Features

- 📱 React Native with Expo
- 🎨 NativeWind for Tailwind CSS-style styling with responsive design
- 🌙 Dark mode support
- 🧭 React Navigation with book reader modal
- 🔍 Real-time book search with Open Library API integration
- 📖 Enhanced book details screen with rich metadata
- 🏪 Anna's Archive integration for book downloads
- 📚 In-app book reader supporting PDF and EPUB formats
- 🎯 Zustand state management for efficient app state
- 💾 Persistent storage for downloaded books and reading progress
- 🔄 Pull-to-refresh and trending books support
- 📊 Download progress tracking and status management

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

## Project Structure

```
├── components/     # Reusable UI components
│   ├── BookCard.js # Enhanced book display component
│   ├── EnhancedBookCard.tsx # Advanced book card with download options
│   └── AnnasArchiveSearchDemo.tsx # Demo component for backend API testing
├── screens/       # App screens
│   ├── HomeScreen.js          # Main screen with search and trending books
│   ├── BookDetailScreen.js    # Enhanced book details with backend download
│   └── BookReaderScreen.js    # In-app book reader
├── services/      # API and external services
│   ├── openLibraryApi.js      # Open Library API integration
│   └── annasArchiveApi.js     # Anna's Archive scraping service (legacy)
├── api/           # Backend API services
│   ├── books.ts              # Legacy API functions
│   ├── annasArchive.ts       # Anna's Archive backend API service
│   └── useAnnasArchive.ts    # React hooks for API state management
├── store/         # State management
│   └── bookStore.js           # Zustand store for app state
├── types/         # TypeScript type definitions
│   ├── book.ts               # Book and API response interfaces
│   ├── components.ts         # Component prop interfaces
│   └── store.ts              # Store state interfaces
├── assets/        # Images, fonts, etc.
└── App.js         # Main app entry point with navigation
```

## New Features

### 🔍 Smart Book Search
- Real-time search using Open Library API
- Displays rich book metadata including covers, descriptions, and categories
- Fallback to trending books when not searching

### 📚 Book Download & Reading
- **Backend Integration** with Anna's Archive API endpoints (`/api/annas/search?query=...`)
- **TypeScript Service Layer** with strong type interfaces for book data and responses
- Support for multiple formats (PDF, EPUB, MOBI, TXT, DOC, DOCX)
- Advanced filtering by format, language, file size, and quality
- Download progress tracking with real-time updates
- Comprehensive error handling with user-friendly messages
- In-app book reader with reading progress persistence

### 🏗️ Backend API Integration
- **RESTful API Service** (`api/annasArchive.ts`) for backend communication
- **React Hooks** (`api/useAnnasArchive.ts`) for state management and UI integration
- **Loading States** with progress tracking for all operations
- **Error Handling** with retry logic and user-friendly error messages
- **TypeScript Interfaces** for all API requests and responses
- **Network Timeout Management** with proper abort controllers
- **Format & Language Filtering** with validation

### 🎯 State Management
- Zustand-powered state management for performance
- Persistent storage for downloaded books and reading progress
- Optimistic UI updates and error handling

### 📖 Enhanced Book Details
- Rich metadata from Open Library (author, publisher, ISBN, categories)
- Download options with format selection
- Reading progress and book status tracking

### 🎨 Responsive Design
- Beautiful, mobile-first design with NativeWind
- Dark mode support throughout the app
- Smooth animations and loading states

## APK Generation for Device Testing

To generate an APK for direct device testing of the complete book search and download flow:

### Quick Start (EAS Build - Recommended)
```bash
# Install EAS CLI
npm install -g eas-cli

# Login and configure
eas login
eas build:configure

# Build APK for testing
eas build --platform android --profile preview
```

### Local Build
```bash
# Install dependencies
npm install

# Run local Android build
expo run:android
```

For detailed instructions, backend setup, and troubleshooting, see [APK_GENERATION_GUIDE.md](./APK_GENERATION_GUIDE.md).

## Backend API Requirements

The app integrates with Anna's Archive backend endpoints:

- `GET /api/annas/search?query={search_term}` - Search for books
- `GET /api/annas/download/{md5}/{format}` - Get download URL
- `GET /api/annas/details/{md5}` - Get detailed book information

Configure your backend URL in `.env`:
```
EXPO_PUBLIC_API_URL=https://your-backend-api.com
```