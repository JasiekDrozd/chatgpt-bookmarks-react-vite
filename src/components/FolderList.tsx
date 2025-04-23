import React, { useState } from 'react';
import { Folder as FolderType } from '../types';
import { Folder } from './Folder';

interface FolderListProps {
  folders: FolderType[];
  onDeleteFolder: (folderId: string) => void;
  onAddBookmark: (folderId: string) => void;
  onDeleteBookmark: (folderId: string, bookmarkIndex: number) => void;
  onCreateFolder: (name: string) => void;
}

export const FolderList: React.FC<FolderListProps> = ({
  folders,
  onDeleteFolder,
  onAddBookmark,
  onDeleteBookmark,
  onCreateFolder
}) => {
  const [newFolderName, setNewFolderName] = useState('');

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      onCreateFolder(newFolderName);
      setNewFolderName('');
    }
  };

  return (
    <div>
      <div className="folder-creation">
        <input
          type="text"
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
          placeholder="New folder name"
        />
        <button onClick={handleCreateFolder}>Create Folder</button>
      </div>

      <div className="folders-container">
        {folders.length > 0 ? (
          folders.map((folder) => (
            <Folder
              key={folder.id}
              folder={folder}
              onDeleteFolder={onDeleteFolder}
              onAddBookmark={onAddBookmark}
              onDeleteBookmark={onDeleteBookmark}
            />
          ))
        ) : (
          <p>No folders yet. Create one above!</p>
        )}
      </div>
    </div>
  );
}; 