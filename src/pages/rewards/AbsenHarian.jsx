import img_1 from '../../assets/images/102_1724.svg';
import img_2 from '../../assets/images/f8f1a5b57a11f48b4845177ed85bf0e0ce6512a1.png';
import img_3 from '../../assets/images/102_1732.svg';
import img_4 from '../../assets/images/102_1737.svg';
import img_5 from '../../assets/images/102_1782.svg';
import img_6 from '../../assets/images/102_1782.svg';
import img_7 from '../../assets/images/102_1782.svg';
import img_8 from '../../assets/images/102_1782.svg';
import img_9 from '../../assets/images/102_1782.svg';
import img_10 from '../../assets/images/102_1782.svg';
import img_11 from '../../assets/images/102_1782.svg';
import img_12 from '../../assets/images/102_1782.svg';

/* Page styles are kept inline in this file so the page is a single-file import. */
const styles = `
/* Scoped styles for AbsenHarian — converted from global.css + inline section styles.
   All selectors are pre-fixed with .page-absen-harian to isolate this page. */

.page-absen-harian {
  margin: 0 auto;
  padding: 0;
  font-family: 'Inter', sans-serif;
  background-color: #fffbf4;
  background-image: 
    radial-gradient(circle at 80% 10%, rgba(255, 201, 60, 0.15) 0%, transparent 40%),
    radial-gradient(circle at 20% 90%, rgba(255, 159, 28, 0.15) 0%, transparent 40%);
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  max-width: 100%;
  box-shadow: 0px 30px 60px 0px rgba(26, 20, 16, 0.18);
  overflow-x: hidden;
  width: 100%;
}

.page-absen-harian, .page-absen-harian * {
  box-sizing: border-box;
}

/* ---- inline section styles ---- */

/* CSS for section section:Header */
.page-absen-harian .header {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 20px 20px 16px 20px;
  }
  .page-absen-harian .back-btn {
    width: 36px;
    height: 36px;
    background-color: #f6f1e9;
    border-radius: 11px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: none;
    cursor: pointer;
  }
  .page-absen-harian .header-title {
    color: #1a1410;
    font-size: 16px;
    font-weight: 600;
    margin: 0;
  }

/* CSS for section section:StreakCard */
.page-absen-harian .streak-card-wrapper {
    padding: 0 20px 20px 20px;
  }
  .page-absen-harian .streak-card {
    background: radial-gradient(circle at 50% 50%, #241c16 0%, #1a1410 55%, #120d09 100%);
    border-radius: 20px;
    padding: 22px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  .page-absen-harian .streak-icon {
    width: 56px;
    height: 56px;
    margin-bottom: 10px;
    object-fit: contain;
  }
  .page-absen-harian .streak-title {
    color: #fff9f2;
    font-size: 20px;
    font-weight: 700;
    margin: 0 0 4px 0;
  }
  .page-absen-harian .streak-subtitle {
    color: rgba(255, 249, 242, 0.55);
    font-size: 12px;
    margin: 0;
    line-height: 1.4;
  }

/* CSS for section section:Calendar */
.page-absen-harian .calendar-section {
    padding: 0 20px;
    display: flex;
    flex-direction: column;
  }
  .page-absen-harian .calendar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  .page-absen-harian .month-nav-btn {
    width: 28px;
    height: 28px;
    background-color: #f6f1e9;
    border-radius: 14px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: none;
    cursor: pointer;
  }
  .page-absen-harian .current-month {
    color: #1a1410;
    font-weight: 600;
    font-size: 14px;
  }
  .page-absen-harian .weekdays {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    margin-bottom: 10px;
  }
  .page-absen-harian .weekday {
    text-align: center;
    color: #a79c8f;
    font-size: 12px;
  }
  .page-absen-harian .calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, 48.86px);
    justify-content: space-between;
    row-gap: 5px;
  }
  .page-absen-harian .day-cell {
    width: 48.86px;
    height: 48.86px;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 2px;
    box-sizing: border-box;
  }
  .page-absen-harian .day-cell.empty {
    background: transparent;
    border: none;
  }
  .page-absen-harian .day-text {
    font-size: 14px;
    font-weight: 600;
    line-height: 1;
  }
  
  .page-absen-harian .day-completed {
    background-color: rgba(63, 166, 107, 0.1);
    border: 1px solid rgba(63, 166, 107, 0.3);
  }
  .page-absen-harian .day-completed .day-text {
    color: #3fa66b;
  }
  .page-absen-harian .check-icon-wrapper {
    width: 14px;
    height: 14px;
    background-color: #3fa66b;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .page-absen-harian .check-icon-wrapper img {
    width: 10px;
    height: 10px;
  }

  .page-absen-harian .day-current {
    background-color: rgba(255, 159, 28, 0.1);
    border: 1px solid #e8790c;
  }
  .page-absen-harian .day-current .day-text {
    color: #e8790c;
  }
  .page-absen-harian .dot-current {
    width: 5px;
    height: 5px;
    background-color: #e8790c;
    border-radius: 2.5px;
  }

  .page-absen-harian .day-future {
    background-color: #ffffff;
    border: 1px solid #efe7dc;
  }
  .page-absen-harian .day-future .day-text {
    color: #a79c8f;
  }
  .page-absen-harian .dot-future {
    width: 4px;
    height: 4px;
    background-color: #efe7dc;
    border-radius: 2px;
  }

/* CSS for section section:BottomAction */
.page-absen-harian .bottom-action-wrapper {
    padding: 20px;
    margin-top: auto;
    padding-top: 40px;
  }
  .page-absen-harian .btn-primary {
    width: 100%;
    background-color: #f1b04a;
    color: #1a1410;
    border: none;
    border-radius: 14px;
    padding: 15px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: opacity 0.2s;
  }
  .page-absen-harian .btn-primary:active {
    opacity: 0.8;
  }
`;

