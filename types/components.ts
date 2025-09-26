import type { Book } from './book';

// Component prop interfaces
export interface BookCardProps {
  book: Book;
  onPress?: () => void;
}

export interface EnhancedBookCardProps {
  book: Book;
  onPress?: () => void;
  onDownload?: (book: Book) => void;
  onAddToFavorites?: (book: Book) => void;
  isDownloaded?: boolean;
  isFavorite?: boolean;
  isDownloading?: boolean;
  downloadProgress?: number;
}

export interface TabBarIconProps {
  focused: boolean;
  icon: string;
  size?: number;
}

// Generic component props
export interface ListItemProps {
  title: string;
  subtitle?: string;
  onPress?: () => void;
  leftIcon?: string;
  rightIcon?: string;
  disabled?: boolean;
}

export interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  color?: string;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error }>;
}

// Form component props
export interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onSubmit?: (query: string) => void;
  autoFocus?: boolean;
}

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
}

export interface ProgressBarProps {
  progress: number; // 0-1
  color?: string;
  backgroundColor?: string;
  height?: number;
  showPercentage?: boolean;
}