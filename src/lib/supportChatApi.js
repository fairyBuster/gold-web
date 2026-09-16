/* ============================================================================
   supportChatApi.js — Live Chat halaman support.

   Thread chat dibuat otomatis oleh backend pada request pertama
   (SupportChatThread.get_or_create_active), jadi tidak ada endpoint terpisah
   untuk membuat thread.
   ============================================================================ */

import { request } from './apiClient.js';

/* GET /api/support/chat/messages/ — pesan pada thread aktif user.
   Respons berupa array datar (tanpa pagination):
   [{ id, thread, sender_type: 'USER' | 'ADMIN', message, created_at }].
   `sinceId` opsional — hanya mengambil pesan dengan id lebih besar dari itu
   (dipakai polling agar hanya pesan baru yang diunduh). */
export async function fetchChatMessages({ sinceId } = {}) {
  const query = sinceId ? `?since_id=${encodeURIComponent(sinceId)}` : '';
  const data = await request('GET', `/api/support/chat/messages/${query}`);
  return Array.isArray(data) ? data : [];
}

/* POST /api/support/chat/send/ — kirim pesan user ke thread aktif.
   Resolves to the created message (201): { id, thread, sender_type: 'USER',
   message, created_at }. Failure modes arrive as ApiError (400 validation /
   401 dead session). Pesan disanitasi di backend (max 5000 karakter). */
export function sendChatMessage(message) {
  return request('POST', '/api/support/chat/send/', { message });
}
