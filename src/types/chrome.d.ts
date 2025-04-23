// Type declarations for Chrome extension API
declare namespace chrome {
  namespace storage {
    interface StorageArea {
      get(keys: string | string[] | null, callback: (items: { [key: string]: any }) => void): void;
      set(items: { [key: string]: any }, callback?: () => void): void;
      remove(keys: string | string[], callback?: () => void): void;
    }

    const sync: StorageArea;
    const local: StorageArea;
  }

  namespace tabs {
    interface Tab {
      id?: number;
      url?: string;
      title?: string;
    }

    function query(queryInfo: { active: boolean, currentWindow: boolean }, callback: (result: Tab[]) => void): void;
  }

  namespace runtime {
    function getURL(path: string): string;
  }
} 