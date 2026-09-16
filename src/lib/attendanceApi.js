/* ============================================================================
   attendanceApi.js — attendance endpoints (Absen Harian page).
   ============================================================================ */

import { request } from './apiClient.js';

/* GET /api/attendance/logs/calendar/ — monthly attendance calendar of the
   current user, following the server date (WIB). Without year/month the
   backend answers with the running month; the params only pick which month
   is fetched (history browsing), they never change attendance data.
   Resolves to { year, month, today, attended_dates, missed_dates,
   attended_count, missed_count, streak, has_claimed_today, can_claim_today }.
   Dates after today are not sent (belum tersedia). Fails with 400 when the
   calendar feature is disabled by admin or year/month are invalid. */
export function getAttendanceCalendar({ year, month } = {}) {
  const params = new URLSearchParams();
  if (year) params.set('year', String(year));
  if (month) params.set('month', String(month));
  const query = params.toString();
  return request('GET', `/api/attendance/logs/calendar/${query ? `?${query}` : ''}`);
}

/* POST /api/attendance/logs/claim/ — claim today's attendance; the date is
   fixed by the server (WIB) and only one claim per day is possible.
   Resolves to { message, claimed_amount, streak, balance_type, balance_after,
   next_claim_date, log, transaction_id }. Fails with 400 when the user
   already claimed today or no active settings exist. */
export function claimAttendance() {
  return request('POST', '/api/attendance/logs/claim/');
}
