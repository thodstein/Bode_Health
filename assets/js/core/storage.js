const Storage = {
  get: (key, def = null) => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : def;
  },
  set: (key, val) => localStorage.setItem(key, JSON.stringify(val)),
  db: {
    open: () => new Promise((resolve, reject) => {
      const req = indexedDB.open('BodeHealthDB', 1);
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains('drugs')) db.createObjectStore('drugs', { keyPath: 'id' });
        if (!db.objectStoreNames.contains('labs')) db.createObjectStore('labs', { keyPath: 'id' });
        if (!db.objectStoreNames.contains('nutrition')) db.createObjectStore('nutrition', { keyPath: 'id' });
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    }),
    add: async (store, data) => {
      const db = await Storage.db.open();
      return new Promise((res, rej) => {
        const tx = db.transaction(store, 'readwrite');
        const req = tx.objectStore(store).add(data);
        req.onsuccess = () => res(req.result);
        req.onerror = () => rej(req.error);
      });
    },
    getAll: async (store) => {
      const db = await Storage.db.open();
      return new Promise((res, rej) => {
        const tx = db.transaction(store, 'readonly');
        const req = tx.objectStore(store).getAll();
        req.onsuccess = () => res(req.result);
        req.onerror = () => rej(req.error);
      });
    },
    delete: async (store, id) => {
      const db = await Storage.db.open();
      return new Promise((res, rej) => {
        const tx = db.transaction(store, 'readwrite');
        tx.objectStore(store).delete(id);
        tx.oncomplete = () => res();
      });
    }
  }
};
