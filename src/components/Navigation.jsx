import React, { useContext, useRef, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';

export default function Navigation() {
  const { activeScreen, setActiveScreen, notifications } = useContext(AppContext);
  const [bubbleStyle, setBubbleStyle] = useState({});
  const navRef = useRef(null);
  const itemsRef = useRef({});

  const screens = [
    { key: 'dashboard', label: 'Home', icon: 'ph-bold ph-house-simple' },
    { key: 'collabs', label: 'Collabs', icon: 'ph-bold ph-handshake', showBadge: true },
    { key: 'analytics', label: 'Stats', icon: 'ph-bold ph-chart-bar' },
    { key: 'content', label: 'Content', icon: 'ph-bold ph-plus-circle' },
    { key: 'settings', label: 'Settings', icon: 'ph-bold ph-gear' }
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  const updateBubblePosition = () => {
    const activeItem = itemsRef.current[activeScreen];
    const navElement = navRef.current;
    if (activeItem && navElement) {
      const rect = activeItem.getBoundingClientRect();
      const parentRect = navElement.getBoundingClientRect();
      const left = rect.left - parentRect.left + (rect.width - 62) / 2;
      setBubbleStyle({
        transform: `translateX(${left}px)`
      });
    }
  };

  useEffect(() => {
    // Small timeout to allow DOM to render and rects to be calculated properly
    const timer = setTimeout(updateBubblePosition, 50);
    window.addEventListener('resize', updateBubblePosition);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateBubblePosition);
    };
  }, [activeScreen]);

  return (
    <nav className="bottom-nav" ref={navRef}>
      <div className="nav-glow-bubble" style={bubbleStyle}></div>
      {screens.map(screen => {
        const isActive = activeScreen === screen.key;
        const iconClass = isActive ? screen.icon.replace('ph-bold', 'ph-fill') : screen.icon;
        
        return (
          <button
            key={screen.key}
            ref={el => itemsRef.current[screen.key] = el}
            className={`nav-item ${isActive ? 'active' : ''}`}
            onClick={() => setActiveScreen(screen.key)}
          >
            <i className={iconClass}></i>
            <span className="nav-text">{screen.label}</span>
            {screen.showBadge && unreadCount > 0 && (
              <span className="nav-badge">{unreadCount}</span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
