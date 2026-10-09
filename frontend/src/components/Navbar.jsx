import React from 'react';
import { 
  Recycle, 
  Search, 
  User, 
  QrCode, 
  Truck, 
  Activity, 
  Flame, 
  ShieldCheck, 
  LogOut,
  Sparkles
} from 'lucide-react';

export default function Navbar({ 
  currentTab, 
  setCurrentTab, 
  currentUser, 
  onQuickSwitchRole, 
  onLogout 
}) {
  const roles = [
    { label: 'Citizen (Customer)', email: 'customer@example.com', role: 'CUSTOMER', tab: 'customer' },
    { label: 'Collection Staff', email: 'collection@example.com', role: 'COLLECTION_CENTRE', tab: 'scanner' },
    { label: 'Transporter', email: 'transporter@example.com', role: 'TRANSPORTER', tab: 'scanner' },
    { label: 'Diagnostic Tech', email: 'inspector@example.com', role: 'INSPECTOR', tab: 'inspector' },
    { label: 'Plant Recycler', email: 'recycler@example.com', role: 'RECYCLER', tab: 'recycler' },
    { label: 'System Admin', email: 'admin@example.com', role: 'ADMIN', tab: 'admin' },
  ];

  return (
    <header className="navbar">
      <div className="container nav-container">
        {/* Brand */}
        <div 
          className="nav-logo" 
          onClick={() => setCurrentTab('tracker')} 
          style={{ cursor: 'pointer' }}
        >
          <div className="nav-logo-icon">
            <Recycle size={20} />
          </div>
          <div>
            <span style={{ color: '#FFFFFF', fontWeight: 800 }}>Eco</span>
            <span style={{ color: 'var(--accent-mint)', fontWeight: 800 }}>Track</span>
            <span style={{ fontSize: '0.65rem', display: 'block', color: 'var(--text-dim)', fontWeight: 500, letterSpacing: '0.08em' }}>
              SMART E-WASTE TRACEABILITY
            </span>
          </div>
        </div>

        {/* Primary Views Navigation */}
        <nav className="nav-links">
          <button 
            className={`btn btn-sm ${currentTab === 'tracker' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setCurrentTab('tracker')}
          >
            <Search size={14} />
            Public Tracker
          </button>

          <button 
            className={`btn btn-sm ${currentTab === 'customer' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setCurrentTab('customer')}
          >
            <User size={14} />
            Citizen Portal
          </button>

          <button 
            className={`btn btn-sm ${currentTab === 'scanner' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setCurrentTab('scanner')}
          >
            <QrCode size={14} />
            Frontline Scanner
          </button>

          <button 
            className={`btn btn-sm ${currentTab === 'inspector' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setCurrentTab('inspector')}
          >
            <Activity size={14} />
            Inspection Hub
          </button>

          <button 
            className={`btn btn-sm ${currentTab === 'recycler' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setCurrentTab('recycler')}
          >
            <Flame size={14} />
            Recycler Plant
          </button>

          <button 
            className={`btn btn-sm ${currentTab === 'admin' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setCurrentTab('admin')}
          >
            <ShieldCheck size={14} />
            Admin Console
          </button>
        </nav>

        {/* Current Active Persona / Fast Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ textAlign: 'right', display: 'none', mdDisplay: 'block' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
                  {currentUser.name}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--accent-mint)', fontWeight: 600 }}>
                  {currentUser.role}
                </div>
              </div>
              <button 
                className="btn btn-secondary btn-sm" 
                onClick={onLogout}
                title="Logout"
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <button 
              className="btn btn-primary btn-sm"
              onClick={() => onQuickSwitchRole('customer@example.com')}
            >
              Sign In Demo
            </button>
          )}
        </div>
      </div>

      {/* Quick Role Simulation Bar */}
      <div className="role-bar" style={{ marginTop: '10px' }}>
        <div className="container role-bar-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
            <Sparkles size={13} style={{ color: 'var(--accent-mint)' }} />
            <span>Fast Role Switcher (Instant Demo Simulation):</span>
          </div>
          <div className="role-pills">
            {roles.map(r => {
              const isActive = currentUser && currentUser.email === r.email;
              return (
                <button
                  key={r.email}
                  className={`role-pill ${isActive ? 'active' : ''}`}
                  onClick={() => {
                    onQuickSwitchRole(r.email);
                    setCurrentTab(r.tab);
                  }}
                >
                  {r.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
}
