import { useEffect } from 'react';
import { HashRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { pages } from './pages-data.js';
import { setBackNavigate } from './lib/backNav.js';
import ScreenIndex from './ScreenIndex.jsx';
import WelcomePage from './pages/auth/WelcomePage.jsx';
import PopupAwal from './pages/auth/PopupAwal.jsx';
import NotifikasiLogin from './pages/auth/NotifikasiLogin.jsx';
import Login from './pages/auth/Login.jsx';
import Register from './pages/auth/register/Register.jsx';
import LupaPassword from './pages/auth/lupa-password/LupaPassword.jsx';
import Home from './pages/home/Home.jsx';
import AlamatPengiriman from './pages/assets/cetak-emas/AlamatPengiriman.jsx';
import Aset03 from './pages/assets/asset/Aset03.jsx';
import AsetSaya from './pages/assets/aset-saya/AsetSaya.jsx';
import Asset from './pages/assets/asset/Asset.jsx';
import CetakEmas from './pages/assets/cetak-emas/CetakEmas.jsx';
import EmasDigital from './pages/assets/aset-saya/EmasDigital.jsx';
import Konfirmasi from './pages/assets/asset/Konfirmasi.jsx';
import BeriRating from './pages/profile/beri-rating/BeriRating.jsx';
import DetailPenarikan from './pages/transactions/penarikan/DetailPenarikan.jsx';
import DetailRiwayatPoin from './pages/rewards/riwayat/DetailRiwayatPoin.jsx';
import IsiUlang from './pages/transactions/deposit/IsiUlang.jsx';
import LoadingPenarikan from './pages/transactions/penarikan/LoadingPenarikan.jsx';
import PilihBank from './pages/profile/kartu-bank/PilihBank.jsx';
import Qris from './pages/transactions/deposit/Qris.jsx';
import RiwayatAsetSaya from './pages/assets/aset-saya/RiwayatAsetSaya.jsx';
import RiwayatDetailKomisi from './pages/affiliate/riwayat/RiwayatDetailKomisi.jsx';
import RiwayatIsiUlang from './pages/transactions/deposit/RiwayatIsiUlang.jsx';
import RiwayatKomisi from './pages/affiliate/riwayat/RiwayatKomisi.jsx';
import RiwayatLainnya from './pages/rewards/riwayat/RiwayatLainnya.jsx';
import RiwayatPenarikan from './pages/transactions/penarikan/RiwayatPenarikan.jsx';
import RiwayatPoin from './pages/rewards/riwayat/RiwayatPoin.jsx';
import RiwayatTransaksi from './pages/transactions/RiwayatTransaksi.jsx';
import TarikDana from './pages/transactions/penarikan/TarikDana.jsx';
import VirtualAccount from './pages/transactions/deposit/VirtualAccount.jsx';
import AbsenHarian from './pages/rewards/AbsenHarian.jsx';
import Misi from './pages/rewards/Misi.jsx';
import PoinMall from './pages/rewards/poin-mall/PoinMall.jsx';
import RedeemKode from './pages/rewards/RedeemKode.jsx';
import Vip from './pages/rewards/Vip.jsx';
import VipRedeemKode from './pages/rewards/VipRedeemKode.jsx';
import EditProfil from './pages/profile/EditProfil.jsx';
import KartuBank from './pages/profile/kartu-bank/KartuBank.jsx';
import MenuNotifikasi from './pages/profile/MenuNotifikasi.jsx';
import Profil from './pages/profile/Profil.jsx';
import Setelan from './pages/profile/Setelan.jsx';
import LihatDetailTim from './pages/affiliate/LihatDetailTim.jsx';
import TimAfiliasi from './pages/affiliate/TimAfiliasi.jsx';
import Berita from './pages/news/Berita.jsx';
import DetailBerita from './pages/news/DetailBerita.jsx';
import HubungiCs from './pages/support/HubungiCs.jsx';
import KebijakanPrivasi from './pages/support/KebijakanPrivasi.jsx';
import Livechat from './pages/support/Livechat.jsx';
import PertanyaanUmum from './pages/support/PertanyaanUmum.jsx';
import SyaratDanKetentuan from './pages/support/SyaratDanKetentuan.jsx';
import TentangKami from './pages/support/TentangKami.jsx';
import LandingPagePerusahaan from './pages/landing/LandingPagePerusahaan.jsx';
import RequireAuth from './components/RequireAuth.jsx';
import NotifOverlay from './components/NotifOverlay.jsx';

const labelByPath = Object.fromEntries(pages.map((page) => [page.path, page.label]));

/* Pre-migration paths no longer exist as routes. Old bookmarks and links
   arrive here as #/auth/register-02 (main.jsx rewrites the hash-less form
   into that); without this they would miss every route and fall into the
   catch-all that bounces to Welcome. */
const LEGACY_ROOTS = ['auth', 'home', 'assets', 'rewards', 'transactions', 'profil', 'affiliate', 'berita', 'support', 'landing', 'sitemap'];

function LegacyPathRedirect() {
  const { pathname, search } = useLocation();
  return <Navigate to={`/index${pathname}${search}`} replace />;
}

function AppEffects() {
  const { pathname, search } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    const label = labelByPath[pathname];
    document.title = label ? `${label} · Jelajah Emas` : 'Jelajah Emas';
  }, [pathname]);

  /* Back buttons call goBack() from lib/backNav.js — it always goes to the
     caller's logical-parent route, never back through visit history (history
     walking bounced users into flows they had just left). The router's
     navigate() is handed over here because that module lives outside the
     component tree. */
  useEffect(() => {
    setBackNavigate(navigate);
  }, [navigate]);

  /* apiClient emits this when a token-bearing request gets a 401 (the
     session was already cleared there): send the user to login and remember
     where they were so login can send them back. While already on login,
     leave the form alone. The router's location is used (not
     window.location) because with hash routing the path lives in the hash. */
  useEffect(() => {
    const onUnauthorized = () => {
      if (pathname === '/index/auth/login') return;
      navigate('/index/auth/login', {
        replace: true,
        state: { from: `${pathname}${search}` },
      });
    };
    window.addEventListener('je:unauthorized', onUnauthorized);
    return () => window.removeEventListener('je:unauthorized', onUnauthorized);
  }, [navigate, pathname, search]);

  return null;
}

