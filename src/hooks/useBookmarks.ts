import { useState, useEffect, useCallback } from 'react';
import { Bookmark, Folder } from '../types';
import { getStorageData, setStorageData, generateId, migrateData } from '../utils/storage';

export const useBookmarks = () => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize bookmarks data
  const initializeBookmarks = useCallback(async () => {
    try {
      setLoading(true);
      const data = await migrateData();
      setFolders(data);
      setError(null);
    } catch (err) {
      console.error('Error initializing bookmarks:', err);
      setError('Failed to load bookmarks');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load bookmarks on component mount
  useEffect(() => {
    initializeBookmarks();
  }, [initializeBookmarks]);

  // Create a new folder
  const createFolder = useCallback(async (name: string) => {
    if (!name.trim()) {
      return false;
    }

    try {
      const newFolder: Folder = {
        id: generateId(),
        name: name.trim(),
        bookmarks: []
      };

      const updatedFolders = [...folders, newFolder];
      await setStorageData(updatedFolders);
      setFolders(updatedFolders);
      return true;
    } catch (err) {
      console.error('Error creating folder:', err);
      setError('Failed to create folder');
      return false;
    }
  }, [folders]);

  // Delete a folder
  const deleteFolder = useCallback(async (folderId: string) => {
    try {
      const updatedFolders = folders.filter(folder => folder.id !== folderId);
      await setStorageData(updatedFolders);
      setFolders(updatedFolders);
      return true;
    } catch (err) {
      console.error('Error deleting folder:', err);
      setError('Failed to delete folder');
      return false;
    }
  }, [folders]);

  // Add bookmark to a folder
  const addBookmarkToFolder = useCallback(async (folderId: string, bookmark: Bookmark) => {
    try {
      const folderIndex = folders.findIndex(f => f.id === folderId);
      if (folderIndex === -1) {
        throw new Error('Folder not found');
      }

      // Check if bookmark already exists in this folder
      const bookmarkExists = folders[folderIndex].bookmarks.some(b => b.url === bookmark.url);
      if (bookmarkExists) {
        return false;
      }

      const updatedFolders = [...folders];
      updatedFolders[folderIndex].bookmarks.push(bookmark);
      await setStorageData(updatedFolders);
      setFolders(updatedFolders);
      return true;
    } catch (err) {
      console.error('Error adding bookmark:', err);
      setError('Failed to add bookmark');
      return false;
    }
  }, [folders]);

  // Delete bookmark from a folder
  const deleteBookmark = useCallback(async (folderId: string, bookmarkIndex: number) => {
    try {
      const folderIndex = folders.findIndex(f => f.id === folderId);
      if (folderIndex === -1) {
        throw new Error('Folder not found');
      }

      const updatedFolders = [...folders];
      updatedFolders[folderIndex].bookmarks.splice(bookmarkIndex, 1);
      await setStorageData(updatedFolders);
      setFolders(updatedFolders);
      return true;
    } catch (err) {
      console.error('Error deleting bookmark:', err);
      setError('Failed to delete bookmark');
      return false;
    }
  }, [folders]);

  // Get current tab info for bookmarking
  const getCurrentTabInfo = useCallback(async (): Promise<Bookmark | null> => {
    return new Promise((resolve) => {
      // Check if we're in content script context (chrome.tabs might not be available)
      if (typeof chrome === 'undefined' || !chrome.tabs || !chrome.tabs.query) {
        // In content script, try to get current URL/title from document
        if (document && document.location && document.title) {
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
          if (!tabs || !tabs[0] || !tabs[0].url) {
            console.error('No active tab found or missing URL');
            resolve(null);
            return;
          }
          
          resolve({
            url: tabs[0].url,
            title: tabs[0].title || 'Untitled'
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
    createFolder,
    deleteFolder,
    addBookmarkToFolder,
    deleteBookmark,
    getCurrentTabInfo,
    refreshBookmarks: initializeBookmarks
  };
}; 