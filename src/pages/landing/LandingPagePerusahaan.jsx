import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import img_1 from '../../assets/images/3d6fb697a044e75c7a6c789438a276b40b37b5b9.png';
import img_2 from '../../assets/images/155_1183.svg';
import img_3 from '../../assets/images/payment.jpg';
import img_4 from '../../assets/images/secure.jpg';
import img_5 from '../../assets/images/fast.jpg';
import img_7 from '../../assets/images/one.png';
import img_8 from '../../assets/images/two.png';
import img_9 from '../../assets/images/three.png';
import img_10 from '../../assets/images/155_1354.svg';
import img_11 from '../../assets/images/155_1362.svg';
import img_12 from '../../assets/images/155_1362.svg';
import img_14 from '../../assets/images/0df4ee1cbf5b1725acac2d9d08fb45019361fa6e.png';
import img_15 from '../../assets/images/77d24c42cf84c32b2b4b166aa82a20eab63965b9.png';
import img_16 from '../../assets/images/155_1477.svg';
import img_17 from '../../assets/images/155_1480.svg';
import img_18 from '../../assets/images/155_1484.svg';
import imgHandphone from '../../assets/images/handphone.png';
import promoVideo from '../../assets/video/video.mp4';
/* Foto profil (pp) pengulas di section Testimoni — file .jpg per nama depan. */
import imgSalsa from '../../assets/images/salsa.jpg';
import imgAndi from '../../assets/images/andi.jpg';
import imgMaya from '../../assets/images/maya.jpg';
import imgRizki from '../../assets/images/rizki.jpg';
import imgCitra from '../../assets/images/citra.jpg';
import imgFajar from '../../assets/images/fajar.jpg';
import imgNadia from '../../assets/images/nadia.jpg';
import imgKevin from '../../assets/images/kevin.jpg';
import { useShowNotif } from '../../lib/useShowNotif.js';

