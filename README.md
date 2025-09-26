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
│   └── BookCard.js # Enhanced book display component
├── screens/       # App screens
│   ├── HomeScreen.js          # Main screen with search and trending books
│   ├── BookDetailScreen.js    # Enhanced book details with download
│   └── BookReaderScreen.js    # In-app book reader
├── services/      # API and external services
│   ├── openLibraryApi.js      # Open Library API integration
│   └── annasArchiveApi.js     # Anna's Archive scraping service
├── store/         # State management
│   └── bookStore.js           # Zustand store for app state
├── assets/        # Images, fonts, etc.
├── api/           # Legacy API functions
└── App.js         # Main app entry point with navigation
```

## New Features

### 🔍 Smart Book Search
- Real-time search using Open Library API
- Displays rich book metadata including covers, descriptions, and categories
- Fallback to trending books when not searching

### 📚 Book Download & Reading
- Integration with Anna's Archive for free book downloads
- Support for multiple formats (PDF, EPUB)
- Download progress tracking with cancellation support
- In-app book reader with reading progress persistence

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