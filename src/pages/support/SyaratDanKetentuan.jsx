import img_1 from '../../assets/images/156_1523.svg';
import { goBack } from '../../lib/backNav.js';

/* Page styles are kept inline in this file so the page is a single-file import. */
const styles = `
/* Scoped styles for SyaratDanKetentuan — converted from global.css + inline section styles.
   All selectors are pre-fixed with .page-syarat-dan-ketentuan to isolate this page. */

.page-syarat-dan-ketentuan {
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 0;
  /* Opaque canvas on the root so it stays full-bleed on desktop; every
     section below keeps its own transparent canvas. */
  background-image: linear-gradient(#fff9f2, #fff9f2);
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  width: 100%;
}

.page-syarat-dan-ketentuan, .page-syarat-dan-ketentuan * {
  box-sizing: border-box;
}

.page-syarat-dan-ketentuan .app-container {
  width: 100%;
  max-width: 100%;
}

/* ---- inline section styles ---- */

/* CSS for section section:Header */
.page-syarat-dan-ketentuan .header {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 22px 20px 16px;
  border-bottom: 1px solid #efe7dc;
  background-color: #fff9f2;
  position: sticky;
  top: 0;
  z-index: 10;
}

.page-syarat-dan-ketentuan .back-btn {
  background-color: #f6f1e9;
  border: none;
  border-radius: 12px;
  width: 38px;
  height: 38px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  padding: 0;
}

.page-syarat-dan-ketentuan .header-title {
  font-size: 16px;
  font-weight: 600;
  color: #1a1410;
  margin: 0;
}

/* CSS for section section:Intro */
.page-syarat-dan-ketentuan .intro-content {
  padding: 20px 22px 14px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.page-syarat-dan-ketentuan .last-updated {
  font-size: 12px;
  color: #a79c8f;
  margin: 0;
}

.page-syarat-dan-ketentuan .intro-box {
  background-color: #f6f1e9;
  border: 1px solid #e8790c;
  border-radius: 10px;
  padding: 14px 16px;
}

.page-syarat-dan-ketentuan .intro-box p {
  margin: 0;
  color: #514840;
  font-size: 12px;
  line-height: 1.5;
  white-space: pre-wrap;
}

/* CSS for section section:Terms */
.page-syarat-dan-ketentuan .terms-content {
  padding: 0 22px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.page-syarat-dan-ketentuan .term-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 4px 0 18px;
  border-bottom: 1px solid #efe7dc;
}

.page-syarat-dan-ketentuan .term-item:last-child {
  border-bottom: none;
}

.page-syarat-dan-ketentuan .term-heading {
  display: flex;
  align-items: center;
  gap: 8px;
}

.page-syarat-dan-ketentuan .bullet {
  width: 6px;
  height: 6px;
  background-color: #e8790c;
  border-radius: 3px;
  flex-shrink: 0;
}

.page-syarat-dan-ketentuan .term-heading h2 {
  font-size: 14px;
  font-weight: 600;
  color: #1a1410;
  margin: 0;
}

.page-syarat-dan-ketentuan .term-text p {
  margin: 0;
  color: #514840;
  font-size: 12px;
  line-height: 1.5;
  white-space: pre-wrap;
}

/* CSS for section section:Footer */
.page-syarat-dan-ketentuan .footer-content {
  padding: 14px 22px 32px;
}

.page-syarat-dan-ketentuan .footer-content p {
  margin: 0;
  color: #514840;
  font-size: 12px;
  line-height: 1.5;
}
`;