/* Page styles are kept inline in this file so the page is a single-file import. */
const styles = `
/* Scoped styles for LandingPagePerusahaan — converted from global.css + inline section styles.
   All selectors are pre-fixed with .page-landing-page-perusahaan to isolate this page. */

.page-landing-page-perusahaan {
  --primary-color: #e8790c;
  --text-dark: #1a1410;
  --text-gray: #514840;
  --text-light-gray: #a79c8f;
  --bg-light: #ffffff;
  --bg-offwhite: #fff9f2;
  --bg-dark: #1a1410;
  --border-color: #efe7dc;
  --btn-bg: #f1b04a;
  min-height: 100vh;
  width: 100%;
}

.page-landing-page-perusahaan {
  font-family: 'Inter', sans-serif;
  margin: 0 auto;
  padding: 0;
  max-width: 100%;
  background-color: var(--bg-light);
  box-shadow: 0 0 20px rgba(0,0,0,0.05);
  overflow-x: hidden;
}

.page-landing-page-perusahaan section {
  padding: 30px 20px;
  box-sizing: border-box;
  width: 100%;
}

.page-landing-page-perusahaan h1,.page-landing-page-perusahaan  h2,.page-landing-page-perusahaan  h3,.page-landing-page-perusahaan  h4,.page-landing-page-perusahaan  p {
  margin: 0;
}

.page-landing-page-perusahaan .tag {
  color: var(--primary-color);
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
  text-align: center;
}

.page-landing-page-perusahaan .section-title {
  color: var(--text-dark);
  font-size: 24px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 16px;
  line-height: 1.3;
}

.page-landing-page-perusahaan .section-subtitle {
  color: var(--text-gray);
  font-size: 14px;
  text-align: center;
  line-height: 1.5;
  margin-bottom: 24px;
}

.page-landing-page-perusahaan .btn-primary {
  background-color: var(--btn-bg);
  color: var(--text-dark);
  border: none;
  border-radius: 14px;
  padding: 15px 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  text-align: center;
  display: inline-block;
  box-sizing: border-box;
  text-decoration: none;
}

/* ---- inline section styles ---- */

/* CSS for section section:Header */
.page-landing-page-perusahaan .site-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 20px;
  border-bottom: 1px solid var(--border-color);
  background-color: var(--bg-light);
}
.page-landing-page-perusahaan .logo {
  height: 45px;
  width: auto;
}
.page-landing-page-perusahaan .menu-btn {
  background-color: #f6f1e9;
  border: none;
  border-radius: 10px;
  width: 34px;
  height: 34px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

/* CSS for section section:Hero */
.page-landing-page-perusahaan .hero-section {
  background: radial-gradient(circle at 100% 0%, rgba(255, 159, 28, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 0% 100%, rgba(255, 255, 255, 0.6) 0%, transparent 50%);
  background-color: var(--bg-light);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 34px;
  padding-bottom: 0;
  overflow: hidden;
}
.page-landing-page-perusahaan .hero-section .btn-primary {
  margin-bottom: 40px;
}
/* Wrapper teks hero — netral di mobile (susunan tetap tengah seperti
   sebelumnya), jadi kolom kiri saat hero beralih dua kolom di desktop. */
.page-landing-page-perusahaan .hero-copy {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
/* Mockup ponsel memakai gambar handphone.png (kanvas 1000x1000, tepi
   transparan). Konten ponsel ~463px dari lebar kanvas, jadi width 432px
   menampilkan ponsel ~200px — proporsi sama dengan mockup CSS sebelumnya;
   margin bawah negatif memotong ujung ponsel di batas section ala desain
   (sisi transparan & bagian terpotong di‑clip oleh overflow hero-section). */
.page-landing-page-perusahaan .hero-mockup {
  display: block;
  width: 432px;
  margin-bottom: -37px;
}

/* CSS for section section:Features */
.page-landing-page-perusahaan .features-section {
  background-color: var(--bg-light);
}
.page-landing-page-perusahaan .feature-cards {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.page-landing-page-perusahaan .feature-card {
  border: 1px solid var(--border-color);
  border-radius: 16px;
  overflow: hidden;
  background-color: #fff;
}
.page-landing-page-perusahaan .feature-icon-wrapper {
  background-color: #f6f1e9;
  height: 208px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid rgba(26, 20, 16, 0.15);
}
.page-landing-page-perusahaan .feature-icon-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.page-landing-page-perusahaan .feature-content {
  padding: 14px;
}
.page-landing-page-perusahaan .feature-content h3 {
  font-size: 18px;
  color: var(--text-dark);
  margin-bottom: 4px;
}
.page-landing-page-perusahaan .feature-content p {
  font-size: 14px;
  color: var(--text-gray);
  line-height: 1.5;
}

/* CSS for section section:Video */
.page-landing-page-perusahaan .video-section {
  background-color: var(--bg-light);
  display: flex;
  flex-direction: column;
  align-items: center;
}
.page-landing-page-perusahaan .video-placeholder {
  background-color: #f6f1e9;
  border: 1px solid var(--border-color);
  border-radius: 16px;
  aspect-ratio: 854 / 480;
  width: 100%;
  overflow: hidden;
}
/* Video promosi (854x480). Frame mengikuti rasio asli video di semua lebar
   layar, jadi isi video tampil penuh tanpa bagian yang ter-crop. */
.page-landing-page-perusahaan .video-player {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* CSS for section section:Steps */
.page-landing-page-perusahaan .steps-section {
  background-color: var(--bg-light);
  display: flex;
  flex-direction: column;
  align-items: center;
}
.page-landing-page-perusahaan .steps-container {
  display: flex;
  flex-direction: column;
  gap: 30px;
  width: 100%;
}
.page-landing-page-perusahaan .step-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
.page-landing-page-perusahaan .step-icon {
  width: 150px;
  height: 150px;
  background-color: #fff;
  border: 1px solid rgba(26, 20, 16, 0.2);
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 16px;
}
.page-landing-page-perusahaan .step-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
  border-radius: inherit;
}
.page-landing-page-perusahaan .step-content h3 {
  font-size: 18px;
  color: var(--text-dark);
  margin-bottom: 8px;
}
.page-landing-page-perusahaan .step-content p {
  font-size: 14px;
  color: var(--text-gray);
  line-height: 1.5;
  max-width: 280px;
}

/* CSS for section section:Services */
.page-landing-page-perusahaan .services-section {
  background-color: var(--bg-light);
  padding-bottom: 10px;
}

/* CSS for section section:AppDownload */
.page-landing-page-perusahaan .app-download-section {
  background-color: var(--bg-light);
  padding-top: 10px;
}
.page-landing-page-perusahaan .download-card {
  background: linear-gradient(180deg, #241c16 0%, #1a1410 55%, #120d09 100%);
  border-radius: 20px;
  padding: 28px 22px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.page-landing-page-perusahaan .quote-text {
  color: #fff9f2;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.4;
  margin-bottom: 16px;
}
.page-landing-page-perusahaan .download-hint {
  color: rgba(255, 249, 242, 0.55);
  font-size: 14px;
  margin-bottom: 24px;
}

/* CSS for section section:FAQ */
.page-landing-page-perusahaan .faq-section {
  background-color: var(--bg-light);
}
.page-landing-page-perusahaan .faq-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.page-landing-page-perusahaan .faq-item {
  border: 1px solid var(--border-color);
  border-radius: 14px;
  background-color: #fff;
  overflow: hidden;
}
.page-landing-page-perusahaan .faq-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  cursor: pointer;
}
.page-landing-page-perusahaan .faq-header h3 {
  font-size: 14px;
  color: var(--text-dark);
  font-weight: 600;
  margin: 0;
}
.page-landing-page-perusahaan .faq-icon {
  width: 15px;
  height: 15px;
  transition: transform 0.3s ease;
}
.page-landing-page-perusahaan .faq-item.active .faq-icon {
  transform: rotate(180deg);
}
.page-landing-page-perusahaan .faq-body {
  padding: 0 16px 14px 16px;
  display: none;
}
.page-landing-page-perusahaan .faq-item.active .faq-body {
  display: block;
}
.page-landing-page-perusahaan .faq-body p {
  font-size: 14px;
  color: var(--text-gray);
  line-height: 1.5;
  margin: 0;
}

/* CSS for section section:Testimonials */
.page-landing-page-perusahaan .testimonials-section {
  background-color: var(--bg-light);
  overflow: hidden;
}
.page-landing-page-perusahaan .testimonials-scroll {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 20px;
  margin: 0 -20px;
  padding-left: 20px;
  padding-right: 20px;
  scrollbar-width: none;
}
.page-landing-page-perusahaan .testimonials-scroll::-webkit-scrollbar {
  display: none;
}
.page-landing-page-perusahaan .testimonial-card {
  min-width: 240px;
  border: 1px solid var(--border-color);
  border-radius: 14px;
  padding: 16px;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.page-landing-page-perusahaan .testimonial-author {
  display: flex;
  align-items: center;
  gap: 10px;
}
.page-landing-page-perusahaan .avatar {
  width: 38px;
  height: 38px;
  background-color: #f6f1e9;
  border: 1px solid rgba(26, 20, 16, 0.22);
  border-radius: 19px;
  overflow: hidden;
}
/* Foto profil (pp) — crop cover supaya penuh memenuhi lingkaran avatar. */
.page-landing-page-perusahaan .avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.page-landing-page-perusahaan .author-info h4 {
  font-size: 14px;
  color: var(--text-dark);
  margin: 0 0 2px 0;
}
.page-landing-page-perusahaan .author-info span {
  font-size: 12px;
  color: var(--text-light-gray);
}
.page-landing-page-perusahaan .testimonial-quote {
  font-size: 14px;
  color: var(--text-gray);
  line-height: 1.5;
  margin: 0;
}

/* CSS for section section:Newsletter */
.page-landing-page-perusahaan .newsletter-section {
  background-color: var(--bg-light);
}
.page-landing-page-perusahaan .newsletter-form {
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 28px 18px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.page-landing-page-perusahaan .form-group {
  width: 100%;
}
.page-landing-page-perusahaan .form-input {
  width: 100%;
  background-color: #f6f1e9;
  border: none;
  border-radius: 11px;
  padding: 12px 14px;
  font-size: 14px;
  color: var(--text-dark);
  box-sizing: border-box;
  font-family: 'Inter', sans-serif;
}
.page-landing-page-perusahaan .form-input::placeholder {
  color: var(--text-light-gray);
}
.page-landing-page-perusahaan .form-input:focus {
  outline: 1px solid var(--primary-color);
}
.page-landing-page-perusahaan .form-checkbox {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-top: 8px;
  margin-bottom: 16px;
}
.page-landing-page-perusahaan .form-checkbox input[type="checkbox"] {
  margin-top: 3px;
  width: 13px;
  height: 13px;
  border: 1px solid #767676;
  border-radius: 2.5px;
  cursor: pointer;
}
.page-landing-page-perusahaan .form-checkbox label {
  font-size: 12px;
  color: var(--text-gray);
  line-height: 1.4;
  cursor: pointer;
}
.page-landing-page-perusahaan .newsletter-success {
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 28px 18px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 6px;
}
.page-landing-page-perusahaan .newsletter-success .success-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--btn-bg);
  color: var(--text-dark);
  font-size: 20px;
  font-weight: 700;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 4px;
}
.page-landing-page-perusahaan .newsletter-success .success-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--text-dark);
}
.page-landing-page-perusahaan .newsletter-success .success-text {
  font-size: 12px;
  color: var(--text-gray);
  line-height: 1.5;
}

/* CSS for section section:Footer */
.page-landing-page-perusahaan .site-footer {
  background-color: var(--bg-dark);
  padding: 32px 20px 20px 20px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.page-landing-page-perusahaan .footer-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
}
/* The logo asset is black on a transparent background — whitened so it stays
   readable on the dark footer. */
.page-landing-page-perusahaan .footer-logo-img {
  height: 30px;
  width: auto;
  filter: brightness(0) invert(1);
}
.page-landing-page-perusahaan .footer-links-container {
  display: flex;
  gap: 40px;
}
.page-landing-page-perusahaan .footer-links-col {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.page-landing-page-perusahaan .footer-links-col h4 {
  color: #fff9f2;
  font-size: 14px;
  margin: 0;
}
.page-landing-page-perusahaan .footer-links-col a {
  color: rgba(255, 249, 242, 0.55);
  font-size: 14px;
  text-decoration: none;
}
.page-landing-page-perusahaan .footer-ojk {
  background-color: rgba(255, 249, 242, 0.06);
  border-radius: 12px;
  padding: 12px 14px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.page-landing-page-perusahaan .ojk-logos {
  display: flex;
  gap: 10px;
  align-items: center;
}
.page-landing-page-perusahaan .ojk-logos img {
  height: 17px;
  width: auto;
}
.page-landing-page-perusahaan .footer-ojk p {
  color: rgba(255, 249, 242, 0.6);
  font-size: 10px;
  line-height: 1.4;
  margin: 0;
}
.page-landing-page-perusahaan .footer-contact {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.page-landing-page-perusahaan .contact-label {
  color: rgba(255, 249, 242, 0.4);
  font-size: 12px;
}
.page-landing-page-perusahaan .contact-number {
  color: #fff9f2;
  font-size: 18px;
  font-weight: 700;
}
.page-landing-page-perusahaan .contact-alt {
  color: rgba(255, 249, 242, 0.5);
  font-size: 12px;
}
.page-landing-page-perusahaan .footer-social {
  display: flex;
  gap: 10px;
}
.page-landing-page-perusahaan .social-icon {
  width: 32px;
  height: 32px;
  background-color: rgba(255, 249, 242, 0.08);
  border-radius: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.2s;
}
.page-landing-page-perusahaan .social-icon:hover {
  background-color: rgba(255, 249, 242, 0.15);
}
.page-landing-page-perusahaan .footer-bottom {
  border-top: 1px solid rgba(255, 249, 242, 0.1);
  padding-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.page-landing-page-perusahaan .copyright {
  color: rgba(255, 249, 242, 0.35);
  font-size: 12px;
}
.page-landing-page-perusahaan .disclaimer {
  color: rgba(255, 249, 242, 0.35);
  font-size: 10px;
  line-height: 1.5;
}

/* ================= Desktop / layar lebar ================= */
/* Konten dirapikan: latar tetap full-bleed, tapi isi tiap section dibatasi
   lebar baca 1120px dan dipusatkan lewat padding kiri/kanan kalkulatif. */
@media (min-width: 768px) {
  .page-landing-page-perusahaan section,
  .page-landing-page-perusahaan .site-header,
  .page-landing-page-perusahaan .site-footer {
    padding-left: max(32px, calc((100% - 1120px) / 2));
    padding-right: max(32px, calc((100% - 1120px) / 2));
  }
  .page-landing-page-perusahaan .section-title {
    font-size: 30px;
  }
  .page-landing-page-perusahaan .section-subtitle {
    font-size: 15px;
    max-width: 720px;
    margin-left: auto;
    margin-right: auto;
  }
  .page-landing-page-perusahaan .site-header {
    padding-top: 22px;
    padding-bottom: 22px;
  }
  .page-landing-page-perusahaan .hero-section {
    padding-top: 48px;
  }
  .page-landing-page-perusahaan .hero-mockup {
    width: 480px;
    margin-bottom: -41px;
  }
  .page-landing-page-perusahaan .features-section,
  .page-landing-page-perusahaan .video-section,
  .page-landing-page-perusahaan .steps-section,
  .page-landing-page-perusahaan .faq-section,
  .page-landing-page-perusahaan .testimonials-section,
  .page-landing-page-perusahaan .newsletter-section {
    padding-top: 56px;
    padding-bottom: 56px;
  }
  .page-landing-page-perusahaan .feature-cards {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 20px;
  }
  .page-landing-page-perusahaan .video-placeholder {
    max-width: 820px;
    margin-left: auto;
    margin-right: auto;
    height: auto;
    aspect-ratio: 854 / 480;
  }
  .page-landing-page-perusahaan .steps-container {
    flex-direction: row;
    align-items: flex-start;
    gap: 32px;
  }
  .page-landing-page-perusahaan .step-item {
    flex: 1;
  }
  .page-landing-page-perusahaan .faq-list {
    max-width: 760px;
    margin-left: auto;
    margin-right: auto;
  }
  .page-landing-page-perusahaan .testimonials-scroll {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 16px;
    margin: 0;
    padding: 0;
    overflow: visible;
  }
  .page-landing-page-perusahaan .testimonial-card {
    min-width: 0;
  }
  .page-landing-page-perusahaan .app-download-section {
    padding-bottom: 56px;
  }
  .page-landing-page-perusahaan .download-card {
    max-width: 720px;
    margin-left: auto;
    margin-right: auto;
    padding: 40px 32px;
  }
  .page-landing-page-perusahaan .newsletter-form,
  .page-landing-page-perusahaan .newsletter-success {
    max-width: 560px;
    margin-left: auto;
    margin-right: auto;
  }
  .page-landing-page-perusahaan .site-footer {
    padding-top: 48px;
    padding-bottom: 28px;
    gap: 32px;
  }
  .page-landing-page-perusahaan .footer-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 48px;
  }
  .page-landing-page-perusahaan .footer-logo {
    margin-bottom: 0;
  }
  .page-landing-page-perusahaan .footer-links-container {
    gap: 64px;
  }
  .page-landing-page-perusahaan .footer-bottom {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 32px;
  }
  .page-landing-page-perusahaan .footer-bottom .disclaimer {
    max-width: 640px;
    text-align: right;
  }
}

@media (min-width: 1024px) {
  /* Hero dua kolom: teks di kiri, mockup ponsel di kanan — tetap terpotong
     di dasar section supaya efek "mengintip" dari bawah terjaga. */
  .page-landing-page-perusahaan .hero-section {
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 48px;
    padding-top: 56px;
  }
  .page-landing-page-perusahaan .hero-copy {
    width: auto;
    max-width: 460px;
    align-items: flex-start;
  }
  .page-landing-page-perusahaan .hero-copy .tag,
  .page-landing-page-perusahaan .hero-copy .section-title {
    text-align: left;
  }
  .page-landing-page-perusahaan .hero-copy .section-title {
    font-size: 34px;
  }
  .page-landing-page-perusahaan .hero-copy .btn-primary {
    width: auto;
    margin-bottom: 0;
    padding-left: 40px;
    padding-right: 40px;
  }
  .page-landing-page-perusahaan .hero-mockup {
    width: 460px;
    margin-bottom: -40px;
  }
}

@media (min-width: 1280px) {
  .page-landing-page-perusahaan .hero-copy {
    max-width: 520px;
  }
  .page-landing-page-perusahaan .hero-copy .section-title {
    font-size: 40px;
  }
  .page-landing-page-perusahaan .hero-mockup {
    width: 520px;
    margin-bottom: -44px;
  }
}
`;

