import { useState, useEffect, useCallback } from 'react';
import { Bookmark, Folder } from '../types';
// Import Firestore service
import * as firestoreService from '../services/firestoreService';
// Keep local storage utils for backup/fallback
import { getStorageData, setStorageData, generateId } from '../utils/storage';

// Helper to get data from local storage (simple wrapper)
const getLocalBackup = async (): Promise<Folder[]> => {
  try {
    return await getStorageData(); // Assumes getStorageData returns Folder[]
  } catch (err) {
    console.error('Error reading local backup:', err);
    return []; // Return empty array on error
  }
};

// Helper to update local storage backup
const updateLocalBackup = async (folders: Folder[]) => {
  try {
    await setStorageData(folders);
  } catch (err) {
    console.error('Error updating local backup:', err);
    // Decide if we should notify the user about backup failure
  }
};

export const useBookmarks = () => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState<boolean>(false); // Track if we are using offline data

  // Load initial data: Firestore first, then local backup
  const initializeBookmarks = useCallback(async () => {
    setLoading(true);
    setError(null);
    setIsOffline(false);
    try {
      console.log('Attempting to load bookmarks from Firestore...');
      const firestoreFolders = await firestoreService.getFoldersAndBookmarks();
      setFolders(firestoreFolders);
      await updateLocalBackup(firestoreFolders); // Update backup on successful fetch
      console.log('Successfully loaded bookmarks from Firestore.');
    } catch (firestoreError) {
      console.warn('Firestore load failed, attempting local backup:', firestoreError);
      setError('Could not connect to cloud storage. Using local backup.');
      setIsOffline(true);
      const localFolders = await getLocalBackup();
      setFolders(localFolders);
      if (localFolders.length === 0) {
        console.log('Local backup is empty or unavailable.');
        // Optionally set a more specific error if local backup is also empty
      } else {
        console.log('Loaded bookmarks from local backup.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    initializeBookmarks();
  }, [initializeBookmarks]);

  // --- CRUD Operations --- 

  const createFolder = useCallback(async (name: string): Promise<boolean> => {
    if (!name.trim()) return false;

    // Optimistic UI update
    const tempId = generateId(); // Use temp ID for optimistic update
    const newFolderOptimistic: Folder = {
      id: tempId, 
      name: name.trim(),
      bookmarks: []
    };
    const originalFolders = folders;
    setFolders(prevFolders => [...prevFolders, newFolderOptimistic]);
    setError(null); // Clear previous errors

    try {
      const newFolderId = await firestoreService.createFolder(name.trim());
      // Replace optimistic folder with real one from Firestore (or refetch)
      setFolders(prevFolders => 
        prevFolders.map(f => f.id === tempId ? { ...newFolderOptimistic, id: newFolderId } : f)
      );
      await updateLocalBackup(folders); // Update backup on success
      return true;
    } catch (err) {
      console.error('Firestore Error - createFolder:', err);
      setError('Failed to create folder in cloud storage.');
      setFolders(originalFolders); // Revert optimistic update
      return false;
    }
  }, [folders]);

  const deleteFolder = useCallback(async (folderId: string): Promise<boolean> => {
    // Optimistic UI update
    const originalFolders = folders;
    setFolders(prevFolders => prevFolders.filter(folder => folder.id !== folderId));
    setError(null); // Clear previous errors

    try {
      await firestoreService.deleteFolder(folderId);
      await updateLocalBackup(folders.filter(folder => folder.id !== folderId)); // Update backup on success
      return true;
    } catch (err) {
      console.error('Firestore Error - deleteFolder:', err);
      setError('Failed to delete folder in cloud storage.');
      setFolders(originalFolders); // Revert optimistic update
      return false;
    }
  }, [folders]);

  const addBookmarkToFolder = useCallback(async (folderId: string, bookmark: Bookmark): Promise<boolean> => {
    if (!bookmark || !bookmark.url) {
      console.error('Invalid bookmark data:', bookmark);
      return false;
    }
    
    // Find folder for optimistic update
    const folderIndex = folders.findIndex(f => f.id === folderId);
    if (folderIndex === -1) {
        setError('Folder not found for adding bookmark.');
        return false;
    }

    // Check if bookmark already exists in this folder (client-side check)
    const bookmarkExists = folders[folderIndex].bookmarks.some(b => b && b.url === bookmark.url);
    if (bookmarkExists) {
      setError('Bookmark already exists in this folder.'); 
      return false; // Or show a less intrusive notification
    }

    // Optimistic UI update
    const tempBookmark = { ...bookmark, id: generateId() }; // Add temporary ID
    const originalFolders = folders;
    const updatedFoldersOptimistic = folders.map(f => {
      if (f.id === folderId) {
        return { ...f, bookmarks: [...f.bookmarks, tempBookmark] };
      }
      return f;
    });
    setFolders(updatedFoldersOptimistic);
    setError(null);

    try {
      // Omit the temp ID when sending to Firestore
      const { id, ...bookmarkData } = tempBookmark; 
      const newBookmarkId = await firestoreService.addBookmarkToFolder(folderId, bookmarkData);
      
      // Update the bookmark with the real ID
      setFolders(prevFolders => 
        prevFolders.map(f => {
          if (f.id === folderId) {
            return {
              ...f,
              bookmarks: f.bookmarks.map(b => b.id === tempBookmark.id ? { ...b, id: newBookmarkId } : b)
            };
          }
          return f;
        })
      );
      await updateLocalBackup(folders); // Update backup
      return true;
    } catch (err) {
      console.error('Firestore Error - addBookmarkToFolder:', err);
      setError('Failed to add bookmark to cloud storage.');
      setFolders(originalFolders); // Revert optimistic update
      return false;
    }
  }, [folders]);

  const deleteBookmark = useCallback(async (folderId: string, bookmarkId: string): Promise<boolean> => {
     // Find folder and bookmark index for optimistic update
    const folderIndex = folders.findIndex(f => f.id === folderId);
    if (folderIndex === -1) return false;
    const bookmarkIndex = folders[folderIndex].bookmarks.findIndex(b => b.id === bookmarkId);
    if (bookmarkIndex === -1) return false;

    // Optimistic UI update
    const originalFolders = folders;
    const updatedFoldersOptimistic = folders.map(f => {
      if (f.id === folderId) {
        return { ...f, bookmarks: f.bookmarks.filter(b => b.id !== bookmarkId) };
      }
      return f;
    });
    setFolders(updatedFoldersOptimistic);
    setError(null);
    
    try {
      await firestoreService.deleteBookmark(folderId, bookmarkId);
      await updateLocalBackup(folders.filter(f => f.id === folderId ? { ...f, bookmarks: f.bookmarks.filter(b => b.id !== bookmarkId) } : f)); // Update backup
      return true;
    } catch (err) {
      console.error('Firestore Error - deleteBookmark:', err);
      setError('Failed to delete bookmark from cloud storage.');
      setFolders(originalFolders); // Revert optimistic update
      return false;
    }
  }, [folders]);

  // Get current tab info for bookmarking
  const getCurrentTabInfo = useCallback(async (): Promise<Omit<Bookmark, 'id'> | null> => {
    return new Promise((resolve) => {
      // Check if we're in content script context (chrome.tabs might not be available)
      if (typeof chrome === 'undefined' || !chrome.tabs || !chrome.tabs.query) {
        // In content script, try to get current URL/title from document
        if (document && document.location && document.title) {
          // Resolve with object matching Omit<Bookmark, 'id'>
          resolve({
            url: document.location.href,
            title: document.title || 'Untitled'
          });
          return;
        }
        console.error('Unable to access tab information in current context');
        resolve(null);
        return;
      }
      
      // Standard extension context
      try {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (!tabs || tabs.length === 0) {
            console.error('No active tabs found');
            resolve(null);
            return;
          }
          
          const tab = tabs[0];
          if (!tab || !tab.url) {
            console.error('Active tab is missing or has no URL');
            resolve(null);
            return;
          }
          
          // Resolve with object matching Omit<Bookmark, 'id'>
          resolve({
            url: tab.url,
            title: tab.title || 'Untitled'
          });
        });
      } catch (err) {
        console.error('Error accessing chrome.tabs API:', err);
        resolve(null);
      }
    });
  }, []);

  return {
    folders,
    loading,
    error,
    isOffline, // Expose offline status
    createFolder,
    deleteFolder,
    addBookmarkToFolder,
    deleteBookmark,
    getCurrentTabInfo,
    refreshBookmarks: initializeBookmarks // Function to manually trigger refresh
  };
}; 