export default function SyaratDanKetentuan() {
  return (
    <div className="page-syarat-dan-ketentuan">
      <style>{styles}</style>
      <div>
              <section id="section-header" className="app-container">
                <header className="header">
                  <button className="back-btn" aria-label="Back" onClick={(e) => { e.preventDefault(); goBack('/index/auth/welcome'); }}>
                    <img src={img_1} alt="Back Icon" />
                  </button>
                  <h1 className="header-title">Syarat &amp; Ketentuan</h1>
                </header>
              </section>
              <section id="section-intro" className="app-container">
                <div className="intro-content">
                  <p className="last-updated">Terakhir diperbarui: 1 Juni 2026</p>
                  <div className="intro-box">
                    <p>Selamat datang di Jelajah Emas. Syarat dan Ketentuan ini mengatur akses dan penggunaan situs web, aplikasi, fitur, layanan edukasi, serta fasilitas transaksi emas digital yang tersedia melalui Jelajah Emas (“Platform”).
                      Dengan membuat akun, mengakses, atau menggunakan Platform, Pengguna menyatakan telah membaca, memahami, dan menyetujui seluruh Syarat dan Ketentuan ini. Apabila Pengguna tidak menyetujui ketentuan tersebut, Pengguna diminta untuk tidak menggunakan layanan Jelajah Emas.</p>
                  </div>
                </div>
              </section>
              <section id="section-terms" className="app-container">
                <div className="terms-content">
                  <div className="term-item">
                    <div className="term-heading">
                      <span className="bullet" />
                      <h2>1. Ketentuan Umum</h2>
                    </div>
                    <div className="term-text">
                      <p>Jelajah Emas merupakan platform yang menyediakan informasi dan edukasi mengenai emas serta fasilitas yang memungkinkan Pengguna melakukan transaksi emas digital sesuai layanan yang tersedia pada Platform.
                        Dalam Syarat dan Ketentuan ini:
                        “Jelajah Emas” berarti platform, situs web, aplikasi, sistem, dan/atau layanan yang dioperasikan dengan merek Jelajah Emas.
                        “Pengguna” berarti setiap individu yang mengakses, mendaftar, atau menggunakan layanan Jelajah Emas.
                        “Emas Digital” berarti pencatatan kepemilikan atau saldo emas Pengguna secara elektronik berdasarkan satuan berat dan/atau nilai sebagaimana ditampilkan pada Platform dan sesuai dengan mekanisme layanan yang berlaku.
                        “Transaksi” berarti kegiatan pembelian, penjualan, dan aktivitas lain terkait emas digital yang tersedia melalui Platform.
                        Penggunaan Platform tunduk pada hukum dan peraturan perundang-undangan yang berlaku di Republik Indonesia.</p>
                    </div>
                  </div>
                  <div className="term-item">
                    <div className="term-heading">
                      <span className="bullet" />
                      <h2>2. Akun dan Kelayakan Pengguna</h2>
                    </div>
                    <div className="term-text">
                      <p>Untuk menggunakan fitur tertentu, termasuk transaksi emas digital, Pengguna dapat diwajibkan untuk membuat dan memverifikasi akun.
                        Pengguna wajib:
                        memberikan informasi yang benar, lengkap, akurat, dan terkini;
                        memenuhi persyaratan usia dan kecakapan hukum yang berlaku;
                        menyelesaikan proses verifikasi identitas apabila diwajibkan;
                        menjaga kerahasiaan kata sandi, kode OTP, PIN, dan informasi keamanan lainnya; dan
                        tidak memberikan akses akun kepada pihak lain untuk tujuan yang melanggar hukum atau ketentuan Platform.
                        Pengguna bertanggung jawab atas aktivitas yang dilakukan melalui akunnya sepanjang aktivitas tersebut terjadi akibat penggunaan kredensial atau akses yang berada dalam penguasaan Pengguna.
                        Jelajah Emas berhak meminta dokumen atau informasi tambahan untuk kepentingan verifikasi identitas, keamanan, pencegahan penipuan, kepatuhan, serta pelaksanaan kewajiban berdasarkan peraturan yang berlaku.</p>
                    </div>
                  </div>
                  <div className="term-item">
                    <div className="term-heading">
                      <span className="bullet" />
                      <h2>3. Layanan Edukasi dan Informasi</h2>
                    </div>
                    <div className="term-text">
                      <p>Jelajah Emas dapat menyediakan artikel, berita, data harga, kalkulator, grafik, panduan, analisis, materi pembelajaran, dan informasi lainnya mengenai emas.
                        Materi tersebut disediakan untuk tujuan informasi dan edukasi dan tidak dengan sendirinya merupakan nasihat keuangan, rekomendasi investasi pribadi, jaminan keuntungan, ataupun ajakan untuk melakukan transaksi tertentu.
                        Pengguna bertanggung jawab untuk mempertimbangkan kondisi keuangan, tujuan, kebutuhan, dan toleransi risikonya sendiri sebelum mengambil keputusan transaksi.
                        Jelajah Emas berupaya menyediakan informasi yang akurat dan relevan, namun tidak menjamin bahwa seluruh informasi akan selalu bebas dari kesalahan, lengkap, atau tersedia tanpa keterlambatan.</p>
                    </div>
                  </div>
                  <div className="term-item">
                    <div className="term-heading">
                      <span className="bullet" />
                      <h2>4. Transaksi Emas Digital</h2>
                    </div>
                    <div className="term-text">
                      <p>Pengguna yang memenuhi persyaratan dapat melakukan pembelian dan/atau penjualan emas digital melalui fitur yang tersedia pada Platform.
                        Sebelum mengonfirmasi transaksi, Pengguna akan diberikan informasi yang relevan mengenai transaksi, yang dapat mencakup harga emas, jumlah atau berat emas, nilai transaksi, biaya, serta informasi lainnya.
                        Transaksi dianggap diajukan setelah Pengguna memberikan konfirmasi melalui mekanisme yang disediakan Platform.
                        Harga yang digunakan adalah harga yang berlaku pada saat transaksi diproses atau dikonfirmasi sesuai mekanisme Jelajah Emas. Harga yang sebelumnya ditampilkan dapat berubah mengikuti kondisi pasar sebelum transaksi selesai.
                        Transaksi yang telah berhasil diproses dan dicatat oleh sistem pada prinsipnya bersifat final, kecuali terdapat kesalahan sistem, kewajiban berdasarkan hukum, atau keadaan lain yang menurut Jelajah Emas memerlukan koreksi atau pembatalan.
                        Ketentuan minimum dan maksimum transaksi dapat ditetapkan dan diubah dari waktu ke waktu serta akan diinformasikan melalui Platform.</p>
                    </div>
                  </div>
                  <div className="term-item">
                    <div className="term-heading">
                      <span className="bullet" />
                      <h2>5. Harga Emas dan Perubahan Nilai</h2>
                    </div>
                    <div className="term-text">
                      <p>Harga beli dan harga jual emas digital dapat berbeda. Selisih antara harga beli dan harga jual (“spread”) dapat berubah berdasarkan kondisi pasar, likuiditas, biaya operasional, sumber harga, serta faktor lainnya.
                        Harga emas dapat mengalami kenaikan maupun penurunan.
                        Nilai emas yang dimiliki Pengguna pada suatu waktu tidak menjamin nilai yang sama pada waktu berikutnya. Keuntungan pada periode sebelumnya juga tidak merupakan jaminan keuntungan di masa mendatang.
                        Dengan melakukan transaksi, Pengguna memahami dan menerima risiko perubahan harga tersebut.</p>
                    </div>
                  </div>
                  <div className="term-item">
                    <div className="term-heading">
                      <span className="bullet" />
                      <h2>6. Kepemilikan, Saldo dan Penyimpanan Emas</h2>
                    </div>
                    <div className="term-text">
                      <p>Setiap transaksi emas digital yang berhasil akan dicatat dalam akun Pengguna sesuai jumlah atau berat emas yang diperoleh atau dijual.
                        Informasi saldo emas yang ditampilkan pada akun merupakan catatan elektronik kepemilikan Pengguna berdasarkan sistem Jelajah Emas dan mekanisme penyimpanan atau pengelolaan emas yang digunakan oleh Platform.
                        Apabila penyimpanan, kustodian, perdagangan, atau penyediaan emas dilakukan melalui mitra pihak ketiga, Jelajah Emas dapat menggunakan layanan mitra tersebut sesuai perjanjian dan ketentuan yang berlaku.
                        Ketentuan mengenai dukungan emas fisik, kustodian, konversi atau pencetakan menjadi emas fisik, minimum penarikan, biaya, kadar emas, lokasi penyimpanan, dan mekanisme penyerahan—apabila tersedia—akan mengikuti informasi produk dan ketentuan khusus yang ditampilkan pada Platform.
                        Jelajah Emas tidak akan menyatakan suatu saldo emas didukung oleh emas fisik tertentu kecuali dukungan dan mekanisme tersebut memang berlaku pada produk yang bersangkutan.</p>
                    </div>
                  </div>
                  <div className="term-item">
                    <div className="term-heading">
                      <span className="bullet" />
                      <h2>7. Pembayaran dan Pencairan Dana</h2>
                    </div>
                    <div className="term-text">
                      <p>Pembayaran transaksi dapat dilakukan melalui metode pembayaran yang tersedia pada Platform, termasuk metode yang disediakan oleh penyedia layanan pembayaran pihak ketiga.
                        Pengguna wajib menggunakan sumber dana dan metode pembayaran yang sah serta tidak menggunakan Platform untuk transaksi yang berasal dari atau berkaitan dengan aktivitas yang melanggar hukum.
                        Dana hasil penjualan emas akan diproses sesuai metode pencairan yang tersedia dan dapat memerlukan waktu pemrosesan tertentu.
                        Keterlambatan yang terjadi pada bank, penyedia pembayaran, jaringan pembayaran, atau pihak ketiga lainnya dapat berada di luar kendali langsung Jelajah Emas.</p>
                    </div>
                  </div>
                  <div className="term-item">
                    <div className="term-heading">
                      <span className="bullet" />
                      <h2>8. Biaya</h2>
                    </div>
                    <div className="term-text">
                      <p>Jelajah Emas dapat mengenakan biaya tertentu sehubungan dengan penggunaan layanan, termasuk tetapi tidak terbatas pada biaya transaksi, penyimpanan, pembayaran, pencairan, pencetakan atau pengiriman emas fisik apabila fitur tersebut tersedia.
                        Besaran biaya yang berlaku akan diinformasikan kepada Pengguna melalui Platform atau sebelum transaksi dikonfirmasi apabila biaya tersebut berkaitan langsung dengan transaksi.
                        Pengguna bertanggung jawab atas kewajiban perpajakan pribadi yang mungkin timbul dari transaksi atau penggunaan layanan sesuai ketentuan perpajakan yang berlaku.</p>
                    </div>
                  </div>
                  <div className="term-item">
                    <div className="term-heading">
                      <span className="bullet" />
                      <h2>9. Risiko Penggunaan Layanan</h2>
                    </div>
                    <div className="term-text">
                      <p>Pengguna memahami bahwa transaksi emas memiliki risiko.
                        Risiko tersebut antara lain dapat meliputi perubahan harga emas, perbedaan harga beli dan jual, perubahan kondisi pasar, risiko likuiditas pada kondisi tertentu, gangguan sistem, keterlambatan layanan pihak ketiga, serta perubahan peraturan yang dapat memengaruhi layanan.
                        Jelajah Emas tidak menjanjikan atau menjamin tingkat keuntungan, imbal hasil tetap, kenaikan harga, maupun hasil finansial tertentu kepada Pengguna.
                        Keputusan untuk membeli, menyimpan, atau menjual emas merupakan keputusan Pengguna.</p>
                    </div>
                  </div>
                  <div className="term-item">
                    <div className="term-heading">
                      <span className="bullet" />
                      <h2>10. Larangan Penggunaan</h2>
                    </div>
                    <div className="term-text">
                      <p>Pengguna dilarang menggunakan Jelajah Emas untuk:
                        penipuan atau transaksi yang tidak sah;
                        pencucian uang atau pendanaan aktivitas yang dilarang;
                        penggunaan identitas palsu atau identitas milik pihak lain tanpa hak;
                        manipulasi transaksi atau penyalahgunaan promosi;
                        mengakses, merusak, mengganggu, atau mengeksploitasi sistem Platform;
                        menggunakan bot, script, atau metode otomatis yang tidak diizinkan untuk memanipulasi layanan;
                        melakukan transaksi menggunakan dana yang berasal dari aktivitas melanggar hukum; atau
                        aktivitas lain yang bertentangan dengan hukum atau Syarat dan Ketentuan ini.
                        Jelajah Emas berhak melakukan pemeriksaan, membatasi transaksi, menangguhkan akun, meminta verifikasi tambahan, atau mengambil tindakan lain yang diperlukan apabila terdapat indikasi pelanggaran, aktivitas mencurigakan, atau kewajiban berdasarkan hukum.</p>
                    </div>
                  </div>
                  <div className="term-item">
                    <div className="term-heading">
                      <span className="bullet" />
                      <h2>11. Keamanan Akun</h2>
                    </div>
                    <div className="term-text">
                      <p>Pengguna bertanggung jawab menjaga keamanan perangkat dan informasi autentikasi yang digunakan untuk mengakses akun.
                        Pengguna tidak boleh memberikan OTP, PIN, kata sandi, atau kode keamanan lainnya kepada pihak yang tidak berwenang.
                        Apabila Pengguna mengetahui atau mencurigai adanya akses tanpa izin, Pengguna harus segera menghubungi layanan pelanggan Jelajah Emas.
                        Jelajah Emas dapat melakukan tindakan pengamanan sementara terhadap akun apabila terdapat indikasi akses tidak sah atau aktivitas yang berpotensi merugikan Pengguna maupun Platform.</p>
                    </div>
                  </div>
                  <div className="term-item">
                    <div className="term-heading">
                      <span className="bullet" />
                      <h2>12. Gangguan dan Pemeliharaan Sistem</h2>
                    </div>
                    <div className="term-text">
                      <p>Jelajah Emas berupaya menjaga ketersediaan Platform, namun layanan dapat mengalami penghentian sementara akibat pemeliharaan, peningkatan sistem, gangguan jaringan, gangguan penyedia layanan pihak ketiga, keadaan darurat, atau kondisi lain di luar kendali yang wajar.
                        Dalam kondisi tersebut, beberapa fitur termasuk transaksi dapat dibatasi atau dihentikan sementara untuk menjaga keamanan dan integritas sistem.</p>
                    </div>
                  </div>
                  <div className="term-item">
                    <div className="term-heading">
                      <span className="bullet" />
                      <h2>13. Pembatasan Tanggung Jawab</h2>
                    </div>
                    <div className="term-text">
                      <p>Sepanjang diperbolehkan oleh hukum, Jelajah Emas tidak bertanggung jawab atas kerugian yang semata-mata timbul akibat perubahan harga emas atau keputusan transaksi yang dibuat sendiri oleh Pengguna.
                        Ketentuan ini tidak dimaksudkan untuk menghapus tanggung jawab Jelajah Emas yang menurut peraturan perundang-undangan tidak dapat dikecualikan atau dibatasi.
                        Apabila kerugian terjadi karena kesalahan sistem atau kesalahan yang secara langsung berada dalam tanggung jawab Jelajah Emas, penanganannya akan dilakukan berdasarkan hasil pemeriksaan dan ketentuan hukum yang berlaku.</p>
                    </div>
                  </div>
                  <div className="term-item">
                    <div className="term-heading">
                      <span className="bullet" />
                      <h2>14. Penangguhan dan Penutupan Akun</h2>
                    </div>
                    <div className="term-text">
                      <p>Pengguna dapat mengajukan penutupan akun sesuai prosedur yang tersedia, dengan ketentuan seluruh transaksi, saldo, kewajiban, atau proses pemeriksaan yang masih berjalan telah diselesaikan apabila diperlukan.
                        Jelajah Emas dapat membatasi atau menangguhkan akun apabila:
                        terdapat indikasi pelanggaran Syarat dan Ketentuan;
                        terdapat aktivitas yang tidak wajar atau mencurigakan;
                        diperlukan verifikasi tambahan;
                        terdapat permintaan atau kewajiban dari otoritas yang berwenang; atau
                        tindakan tersebut diperlukan untuk menjaga keamanan Platform dan Pengguna.
                        Hak Pengguna atas aset atau dana yang sah tetap akan ditangani sesuai hukum dan prosedur yang berlaku.</p>
                    </div>
                  </div>
                  <div className="term-item">
                    <div className="term-heading">
                      <span className="bullet" />
                      <h2>15. Privasi dan Perlindungan Data</h2>
                    </div>
                    <div className="term-text">
                      <p>Pengumpulan dan penggunaan data pribadi Pengguna dilakukan sesuai Kebijakan Privasi Jelajah Emas dan ketentuan perlindungan data pribadi yang berlaku.
                        Data dapat diproses untuk keperluan penyediaan layanan, verifikasi identitas, keamanan, pencegahan penipuan, pemrosesan transaksi, dukungan pelanggan, pemenuhan kewajiban hukum, serta tujuan lain sebagaimana dijelaskan dalam Kebijakan Privasi.</p>
                    </div>
                  </div>
                  <div className="term-item">
                    <div className="term-heading">
                      <span className="bullet" />
                      <h2>16. Hak Kekayaan Intelektual</h2>
                    </div>
                    <div className="term-text">
                      <p>Nama Jelajah Emas, logo, desain, tampilan Platform, materi edukasi, teks, grafik, ilustrasi, perangkat lunak, dan konten lain yang dimiliki atau digunakan secara sah oleh Jelajah Emas dilindungi berdasarkan ketentuan hak kekayaan intelektual yang berlaku.
                        Pengguna tidak diperkenankan menyalin, mendistribusikan, menjual, memodifikasi, atau menggunakan materi tersebut untuk tujuan komersial tanpa izin dari pemegang hak yang bersangkutan.</p>
                    </div>
                  </div>
                  <div className="term-item">
                    <div className="term-heading">
                      <span className="bullet" />
                      <h2>17. Perubahan Layanan dan Ketentuan</h2>
                    </div>
                    <div className="term-text">
                      <p>Jelajah Emas dapat memperbarui layanan maupun Syarat dan Ketentuan ini untuk menyesuaikan perkembangan layanan, teknologi, keamanan, kebijakan operasional, dan/atau peraturan perundang-undangan.
                        Perubahan material akan diinformasikan melalui Platform atau sarana komunikasi lain yang dianggap sesuai.
                        Penggunaan Platform setelah perubahan berlaku merupakan persetujuan terhadap ketentuan terbaru sepanjang diperbolehkan berdasarkan hukum yang berlaku.</p>
                    </div>
                  </div>
                  <div className="term-item">
                    <div className="term-heading">
                      <span className="bullet" />
                      <h2>18. Keadaan Kahar</h2>
                    </div>
                    <div className="term-text">
                      <p>Jelajah Emas tidak bertanggung jawab atas keterlambatan atau kegagalan pelaksanaan kewajiban yang disebabkan oleh keadaan di luar kendali yang wajar, termasuk bencana alam, kebakaran, perang, kerusuhan, gangguan telekomunikasi berskala luas, kegagalan infrastruktur, tindakan pemerintah, atau keadaan kahar lainnya.</p>
                    </div>
                  </div>
                  <div className="term-item">
                    <div className="term-heading">
                      <span className="bullet" />
                      <h2>19. Penyelesaian Keluhan dan Perselisihan</h2>
                    </div>
                    <div className="term-text">
                      <p>Apabila Pengguna mengalami kendala atau memiliki keluhan mengenai layanan, Pengguna dapat terlebih dahulu menghubungi layanan pelanggan Jelajah Emas melalui kanal resmi yang tersedia.
                        Jelajah Emas dan Pengguna akan mengupayakan penyelesaian perselisihan secara musyawarah.
                        Apabila perselisihan tidak dapat diselesaikan secara musyawarah, penyelesaiannya dilakukan sesuai mekanisme dan forum penyelesaian sengketa berdasarkan hukum Republik Indonesia yang berlaku.</p>
                    </div>
                  </div>
                  <div className="term-item">
                    <div className="term-heading">
                      <span className="bullet" />
                      <h2>20. Kontak</h2>
                    </div>
                    <div className="term-text">
                      <p>Pertanyaan, pengaduan, atau permintaan terkait layanan dan Syarat dan Ketentuan ini dapat disampaikan melalui kanal resmi Jelajah Emas.</p>
                      <p>Email: cs@jelajahemas.com</p>
                    </div>
                  </div>
                </div>
              </section>
              <section id="section-footer" className="app-container">
                <div className="footer-content">
                  <p>Dengan mendaftar dan/atau menggunakan layanan Jelajah Emas, Pengguna menyatakan telah membaca, memahami, dan menyetujui Syarat dan Ketentuan ini.</p>
                </div>
              </section>
            </div>

    </div>
  );
}
