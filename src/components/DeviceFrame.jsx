import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import DynamicIsland from './DynamicIsland';
import Navigation from './Navigation';

export default function DeviceFrame({ children }) {
  const { 
    profile, 
    notifications, 
    activeScreen, 
    setActiveScreen, 
    toasts, 
    triggerBrandDealSimulation 
  } = useContext(AppContext);
  const [time, setTime] = useState('23:35');

  // Clock Update Effect
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      let minutes = now.getMinutes();
      hours = hours < 10 ? '0' + hours : hours;
      minutes = minutes < 10 ? '0' + minutes : minutes;
      setTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div className="device-mockup">
      <div className="phone-frame">
        <div className="phone-screen">
          {/* Status Bar */}
          <div className="status-bar">
            <div className="status-time">{time}</div>
            <div className="status-icons">
              <i className="ph ph-trend-up status-icon-net"></i>
              <i className="ph-bold ph-wifi-high"></i>
              <i className="ph-bold ph-battery-full"></i>
            </div>
          </div>

          {/* Dynamic Island Cutout */}
          <DynamicIsland />

          {/* Toast Notification Container */}
          <div className="toast-container">
            {toasts.map(t => (
              <div key={t.id} className={`toast ${t.type} toast-enter`}>
                {t.type === 'success' && <i className="ph-bold ph-check-circle toast-icon"></i>}
                {t.type === 'alert' && <i className="ph-bold ph-x-circle toast-icon"></i>}
                {t.type === 'info' && <i className="ph-bold ph-info toast-icon"></i>}
                <span>{t.message}</span>
              </div>
            ))}
          </div>

          {/* Main App Container */}
          <div className="app-container">
            {/* App Header */}
            <header className="app-header">
              <div className="header-user" onClick={() => setActiveScreen('settings')} style={{ cursor: 'pointer' }}>
                <img 
                  src={profile.avatar} 
                  alt="Avatar" 
                  className="header-avatar" 
                />
                <div className="header-welcome">
                  <span className="welcome-label">Good evening,</span>
                  <h1 className="user-name">{profile.name}</h1>
                </div>
              </div>
              
              <div className="header-actions">
                <button 
                  className="header-btn" 
                  onClick={() => setActiveScreen('settings')} 
                  aria-label="Notifications"
                >
                  <i className="ph-bold ph-bell"></i>
                  {unreadCount > 0 && (
                    <span className="bell-badge">{unreadCount}</span>
                  )}
                </button>
                <button 
                  className="header-btn" 
                  onClick={triggerBrandDealSimulation}
                  title="Simulate Brand Deal Offer"
                >
                  <i className="ph-bold ph-sparkle"></i>
                </button>
              </div>
            </header>

            {/* Scrollable Viewport */}
            <main className="screens-wrapper">
              {children}
            </main>

            {/* Bottom Nav Bar */}
            <Navigation />
          </div>
        </div>
      </div>
    </div>
  );
}
