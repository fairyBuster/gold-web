/* ============================================================================
   reviewsApi.js — ulasan pengguna (halaman Ulasan Pengguna + Beri Rating).

   GET /api/reviews/ publik dan tanpa pagination; backend hanya mengirim 5
   ulasan terbaru yang sudah approved dan tidak di-hide. POST /api/reviews/
   butuh login dan multipart: `text` (min. 3 karakter) + `images` wajib
   (maks 5 file, masing-masing maks 1MB, JPG/JPEG/PNG/WEBP).
   ============================================================================ */

import { request } from './apiClient.js';

export async function fetchReviews() {
  const data = await request('GET', '/api/reviews/');
  if (Array.isArray(data)) return data;
  return Array.isArray(data?.results) ? data.results : [];
}

export function createReview({ text, images }) {
  const formData = new FormData();
  formData.append('text', text);
  (images || []).forEach((file) => formData.append('images', file));
  return request('POST', '/api/reviews/', formData);
}
