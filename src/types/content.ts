export interface SermonItem {
  id: string | number;
  title: string;
  preacher: string;
  date: string;
  sermonDate?: string;
  duration: string;
  description: string;
  category: string;
  thumbnail: string | null;
  videoUrl: string;
  audioUrl: string;
  videoProvider?: "upload" | "youtube" | "facebook";
  isPublished?: boolean;
  storageBucket?: string | null;
  storagePath?: string | null;
  createdAt?: string;
}

export interface GalleryMediaItem {
  id: string | number;
  title: string;
  category: string;
  description?: string;
  mediaType: "image" | "video";
  mediaUrl: string;
  thumbnailUrl?: string | null;
  eventDate?: string | null;
  isPublished?: boolean;
  storageBucket?: string | null;
  storagePath?: string | null;
  createdAt?: string;
}

export interface UploadedFile {
  bucket: string;
  path: string;
  publicUrl: string;
  contentType: string;
  fileName: string;
}

export interface LeaderItem {
  id: string | number;
  name: string;
  position: string;
  description: string;
  imageUrl: string | null;
  displayOrder: number;
}

export interface ChurchEventItem {
  id: string | number;
  title: string;
  description: string;
  category: string;
  startDate: string;
  endDate: string | null;
  startTime: string | null;
  location: string;
  imageUrl: string | null;
  color: string;
}
