import { NavLink, Outlet } from 'react-router-dom';
import { NotificationDropdown } from '../NotificationDropdown';
import { UserMenu } from '../UserMenu';
import './Layout.scss';

export function Layout() {
  return (
    <div className="app-layout">
      <header className="app-header">
        <div className="header-left">
          <NavLink to="/app/dashboard" className="logo">
            <div className="logo-icon">A</div>
            <span className="logo-name">AmazonEx</span>
          </NavLink>

          <nav className="main-nav">
            <NavLink to="/app/dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Início
            </NavLink>
            <NavLink to="/app/trade" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Negociar
            </NavLink>
            <NavLink to="/app/wallet" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Carteira
            </NavLink>
            <NavLink to="/app/statement" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Extrato
            </NavLink>
          </nav>
        </div>

        <div className="header-right">
          <NotificationDropdown />
          <UserMenu />
        </div>
      </header>

      <main className="app-content">
        <Outlet />
      </main>
    </div>
  );
}
