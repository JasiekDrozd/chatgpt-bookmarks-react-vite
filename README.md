# ChatGPT Bookmarks (React)

A Chrome browser extension that allows you to save bookmarks for ChatGPT conversations. This version is rewritten in React with TypeScript.

## Features

- Save bookmarks for ChatGPT conversations into folders
- Sidebar panel with bookmarks available on the ChatGPT page
- Synchronization of bookmarks via Firestore (with chrome.storage as a fallback)
- Easy management of folders and bookmarks

## Technologies

- React 19
- TypeScript
- Vite
- Chrome Extension API
- Firebase Firestore

## Development

### Requirements

- Node.js (version 18+ recommended)
- npm (version 8+ recommended)

### Install Dependencies

```bash
npm install
```

### Run in Development Mode

```bash
npm run dev
```

### Build the Extension

```bash
npm run build:extension
```

This command will build the extension and copy all necessary files to the `dist` directory.

## Extension Installation

1. Build the extension using the `npm run build:extension` command
2. Open Chrome and navigate to `chrome://extensions`
3. Enable "Developer mode" (toggle switch in the top right corner)
4. Click "Load unpacked" and select the `dist` directory from the project
5. The extension should appear in the list of installed extensions

## Firebase Configuration (Optional - for cloud synchronization)

This extension uses Firestore to store bookmarks and folders in the cloud, with local `chrome.storage` as a backup.

To configure the Firebase connection:

1.  **Create a Firebase project:** If you don't have one already, create a new project in the [Firebase Console](https://console.firebase.google.com/).
2.  **Add a Web App:** In the project settings, add a new Web App. Firebase will generate configuration details for you (apiKey, authDomain, etc.).
3.  **Copy the configuration template:** Copy the file `src/firebaseConfig.example.ts` to a new file named `src/firebaseConfig.ts`.
    ```bash
    cp src/firebaseConfig.example.ts src/firebaseConfig.ts
    ```
4.  **Fill in the configuration:** Open the `src/firebaseConfig.ts` file and replace the placeholder values (`YOUR_API_KEY`, `YOUR_PROJECT_ID`, etc.) with the actual configuration details from your Firebase project (see step 2).
5.  **Set Firestore Security Rules:** In the [Firebase Console](https://console.firebase.google.com/), navigate to Firestore Database -> Rules. For development or personal use, you can set rules to allow access without authentication:
    ```javascript
    rules_version = '2';
    service cloud.firestore {
      match /databases/{database}/documents {
        // WARNING: Allows anyone to read/write. Use with caution.
        match /{document=**} {
          allow read, write: if true;
        }
      }
    }
    ```
    **Remember:** These rules are insecure for public applications.
6.  **Rebuild the extension:** After configuring `firebaseConfig.ts`, rebuild the extension:
    ```bash
    npm run build:extension
    ```

The `src/firebaseConfig.ts` file is automatically ignored by Git (thanks to the `.gitignore` entry), so your API keys won't be accidentally committed to the repository.

## Usage

- Open ChatGPT (https://chat.openai.com/)
- A new button with a star icon will appear in the ChatGPT left sidebar
- Click the star to open the bookmarks sidebar panel
- You can create folders and add bookmarks to them

## License

MIT
