/* Styles are kept inline in this file so the component is a single-file import. */
const styles = `
.list-pagination {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding-top: 8px;
}

.list-pagination .list-pagination-info {
  color: #a79c8f;
  font-size: 12px;
  margin: 0;
}

.list-pagination .load-more-button {
  background-color: #ffffff;
  color: #1a1410;
  border: 1px solid #efe7dc;
  border-radius: 999px;
  padding: 10px 24px;
  font-family: inherit;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0px 2px 8px 0px rgba(26, 20, 16, 0.06);
  transition: background-color 0.2s ease;
}

.list-pagination .load-more-button:hover {
  background-color: #f6f1e9;
}
`;

/**
 * Shared "load more" footer for transaction list pages.
 * Shows a shown/total counter and reveals the next batch of caller-side
 * items via onLoadMore. Renders nothing while everything fits in one batch.
 * Usage: <ListPagination visible={n} total={items.length} label="transaksi" onLoadMore={...} />
 */
export default function ListPagination({ visible = 0, total = 0, label = 'transaksi', pageSize = 8, onLoadMore }) {
  if (total <= pageSize) return null;
  const shown = Math.min(visible, total);

  return (
    <>
      <style>{styles}</style>
      <div className="list-pagination">
        <p className="list-pagination-info">
          Menampilkan {shown} dari {total} {label}
        </p>
        {shown < total && (
          <button type="button" className="load-more-button" onClick={onLoadMore}>
            Muat Lebih Banyak
          </button>
        )}
      </div>
    </>
  );
}
