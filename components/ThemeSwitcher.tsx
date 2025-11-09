'use client';

import { useTheme } from './ThemeContext';

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <i className="fas fa-lg fa-sun"></i>;
      case 'dark':
        return <i className="fas fa-lg fa-moon"></i>;
      default:
        return <i className="fas fa-lg fa-desktop"></i>;
    }
  };

  return (
    <div className="navbar-item has-dropdown is-hoverable">
      <a className="navbar-link is-arrowless">
        <span className="icon is-large navbar-icon">
          {getThemeIcon()}
        </span>
      </a>
      <div id="themeSelector" className="navbar-dropdown">
        <a 
          className="navbar-item" 
          onClick={() => setTheme('light')}
          style={{ cursor: 'pointer' }}
        >
          <div className="is-flex is-justify-content-space-between is-fullwidth">
            <span>
              <span className="icon mr-1">
                <i className="fas fa-sun"></i>
              </span>
              <span>Light</span>
            </span>
            {theme === 'light' && (
              <span className="icon">
                <i className="fas fa-check"></i>
              </span>
            )}
          </div>
        </a>

        <a 
          className="navbar-item" 
          onClick={() => setTheme('dark')}
          style={{ cursor: 'pointer' }}
        >
          <div className="is-flex is-justify-content-space-between is-fullwidth">
            <span>
              <span className="icon mr-1">
                <i className="fas fa-moon"></i>
              </span>
              <span>Dark</span>
            </span>
            {theme === 'dark' && (
              <span className="icon">
                <i className="fas fa-check"></i>
              </span>
            )}
          </div>
        </a>

        <a 
          className="navbar-item" 
          onClick={() => setTheme('system')}
          style={{ cursor: 'pointer' }}
        >
          <div className="is-flex is-justify-content-space-between is-fullwidth">
            <span>
              <span className="icon mr-1">
                <i className="fas fa-desktop"></i>
              </span>
              <span>System</span>
            </span>
            {theme === 'system' && (
              <span className="icon">
                <i className="fas fa-check"></i>
              </span>
            )}
          </div>
        </a>
      </div>
    </div>
  );
}
