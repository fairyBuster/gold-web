import img_1 from '../../assets/images/156_1523.svg';

/* Page styles are kept inline in this file so the page is a single-file import. */
const styles = `
/* Scoped styles for KebijakanPrivasi — converted from global.css + inline section styles.
   All selectors are pre-fixed with .page-kebijakan-privasi to isolate this page. */

.page-kebijakan-privasi {
  margin: 0;
  padding: 0;
  font-family: 'Inter', sans-serif;
  background-color: #fffbf4;
  background-image: radial-gradient(circle at top right, rgba(255, 180, 50, 0.15) 0%, transparent 400px);
  background-repeat: no-repeat;
  background-attachment: fixed;
  color: #514840;
  -webkit-font-smoothing: antialiased;
  min-height: 100vh;
  width: 100%;
}

.page-kebijakan-privasi .container {
  max-width: 100%;
  margin: 0 auto;
  padding: 0 22px;
  box-sizing: border-box;
}

.page-kebijakan-privasi, .page-kebijakan-privasi * {
  box-sizing: border-box;
}

/* ---- inline section styles ---- */

/* CSS for section section:Header */
.page-kebijakan-privasi .site-header {
    border-bottom: 1px solid #efe7dc;
    background-color: transparent;
  }
  .page-kebijakan-privasi .header-container {
    display: flex;
    align-items: center;
    gap: 14px;
    padding-top: 22px;
    padding-bottom: 16px;
  }
  .page-kebijakan-privasi .icon-btn {
    width: 38px;
    height: 38px;
    border-radius: 12px;
    background-color: #f6f1e9;
    border: none;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    padding: 0;
    transition: background-color 0.2s;
  }
  .page-kebijakan-privasi .icon-btn:hover {
    background-color: #efe7dc;
  }
  .page-kebijakan-privasi .page-title {
    font-size: 16px;
    font-weight: 700;
    color: #1a1410;
    margin: 0;
  }

/* CSS for section section:Intro */
.page-kebijakan-privasi .intro-container {
    padding-top: 20px;
  }
  .page-kebijakan-privasi .last-updated {
    color: #a79c8f;
    font-size: 12px;
    margin: 0 0 14px 0;
  }
  .page-kebijakan-privasi .highlight-box {
    background-color: #f6f1e9;
    border: 1px solid #e8790c;
    border-radius: 10px;
    padding: 14px 16px;
    margin-bottom: 14px;
  }
  .page-kebijakan-privasi .highlight-box p {
    color: #514840;
    font-size: 14px;
    line-height: 1.5;
    margin: 0;
  }

/* CSS for section section:PolicyDetails */
.page-kebijakan-privasi .policy-item {
    padding-bottom: 22px;
    margin-bottom: 14px;
    border-bottom: 1px solid #efe7dc;
  }
  .page-kebijakan-privasi .policy-item.no-border {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 32px;
  }
  .page-kebijakan-privasi .item-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
  }
  .page-kebijakan-privasi .bullet {
    width: 6px;
    height: 6px;
    background-color: #e8790c;
    border-radius: 3px;
    flex-shrink: 0;
  }
  .page-kebijakan-privasi .item-header h2 {
    font-size: 14px;
    font-weight: 700;
    color: #1a1410;
    margin: 0;
  }
  .page-kebijakan-privasi .policy-item p {
    font-size: 14px;
    color: #514840;
    line-height: 1.5;
    margin: 0;
  }
  .page-kebijakan-privasi .policy-list {
    list-style: none;
    padding: 0;
    margin: 8px 0 0 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .page-kebijakan-privasi .policy-list li {
    position: relative;
    padding-left: 14px;
    font-size: 14px;
    color: #514840;
    line-height: 1.5;
  }
  .page-kebijakan-privasi .policy-list li::before {
    content: '•';
    position: absolute;
    left: 0;
    top: 0;
    color: #514840;
  }
  .page-kebijakan-privasi .policy-list.numbered {
    counter-reset: policy-number;
  }
  .page-kebijakan-privasi .policy-list.numbered li {
    counter-increment: policy-number;
    padding-left: 18px;
  }
  .page-kebijakan-privasi .policy-list.numbered li::before {
    content: counter(policy-number) '.';
  }
  .page-kebijakan-privasi .intro-consent {
    font-size: 14px;
    color: #514840;
    line-height: 1.5;
    margin: 0 0 14px 0;
  }
  .page-kebijakan-privasi .policy-item p + p,
  .page-kebijakan-privasi .policy-list + p {
    margin-top: 8px;
  }
`;

