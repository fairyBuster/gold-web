/* ============================================================================
   useTransactionFeed.js — loads & merges transaction types for list pages.
   ============================================================================ */

import { useEffect, useState } from 'react';
import { listAllTransactions } from './transactionsApi.js';
import { parseDate } from './transactionFormat.js';

/* Fetches every page for each of the given types in parallel, merges the
   results and sorts them newest-first. `types` must be a module-level
   constant array so its identity stays stable across renders. An optional
   `status` is forwarded to the API filter so a page can restrict itself to
   e.g. only COMPLETED rows. The `error` string is only set when every type
   request fails; partial failures are silently tolerated (the remaining
   types still render). */
export function useTransactionFeed(types, { status, startDate, errorMessage = 'Gagal memuat riwayat.' } = {}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    Promise.allSettled(types.map((type) => listAllTransactions({ type, status, startDate }))).then((settled) => {
      if (!active) return;
      const fulfilled = settled.filter((result) => result.status === 'fulfilled');
      if (fulfilled.length === 0) {
        const failed = settled.find((result) => result.status === 'rejected');
        setError(failed?.reason?.message || errorMessage);
      } else {
        setItems(
          fulfilled
            .flatMap((result) => (Array.isArray(result.value) ? result.value : []))
            .sort((a, b) => parseDate(b.created_at) - parseDate(a.created_at))
        );
      }
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [types, status, startDate, errorMessage]);

  return { items, loading, error };
}