export default function AbsenHarian() {
  return (
    <div className="page-absen-harian">
      <style>{styles}</style>
      <div>
              <section id="section-header">
                <header className="header">
                  <button className="back-btn" aria-label="Go back" onClick={(e) => { e.preventDefault(); window.history.back(); }}>
                    <img src={img_1} alt="" />
                  </button>
                  <h1 className="header-title">Absen Harian</h1>
                </header>
              </section>
              <section id="section-streak-card" className="streak-card-wrapper">
                <div className="streak-card">
                  <img src={img_2} alt="Streak Icon" className="streak-icon" />
                  <h2 className="streak-title">4 Hari Berturut-turut</h2>
                  <p className="streak-subtitle">Lorem ipsum dolor sit amet, jangan putus streak kamu!</p>
                </div>
              </section>
              <section id="section-calendar" className="calendar-section">
                <div className="calendar-header">
                  <button className="month-nav-btn" aria-label="Previous Month">
                    <img src={img_3} alt="" />
                  </button>
                  <span className="current-month">September 2026</span>
                  <button className="month-nav-btn" aria-label="Next Month">
                    <img src={img_4} alt="" />
                  </button>
                </div>
                <div className="weekdays">
                  <div className="weekday">Sen</div>
                  <div className="weekday">Sel</div>
                  <div className="weekday">Rab</div>
                  <div className="weekday">Kam</div>
                  <div className="weekday">Jum</div>
                  <div className="weekday">Sab</div>
                  <div className="weekday">Min</div>
                </div>
                <div className="calendar-grid">
                  <div className="day-cell empty" />
                  <div className="day-cell day-completed"><span className="day-text">1</span><div className="check-icon-wrapper"><img src={img_5} alt="Completed" /></div></div>
                  <div className="day-cell day-completed"><span className="day-text">2</span><div className="check-icon-wrapper"><img src={img_6} alt="Completed" /></div></div>
                  <div className="day-cell day-completed"><span className="day-text">3</span><div className="check-icon-wrapper"><img src={img_7} alt="Completed" /></div></div>
                  <div className="day-cell day-completed"><span className="day-text">4</span><div className="check-icon-wrapper"><img src={img_8} alt="Completed" /></div></div>
                  <div className="day-cell day-completed"><span className="day-text">5</span><div className="check-icon-wrapper"><img src={img_9} alt="Completed" /></div></div>
                  <div className="day-cell day-completed"><span className="day-text">6</span><div className="check-icon-wrapper"><img src={img_10} alt="Completed" /></div></div>
                  <div className="day-cell day-completed"><span className="day-text">7</span><div className="check-icon-wrapper"><img src={img_11} alt="Completed" /></div></div>
                  <div className="day-cell day-completed"><span className="day-text">8</span><div className="check-icon-wrapper"><img src={img_12} alt="Completed" /></div></div>
                  <div className="day-cell day-current"><span className="day-text">9</span><div className="dot-current" /></div>
                  <div className="day-cell day-future"><span className="day-text">10</span><div className="dot-future" /></div>
                  <div className="day-cell day-future"><span className="day-text">11</span><div className="dot-future" /></div>
                  <div className="day-cell day-future"><span className="day-text">12</span><div className="dot-future" /></div>
                  <div className="day-cell day-future"><span className="day-text">13</span><div className="dot-future" /></div>
                  <div className="day-cell day-future"><span className="day-text">14</span><div className="dot-future" /></div>
                  <div className="day-cell day-future"><span className="day-text">15</span><div className="dot-future" /></div>
                  <div className="day-cell day-future"><span className="day-text">16</span><div className="dot-future" /></div>
                  <div className="day-cell day-future"><span className="day-text">17</span><div className="dot-future" /></div>
                  <div className="day-cell day-future"><span className="day-text">18</span><div className="dot-future" /></div>
                  <div className="day-cell day-future"><span className="day-text">19</span><div className="dot-future" /></div>
                  <div className="day-cell day-future"><span className="day-text">20</span><div className="dot-future" /></div>
                  <div className="day-cell day-future"><span className="day-text">21</span><div className="dot-future" /></div>
                  <div className="day-cell day-future"><span className="day-text">22</span><div className="dot-future" /></div>
                  <div className="day-cell day-future"><span className="day-text">23</span><div className="dot-future" /></div>
                  <div className="day-cell day-future"><span className="day-text">24</span><div className="dot-future" /></div>
                  <div className="day-cell day-future"><span className="day-text">25</span><div className="dot-future" /></div>
                  <div className="day-cell day-future"><span className="day-text">26</span><div className="dot-future" /></div>
                  <div className="day-cell day-future"><span className="day-text">27</span><div className="dot-future" /></div>
                  <div className="day-cell day-future"><span className="day-text">28</span><div className="dot-future" /></div>
                  <div className="day-cell day-future"><span className="day-text">29</span><div className="dot-future" /></div>
                  <div className="day-cell day-future"><span className="day-text">30</span><div className="dot-future" /></div>
                </div>
              </section>
              <section id="section-bottom-action" className="bottom-action-wrapper">
                <button className="btn-primary">Absen Sekarang</button>
              </section>
            </div>

    </div>
  );
}
