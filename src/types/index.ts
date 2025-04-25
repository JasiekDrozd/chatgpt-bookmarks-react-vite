export interface Bookmark {
  id: string;
  url: string;
  title: string;
  // createdAt?: Date | firebase.firestore.Timestamp; // Optional: Add if needed
}

export interface Folder {
  id: string;
  name: string;
  bookmarks: Bookmark[];
}

export interface BookmarkStorageData {
  folders: Folder[];
} 