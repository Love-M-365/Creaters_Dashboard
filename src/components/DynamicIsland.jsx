import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';

export default function DynamicIsland() {
  const { island, hideIslandNotification } = useContext(AppContext);
  const [shouldAnimateExpanded, setShouldAnimateExpanded] = useState(false);

  useEffect(() => {
    if (island.visible) {
      // Trigger expanded transition
      const enterTimer = setTimeout(() => {
        setShouldAnimateExpanded(true);
      }, 50);

      // Auto-collapse after 4.5 seconds
      const exitTimer = setTimeout(() => {
        setShouldAnimateExpanded(false);
        // Wait for collapse transition to finish before hiding from DOM context
        setTimeout(() => {
          hideIslandNotification();
        }, 300);
      }, 4500);

      return () => {
        clearTimeout(enterTimer);
        clearTimeout(exitTimer);
      };
    } else {
      setShouldAnimateExpanded(false);
    }
  }, [island.visible, hideIslandNotification]);

  if (!island.visible) {
    return (
      <div className="dynamic-island-container">
        <div className="dynamic-island">
          <div className="island-camera"></div>
          <div className="island-content"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="dynamic-island-container">
      <div 
        className={`dynamic-island ${shouldAnimateExpanded ? 'expanded' : ''}`}
        onClick={() => {
          setShouldAnimateExpanded(false);
          setTimeout(() => hideIslandNotification(), 300);
        }}
        style={{ cursor: 'pointer' }}
      >
        <div className="island-camera"></div>
        {shouldAnimateExpanded && (
          <div className="island-content">
            {island.imageSrc && (
              <img src={island.imageSrc} className="island-avatar" alt="Brand Logo" />
            )}
            <div className="island-text-group">
              <span className="island-title">{island.title}</span>
              <span className="island-desc">{island.desc}</span>
            </div>
            {island.iconClass && (
              <div className="island-action-symbol">
                <i className={island.iconClass}></i>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
