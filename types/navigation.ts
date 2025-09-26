import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { StackScreenProps } from '@react-navigation/stack';
import type { Book } from './book';

// Root Stack Navigator param list
export type RootStackParamList = {
  MainTabs: undefined;
  BookDetail: {
    book: Book;
  };
  BookReader: {
    book: Book;
    filePath?: string;
  };
};

// Bottom Tab Navigator param list
export type MainTabParamList = {
  Home: undefined;
  MyLibrary: undefined;
  Favorites: undefined;
  Settings: undefined;
};

// Screen prop types
export type HomeScreenProps = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Home'>,
  StackScreenProps<RootStackParamList>
>;

export type MyLibraryScreenProps = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'MyLibrary'>,
  StackScreenProps<RootStackParamList>
>;

export type FavoritesScreenProps = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Favorites'>,
  StackScreenProps<RootStackParamList>
>;

export type SettingsScreenProps = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Settings'>,
  StackScreenProps<RootStackParamList>
>;

export type BookDetailScreenProps = StackScreenProps<RootStackParamList, 'BookDetail'>;

export type BookReaderScreenProps = StackScreenProps<RootStackParamList, 'BookReader'>;

// Navigation prop types for hooks
export type RootStackNavigationProp = StackScreenProps<RootStackParamList>['navigation'];
export type MainTabNavigationProp = BottomTabScreenProps<MainTabParamList>['navigation'];

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}