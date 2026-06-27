import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';

export default function SettingsScreen() {
  const { 
    profile, 
    setProfile, 
    notifications, 
    readNotification, 
    markAllNotificationsRead, 
    clearNotifications,
    triggerBrandDealSimulation,
    setMetrics,
    showToast
  } = useContext(AppContext);

  // Edit profile local state
  const [name, setName] = useState(profile.name);
  const [handle, setHandle] = useState(profile.handle);
  const [avatar, setAvatar] = useState(profile.avatar);
  const [bio, setBio] = useState(profile.bio);

  // Notification tab active filter
  const [notiFilter, setNotiFilter] = useState('all'); // all, collab, analytics, alert

  const handleProfileSave = (e) => {
    e.preventDefault();
    setProfile({ name, handle, avatar, bio });
    showToast("Profile details updated!", "success");
  };

  // Spike simulator controls
  const handleSpikeEarnings = () => {
    setMetrics(prev => {
      const current = parseFloat(prev.earnings.total.replace('$', '').replace(',', ''));
      const added = 10000;
      const nextHistory = [...prev.earnings.history];
      nextHistory[nextHistory.length - 1] += added;

      return {
        ...prev,
        earnings: {
          ...prev.earnings,
          total: `$${(current + added).toLocaleString()}`,
          history: nextHistory
        }
      };
    });
    showToast("Spiked Earnings by +$10,000!", "success");
  };

  const handleSpikeViews = () => {
    setMetrics(prev => {
      const currentK = parseFloat(prev.views.total.replace('K', ''));
      const addedViews = 150000;
      const nextHistory = [...prev.views.history];
      nextHistory[nextHistory.length - 1] += addedViews;

      return {
        ...prev,
        views: {
          ...prev.views,
          total: `${(currentK + addedViews / 1000).toFixed(1)}K`,
          history: nextHistory
        }
      };
    });
    showToast("Spiked Views by +150,000!", "success");
  };

  // Filtered Notifications list
  const filteredNotis = notifications.filter(n => {
    if (notiFilter === 'all') return true;
    return n.type === notiFilter;
  });

  return (
    <section id="settings-screen" className="app-screen active">
      <h2 className="screen-title">Preferences & Sandbox</h2>

      {/* Edit Profile Form */}
      <div className="glass-card" style={{ padding: '16px', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '12px' }}>Edit Profile Profile</h3>
        <form onSubmit={handleProfileSave} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div className="form-group">
            <label>Display Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className="form-input"
              style={{ fontSize: '12px', padding: '8px' }}
              required 
            />
          </div>
          <div className="form-group">
            <label>Profile Avatar URL</label>
            <input 
              type="text" 
              value={avatar} 
              onChange={(e) => setAvatar(e.target.value)} 
              className="form-input"
              style={{ fontSize: '12px', padding: '8px' }}
              required 
            />
          </div>
          <div className="form-group">
            <label>Social Handle</label>
            <input 
              type="text" 
              value={handle} 
              onChange={(e) => setHandle(e.target.value)} 
              className="form-input"
              style={{ fontSize: '12px', padding: '8px' }}
              required 
            />
          </div>
          <div className="form-group">
            <label>Bio</label>
            <textarea 
              value={bio} 
              onChange={(e) => setBio(e.target.value)} 
              className="form-input"
              style={{ fontSize: '11px', padding: '8px', minHeight: '50px', resize: 'vertical', fontFamily: 'var(--font-main)' }}
            />
          </div>
          <button 
            type="submit" 
            className="btn-primary" 
            style={{ padding: '10px', fontSize: '11px', fontWeight: 700 }}
          >
            Save Profile Settings
          </button>
        </form>
      </div>

      {/* Sandbox Controls */}
      <div className="glass-card" style={{ padding: '16px', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '10px' }}>Developer Sandbox</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button 
            onClick={triggerBrandDealSimulation} 
            className="btn-primary" 
            style={{ width: '100%', padding: '10px', fontSize: '11px', background: 'rgba(139,92,246,0.15)', border: '1px solid var(--primary)', color: '#fff' }}
          >
            <i className="ph ph-sparkle"></i> Inject Brand Deal Invitation
          </button>
          
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              onClick={handleSpikeEarnings} 
              className="btn-secondary flex-1" 
              style={{ padding: '8px', fontSize: '10.5px' }}
            >
              +$10k Earnings
            </button>
            <button 
              onClick={handleSpikeViews} 
              className="btn-secondary flex-1" 
              style={{ padding: '8px', fontSize: '10.5px' }}
            >
              +150k Views
            </button>
          </div>
        </div>
      </div>

      {/* Notifications Log Center */}
      <div className="glass-card" style={{ padding: '16px' }}>
        <div className="section-header-row" style={{ marginBottom: '10px' }}>
          <h3 style={{ fontSize: '13px', fontWeight: 700 }}>Notifications Center</h3>
          {notifications.length > 0 && (
            <button 
              onClick={clearNotifications} 
              className="text-link-btn"
              style={{ fontSize: '10px', color: 'var(--accent)' }}
            >
              Clear Logs
            </button>
          )}
        </div>

        {/* Noti chips filters */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', flexWrap: 'wrap' }}>
          {['all', 'collab', 'analytics', 'alert'].map(type => (
            <button
              key={type}
              onClick={() => setNotiFilter(type)}
              className={`filter-tab ${notiFilter === type ? 'active' : ''}`}
              style={{ fontSize: '9px', padding: '4px 8px', minWidth: '40px', borderRadius: '15px' }}
            >
              {type}
            </button>
          ))}
          {notifications.some(n => n.unread) && (
            <button 
              onClick={markAllNotificationsRead} 
              className="filter-tab"
              style={{ fontSize: '9px', padding: '4px 8px', borderRadius: '15px', color: 'var(--green)', border: '1px solid rgba(16,185,129,0.2)' }}
            >
              Mark Read
            </button>
          )}
        </div>

        {/* Notifications list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '180px', overflowY: 'auto' }}>
          {filteredNotis.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '11px', textAlign: 'center', padding: '12px' }}>
              No notifications.
            </p>
          ) : (
            filteredNotis.map(noti => {
              let icon = 'ph-handshake';
              let badgeColor = 'rgba(139, 92, 246, 0.12)';
              if (noti.type === 'analytics') {
                icon = 'ph-chart-bar';
                badgeColor = 'rgba(6, 182, 212, 0.12)';
              } else if (noti.type === 'alert') {
                icon = 'ph-warning-circle';
                badgeColor = 'rgba(236, 72, 153, 0.12)';
              }

              return (
                <div 
                  key={noti.id} 
                  className="glass-card notification-card" 
                  onClick={() => readNotification(noti.id)}
                  style={{ cursor: 'pointer', display: 'flex', gap: '10px', alignItems: 'center', padding: '8px', borderRadius: '10px', background: 'rgba(255,255,255,0.02)', position: 'relative' }}
                >
                  <div className="notification-icon-badge" style={{ background: badgeColor, minWidth: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px' }}>
                    <i className={`ph-bold ${icon}`} style={{ fontSize: '14px' }}></i>
                  </div>
                  <div className="notification-details" style={{ flex: 1, minWidth: 0 }}>
                    <p className="notification-text" style={{ fontSize: '10.5px', margin: 0, fontWeight: noti.unread ? 700 : 400, color: 'var(--text-primary)', whiteSpace: 'normal', lineClamp: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {noti.text}
                    </p>
                    <span style={{ fontSize: '8px', color: 'var(--text-muted)' }}>{noti.time}</span>
                  </div>
                  {noti.unread && (
                    <span className="unread-dot" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)' }}></span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
