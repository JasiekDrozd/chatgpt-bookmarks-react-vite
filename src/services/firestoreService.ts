import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  writeBatch,
  query,
  orderBy,
  Timestamp,
  serverTimestamp // Import serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Import initialized Firestore instance
import { Folder, Bookmark } from '../types'; // Assuming types are in ../types

const FOLDERS_COLLECTION = 'folders';
const BOOKMARKS_SUBCOLLECTION = 'bookmarks';

// Helper function to convert Firestore doc data to Bookmark type
// Adds the document ID to the bookmark object
const docToBookmark = (doc: any): Bookmark & { id: string } => {
  const data = doc.data();
  return {
    id: doc.id,
    title: data.title,
    url: data.url,
    // Convert Firestore Timestamp to Date object if needed, otherwise keep as Timestamp
    // createdAt: data.createdAt?.toDate() 
  };
};

// Fetch all folders and their bookmarks
export const getFoldersAndBookmarks = async (): Promise<Folder[]> => {
  const foldersQuery = query(collection(db, FOLDERS_COLLECTION), orderBy('name')); // Example: order by name
  const querySnapshot = await getDocs(foldersQuery);
  
  const folders: Folder[] = [];
  
  for (const folderDoc of querySnapshot.docs) {
    const folderData = folderDoc.data();
    const folderId = folderDoc.id;

    // Fetch bookmarks for this folder
    const bookmarksQuery = query(collection(db, FOLDERS_COLLECTION, folderId, BOOKMARKS_SUBCOLLECTION), orderBy('createdAt')); // Order bookmarks by creation time
    const bookmarksSnapshot = await getDocs(bookmarksQuery);
    const bookmarks = bookmarksSnapshot.docs.map(docToBookmark);

    folders.push({
      id: folderId,
      name: folderData.name,
      bookmarks: bookmarks,
      // Add other folder fields if necessary
    });
  }
  
  return folders;
};

// Create a new folder
export const createFolder = async (name: string): Promise<string> => {
  const docRef = await addDoc(collection(db, FOLDERS_COLLECTION), {
    name: name,
    createdAt: serverTimestamp() // Use serverTimestamp for creation time
  });
  return docRef.id; // Return the ID of the newly created folder
};

// Delete a folder and all its bookmarks
export const deleteFolder = async (folderId: string): Promise<void> => {
  const batch = writeBatch(db);

  // 1. Get all bookmarks in the subcollection to delete them
  const bookmarksQuery = collection(db, FOLDERS_COLLECTION, folderId, BOOKMARKS_SUBCOLLECTION);
  const bookmarksSnapshot = await getDocs(bookmarksQuery);
  bookmarksSnapshot.docs.forEach(bookmarkDoc => {
    batch.delete(doc(db, FOLDERS_COLLECTION, folderId, BOOKMARKS_SUBCOLLECTION, bookmarkDoc.id));
  });

  // 2. Delete the folder itself
  batch.delete(doc(db, FOLDERS_COLLECTION, folderId));

  await batch.commit();
};

// Add a bookmark to a specific folder
export const addBookmarkToFolder = async (folderId: string, bookmark: Omit<Bookmark, 'id'>): Promise<string> => {
  const docRef = await addDoc(collection(db, FOLDERS_COLLECTION, folderId, BOOKMARKS_SUBCOLLECTION), {
    ...bookmark,
    createdAt: serverTimestamp() // Use serverTimestamp
  });
  return docRef.id; // Return the ID of the newly created bookmark
};

// Delete a specific bookmark from a folder
export const deleteBookmark = async (folderId: string, bookmarkId: string): Promise<void> => {
  await deleteDoc(doc(db, FOLDERS_COLLECTION, folderId, BOOKMARKS_SUBCOLLECTION, bookmarkId));
}; 