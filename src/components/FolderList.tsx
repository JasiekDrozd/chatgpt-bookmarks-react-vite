import React, { useState } from 'react';
import { Folder as FolderType } from '../types';
import { Folder } from './Folder';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolderPlus } from '@fortawesome/free-solid-svg-icons';

interface FolderListProps {
  folders: FolderType[];
  onDeleteFolder: (folderId: string) => void;
  onAddBookmark: (folderId: string) => void;
  onDeleteBookmark: (folderId: string, bookmarkId: string) => void;
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
        <button onClick={handleCreateFolder} title="Create Folder">
          <FontAwesomeIcon icon={faFolderPlus} />
        </button>
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