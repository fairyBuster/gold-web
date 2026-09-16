/* ============================================================================
   useTransactionFeed.js — loads & merges transaction types for list pages.
   ============================================================================ */

import { useEffect, useState } from 'react';
import { listAllTransactions } from './transactionsApi.js';
import { parseDate } from './transactionFormat.js';

/* Fetches every page for each of the given types in parallel, merging rows as
   they arrive and keeping the list sorted newest-first. `types` must be a
   module-level constant array so its identity stays stable across renders. An
   optional `status` is forwarded to the API filter so a page can restrict
   itself to e.g. only COMPLETED rows. Pages are published progressively: the
   first page that lands renders immediately (`loading` flips off as soon as
   anything is shown) instead of waiting for every type × page to finish. The
   `error` string is only set when every type request fails; partial failures
   are silently tolerated (the remaining types still render). */
export function useTransactionFeed(types, { status, startDate, errorMessage = 'Gagal memuat riwayat.' } = {}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    let pending = types.length;
    let successCount = 0;
    let firstError = null;
    /* The same row can arrive twice when two type filters overlap — keep one. */
    const seen = new Set();
    const collected = [];

    /* Merge one arriving page, re-sort newest-first and publish. */
    const publishChunk = (rows) => {
      if (!active || !Array.isArray(rows) || rows.length === 0) return;
      for (const row of rows) {
        if (row && row.id != null) {
          if (seen.has(row.id)) continue;
          seen.add(row.id);
        }
        collected.push(row);
      }
      collected.sort((a, b) => parseDate(b.created_at) - parseDate(a.created_at));
      setItems([...collected]);
      setLoading(false);
    };

    const settle = () => {
      pending -= 1;
      if (!active || pending > 0) return;
      if (successCount === 0) setError(firstError?.message || errorMessage);
      setLoading(false);
    };

    if (types.length === 0) {
      setLoading(false);
      return () => {
        active = false;
      };
    }

    types.forEach((type) => {
      listAllTransactions({ type, status, startDate }, { onPage: publishChunk })
        .then(() => { successCount += 1; })
        .catch((err) => { if (!firstError) firstError = err; })
        .finally(settle);
    });

    return () => {
      active = false;
    };
  }, [types, status, startDate, errorMessage]);

  return { items, loading, error };
}
