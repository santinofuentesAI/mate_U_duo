import type { Course } from './types';
// Books are imported privately. Do not fetch missing /books/*.pdf routes or
// mistake a hosting SPA fallback (HTTP 200 HTML) for a PDF.
export async function bundledBook(_course:Course):Promise<undefined> {return undefined;}
