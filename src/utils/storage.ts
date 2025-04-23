import { Bookmark, BookmarkStorageData, Folder } from '../types';

// Helper function to generate unique ID for folders
export const generateId = (): string => `folder_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

// Get data from Chrome Storage
export const getStorageData = async (key: string = 'folders'): Promise<Folder[]> => {
  return new Promise((resolve) => {
    chrome.storage.sync.get([key], (result: { [key: string]: any }) => {
      resolve(result[key] || []);
    });
  });
};

// Save data to Chrome Storage
export const setStorageData = async (data: Folder[]): Promise<void> => {
  return new Promise((resolve) => {
    chrome.storage.sync.set({ folders: data }, () => {
      console.log('Storage updated.');
      resolve();
    });
  });
};

// Migrate data from old format if needed
export const migrateData = async (): Promise<Folder[]> => {
  const folders = await getStorageData('folders');
  
  if (folders && folders.length > 0) {
    // New structure already exists
    let needsUpdate = false;
    folders.forEach(folder => {
      if (!folder.id) {
        folder.id = generateId();
        needsUpdate = true;
      }
    });
    
    if (needsUpdate) {
      await setStorageData(folders);
    }
    
    return folders;
  }

  // Check for old bookmarks format
  const oldBookmarks = await getStorageData('bookmarks') as unknown as Bookmark[];
  if (oldBookmarks && oldBookmarks.length > 0) {
    console.log('Migrating old bookmarks to new folder structure...');
    const uncategorizedFolder: Folder = {
      id: generateId(),
      name: 'Uncategorized',
      bookmarks: oldBookmarks
    };
    
    await setStorageData([uncategorizedFolder]);
    chrome.storage.sync.remove('bookmarks');
    console.log('Migration complete.');
    return [uncategorizedFolder];
  } else {
    // Create default folder
    const initialFolders: Folder[] = [{
      id: generateId(),
      name: 'My First Folder',
      bookmarks: []
    }];
    
    await setStorageData(initialFolders);
    return initialFolders;
  }
}; 