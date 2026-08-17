(function () {
  'use strict';

  const DB_NAME = 'LuminaDB';
  const DB_VERSION = 2;
  let dbInstance = null;

  function initDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = (e) => {
        const database = e.target.result;
        if (!database.objectStoreNames.contains('books')) {
          database.createObjectStore('books', { keyPath: 'id' });
        }
        if (!database.objectStoreNames.contains('files')) {
          database.createObjectStore('files', { keyPath: 'id' });
        }
        if (!database.objectStoreNames.contains('notes')) {
          database.createObjectStore('notes', { keyPath: 'id' });
        }
      };
      request.onsuccess = (e) => {
        dbInstance = e.target.result;
        resolve(dbInstance);
      };
      request.onerror = (e) => {
        reject(e.target.error);
      };
    });
  }

  function getDB() {
    if (dbInstance) return Promise.resolve(dbInstance);
    return initDB();
  }

  window.LuminaDB = {
    async getNotes() {
      const database = await getDB();
      return new Promise((resolve, reject) => {
        const transaction = database.transaction('notes', 'readonly');
        const store = transaction.objectStore('notes');
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(request.error);
      });
    },

    async saveNote(note) {
      const database = await getDB();
      return new Promise((resolve, reject) => {
        const transaction = database.transaction('notes', 'readwrite');
        const store = transaction.objectStore('notes');
        const request = store.put(note);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    },

    async deleteNote(id) {
      const database = await getDB();
      return new Promise((resolve, reject) => {
        const transaction = database.transaction('notes', 'readwrite');
        const store = transaction.objectStore('notes');
        const request = store.delete(id);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    },

    async getBooks() {
      const database = await getDB();
      return new Promise((resolve, reject) => {
        const transaction = database.transaction('books', 'readonly');
        const store = transaction.objectStore('books');
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(request.error);
      });
    },

    async saveBook(book) {
      const database = await getDB();
      return new Promise((resolve, reject) => {
        const transaction = database.transaction('books', 'readwrite');
        const store = transaction.objectStore('books');
        const request = store.put(book);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    },

    async deleteBook(id) {
      const database = await getDB();
      const book = await this.getBook(id);
      if (book && book.pdfs) {
        for (const pdf of book.pdfs) {
          if (pdf.fileId) {
            await this.deleteFile(pdf.fileId);
          }
        }
      }
      return new Promise((resolve, reject) => {
        const transaction = database.transaction('books', 'readwrite');
        const store = transaction.objectStore('books');
        const request = store.delete(id);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    },

    async getBook(id) {
      const database = await getDB();
      return new Promise((resolve, reject) => {
        const transaction = database.transaction('books', 'readonly');
        const store = transaction.objectStore('books');
        const request = store.get(id);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    },

    async saveFile(id, blob) {
      const database = await getDB();
      return new Promise((resolve, reject) => {
        const transaction = database.transaction('files', 'readwrite');
        const store = transaction.objectStore('files');
        const request = store.put({ id, blob });
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    },

    async getFile(id) {
      const database = await getDB();
      return new Promise((resolve, reject) => {
        const transaction = database.transaction('files', 'readonly');
        const store = transaction.objectStore('files');
        const request = store.get(id);
        request.onsuccess = () => resolve(request.result ? request.result.blob : null);
        request.onerror = () => reject(request.error);
      });
    },

    async deleteFile(id) {
      const database = await getDB();
      return new Promise((resolve, reject) => {
        const transaction = database.transaction('files', 'readwrite');
        const store = transaction.objectStore('files');
        const request = store.delete(id);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    }
  };
})();
