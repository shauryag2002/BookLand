# APK Generation and Testing Guide for BookLand

This guide explains how to generate an APK from the Expo project for direct device testing of the complete book search and download flow.

## Prerequisites

Before generating an APK, ensure you have:

1. **Expo CLI installed globally:**
   ```bash
   npm install -g @expo/cli
   ```

2. **EAS CLI for building:**
   ```bash
   npm install -g eas-cli
   ```

3. **Android SDK (for local builds):**
   - Install Android Studio or just the Android SDK
   - Set up ANDROID_HOME environment variable
   - Add SDK tools to PATH

## Method 1: EAS Build (Recommended)

EAS Build is the easiest and most reliable method for generating APKs.

### Setup EAS Build

1. **Login to Expo:**
   ```bash
   eas login
   ```

2. **Initialize EAS configuration:**
   ```bash
   cd /path/to/BookLand
   eas build:configure
   ```

3. **Create/update `eas.json` configuration:**
   ```json
   {
     "cli": {
       "version": ">= 3.0.0"
     },
     "build": {
       "development": {
         "developmentClient": true,
         "distribution": "internal",
         "android": {
           "buildType": "apk",
           "gradleCommand": ":app:assembleDebug"
         }
       },
       "preview": {
         "distribution": "internal",
         "android": {
           "buildType": "apk"
         }
       },
       "production": {
         "android": {
           "buildType": "aab"
         }
       }
     },
     "submit": {
       "production": {}
     }
   }
   ```

### Build APK for Testing

1. **Build development APK:**
   ```bash
   eas build --platform android --profile development
   ```

2. **Build preview APK (recommended for testing):**
   ```bash
   eas build --platform android --profile preview
   ```

3. **Download the APK:**
   - EAS will provide a download link when build completes
   - Or download from: https://expo.dev/accounts/[username]/projects/bookland/builds

## Method 2: Local Build with Expo

### Using Expo Development Build

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create development build:**
   ```bash
   expo install expo-dev-client
   expo run:android
   ```

### Using EAS Local Build

1. **Build locally:**
   ```bash
   eas build --platform android --profile development --local
   ```

## Method 3: Classic Expo Build (Legacy)

**Note:** This method is deprecated but still works for simple projects.

```bash
expo build:android
```

## Testing the BookLand App

### Backend Configuration

Before testing, configure the backend API URL:

1. **Set environment variable in `app.json`:**
   ```json
   {
     "expo": {
       "name": "BookLand",
       "extra": {
         "apiUrl": "https://your-backend-api.com"
       }
     }
   }
   ```

2. **Or create `.env` file:**
   ```
   EXPO_PUBLIC_API_URL=https://your-backend-api.com
   ```

### Anna's Archive Backend Requirements

Your backend should implement these endpoints:

```
GET /api/annas/search?query={search_term}&formats={pdf,epub}&languages={en,es}
GET /api/annas/download/{md5}/{format}
GET /api/annas/details/{md5}
```

### Testing Workflow

1. **Install APK on device:**
   ```bash
   adb install BookLand.apk
   ```

2. **Test search functionality:**
   - Open the app
   - Navigate to book search
   - Search for "Python programming"
   - Verify results are displayed correctly

3. **Test download flow:**
   - Select a book from search results
   - Tap download button
   - Verify download progress is shown
   - Check that download completes successfully

4. **Test error handling:**
   - Turn off internet connection
   - Try to search/download
   - Verify user-friendly error messages appear

## Development Testing Features

### Anna's Archive Demo Screen

The app includes a demo screen (`AnnasArchiveSearchDemo`) that demonstrates:

- Real-time search with backend API
- Format filtering (PDF, EPUB, etc.)
- Loading states and progress tracking
- Error handling with user-friendly messages
- Download functionality with progress bars

### Mock vs Real Backend

The app supports both:

1. **Mock implementation** (in `services/annasArchiveApi.ts`)
2. **Real backend integration** (in `api/annasArchive.ts`)

Switch between them by updating import statements in components.

## Troubleshooting

### Common Build Issues

1. **Metro bundler conflicts:**
   ```bash
   expo r -c  # Clear cache
   ```

2. **Android build failures:**
   ```bash
   cd android
   ./gradlew clean
   cd ..
   ```

3. **EAS build quota exceeded:**
   - Use local builds: `--local` flag
   - Or upgrade EAS plan

### Testing Issues

1. **Network requests failing:**
   - Check CORS configuration on backend
   - Verify API URL is correct
   - Test backend endpoints with Postman

2. **APK not installing:**
   ```bash
   adb uninstall com.yourcompany.bookland
   adb install BookLand.apk
   ```

3. **Permission issues:**
   - Enable "Install from unknown sources"
   - Check internet permission in AndroidManifest.xml

## Performance Optimization

### APK Size Reduction

1. **Enable ProGuard/R8:**
   ```json
   {
     "android": {
       "enableProguardInReleaseBuilds": true
     }
   }
   ```

2. **Remove unused assets:**
   ```bash
   npx expo-asset --optimize
   ```

3. **Use App Bundle instead of APK:**
   - Change `buildType` to `"aab"` in eas.json
   - Smaller downloads through Play Store

### Runtime Performance

1. **Enable Hermes JavaScript engine:**
   ```json
   {
     "android": {
       "jsEngine": "hermes"
     }
   }
   ```

2. **Optimize images:**
   - Use WebP format
   - Compress images before bundling

## Backend Implementation Example

Here's a minimal Node.js backend for Anna's Archive integration:

```javascript
const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

// Search books endpoint
app.get('/api/annas/search', async (req, res) => {
  try {
    const { query, formats, languages } = req.query;
    
    // Your Anna's Archive scraping logic here
    const results = await scrapeAnnasArchive(query, { formats, languages });
    
    res.json({
      success: true,
      data: {
        books: results,
        totalResults: results.length,
        hasMore: false
      }
    });
  } catch (error) {
    res.json({
      success: false,
      error: error.message
    });
  }
});

// Download endpoint
app.get('/api/annas/download/:md5/:format', async (req, res) => {
  try {
    const { md5, format } = req.params;
    
    // Get download URL from Anna's Archive
    const downloadUrl = await getDownloadUrl(md5, format);
    
    res.json({
      success: true,
      data: {
        downloadUrl,
        fileName: `book_${md5}.${format}`,
        format
      }
    });
  } catch (error) {
    res.json({
      success: false,
      error: error.message
    });
  }
});

app.listen(3000, () => {
  console.log('Backend running on port 3000');
});
```

## Security Considerations

1. **API Rate Limiting:**
   - Implement rate limiting on backend
   - Use exponential backoff in app

2. **Input Validation:**
   - Validate search queries on backend
   - Sanitize user input

3. **HTTPS Only:**
   - Always use HTTPS for API calls
   - Configure network security in app

## Conclusion

This guide provides multiple methods for generating APKs and comprehensive testing strategies. The EAS Build method is recommended for production-ready APKs, while local builds are suitable for development testing.

Remember to test the complete book search and download flow on actual devices to ensure optimal user experience.