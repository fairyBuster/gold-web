import imgSuccess from '../assets/images/79_692.svg';
import imgError from '../assets/images/notif-error.svg';
import imgClose from '../assets/images/79_702.svg';

/* Styles are kept inline in this file so the component is a single-file import. */
const styles = `
.notif-card {
  width: 100%;
  background-color: #ffffff;
  border: 1px solid #efe7dc;
  border-radius: 16px;
  box-shadow: 0px 10px 24px 0px rgba(26, 20, 16, 0.1);
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  text-align: left;
}

.notif-card .icon-wrapper {
  background-color: rgba(255, 159, 28, 0.14);
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
}

.notif-card .notif-icon {
  width: 18px;
  height: 18px;
  object-fit: contain;
}

.notif-card.error .icon-wrapper {
  background-color: rgba(226, 76, 76, 0.12);
}

.notif-card .text-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex-grow: 1;
  padding-top: 2px;
}

.notif-card .notification-title {
  margin: 0;
  color: #1a1410;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.2;
}

.notif-card .notification-desc {
  margin: 0;
  color: #514840;
  font-size: 12px;
  font-weight: 400;
  line-height: 1.5;
}

.notif-card .close-button {
  background-color: #f6f1e9;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  border: none;
  padding: 0;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.notif-card .close-button:hover {
  background-color: #eaddc9;
}

.notif-card .close-icon {
  width: 10px;
  height: 10px;
  object-fit: contain;
}
`;

/**
 * Shared in-app notification card — used for API success/error messages.
 * Usage: <NotifCard variant="success|error" title="..." description="..." onClose={...} showClose={false} />
 * onClose defaults to going back in history; showClose={false} hides the X button.
 */
export default function NotifCard({
  variant = 'success',
  title = 'Login Berhasil',
  description = 'Selamat datang di Jelajah Emas. Akun Anda berhasil masuk dan siap digunakan.',
  onClose,
  showClose = true,
}) {
  const handleClose = (e) => {
    e.preventDefault();
    if (onClose) onClose();
    else window.history.back();
  };

  const isError = variant === 'error';

  return (
    <>
      <style>{styles}</style>
      <div className={`notif-card${isError ? ' error' : ''}`}>
        <div className="icon-wrapper">
          <img src={isError ? imgError : imgSuccess} alt={isError ? 'Error Icon' : 'Success Icon'} className="notif-icon" />
        </div>
        <div className="text-content">
          <h3 className="notification-title">{title}</h3>
          <p className="notification-desc">{description}</p>
        </div>
        {showClose && (
          <button type="button" className="close-button" aria-label="Close notification" onClick={handleClose}>
            <img src={imgClose} alt="Close Icon" className="close-icon" />
          </button>
        )}
      </div>
    </>
  );
}
