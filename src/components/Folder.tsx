import React from 'react';
import { Folder as FolderType } from '../types';
import { Bookmark } from './Bookmark';

interface FolderProps {
  folder: FolderType;
  onDeleteFolder: (folderId: string) => void;
  onAddBookmark: (folderId: string) => void;
  onDeleteBookmark: (folderId: string, bookmarkIndex: number) => void;
}

export const Folder: React.FC<FolderProps> = ({
  folder,
  onDeleteFolder,
  onAddBookmark,
  onDeleteBookmark
}) => {
  const handleDeleteFolder = () => {
    if (window.confirm('Are you sure you want to delete this folder and all its bookmarks?')) {
      onDeleteFolder(folder.id);
    }
  };

  return (
    <div className="folder" data-folder-id={folder.id}>
      <div className="folder-header">
        <h2>{folder.name}</h2>
        <div className="folder-actions">
          <button 
            className="add-here-btn"
            onClick={() => onAddBookmark(folder.id)}
          >
            Add Here
          </button>
          <button 
            className="delete-folder-btn"
            onClick={handleDeleteFolder}
          >
            Delete Folder
          </button>
        </div>
      </div>
      
      <ul>
        {folder.bookmarks && folder.bookmarks.length > 0 ? (
          folder.bookmarks
            .filter(bookmark => bookmark && bookmark.url)
            .map((bookmark, index) => (
              <Bookmark
                key={`${bookmark.url}-${index}`}
                bookmark={bookmark}
                onDelete={() => onDeleteBookmark(folder.id, index)}
              />
            ))
        ) : (
          <li>No bookmarks in this folder.</li>
        )}
      </ul>
    </div>
  );
}; 