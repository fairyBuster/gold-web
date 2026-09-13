/* ============================================================================
   transactionFormat.js — shared display helpers for transaction list pages
   (history pages + the notification feed). All functions are pure.
   ============================================================================ */

/* Tolerant status → display group mapping (backend status labels vary). */
const SUCCESS_STATUSES = ['SUCCESS', 'SUCCESSFUL', 'COMPLETED', 'COMPLETE', 'APPROVED', 'DONE', 'PAID'];
const FAILED_STATUSES = ['FAILED', 'FAIL', 'REJECTED', 'REJECT', 'CANCELLED', 'CANCELED', 'EXPIRED'];

export function statusKind(status) {
  const value = String(status || '').toUpperCase();
  if (SUCCESS_STATUSES.includes(value)) return 'success';
  if (FAILED_STATUSES.includes(value)) return 'failed';
  return 'pending';
}

/* Backend timestamps arrive as "YYYY-MM-DD HH:mm:ss"; the space-separated
   form is Invalid Date on iOS Safari and Firefox, so normalize it to the
   'T' form before parsing. */
export function parseDate(iso) {
  return new Date(String(iso || '').replace(' ', 'T'));
}

/* "Rp115.000" — absolute value, no decimals. */
export function formatRupiah(value) {
  return `Rp${Math.abs(Number(value) || 0).toLocaleString('id-ID', { maximumFractionDigits: 0 })}`;
}

/* "10:24" — local wall-clock time from an ISO timestamp. */
export function formatTime(iso) {
  const date = parseDate(iso);
  if (Number.isNaN(date.getTime())) return '';
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

/* Day section label: Hari Ini / Kemarin / "12 September 2026". */
export function dayLabel(iso) {
  const date = parseDate(iso);
  if (Number.isNaN(date.getTime())) return 'Lainnya';
  const startOfDay = (value) => new Date(value.getFullYear(), value.getMonth(), value.getDate()).getTime();
  const diffDays = Math.round((startOfDay(new Date()) - startOfDay(date)) / 86400000);
  if (diffDays === 0) return 'Hari Ini';
  if (diffDays === 1) return 'Kemarin';
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

/* Signed amount label: "+Rp100.000", "-950 Poin" (POINT currency),
   "+1.200 USD" (any other currency). */
export function formatAmountLabel(value, currencyCode) {
  const amount = Number(value) || 0;
  const sign = amount < 0 ? '-' : '+';
  const digits = Math.abs(amount).toLocaleString('id-ID', { maximumFractionDigits: 0 });
  const currency = String(currencyCode || 'IDR').toUpperCase();
  if (currency === 'IDR') return `${sign}Rp${digits}`;
  if (currency.includes('POINT') || currency.includes('POIN')) return `${sign}${digits} Poin`;
  return `${sign}${digits} ${currency}`;
}

/* Collapses a newest-first item list into consecutive day groups:
   [{ label: 'Hari Ini', items: [...] }, ...]. */
export function groupByDay(items) {
  const groups = [];
  for (const item of items) {
    const label = dayLabel(item.created_at);
    const current = groups[groups.length - 1];
    if (current && current.label === label) current.items.push(item);
    else groups.push({ label, items: [item] });
  }
  return groups;
}
