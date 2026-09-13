import img_1 from '../../assets/images/105_2418.svg';
import img_2 from '../../assets/images/7f43db77fdc0a54172b923d3fc56ba8f36714aa6.png';
import img_3 from '../../assets/images/105_2458.svg';

/* Page styles are kept inline in this file so the page is a single-file import. */
const styles = `
/* Scoped styles for Livechat — converted from global.css + inline section styles.
   All selectors are pre-fixed with .page-livechat to isolate this page. */

.page-livechat, .page-livechat * {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.page-livechat {
  font-family: 'Inter', sans-serif;
  background-color: #f0f0f0; /* Desktop background */
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden; /* Prevent body scroll, handle scrolling inside chat area */
  min-height: 100vh;
  width: 100%;
}

/* Responsive container styles for desktop view */
@media (min-width: 413px) {
  .page-livechat .header-container,.page-livechat  .chat-container,.page-livechat  .input-container {
    border-left: 1px solid #e0e0e0;
    border-right: 1px solid #e0e0e0;
  }
  .page-livechat .input-container {
    box-shadow: 0px 30px 60px 0px rgba(26, 20, 16, 0.18);
  }
}

/* ---- inline section styles ---- */

/* CSS for section section:Header */
.page-livechat #section-header {
  width: 100%;
  display: flex;
  justify-content: center;
  background-color: #f0f0f0;
  flex-shrink: 0;
}

.page-livechat .header-container {
  width: 100%;
  max-width: 100%;
  background-color: #ffffff;
  border-bottom: 1px solid #efe7dc;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 18px 20px;
}

.page-livechat .back-btn {
  background-color: #f6f1e9;
  border: none;
  border-radius: 10px;
  width: 32px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  padding: 0;
}

.page-livechat .avatar-wrapper {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.page-livechat .avatar-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.page-livechat .cs-info {
  display: flex;
  flex-direction: column;
}

.page-livechat .cs-name {
  color: #1a1410;
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 2px 0;
}

.page-livechat .cs-status {
  color: #3fa66b;
  font-size: 12px;
  margin: 0;
}

/* CSS for section section:ChatArea */
.page-livechat #section-chat {
  width: 100%;
  flex: 1;
  display: flex;
  justify-content: center;
  background-color: #f0f0f0;
  overflow: hidden;
}

.page-livechat .chat-container {
  width: 100%;
  max-width: 100%;
  background-color: #fff9f2;
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  padding: 18px 16px;
}

.page-livechat .chat-date {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}

.page-livechat .chat-date span {
  color: #a79c8f;
  font-size: 12px;
}

.page-livechat .message-row {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 16px;
}

.page-livechat .msg-avatar {
  width: 33px;
  height: 33px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.page-livechat .msg-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.page-livechat .msg-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-width: calc(100% - 41px);
}

.page-livechat .msg-bubble {
  background-color: #ffffff;
  border: 1px solid #efe7dc;
  padding: 10px 14px;
  border-radius: 0 12px 12px 12px;
}

.page-livechat .msg-bubble p {
  margin: 0;
  color: #1a1410;
  font-size: 14px;
  line-height: 1.4;
}

.page-livechat .msg-time {
  color: #a79c8f;
  font-size: 12px;
}

.page-livechat .quick-replies-wrapper {
  margin-top: 8px;
}

.page-livechat .quick-replies {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */
}

.page-livechat .quick-replies::-webkit-scrollbar {
  display: none; /* Chrome/Safari */
}

.page-livechat .reply-btn {
  background-color: #ffffff;
  border: 1px solid #efe7dc;
  color: #514840;
  font-size: 14px;
  padding: 8px 14px;
  border-radius: 20px;
  white-space: nowrap;
  cursor: pointer;
  font-family: inherit;
}

/* CSS for section section:InputArea */
.page-livechat #section-input {
  width: 100%;
  display: flex;
  justify-content: center;
  background-color: #f0f0f0;
  flex-shrink: 0;
}

.page-livechat .input-container {
  width: 100%;
  max-width: 100%;
  background-color: #ffffff;
  border-top: 1px solid #efe7dc;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
}

.page-livechat .input-box {
  flex: 1;
  background-color: #f6f1e9;
  border-radius: 22px;
  padding: 11px 16px;
  display: flex;
  align-items: center;
}

.page-livechat .input-box input {
  width: 100%;
  background: transparent;
  border: none;
  outline: none;
  color: #1a1410;
  font-size: 14px;
  font-family: inherit;
}

.page-livechat .input-box input::placeholder {
  color: #a79c8f;
}

.page-livechat .send-btn {
  width: 38px;
  height: 38px;
  border-radius: 19px;
  border: none;
  background: linear-gradient(135deg, #ffc93c 0%, #e8790c 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  flex-shrink: 0;
  padding: 0;
}
`;

export default function Livechat() {
  return (
    <div className="page-livechat">
      <style>{styles}</style>
      <div>
              <section id="section-header">
                <header className="header-container">
                  <button className="back-btn" aria-label="Go back" onClick={(e) => { e.preventDefault(); window.history.back(); }}>
                    <img src={img_1} alt="" />
                  </button>
                  <div className="avatar-wrapper">
                    <img src={img_2} alt="CS JelajahEmas Avatar" />
                  </div>
                  <div className="cs-info">
                    <h1 className="cs-name">CS JelajahEmas</h1>
                    <p className="cs-status">Online • biasanya balas cepat</p>
                  </div>
                </header>
              </section>
              <section id="section-chat">
                <main className="chat-container">
                  <div className="chat-date">
                    <span>Hari Ini, 14:02</span>
                  </div>
                  <div className="message-row">
                    <div className="msg-avatar">
                      <img src={img_2} alt="CS Avatar" />
                    </div>
                    <div className="msg-content">
                      <div className="msg-bubble">
                        <p>Halo! Selamat datang di Live Chat<br />JelajahEmas. Ada yang bisa kami bantu<br />hari ini? 😊</p>
                      </div>
                      <span className="msg-time">14:02</span>
                    </div>
                  </div>
                  <div className="quick-replies-wrapper">
                    <div className="quick-replies">
                      <button className="reply-btn">Kendala isi ulang</button>
                      <button className="reply-btn">Status tarik dana</button>
                      <button className="reply-btn">Lainnya</button>
                    </div>
                  </div>
                </main>
              </section>
              <section id="section-input">
                <footer className="input-container">
                  <div className="input-box">
                    <input type="text" placeholder="Tulis pesan..." aria-label="Type a message" />
                  </div>
                  <button className="send-btn" aria-label="Send message">
                    <img src={img_3} alt="" />
                  </button>
                </footer>
              </section>
            </div>

    </div>
  );
}
