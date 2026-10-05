import type { Course } from './types';
export interface BookClip { id: string; course: Course; page: number; title: string; image: string; created: number; }
function database(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const r = indexedDB.open('mate-u-duo-books', 2);
    r.onupgradeneeded = () => { for (const name of ['books', 'clips']) if (!r.result.objectStoreNames.contains(name)) r.result.createObjectStore(name); };
    r.onsuccess = () => resolve(r.result); r.onerror = () => reject(r.error);
    r.onblocked = () => reject(new Error('Cerrá las otras pestañas de la app y volvé a intentar.'));
  });
}
async function read<T>(store: string, key?: string): Promise<T> {
  const db = await database();
  try { return await new Promise((resolve, reject) => {
    const s = db.transaction(store).objectStore(store), r = key === undefined ? s.getAll() : s.get(key);
    r.onsuccess = () => resolve(r.result); r.onerror = () => reject(r.error);
  }); } finally { db.close(); }
}
async function write(store: string, key: string, value?: unknown) {
  const db = await database();
  try { await new Promise<void>((resolve, reject) => {
    const t = db.transaction(store, 'readwrite');
    if (value === undefined) t.objectStore(store).delete(key); else t.objectStore(store).put(value, key);
    t.oncomplete = () => resolve(); t.onerror = () => reject(t.error); t.onabort = () => reject(t.error);
  }); } finally { db.close(); }
}
export const storedBook = (course: Course) => read<ArrayBuffer | undefined>('books', course);
export async function saveBook(course: Course, data: ArrayBuffer) {
  await write('books', course, data);
  window.dispatchEvent(new CustomEvent('mate-book-changed', { detail: course }));
}
export async function storedClips(course: Course) { return (await read<BookClip[]>('clips')).filter(c => c.course === course).sort((a,b) => b.created-a.created); }
export const saveClip = (clip: BookClip) => write('clips', clip.id, clip);
export const deleteClip = (id: string) => write('clips', id);
