/* Styles are kept inline in this file so the component is a single-file import. */
const styles = `
.list-state {
  padding: 48px 0;
  text-align: center;
  color: #a79c8f;
  font-size: 13px;
  margin: 0;
}
`;

/**
 * Shared muted text for loading / empty list states.
 * Usage: <ListState text="Memuat riwayat…" />
 */
export default function ListState({ text }) {
  return (
    <>
      <style>{styles}</style>
      <p className="list-state">{text}</p>
    </>
  );
}
