import React from 'react';
import { FolderList } from './FolderList';
import { useBookmarks } from '../hooks/useBookmarks';

export const Popup: React.FC = () => {
  const {
    folders,
    loading,
    error,
    createFolder,
    deleteFolder,
    addBookmarkToFolder,
    deleteBookmark,
    getCurrentTabInfo,
  } = useBookmarks();

  const handleAddBookmark = async (folderId: string) => {
    const bookmark = await getCurrentTabInfo();
    if (bookmark) {
      const success = await addBookmarkToFolder(folderId, bookmark);
      if (success) {
        alert('Bookmark added successfully!');
      } else {
        alert('This bookmark already exists in the selected folder or failed to add.');
      }
    } else {
      alert('Could not get current tab information.');
    }
  };

  if (loading) {
    return <div className="popup loading">Loading...</div>;
  }

  if (error) {
    return <div className="popup error">Error: {error}</div>;
  }

  return (
    <div className="popup">
      <h1>ChatGPT Bookmarks</h1>
      
      <FolderList
        folders={folders}
        onDeleteFolder={deleteFolder}
        onAddBookmark={handleAddBookmark}
        onDeleteBookmark={deleteBookmark}
        onCreateFolder={createFolder}
      />
    </div>
  );
}; 