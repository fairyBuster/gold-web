import { useEffect, useState } from 'react';
import imgClose from '../assets/images/167_476.svg';
import imgTelegram from '../assets/images/167_489.svg';
import imgWhatsapp from '../assets/images/167_493.svg';
import imgHelp from '../assets/images/98_1430.svg';
import { listSupportLinks } from '../lib/supportLinksApi.js';

/* Styles are kept inline in this file so the component is a single-file import. */
const styles = `
.popup-komunitas .overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(26, 20, 16, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 24px;
}

.popup-komunitas .modal-container {
  width: 100%;
  max-width: 320px;
  background-color: #ffffff;
  border-radius: 24px;
  box-shadow: 0px 24px 50px 0px rgba(26, 20, 16, 0.25);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.popup-komunitas .modal-header {
  height: 160px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(180deg, #fff3d6 0%, #ffe29b 55%, #fff9f2 100%);
}

.popup-komunitas .sun-graphic {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background: radial-gradient(circle, #ffc93c 0%, #e8790c 65%, rgba(232, 121, 12, 0) 78%);
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.popup-komunitas .sun-glow {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  box-shadow: 0px 0px 0px 28px rgba(255, 159, 28, 0.06), 0px 0px 0px 14px rgba(255, 159, 28, 0.12);
}

.popup-komunitas .close-btn {
  position: absolute;
  top: 14px;
  right: 14px;
  width: 26px;
  height: 26px;
  background-color: rgba(26, 20, 16, 0.15);
  border-radius: 13px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  cursor: pointer;
  padding: 0;
}

.popup-komunitas .close-btn img {
  width: 11px;
  height: 11px;
}

.popup-komunitas .modal-content {
  padding: 20px 22px 22px 22px;
  display: flex;
  flex-direction: column;
}

.popup-komunitas .subtitle {
  color: #a79c8f;
  font-size: 12px;
  font-weight: 500;
  margin-bottom: 4px;
}

.popup-komunitas .title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.popup-komunitas .title {
  color: #1a1410;
  font-size: 20px;
  font-weight: 700;
  margin: 0;
  line-height: 1.3;
}

.popup-komunitas .badge {
  background-color: rgba(63, 166, 107, 0.14);
  color: #3fa66b;
  padding: 2px 8px;
  border-radius: 7px;
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
}

.popup-komunitas .description {
  color: #514840;
  font-size: 13px;
  line-height: 1.5;
  margin: 8px 0 0 0;
}

.popup-komunitas .action-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 16px;
}

.popup-komunitas .btn {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 9px;
  padding: 14px;
  border-radius: 14px;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  transition: opacity 0.2s;
}

.popup-komunitas .btn:hover {
  opacity: 0.9;
}

.popup-komunitas .btn img {
  width: 18px;
  height: 18px;
}

.popup-komunitas .btn-dark {
  background-color: #1a1410;
  color: #fff9f2;
}

.popup-komunitas .btn-primary {
  background-color: #f1b04a;
  color: #1a1410;
}

.popup-komunitas .btn-soft {
  background-color: #f6f1e9;
  color: #1a1410;
}
`;

/* Channel entries in GET /api/support/links/ (same mapping as HubungiCs):
   id 13 "Saluran Telegram", id 12 "Saluran WhatsApp", id 11 "Layanan
   Bantuan". */
const TELEGRAM_LINK_ID = 13;
const WHATSAPP_LINK_ID = 12;
const HELP_LINK_ID = 11;

/**
 * Shared "Gabung Komunitas Kami" popup.
 * Usage: <PopupKomunitas onClose={...} /> — renders a fixed overlay on any page.
 * The X button and a tap on the dark overlay both close it; onClose defaults
 * to going back in history.
 * Used by Home (shown once per page load — reappears after every refresh) and
 * by the standalone PopupAwal mockup page.
 * The action buttons open the Telegram/WhatsApp channels and the help service
 * configured in GET /api/support/links/; until those load (or when the request
 * fails) the hrefs fall back to '#' like the original mockup.
 */
export default function PopupKomunitas({
  onClose,
  subtitle = 'Komunitas',
  title = (
    <>
      Gabung Komunitas
      <br />
      Kami
    </>
  ),
  badge = 'Baru',
  description = 'Dapatkan info promo, event, dan diskusi seputar emas bareng ribuan member lainnya.',
}) {
  const [supportLinks, setSupportLinks] = useState([]);

  useEffect(() => {
    let active = true;
    listSupportLinks()
      .then((links) => {
        if (active) setSupportLinks(links);
      })
      .catch(() => {
        /* keep the '#' fallback */
      });
    return () => {
      active = false;
    };
  }, []);

  /* Entries soft-disabled by admin (is_active false) count as absent. */
  const telegramLink = supportLinks.find((link) => link.id === TELEGRAM_LINK_ID && link.is_active !== false);
  const whatsappLink = supportLinks.find((link) => link.id === WHATSAPP_LINK_ID && link.is_active !== false);
  const helpLink = supportLinks.find((link) => link.id === HELP_LINK_ID && link.is_active !== false);

  const handleClose = (e) => {
    e.preventDefault();
    if (onClose) onClose();
    else window.history.back();
  };

  return (
    <>
      <style>{styles}</style>
      <div className="popup-komunitas">
        {/* Tapping the dark backdrop (anywhere outside the card) closes the
            popup like the X; clicks inside the card bubble up here too, so
            only act when the overlay itself is the target. */}
        <div className="overlay" onClick={(e) => { if (e.target === e.currentTarget) handleClose(e); }}>
          <div className="modal-container">
            <div className="modal-header">
              <div className="sun-graphic">
                <div className="sun-glow" />
              </div>
              <button type="button" className="close-btn" aria-label="Close" onClick={handleClose}>
                <img src={imgClose} alt="" />
              </button>
            </div>
            <div className="modal-content">
              <div className="subtitle">{subtitle}</div>
              <div className="title-row">
                <h2 className="title">{title}</h2>
                <span className="badge">{badge}</span>
              </div>
              <p className="description">{description}</p>
              <div className="action-buttons">
                <a href={telegramLink?.url || '#'} className="btn btn-dark" onClick={(e) => { if (!telegramLink?.url) e.preventDefault(); }}>
                  <img src={imgTelegram} alt="" />
                  Gabung Telegram
                </a>
                <a href={whatsappLink?.url || '#'} className="btn btn-primary" onClick={(e) => { if (!whatsappLink?.url) e.preventDefault(); }}>
                  <img src={imgWhatsapp} alt="" />
                  Gabung WhatsApp
                </a>
                <a href={helpLink?.url || '#'} className="btn btn-soft" onClick={(e) => { if (!helpLink?.url) e.preventDefault(); }}>
                  <img src={imgHelp} alt="" />
                  Layanan Bantuan
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
