const DATABASE_NAME = "mcn-admin-drafts";
const STORE_NAME = "files";

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DATABASE_NAME, 1);

    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function loadAdminDraftFile(key: string): Promise<File | null> {
  if (!("indexedDB" in window)) return null;

  try {
    const database = await openDatabase();
    return await new Promise((resolve, reject) => {
      const transaction = database.transaction(STORE_NAME, "readonly");
      const request = transaction.objectStore(STORE_NAME).get(key);
      request.onsuccess = () => resolve(request.result instanceof File ? request.result : null);
      request.onerror = () => reject(request.error);
      transaction.oncomplete = () => database.close();
    });
  } catch (error) {
    console.warn("The saved admin file could not be restored.", error);
    return null;
  }
}

export async function saveAdminDraftFile(key: string, file: File | null): Promise<void> {
  if (!("indexedDB" in window)) return;

  try {
    const database = await openDatabase();
    await new Promise<void>((resolve, reject) => {
      const transaction = database.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      if (file) store.put(file, key);
      else store.delete(key);
      transaction.oncomplete = () => {
        database.close();
        resolve();
      };
      transaction.onerror = () => reject(transaction.error);
    });
  } catch (error) {
    console.warn("The admin file could not be saved for recovery.", error);
  }
}