export default function KebijakanPrivasi() {
  return (
    <div className="page-kebijakan-privasi">
      <style>{styles}</style>
      <div>
              <section id="section-header">
                <header className="site-header">
                  <div className="container header-container">
                    <button className="icon-btn" aria-label="Kembali" onClick={(e) => { e.preventDefault(); window.history.back(); }}>
                      <img src={img_1} alt="Back Icon" />
                    </button>
                    <h1 className="page-title">KEBIJAKAN PRIVASI JELAJAH EMAS</h1>
                  </div>
                </header>
              </section>
              <section id="section-intro">
                <div className="container intro-container">
                  <p className="last-updated">Terakhir diperbarui: 1 Juni 2026</p>
                  <div className="highlight-box">
                    <p>Jelajah Emas menghargai dan melindungi privasi setiap pengguna. Kebijakan Privasi ini menjelaskan bagaimana PT JELAJAH EMAS DIGITAL INDONESIA ("Jelajah Emas", "kami") memperoleh, menggunakan, menyimpan, melindungi, dan mengungkapkan data pribadi ketika Anda menggunakan aplikasi, situs web, serta layanan Jelajah Emas.</p>
                  </div>
                  <p className="intro-consent">Dengan menggunakan layanan Jelajah Emas, Anda menyatakan telah membaca dan memahami Kebijakan Privasi ini.</p>
                </div>
              </section>
              <section id="section-policy-details">
                <div className="container">
                  <div className="policy-item">
                    <div className="item-header">
                      <span className="bullet" />
                      <h2>1. Data yang Kami Kumpulkan</h2>
                    </div>
                    <p>Kami dapat mengumpulkan data berikut sesuai dengan layanan yang Anda gunakan:</p>
                    <ol className="policy-list numbered">
                      <li>Data akun, seperti nama, alamat email, nomor telepon, nama pengguna, kata sandi yang telah dienkripsi, dan foto profil.</li>
                      <li>Data profil, seperti tanggal lahir, jenis kelamin, alamat, minat, serta informasi lain yang Anda tambahkan secara sukarela.</li>
                      <li>Data aktivitas, seperti riwayat penggunaan fitur, pencarian, konten yang dilihat, favorit, komentar, serta interaksi lainnya dalam layanan.</li>
                      <li>Data perangkat dan teknis, seperti alamat IP, jenis perangkat, sistem operasi, identitas perangkat, versi aplikasi, bahasa, serta waktu akses.</li>
                      <li>Data lokasi, apabila Anda mengaktifkan izin lokasi untuk menggunakan fitur yang memerlukannya.</li>
                      <li>Data transaksi, seperti riwayat transaksi dan status pembayaran. Informasi kartu atau rekening dapat diproses langsung oleh penyedia pembayaran dan tidak selalu kami simpan.</li>
                      <li>Data komunikasi, termasuk pesan, pertanyaan, kritik, laporan, atau permintaan yang disampaikan kepada layanan pelanggan.</li>
                      <li>Data lain yang Anda berikan secara sukarela atau yang kami kumpulkan setelah memperoleh persetujuan Anda.</li>
                    </ol>
                  </div>
                  <div className="policy-item">
                    <div className="item-header">
                      <span className="bullet" />
                      <h2>2. Cara Kami Memperoleh Data</h2>
                    </div>
                    <p>Data pribadi dapat kami peroleh ketika Anda:</p>
                    <ul className="policy-list">
                      <li>membuat atau memperbarui akun;</li>
                      <li>menggunakan fitur Jelajah Emas;</li>
                      <li>mengisi formulir, survei, atau menghubungi layanan pelanggan;</li>
                      <li>memberikan izin akses tertentu pada perangkat;</li>
                      <li>melakukan transaksi melalui layanan; atau</li>
                      <li>mengakses aplikasi atau situs web kami.</li>
                    </ul>
                    <p>Kami juga dapat menerima data dari mitra yang sah, seperti penyedia autentikasi, pembayaran, analitik, atau layanan teknis, sesuai dengan izin dan ketentuan yang berlaku.</p>
                  </div>
                  <div className="policy-item">
                    <div className="item-header">
                      <span className="bullet" />
                      <h2>3. Tujuan Penggunaan Data</h2>
                    </div>
                    <p>Kami menggunakan data pribadi untuk:</p>
                    <ul className="policy-list">
                      <li>membuat, mengelola, dan mengamankan akun;</li>
                      <li>menyediakan serta menjalankan fitur Jelajah Emas;</li>
                      <li>memproses transaksi dan memberikan layanan yang diminta;</li>
                      <li>memberikan informasi, rekomendasi, atau konten yang relevan;</li>
                      <li>mengirim pemberitahuan penting mengenai akun dan layanan;</li>
                      <li>memberikan bantuan dan menanggapi pertanyaan pengguna;</li>
                      <li>mengevaluasi dan meningkatkan kualitas, keamanan, serta kinerja layanan;</li>
                      <li>mendeteksi dan mencegah penipuan, penyalahgunaan, atau pelanggaran;</li>
                      <li>memenuhi kewajiban hukum; serta</li>
                      <li>mengirim promosi apabila Anda telah memberikan persetujuan.</li>
                    </ul>
                    <p>Anda dapat berhenti menerima pesan promosi melalui fitur berhenti berlangganan atau dengan menghubungi kami.</p>
                  </div>
                  <div className="policy-item">
                    <div className="item-header">
                      <span className="bullet" />
                      <h2>4. Dasar Pemrosesan Data</h2>
                    </div>
                    <p>Kami memproses data pribadi berdasarkan satu atau beberapa dasar berikut:</p>
                    <ul className="policy-list">
                      <li>persetujuan yang Anda berikan;</li>
                      <li>pelaksanaan perjanjian atau penyediaan layanan kepada Anda;</li>
                      <li>pemenuhan kewajiban hukum;</li>
                      <li>perlindungan kepentingan vital pengguna;</li>
                      <li>pelaksanaan tugas untuk kepentingan umum, jika berlaku; atau</li>
                      <li>kepentingan sah lainnya dengan tetap memperhatikan hak Anda.</li>
                    </ul>
                    <p>Apabila pemrosesan didasarkan pada persetujuan, Anda dapat menarik persetujuan tersebut sesuai ketentuan yang berlaku. Penarikan persetujuan tidak membatalkan pemrosesan yang telah dilakukan secara sah sebelumnya.</p>
                  </div>
                  <div className="policy-item">
                    <div className="item-header">
                      <span className="bullet" />
                      <h2>5. Pengungkapan Data kepada Pihak Lain</h2>
                    </div>
                    <p>Kami tidak menjual data pribadi Anda. Data hanya dapat diberikan kepada:</p>
                    <ul className="policy-list">
                      <li>penyedia layanan teknologi, penyimpanan data, analitik, komunikasi, atau pembayaran;</li>
                      <li>mitra yang membantu menjalankan layanan Jelajah Emas;</li>
                      <li>penasihat profesional, auditor, atau penyedia keamanan;</li>
                      <li>instansi pemerintah atau aparat penegak hukum berdasarkan permintaan yang sah; atau</li>
                      <li>pihak lain dalam proses penggabungan, pengambilalihan, atau pengalihan usaha yang dilakukan sesuai hukum.</li>
                    </ul>
                    <p>Setiap pihak yang memproses data untuk kami diwajibkan menjaga kerahasiaan dan menggunakannya hanya untuk tujuan yang telah ditentukan.</p>
                  </div>
                  <div className="policy-item">
                    <div className="item-header">
                      <span className="bullet" />
                      <h2>6. Penyimpanan Data</h2>
                    </div>
                    <p>Data pribadi disimpan selama akun Anda aktif atau selama masih diperlukan untuk menyediakan layanan, memenuhi tujuan pengumpulan, menyelesaikan sengketa, dan menjalankan kewajiban hukum.</p>
                    <p>Setelah masa penyimpanan berakhir, data akan dihapus, dimusnahkan, atau dianonimkan sesuai dengan prosedur yang berlaku, kecuali penyimpanan lebih lama diwajibkan oleh hukum.</p>
                  </div>
                  <div className="policy-item">
                    <div className="item-header">
                      <span className="bullet" />
                      <h2>7. Keamanan Data</h2>
                    </div>
                    <p>Kami menerapkan langkah pengamanan teknis dan organisasi yang wajar, termasuk pembatasan akses, enkripsi, pemantauan sistem, dan evaluasi keamanan.</p>
                    <p>Meskipun demikian, tidak ada sistem elektronik yang sepenuhnya bebas dari risiko. Apabila terjadi insiden yang berdampak pada data pribadi Anda, kami akan melakukan penanganan dan pemberitahuan sesuai ketentuan hukum yang berlaku.</p>
                  </div>
                  <div className="policy-item">
                    <div className="item-header">
                      <span className="bullet" />
                      <h2>8. Hak Pengguna</h2>
                    </div>
                    <p>Sesuai dengan peraturan yang berlaku, Anda dapat meminta untuk:</p>
                    <ul className="policy-list">
                      <li>memperoleh informasi mengenai pemrosesan data pribadi;</li>
                      <li>mengakses dan mendapatkan salinan data pribadi;</li>
                      <li>memperbaiki atau memperbarui data yang tidak akurat;</li>
                      <li>menghapus atau memusnahkan data pribadi;</li>
                      <li>menarik persetujuan;</li>
                      <li>menghentikan atau membatasi pemrosesan data;</li>
                      <li>mengajukan keberatan terhadap keputusan otomatis yang berdampak signifikan;</li>
                      <li>memperoleh atau memindahkan data dalam format yang sesuai, apabila berlaku; serta</li>
                      <li>mengajukan pengaduan atau menuntut ganti rugi sesuai hukum.</li>
                    </ul>
                    <p>Permintaan dapat dikirimkan melalui kontak pada bagian akhir kebijakan ini. Untuk melindungi akun Anda, kami mungkin perlu melakukan verifikasi identitas sebelum memproses permintaan.</p>
                  </div>
                  <div className="policy-item">
                    <div className="item-header">
                      <span className="bullet" />
                      <h2>9. Izin Perangkat</h2>
                    </div>
                    <p>Jelajah Emas dapat meminta akses ke fitur perangkat seperti lokasi, kamera, galeri, atau notifikasi apabila diperlukan oleh fitur tertentu. Anda dapat mengubah izin tersebut melalui pengaturan perangkat.</p>
                    <p>Penonaktifan izin tertentu mungkin menyebabkan sebagian fitur tidak dapat digunakan secara optimal.</p>
                  </div>
                  <div className="policy-item">
                    <div className="item-header">
                      <span className="bullet" />
                      <h2>10. Cookie dan Teknologi Sejenis</h2>
                    </div>
                    <p>Situs web Jelajah Emas dapat menggunakan cookie atau teknologi sejenis untuk menjaga sesi masuk, mengingat preferensi, mengukur kinerja, dan meningkatkan pengalaman pengguna.</p>
                    <p>Anda dapat mengatur atau menolak cookie melalui pengaturan peramban. Cookie yang diperlukan untuk fungsi utama layanan mungkin tidak dapat dinonaktifkan.</p>
                  </div>
                  <div className="policy-item">
                    <div className="item-header">
                      <span className="bullet" />
                      <h2>11. Data Anak</h2>
                    </div>
                    <p>Layanan Jelajah Emas tidak ditujukan kepada pengguna berusia di bawah 18 tahun. Apabila layanan dapat digunakan oleh anak, pemrosesan data anak akan dilakukan setelah memperoleh persetujuan orang tua atau wali sesuai ketentuan hukum.</p>
                    <p>Jika Anda mengetahui bahwa data anak telah diberikan tanpa persetujuan yang semestinya, silakan hubungi kami agar dapat ditindaklanjuti.</p>
                  </div>
                  <div className="policy-item">
                    <div className="item-header">
                      <span className="bullet" />
                      <h2>12. Transfer Data</h2>
                    </div>
                    <p>Apabila data diproses atau disimpan di luar wilayah Indonesia, kami akan memastikan bahwa pemindahan tersebut dilakukan dengan perlindungan yang memadai dan sesuai dengan peraturan yang berlaku.</p>
                  </div>
                  <div className="policy-item">
                    <div className="item-header">
                      <span className="bullet" />
                      <h2>13. Tautan dan Layanan Pihak Ketiga</h2>
                    </div>
                    <p>Layanan kami dapat memuat tautan atau terhubung dengan layanan pihak ketiga. Kebijakan Privasi ini tidak mengatur praktik pihak ketiga tersebut. Kami menyarankan Anda membaca kebijakan privasi masing-masing layanan sebelum memberikan data pribadi.</p>
                  </div>
                  <div className="policy-item">
                    <div className="item-header">
                      <span className="bullet" />
                      <h2>14. Perubahan Kebijakan Privasi</h2>
                    </div>
                    <p>Kami dapat memperbarui Kebijakan Privasi ini untuk menyesuaikan perkembangan layanan, teknologi, atau peraturan. Perubahan akan diumumkan melalui aplikasi, situs web, email, atau media lain yang wajar.</p>
                    <p>Tanggal pembaruan terbaru akan dicantumkan pada bagian atas kebijakan ini.</p>
                  </div>
                  <div className="policy-item no-border">
                    <div className="item-header">
                      <span className="bullet" />
                      <h2>15. Hubungi Kami</h2>
                    </div>
                    <p>Apabila Anda memiliki pertanyaan, pengaduan, atau permintaan terkait data pribadi, silakan menghubungi:</p>
                    <p>Pengelola: PT JELAJAH EMAS DIGITAL INDONESIA</p>
                    <p>Email: cs@jelajahemas.com</p>
                    <p>Kami akan meninjau dan menanggapi permintaan Anda sesuai dengan ketentuan hukum yang berlaku.</p>
                  </div>
                </div>
              </section>
            </div>

    </div>
  );
}