export default function App() {
  return (
    <HashRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AppEffects />
      {/* Floating notif host — outside <Routes> so it survives route changes. */}
      <NotifOverlay />
      <Routes>
        {/* ---- Public routes (no login required) ---- */}
        {/* Root dari domain (tanpa hash / #/index) langsung membuka halaman
            landing perusahaan, bukan Welcome; Welcome tetap bisa diakses
            lewat /index/auth/welcome. */}
        <Route path="/" element={<Navigate to="/index/landing" replace />} />
        <Route path="/index" element={<Navigate to="/index/landing" replace />} />

        {/* ---- Legacy paths (pre-/index namespace): compatibility redirects
             so stale tabs, old bookmarks and old referral links still land
             on the right /index page instead of the Welcome catch-all ---- */}
        {LEGACY_ROOTS.flatMap((root) => [
          <Route key={root} path={`/${root}`} element={<LegacyPathRedirect />} />,
          <Route key={`${root}-sub`} path={`/${root}/*`} element={<LegacyPathRedirect />} />,
        ])}

        <Route path="/index/sitemap" element={<ScreenIndex />} />
        <Route path="/index/auth/welcome" element={<WelcomePage />} />
        <Route path="/index/auth/popup-awal" element={<PopupAwal />} />
        <Route path="/index/auth/login" element={<Login />} />
        <Route path="/index/auth/register-01" element={<Register step={1} />} />
        <Route path="/index/auth/register-02" element={<Register step={2} />} />
        <Route path="/index/auth/register-03" element={<Register step={3} />} />
        <Route path="/index/auth/register-04" element={<Register step={4} />} />
        <Route path="/index/auth/lupa-password" element={<LupaPassword step={1} />} />
        <Route path="/index/auth/lupa-password-02" element={<LupaPassword step={2} />} />
        <Route path="/index/auth/lupa-password-03" element={<LupaPassword step={3} />} />
        <Route path="/index/auth/lupa-password-04" element={<LupaPassword step={4} />} />
        <Route path="/index/landing" element={<LandingPagePerusahaan />} />
        <Route path="/index/support/syarat-dan-ketentuan" element={<SyaratDanKetentuan />} />
        <Route path="/index/support/kebijakan-privasi" element={<KebijakanPrivasi />} />
        <Route path="/index/support/tentang-kami" element={<TentangKami />} />

        {/* ---- Protected routes (login required) ---- */}
        <Route element={<RequireAuth />}>
          <Route path="/index/auth/notifikasi-login" element={<NotifikasiLogin />} />
          <Route path="/index/home" element={<Home />} />
          <Route path="/index/assets/alamat-pengiriman" element={<AlamatPengiriman />} />
          <Route path="/index/assets/aset-03" element={<Aset03 />} />
          <Route path="/index/assets/all" element={<AsetSaya step={1} />} />
          <Route path="/index/assets/aset-saya-02" element={<AsetSaya step={2} />} />
          <Route path="/index/assets/asset-01" element={<Asset step={1} />} />
          <Route path="/index/assets/asset-02" element={<Asset step={2} />} />
          <Route path="/index/assets/cetak-emas-01" element={<CetakEmas step={1} />} />
          <Route path="/index/assets/cetak-emas-02" element={<CetakEmas step={2} />} />
          <Route path="/index/assets/cetak-emas-03" element={<CetakEmas step={3} />} />
          <Route path="/index/assets/digital" element={<EmasDigital />} />
          <Route path="/index/assets/konfirmasi" element={<Konfirmasi />} />
          <Route path="/index/profil/beri-rating" element={<BeriRating step={1} />} />
          <Route path="/index/profil/beri-rating-02" element={<BeriRating step={2} />} />
          <Route path="/index/transactions/detail-penarikan" element={<DetailPenarikan step={1} />} />
          <Route path="/index/transactions/detail-penarikan-02" element={<DetailPenarikan step={2} />} />
          <Route path="/index/transactions/detail-penarikan-03" element={<DetailPenarikan step={3} />} />
          <Route path="/index/rewards/detail-riwayat-poin" element={<DetailRiwayatPoin />} />
          <Route path="/index/transactions/topup" element={<IsiUlang />} />
          <Route path="/index/transactions/loading-penarikan" element={<LoadingPenarikan />} />
          <Route path="/index/profil/pilih-bank" element={<PilihBank />} />
          <Route path="/index/transactions/qris" element={<Qris />} />
          <Route path="/index/assets/riwayat-aset-saya" element={<RiwayatAsetSaya />} />
          <Route path="/index/affiliate/riwayat-detail-komisi" element={<RiwayatDetailKomisi />} />
          <Route path="/index/transactions/balance" element={<RiwayatIsiUlang />} />
          <Route path="/index/affiliate/riwayat-komisi" element={<RiwayatKomisi />} />
          <Route path="/index/rewards/riwayat-lainnya" element={<RiwayatLainnya />} />
          <Route path="/index/transactions/riwayat-penarikan" element={<RiwayatPenarikan />} />
          <Route path="/index/rewards/riwayat-poin" element={<RiwayatPoin />} />
          <Route path="/index/transactions/riwayat-transaksi" element={<RiwayatTransaksi />} />
          <Route path="/index/transactions/sending" element={<TarikDana step={1} />} />
          <Route path="/index/transactions/tarik-dana-02" element={<TarikDana step={2} />} />
          <Route path="/index/transactions/tarik-dana-03" element={<TarikDana step={3} />} />
          <Route path="/index/transactions/tarik-dana-04" element={<TarikDana step={4} />} />
          <Route path="/index/transactions/virtual-account" element={<VirtualAccount />} />
          <Route path="/index/rewards/absen-harian" element={<AbsenHarian />} />
          <Route path="/index/rewards/misi" element={<Misi />} />
          <Route path="/index/rewards/poin-mall-01" element={<PoinMall step={1} />} />
          <Route path="/index/rewards/poin-mall-02" element={<PoinMall step={2} />} />
          <Route path="/index/rewards/poin-mall-03" element={<PoinMall step={3} />} />
          <Route path="/index/rewards/redeem-kode" element={<RedeemKode />} />
          <Route path="/index/rewards/vip" element={<Vip />} />
          <Route path="/index/rewards/vip-redeem-kode" element={<VipRedeemKode />} />
          <Route path="/index/profil/edit" element={<EditProfil />} />
          <Route path="/index/profil/kartu" element={<KartuBank step={1} />} />
          <Route path="/index/profil/kartu-bank-02" element={<KartuBank step={2} />} />
          <Route path="/index/profil/kartu-bank-03" element={<KartuBank step={3} />} />
          <Route path="/index/profil/notifikasi" element={<MenuNotifikasi />} />
          <Route path="/index/profil" element={<Profil />} />
          <Route path="/index/profil/setelan" element={<Setelan />} />
          <Route path="/index/affiliate/detail-tim" element={<LihatDetailTim />} />
          <Route path="/index/affiliate/tim-afiliasi" element={<TimAfiliasi />} />
          <Route path="/index/berita" element={<Berita />} />
          <Route path="/index/berita/detail" element={<DetailBerita />} />
          <Route path="/index/support/hubungi-cs" element={<HubungiCs />} />
          <Route path="/index/support/livechat" element={<Livechat />} />
          <Route path="/index/support/pertanyaan-umum" element={<PertanyaanUmum />} />
        </Route>

        <Route path="*" element={<Navigate to="/index/auth/welcome" replace />} />
      </Routes>
    </HashRouter>
  );
}
