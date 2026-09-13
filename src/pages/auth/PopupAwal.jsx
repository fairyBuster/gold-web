import PopupKomunitas from '../../components/PopupKomunitas.jsx';

/* Page styles are kept inline in this file so the page is a single-file import. */
const styles = `
/* Scoped styles for PopupAwal — page shell only.
   The popup itself lives in src/components/PopupKomunitas.jsx (styles inline in that file). */

.page-popup-awal {
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 0;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
  width: 100%;
}

.page-popup-awal, .page-popup-awal * {
  box-sizing: border-box;
}
`;

export default function PopupAwal() {
  return (
    <div className="page-popup-awal">
      <style>{styles}</style>
      <PopupKomunitas />
    </div>
  );
}
