import { Link } from 'react-router-dom';
import iconHomeActive from '../assets/images/120_3378.svg';
import iconHome from '../assets/images/98_1589.svg';
import iconAsetActive from '../assets/images/nav-aset-active.svg';
import iconAset from '../assets/images/98_1594.svg';
import iconVoucherActive from '../assets/images/88_1072.svg';
import iconVoucher from '../assets/images/98_1599.svg';
import iconProfilActive from '../assets/images/98_1603.svg';
import iconProfil from '../assets/images/120_3392.svg';

/* Styles are kept inline in this file so the component is a single-file import. */
const styles = `
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #ffffff;
  border-top: 1px solid #efe7dc;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 10px 0 calc(14px + env(safe-area-inset-bottom));
  z-index: 100;
}

.bottom-nav .nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  width: 64px;
  text-decoration: none;
}

.bottom-nav .nav-item img {
  width: 20px;
  height: 20px;
}

.bottom-nav .nav-item span {
  color: #a79c8f;
  font-size: 10px;
}

.bottom-nav .nav-item.active span {
  color: #e8790c;
  font-weight: 600;
}
`;

const ITEMS = [
  { key: 'home', label: 'Home', to: '/home', icon: iconHome, iconActive: iconHomeActive },
  { key: 'aset', label: 'Aset', to: '/assets/asset-01', icon: iconAset, iconActive: iconAsetActive },
  { key: 'voucher', label: 'Voucher', to: '/rewards/poin-mall-01', icon: iconVoucher, iconActive: iconVoucherActive },
  { key: 'profil', label: 'Profil', to: '/profil', icon: iconProfil, iconActive: iconProfilActive },
];

/**
 * Shared bottom navigation bar.
 * Usage: <BottomNav active="home" /> — active: 'home' | 'aset' | 'voucher' | 'profil'
 */
export default function BottomNav({ active }) {
  return (
    <>
      <style>{styles}</style>
      <nav className="bottom-nav">
        {ITEMS.map((item) => {
          const isActive = item.key === active;
          return (
            <Link
              key={item.key}
              to={item.to}
              className={isActive ? 'nav-item active' : 'nav-item'}
            >
              <img src={isActive ? item.iconActive : item.icon} alt={item.label} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
