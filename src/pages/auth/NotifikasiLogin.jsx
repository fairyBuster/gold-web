import NotifCard from '../../components/NotifCard.jsx';

/* Page styles are kept inline in this file so the page is a single-file import. */
const styles = `
/* Scoped styles for NotifikasiLogin — page shell only.
   The notification card lives in src/components/NotifCard.jsx (styles inline in that file). */

.page-notifikasi-login {
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f0f0f0;
  display: flex;
  justify-content: center;
  min-height: 100vh;
  width: 100%;
}

/* ---- inline section styles ---- */

/* CSS for section section:NotificationScreen */
.page-notifikasi-login #section-notification-screen {
  display: flex;
  justify-content: center;
  width: 100%;
  min-height: 100vh;
}

.page-notifikasi-login .screen-container {
  width: 100%;
  max-width: 100%;
  background-color: #fff9f2;
  padding: 20px;
  box-sizing: border-box;
  box-shadow: 0px 30px 60px 0px rgba(26, 20, 16, 0.18);
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  overflow: hidden;
}
`;

export default function NotifikasiLogin() {
  return (
    <div className="page-notifikasi-login">
      <style>{styles}</style>
      <section id="section-notification-screen">
        <div className="screen-container">
          <NotifCard />
        </div>
      </section>
    </div>
  );
}
