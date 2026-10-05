import type { Course } from './types';
// Fingerprints identify the exact files used when reviewing crop coordinates.
export const bookEditions: Record<Course, { title: string; sha256: string }> = {
  precalculo: { title: 'Precálculo 2024 · Didier Castro', sha256: 'f7163d26c4f147c7629f731be0b4914b5d6b3cdc36a304d80e56fadb08ab99f5' },
  discreta: { title: 'Introducción a la Matemática Discreta · 4.ª edición', sha256: '3ba95edf85f1cd982d49438680dbcd75f809c4e0e4f6374c7e6c06394a3caf75' },
};
export async function matchesBook(data: ArrayBuffer, course: Course) {
  const digest=await crypto.subtle.digest('SHA-256',data);
  return [...new Uint8Array(digest)].map(n=>n.toString(16).padStart(2,'0')).join('')===bookEditions[course].sha256;
}
