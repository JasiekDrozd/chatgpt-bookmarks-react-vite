export interface Bookmark {
  url: string;
  title: string;
}

export interface Folder {
  id: string;
  name: string;
  bookmarks: Bookmark[];
}

export interface BookmarkStorageData {
  folders: Folder[];
} 