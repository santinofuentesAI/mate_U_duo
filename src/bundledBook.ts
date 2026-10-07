import type { Course } from './types';
export async function bundledBook(course:Course):Promise<ArrayBuffer> {
  const response=await fetch(`${import.meta.env.BASE_URL}books/${course}.pdf`);
  if(!response.ok)throw new Error('No se pudo abrir el libro incluido en la app.');
  return response.arrayBuffer();
}
