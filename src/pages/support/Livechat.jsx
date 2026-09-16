import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { goBack } from '../../lib/backNav.js';
/* Live Chat: GET/POST /api/support/chat/... (thread dibuat otomatis backend). */
import { fetchChatMessages, sendChatMessage } from '../../lib/supportChatApi.js';
import NotifCard from '../../components/NotifCard.jsx';
import ListState from '../../components/ListState.jsx';
import { formatTime, groupByDay } from '../../lib/transactionFormat.js';
import img_1 from '../../assets/images/105_2418.svg';
import img_2 from '../../assets/images/7f43db77fdc0a54172b923d3fc56ba8f36714aa6.webp';
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
  /* Opaque canvas moved onto the root so it stays full-bleed on desktop;
     the header/chat/input containers fully cover it at every width. */
  background-image: linear-gradient(#f0f0f0, #f0f0f0);
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

/* Rantai flex harus utuh dari kolom konten sampai tiap section: wrapper di
   dalam root ikut direntangkan (bukan menyusut ke tinggi konten) supaya
   area chat mengisi ruang tersisa dan footer input terkunci di bawah layar. */
.page-livechat > div {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  width: 100%;
}

/* ---- inline section styles ---- */

/* CSS for section section:Header */
.page-livechat #section-header {
  width: 100%;
  display: flex;
  justify-content: center;
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
  min-height: 0; /* izinkan menyusut agar pesan panjang di-scroll di dalam */
  display: flex;
  justify-content: center;
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
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.page-livechat .msg-time {
  color: #a79c8f;
  font-size: 12px;
}

/* Pesan user rata kanan dengan bubble emas tanpa avatar; sudut kanan atas
   dibuat siku sebagai cerminan bubble CS di sisi kiri. */
.page-livechat .message-row.user {
  flex-direction: row-reverse;
}

.page-livechat .message-row.user .msg-content {
  align-items: flex-end;
  max-width: 85%;
}

.page-livechat .msg-bubble.user {
  background-color: #f1b04a;
  border-color: #f1b04a;
  border-radius: 12px 0 12px 12px;
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

.page-livechat .send-btn:disabled {
  opacity: 0.5;
  cursor: default;
}
`;

/* Jeda polling pesan baru. Balasan CS (sender_type ADMIN) diambil lewat
   since_id agar hanya pesan baru yang diunduh. */
const POLL_INTERVAL_MS = 5000;

/* Saran cepat saat percakapan masih kosong — tampil sampai user mengirim
   pesan pertamanya. Klik mengisi kolom teks (belum terkirim) agar user bisa
   mengubah dulu; "Lainnya" hanya memfokuskan input untuk tulis bebas. */
const QUICK_REPLIES = ['Kendala isi ulang', 'Status tarik dana', 'Lainnya'];

export default function Livechat() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState('');
  const chatRef = useRef(null);
  const inputRef = useRef(null);
  const lastIdRef = useRef(0);
  const pollBusyRef = useRef(false);

  /* Gabungkan pesan baru berdasarkan id (idempotent — hasil polling dan hasil
     kirim bisa tumpang tindih), lalu urutkan lama → baru. */
  const mergeMessages = useCallback((incoming) => {
    if (!Array.isArray(incoming) || incoming.length === 0) return;
    setMessages((prev) => {
      const byId = new Map(prev.map((msg) => [msg.id, msg]));
      incoming.forEach((msg) => { if (msg && msg.id != null) byId.set(msg.id, msg); });
      return [...byId.values()].sort((a, b) => a.id - b.id);
    });
  }, []);

  /* Muat seluruh pesan thread saat halaman dibuka. */
  const loadMessages = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchChatMessages();
      mergeMessages(data);
      setError('');
    } catch (err) {
      setError(err?.message || 'Gagal memuat chat.');
    } finally {
      setLoading(false);
    }
  }, [mergeMessages]);

  useEffect(() => { loadMessages(); }, [loadMessages]);

  /* Id pesan terakhir — dikirim sebagai since_id saat polling. */
  useEffect(() => {
    lastIdRef.current = messages.length ? messages[messages.length - 1].id : 0;
  }, [messages]);

  /* Polling ringan agar balasan CS muncul tanpa reload. Kegagalan poll
     didiamkan — percobaan berikutnya yang mencoba lagi. */
  useEffect(() => {
    const timer = window.setInterval(async () => {
      if (pollBusyRef.current) return;
      pollBusyRef.current = true;
      try {
        const data = await fetchChatMessages(lastIdRef.current ? { sinceId: lastIdRef.current } : undefined);
        setError('');
        mergeMessages(data);
      } catch {
        /* diamkan */
      } finally {
        pollBusyRef.current = false;
      }
    }, POLL_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [mergeMessages]);

  /* Selalu tampilkan pesan terbaru. */
  useEffect(() => {
    const el = chatRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, loading, sendError]);

  /* Kirim pesan — dari tombol kirim atau tombol Enter. Error tampil inline
     agar teks yang diketik tidak hilang. */
  const handleSend = async () => {
    if (sending) return;
    const text = input.trim();
    if (!text) {
      inputRef.current?.focus();
      return;
    }
    setSending(true);
    setSendError('');
    try {
      const data = await sendChatMessage(text);
      mergeMessages([data]);
      setInput('');
      inputRef.current?.focus();
    } catch (err) {
      setSendError(err?.message || 'Pesan gagal terkirim. Coba lagi ya.');
    } finally {
      setSending(false);
    }
  };

  /* Saran cepat mengisi kolom teks (bukan langsung terkirim) supaya user
     masih bisa mengubah pesannya dulu. "Lainnya" hanya memfokuskan input. */
  const handleQuickReply = (label) => {
    if (label !== 'Lainnya') setInput(label);
    inputRef.current?.focus();
  };

  const hasUserMessages = messages.some((msg) => msg.sender_type === 'USER');
  const showQuickReplies = !loading && !error && !hasUserMessages;

  return (
    <div className="page-livechat">
      <style>{styles}</style>
      <div>
              <section id="section-header">
                <header className="header-container">
                  <button className="back-btn" aria-label="Go back" onClick={(e) => { e.preventDefault(); goBack('/index/support/hubungi-cs'); }}>
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
                <main className="chat-container" ref={chatRef}>
                  {error ? (
                    <NotifCard variant="error" title="Gagal Memuat Chat" description={error} />
                  ) : loading ? (
                    <ListState text="Memuat chat…" />
                  ) : (
                    <>
                      {messages.length === 0 ? (
                        <ListState text="Belum ada pesan. Mulai chat dengan CS JelajahEmas." />
                      ) : (
                        groupByDay(messages).map((group) => (
                          <Fragment key={group.label}>
                            <div className="chat-date">
                              <span>{group.label}</span>
                            </div>
                            {group.items.map((msg) => {
                              const isUser = msg.sender_type === 'USER';
                              return (
                                <div className={`message-row${isUser ? ' user' : ''}`} key={msg.id}>
                                  {isUser ? null : (
                                    <div className="msg-avatar">
                                      <img src={img_2} alt="CS Avatar" />
                                    </div>
                                  )}
                                  <div className="msg-content">
                                    <div className={`msg-bubble${isUser ? ' user' : ''}`}>
                                      <p>{msg.message}</p>
                                    </div>
                                    <span className="msg-time">{formatTime(msg.created_at)}</span>
                                  </div>
                                </div>
                              );
                            })}
                          </Fragment>
                        ))
                      )}
                      {showQuickReplies ? (
                        <div className="quick-replies-wrapper">
                          <div className="quick-replies">
                            {QUICK_REPLIES.map((label) => (
                              <button key={label} className="reply-btn" onClick={() => handleQuickReply(label)}>{label}</button>
                            ))}
                          </div>
                        </div>
                      ) : null}
                    </>
                  )}
                  {sendError ? (
                    <NotifCard variant="error" title="Pesan Gagal Terkirim" description={sendError} />
                  ) : null}
                </main>
              </section>
              <section id="section-input">
                <footer className="input-container">
                  <div className="input-box">
                    <input
                      ref={inputRef}
                      type="text"
                      placeholder="Tulis pesan..."
                      aria-label="Type a message"
                      value={input}
                      maxLength={5000}
                      enterKeyHint="send"
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSend(); } }}
                    />
                  </div>
                  <button className="send-btn" aria-label="Send message" disabled={sending || !input.trim()} onClick={(e) => { e.preventDefault(); handleSend(); }}>
                    <img src={img_3} alt="" />
                  </button>
                </footer>
              </section>
            </div>

    </div>
  );
}
