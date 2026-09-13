/* ============================================================================
   faqApi.js — isi halaman Pusat Bantuan.

   FAQ dikelola lewat Django admin (app `support`, model SupportFaq), lalu
   dibaca publik dari GET /api/support/faqs/ (tanpa pagination).
   ============================================================================ */

import { request } from './apiClient.js';

export async function fetchFaqs() {
  const data = await request('GET', '/api/support/faqs/');
  if (Array.isArray(data)) return data;
  return Array.isArray(data?.results) ? data.results : [];
}
