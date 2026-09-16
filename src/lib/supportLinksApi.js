/* ============================================================================
   supportLinksApi.js — kanal bantuan resmi untuk halaman Hubungi CS.

   GET /api/support/links/ — daftar kanal (Telegram, WhatsApp, layanan
   bantuan) yang diatur admin. Respons terpaginasi:
   { count, next, previous, root_parent_phone,
     results: [{ id, title, url, platform: 'telegram' | 'whatsapp' | 'other',
                 description, icon, is_active, created_at, updated_at }] }.
   ============================================================================ */

import { request } from './apiClient.js';

/* Hasil berupa array datar (results); respons tanpa results dianggap kosong. */
export async function listSupportLinks() {
  const data = await request('GET', '/api/support/links/');
  return Array.isArray(data?.results) ? data.results : [];
}