export default function LandingPagePerusahaan() {
  const navigate = useNavigate();
  // FAQ items toggle independently, replicating the original global.js behaviour
  const [openFaq, setOpenFaq] = useState(() => new Set([0]));
  const toggleFaq = (index) => {
    setOpenFaq((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };
  // Newsletter form is a demo: a valid submit swaps the form for a success note.
  const [newsletterSent, setNewsletterSent] = useState(false);
  const [newsletterNama, setNewsletterNama] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterPhone, setNewsletterPhone] = useState('');
  const [newsletterTnc, setNewsletterTnc] = useState(false);
  const showNotif = useShowNotif();

  /* Validasi "belum diisi" tampil lewat halaman /notif (menggantikan
     validasi bawaan browser dari atribut required). */
  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!newsletterNama.trim()) { showNotif({ title: 'Lengkapi Data', description: 'Masukkan nama lengkap kamu.' }); return; }
    if (!newsletterEmail.trim()) { showNotif({ title: 'Lengkapi Data', description: 'Masukkan alamat email kamu.' }); return; }
    if (!newsletterEmail.includes('@')) { showNotif({ title: 'Lengkapi Data', description: 'Masukkan alamat email yang valid.' }); return; }
    if (!newsletterPhone.trim()) { showNotif({ title: 'Lengkapi Data', description: 'Masukkan nomor telepon kamu.' }); return; }
    if (!newsletterTnc) { showNotif({ title: 'Lengkapi Data', description: 'Setujui Syarat dan Ketentuan dulu ya.' }); return; }
    setNewsletterSent(true);
  };

  return (
    <div className="page-landing-page-perusahaan">
      <style>{styles}</style>
      <div>
              <header id="section-header" className="site-header">
                <img src={img_1} alt="JelajahEmas Logo" className="logo" />
                <button className="menu-btn" aria-label="Menu" onClick={(e) => { e.preventDefault(); navigate('/index/auth/login'); }}>
                  <img src={img_2} alt="" />
                </button>
              </header>
              <section id="section-hero" className="hero-section">
                <div className="hero-copy">
                  <div className="tag">#LangkahEmasmu</div>
                  <h1 className="section-title">Kenal Lebih Dekat, Jelajah Lebih Mudah</h1>
                  <Link to="/index/auth/login" className="btn-primary">Download JelajahEmas</Link>
                </div>
                <img className="hero-mockup" src={imgHandphone} alt="Tampilan Aplikasi JelajahEmas" />
              </section>
              <section id="section-features" className="features-section">
                <h2 className="section-title">Transaksi Nyaman Dalam Genggaman</h2>
                <p className="section-subtitle">Kenali emas digital lebih dekat, pahami cara kerjanya, dan temukan berbagai informasi seputar emas dalam satu tempat.</p>
                <div className="feature-cards">
                  <div className="feature-card">
                    <div className="feature-icon-wrapper">
                      <img src={img_3} alt="Kemudahan Bertransaksi" />
                    </div>
                    <div className="feature-content">
                      <h3>Kemudahan Bertransaksi</h3>
                      <p>Pelajari, kelola, dan akses berbagai layanan emas digital dengan lebih mudah dalam satu platform.</p>
                    </div>
                  </div>
                  <div className="feature-card">
                    <div className="feature-icon-wrapper">
                      <img src={img_4} alt="Keamanan yang Utama" />
                    </div>
                    <div className="feature-content">
                      <h3>Keamanan yang Utama</h3>
                      <p>Keamanan akun dan setiap aktivitas kamu menjadi prioritas, agar menggunakan layanan Jelajah Emas terasa lebih aman dan nyaman.</p>
                    </div>
                  </div>
                  <div className="feature-card">
                    <div className="feature-icon-wrapper">
                      <img src={img_5} alt="Kecepatan yang Menjawab Kebutuhan" />
                    </div>
                    <div className="feature-content">
                      <h3>Kecepatan yang Menjawab Kebutuhan</h3>
                      <p>Akses informasi dan berbagai layanan Jelajah Emas dengan proses yang cepat, praktis, dan mudah digunakan.</p>
                    </div>
                  </div>
                </div>
              </section>
              <section id="section-video" className="video-section">
                <div className="tag">#LangkahEmasmu</div>
                <p className="section-subtitle">Mulai kenali emas digital dengan cara yang lebih sederhana. Temukan informasi, edukasi, dan berbagai layanan dalam satu tempat.</p>
                <div className="video-placeholder">
                  {/* autoPlay wajib disertai muted agar diizinkan browser; user bisa unmute via controls. */}
                  <video className="video-player" src={promoVideo} autoPlay muted playsInline controls preload="auto" />
                </div>
              </section>
              <section id="section-steps" className="steps-section">
                <h2 className="section-title">Pengalaman Baru Semakin Memudahkanmu!</h2>
                <p className="section-subtitle">Tampilan yang lebih sederhana dan fitur yang lebih lengkap, membuat pengalaman menjelajahi informasi dan layanan emas digital jadi semakin mudah.</p>
                <div className="steps-container">
                  <div className="step-item">
                    <div className="step-icon">
                      <img src={img_7} alt="Step 1" />
                    </div>
                    <div className="step-content">
                      <h3>Mulai Dalam Satu Langkah!</h3>
                      <p>Daftar dan verifikasi akun dengan mudah untuk mulai menjelajahi informasi, edukasi, dan berbagai layanan Jelajah Emas.</p>
                    </div>
                  </div>
                  <div className="step-item">
                    <div className="step-icon">
                      <img src={img_8} alt="Step 2" />
                    </div>
                    <div className="step-content">
                      <h3>Kemudahan Investasi Emas!</h3>
                      <p>Mulai kenali dan miliki emas digital dengan cara yang lebih praktis, fleksibel, dan mudah diakses kapan saja.</p>
                    </div>
                  </div>
                  <div className="step-item">
                    <div className="step-icon">
                      <img src={img_9} alt="Step 3" />
                    </div>
                    <div className="step-content">
                      <h3>1 User ID, Semua Kebutuhan</h3>
                      <p>Satu akun untuk mengakses informasi, edukasi, dan berbagai layanan Jelajah Emas dengan lebih mudah.</p>
                    </div>
                  </div>
                </div>
              </section>
              <section id="section-services" className="services-section">
                <h2 className="section-title">Mau Nabung dan Cetak Emas?</h2>
                <p className="section-subtitle">Temukan panduan lengkap untuk mengenal fitur tabungan emas, cetak emas, dan berbagai layanan Jelajah Emas dengan lebih mudah.</p>
              </section>
              <section id="section-app-download" className="app-download-section">
                <div className="download-card">
                  <h2 className="quote-text">“Melangkah dan Kembangkan Finansialmu<br />#LangkahEmasmu!”</h2>
                  <p className="download-hint">Klik untuk mengunduh aplikasi</p>
                  <Link to="/index/auth/login" className="btn-primary">Download JelajahEmas</Link>
                </div>
              </section>
              <section id="section-faq" className="faq-section">
                <h2 className="section-title">Pertanyaan Seputar JelajahEmas</h2>
                <p className="section-subtitle">Temukan jawaban singkat untuk beberapa pertanyaan yang paling sering ditanyakan seputar Jelajah Emas.</p>
                <div className="faq-list">
                  <div className={`faq-item${openFaq.has(0) ? ' active' : ''}`}>
                    <div className="faq-header" onClick={() => toggleFaq(0)}>
                      <h3>1. Bagaimana cara mendaftar di Jelajah Emas?</h3>
                      <img src={img_10} alt="Toggle" className="faq-icon" />
                    </div>
                    <div className="faq-body">
                      <p>Daftar menggunakan nomor ponsel dan email aktif, buat kata sandi, lalu ikuti proses verifikasi akun. Setelah verifikasi selesai, kamu dapat mulai menjelajahi berbagai informasi dan layanan yang tersedia.</p>
                    </div>
                  </div>
                  <div className={`faq-item${openFaq.has(1) ? ' active' : ''}`}>
                    <div className="faq-header" onClick={() => toggleFaq(1)}>
                      <h3>2. Apakah Jelajah Emas aman digunakan?</h3>
                      <img src={img_11} alt="Toggle" className="faq-icon" />
                    </div>
                    <div className="faq-body">
                      <p>Jelajah Emas mengutamakan keamanan akun dan aktivitas pengguna melalui sistem perlindungan dan proses verifikasi. Pastikan kamu juga menjaga kerahasiaan kata sandi, PIN, dan kode verifikasi serta hanya menggunakan kanal resmi Jelajah Emas.</p>
                    </div>
                  </div>
                  <div className={`faq-item${openFaq.has(2) ? ' active' : ''}`}>
                    <div className="faq-header" onClick={() => toggleFaq(2)}>
                      <h3>3. Apa saja yang bisa dilakukan di Jelajah Emas?</h3>
                      <img src={img_12} alt="Toggle" className="faq-icon" />
                    </div>
                    <div className="faq-body">
                      <p>Kamu dapat mempelajari berbagai informasi seputar emas digital, melihat perkembangan harga emas, mengakses layanan emas digital, hingga menggunakan fitur pencetakan emas fisik yang tersedia.</p>
                    </div>
                  </div>
                </div>
              </section>
              <section id="section-testimonials" className="testimonials-section">
                <h2 className="section-title">Kata Mereka tentang JelajahEmas</h2>
                <p className="section-subtitle">Cerita dari pengguna yang telah menjelajahi berbagai informasi dan layanan emas digital bersama Jelajah Emas.</p>
                <div className="testimonials-scroll">
                  <div className="testimonial-card">
                    <div className="testimonial-author">
                      <div className="avatar">
                        <img src={imgSalsa} alt="Salsa Aulia" />
                      </div>
                      <div className="author-info">
                        <h4>Salsa Aulia</h4>
                        <span>Mahasiswa, 23th</span>
                      </div>
                    </div>
                    <p className="testimonial-quote">“Baru mulai belajar soal emas dan ternyata banyak istilah yang sebelumnya aku nggak ngerti. Penjelasan di Jelajah Emas ringan, jadi lebih gampang dipahami.”</p>
                  </div>
                  <div className="testimonial-card">
                    <div className="testimonial-author">
                      <div className="avatar">
                        <img src={imgAndi} alt="Andi Pratama" />
                      </div>
                      <div className="author-info">
                        <h4>Andi Pratama</h4>
                        <span>Wiraswasta, 35th</span>
                      </div>
                    </div>
                    <p className="testimonial-quote">“Yang aku suka semuanya ada dalam satu tempat. Bisa cek informasi emas, baca artikel, dan akses layanan yang dibutuhkan tanpa ribet.”</p>
                  </div>
                  <div className="testimonial-card">
                    <div className="testimonial-author">
                      <div className="avatar">
                        <img src={imgMaya} alt="Maya Lestari" />
                      </div>
                      <div className="author-info">
                        <h4>Maya Lestari</h4>
                        <span>Karyawan, 29th</span>
                      </div>
                    </div>
                    <p className="testimonial-quote">“Tampilannya simpel dan nyaman dipakai. Dari pertama daftar sampai mulai jelajahi fitur-fiturnya, alurnya jelas dan nggak bikin bingung.”</p>
                  </div>
                  <div className="testimonial-card">
                    <div className="testimonial-author">
                      <div className="avatar">
                        <img src={imgRizki} alt="Rizky Ramadhan" />
                      </div>
                      <div className="author-info">
                        <h4>Rizky Ramadhan</h4>
                        <span>Freelancer, 27th</span>
                      </div>
                    </div>
                    <p className="testimonial-quote">“Aku biasanya cuma tahu emas fisik. Setelah baca-baca di Jelajah Emas, jadi lebih ngerti bagaimana emas digital bekerja dan apa saja yang perlu diperhatikan.”</p>
                  </div>
                  <div className="testimonial-card">
                    <div className="testimonial-author">
                      <div className="avatar">
                        <img src={imgCitra} alt="Citra Amelia" />
                      </div>
                      <div className="author-info">
                        <h4>Citra Amelia</h4>
                        <span>Pengusaha, 32th</span>
                      </div>
                    </div>
                    <p className="testimonial-quote">“Suka sama bagian edukasinya karena bahasanya nggak terlalu rumit. Kalau ada hal tentang emas yang belum aku pahami, tinggal cari dan baca penjelasannya.”</p>
                  </div>
                  <div className="testimonial-card">
                    <div className="testimonial-author">
                      <div className="avatar">
                        <img src={imgFajar} alt="Fajar Nugraha" />
                      </div>
                      <div className="author-info">
                        <h4>Fajar Nugraha</h4>
                        <span>Karyawan, 30th</span>
                      </div>
                    </div>
                    <p className="testimonial-quote">“Praktis karena informasi dan berbagai layanan emas ada di satu platform. Jadi nggak perlu pindah-pindah tempat hanya untuk cari informasi yang dibutuhkan.”</p>
                  </div>
                  <div className="testimonial-card">
                    <div className="testimonial-author">
                      <div className="avatar">
                        <img src={imgNadia} alt="Nadia Putri" />
                      </div>
                      <div className="author-info">
                        <h4>Nadia Putri</h4>
                        <span>Ibu Rumah Tangga, 36th</span>
                      </div>
                    </div>
                    <p className="testimonial-quote">“Awalnya cuma penasaran soal emas digital. Setelah pakai Jelajah Emas, aku jadi lebih paham sedikit demi sedikit karena informasinya disampaikan dengan bahasa yang sederhana.”</p>
                  </div>
                  <div className="testimonial-card">
                    <div className="testimonial-author">
                      <div className="avatar">
                        <img src={imgKevin} alt="Kevin Aditya" />
                      </div>
                      <div className="author-info">
                        <h4>Kevin Aditya</h4>
                        <span>Content Creator, 26th</span>
                      </div>
                    </div>
                    <p className="testimonial-quote">“Menurutku yang paling enak itu tampilannya bersih dan informasinya gampang dicari. Buat yang baru mulai kenal emas digital jadi nggak terasa rumit.”</p>
                  </div>
                </div>
              </section>
              <section id="section-newsletter" className="newsletter-section">
                <h2 className="section-title">Biar Nggak Ketinggalan Info Seru!</h2>
                <p className="section-subtitle">Dapatkan kabar terbaru seputar emas, artikel edukasi, promo, dan berbagai informasi menarik dari Jelajah Emas.</p>
                {newsletterSent ? (
                  <div className="newsletter-success" role="status">
                    <div className="success-icon">✓</div>
                    <p className="success-title">Terima kasih!</p>
                    <p className="success-text">Data kamu sudah kami terima. Kabar terbaru, promo, dan event akan kami kirimkan ke email kamu.</p>
                  </div>
                ) : (
                  <form onSubmit={handleNewsletterSubmit} className="newsletter-form">
                    <div className="form-group">
                      <input type="text" placeholder="Nama Lengkap" className="form-input" value={newsletterNama} onChange={(e) => setNewsletterNama(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <input type="email" placeholder="Alamat Email" className="form-input" value={newsletterEmail} onChange={(e) => setNewsletterEmail(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <input type="tel" placeholder="Nomor Telepon" className="form-input" value={newsletterPhone} onChange={(e) => setNewsletterPhone(e.target.value)} />
                    </div>
                    <div className="form-checkbox">
                      <input type="checkbox" id="tnc" checked={newsletterTnc} onChange={(e) => setNewsletterTnc(e.target.checked)} />
                      <label htmlFor="tnc">Saya setuju dengan Syarat dan Ketentuan yang berlaku serta bersedia data pribadi digunakan untuk penawaran dan promosi.</label>
                    </div>
                    <button type="submit" className="btn-primary">Kirim</button>
                  </form>
                )}
              </section>
              <footer id="section-footer" className="site-footer">
                <div className="footer-top">
                  <div className="footer-logo">
                    <img src={img_1} alt="JelajahEmas" className="footer-logo-img" />
                  </div>
                  <div className="footer-links-container">
                    <div className="footer-links-col">
                      <h4>Bantuan</h4>
                      <Link to="/index/support/syarat-dan-ketentuan">Syarat &amp; Ketentuan</Link>
                      <Link to="/index/support/kebijakan-privasi">Kebijakan Privasi</Link>
                      <a href="#section-newsletter">Hubungi Kami</a>
                    </div>
                    <div className="footer-links-col">
                      <h4>Lainnya</h4>
                      <a href="#section-hero">Tentang Kami</a>
                      <a href="#section-newsletter">Promo</a>
                      <a href="#section-newsletter">Karir</a>
                    </div>
                  </div>
                </div>
                <div className="footer-ojk">
                  <div className="ojk-logos">
                    <img src={img_14} alt="OJK" />
                    <img src={img_15} alt="BAPPEBTI" />
                  </div>
                  <p>PT Jelajah Emas Digital Indonesia. Berizin dan diawasi oleh Otoritas Jasa Keuangan (OJK) &amp; BAPPEBTI.</p>
                </div>
                {/* <div className="footer-contact">
                  <p className="contact-label">Call Center</p>
                  <p className="contact-number">1500 123</p>
                  <p className="contact-alt">atau 021-8063 5162 &amp; 021-3155 550</p>
                </div> */}
                {/* <div className="footer-social">
                  <a href="#" className="social-icon"><img src={img_16} alt="Social" /></a>
                  <a href="#" className="social-icon"><img src={img_17} alt="Social" /></a>
                  <a href="#" className="social-icon"><img src={img_18} alt="Social" /></a>
                </div> */}
                <div className="footer-bottom">
                  <p className="copyright">© 2026 PT PT Jelajah Emas Digital Indonesia. Hak cipta dilindungi.</p>
                  <p className="disclaimer">JelajahEmas terdaftar dan diawasi oleh Otoritas Jasa Keuangan (OJK) &amp; Badan Pengawas Perdagangan Berjangka Komoditi (BAPPEBTI). Investasi emas mengandung risiko fluktuasi harga pasar.</p>
                </div>
              </footer>
            </div>

    </div>
  );
}
