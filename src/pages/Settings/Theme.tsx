import { useTheme } from '../../contexts';
import './Settings.scss';

export function Theme() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="settings-section">
      <div className="section-header">
        <h1>Tema</h1>
        <p>Escolha a aparência da plataforma</p>
      </div>

      <div className="theme-section">
        <h3>Modo de exibição</h3>
        <p>Selecione entre tema claro ou escuro</p>

        <div className="theme-options">
          <button
            className={`theme-option ${theme === 'dark' ? 'active' : ''}`}
            onClick={() => setTheme('dark')}
          >
            <div className="theme-preview dark">
              <div className="preview-header"></div>
              <div className="preview-sidebar"></div>
              <div className="preview-content">
                <div className="preview-line"></div>
                <div className="preview-line short"></div>
              </div>
            </div>
            <div className="theme-info">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
              <span>Escuro</span>
            </div>
          </button>

          <button
            className={`theme-option ${theme === 'light' ? 'active' : ''}`}
            onClick={() => setTheme('light')}
          >
            <div className="theme-preview light">
              <div className="preview-header"></div>
              <div className="preview-sidebar"></div>
              <div className="preview-content">
                <div className="preview-line"></div>
                <div className="preview-line short"></div>
              </div>
            </div>
            <div className="theme-info">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
              <span>Claro</span>
            </div>
          </button>
        </div>
      </div>

      <div className="info-box">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
        <div>
          <strong>Dica:</strong> O tema escuro pode ajudar a reduzir a fadiga ocular durante longas sessões de trading, especialmente em ambientes com pouca luz.
        </div>
      </div>
    </div>
  );
}
