import React, { useContext, useState, useRef, useEffect } from 'react';
import { AppContext } from '../context/AppContext';

export default function CollabsScreen() {
  const { 
    offers, 
    activeCollabs, 
    chats, 
    sendChatMessage, 
    declineOffer, 
    acceptOffer, 
    toggleDeliverable, 
    requestPayout 
  } = useContext(AppContext);

  const [activeSubTab, setActiveSubTab] = useState('offers'); // 'offers' or 'active'
  const [selectedItem, setSelectedItem] = useState(null); // offer or active collab currently open in sheet
  const [sheetType, setSheetType] = useState(''); // 'offer' or 'active'
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  
  const chatMessagesEndRef = useRef(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatMessagesEndRef.current) {
      chatMessagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chats, selectedItem]);

  const openOfferDetails = (offer) => {
    setSelectedItem(offer);
    setSheetType('offer');
    setIsSheetOpen(true);
  };

  const openActiveCollab = (collab) => {
    setSelectedItem(collab);
    setSheetType('active');
    setIsSheetOpen(true);
  };

  const closeSheet = () => {
    setIsSheetOpen(false);
    setTimeout(() => {
      setSelectedItem(null);
      setSheetType('');
    }, 300); // transition match
  };

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim() || !selectedItem) return;

    const collabId = selectedItem.id;
    sendChatMessage(collabId, chatInput, 'creator');
    setChatInput('');

    // Trigger simulated chatbot brand response
    const currentActiveCollab = activeCollabs.find(c => c.id === collabId);
    if (!currentActiveCollab) return;

    const total = currentActiveCollab.deliverables.length;
    const checked = currentActiveCollab.deliverables.filter(d => d.done).length;
    const progressVal = Math.round((checked / total) * 100);

    setTimeout(() => {
      let brandResponse = "Thanks for checking in! We'll review and get back to you shortly.";
      if (progressVal < 50) {
        brandResponse = `Thanks for the update. Let's work on completing the initial contract and draft integration steps!`;
      } else if (progressVal >= 50 && progressVal < 100) {
        brandResponse = `The work looks promising! Please make sure to tick off the remaining deliverables so we can finalize this.`;
      } else if (progressVal === 100) {
        brandResponse = `Excellent! All deliverables are checked. Click the 'Request Payout' button below to release the $${currentActiveCollab.payout.toLocaleString()} fund.`;
      }
      sendChatMessage(collabId, brandResponse, 'brand');
    }, 1200);
  };

  // Find updated collab in state to refresh calculations in sheet
  const activeDetailData = selectedItem && sheetType === 'active' 
    ? activeCollabs.find(c => c.id === selectedItem.id) 
    : null;

  const totalMilestones = activeDetailData ? activeDetailData.deliverables.length : 1;
  const completedMilestones = activeDetailData ? activeDetailData.deliverables.filter(d => d.done).length : 0;
  const progressPercent = Math.round((completedMilestones / totalMilestones) * 100);
  const statusLabel = progressPercent === 100 ? 'All Completed' : (progressPercent >= 50 ? 'Draft Under Review' : 'Contract Signed');

  return (
    <section id="collabs-screen" className="app-screen active">
      <h2 className="screen-title">Collaborations</h2>

      {/* Sub Navigation Tabs for Collabs */}
      <div className="sub-tabs-container">
        <button 
          className={`sub-tab ${activeSubTab === 'offers' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('offers')}
        >
          Invitations ({offers.length})
        </button>
        <button 
          className={`sub-tab ${activeSubTab === 'active' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('active')}
        >
          Active ({activeCollabs.length})
        </button>
      </div>

      <div className="collab-lists-wrapper">
        {/* Sub-tab: Offers List */}
        {activeSubTab === 'offers' && (
          <div className="collab-list-section active">
            {offers.length === 0 ? (
              <div className="glass-card text-center padding-lg" style={{ padding: '24px' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>No new invitations at this moment.</p>
              </div>
            ) : (
              offers.map(offer => (
                <div key={offer.id} className="glass-card collab-card offer-card">
                  <div className="collab-card-header">
                    <div className="brand-info">
                      <div className={`brand-logo ${offer.logoBg}`}>{offer.logoLetter}</div>
                      <div>
                        <h3 className="brand-name">{offer.brand}</h3>
                        <span className="collab-tag">{offer.type}</span>
                      </div>
                    </div>
                    <div className="payout-badge">${offer.payout.toLocaleString()}</div>
                  </div>
                  <p className="collab-desc">{offer.description}</p>
                  <div className="collab-footer">
                    <span className="due-date"><i className="ph ph-calendar"></i> Apply by {offer.applyBy}</span>
                    <div className="card-action-btns">
                      <button 
                        className="btn-secondary btn-sm decline-offer-btn"
                        onClick={() => declineOffer(offer.id)}
                      >
                        Decline
                      </button>
                      <button 
                        className="btn-primary btn-sm accept-offer-btn"
                        onClick={() => openOfferDetails(offer)}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Sub-tab: Active List */}
        {activeSubTab === 'active' && (
          <div className="collab-list-section active">
            {activeCollabs.length === 0 ? (
              <div className="glass-card text-center padding-lg" style={{ padding: '24px' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>No active sponsorships currently.</p>
              </div>
            ) : (
              activeCollabs.map(act => {
                const total = act.deliverables.length;
                const checked = act.deliverables.filter(d => d.done).length;
                const percent = Math.round((checked / total) * 100);
                const warningClass = act.dueDays <= 3 ? 'text-warning' : '';
                const actStatus = percent === 100 ? 'All Completed' : (percent >= 50 ? 'Draft Under Review' : 'Contract Signed');

                return (
                  <div key={act.id} className="glass-card collab-card active-card">
                    <div className="collab-card-header">
                      <div className="brand-info">
                        <div className={`brand-logo ${act.logoBg}`}>{act.logoLetter}</div>
                        <div>
                          <h3 className="brand-name">{act.brand}</h3>
                          <span className="collab-tag">{act.type}</span>
                        </div>
                      </div>
                      <div className="payout-badge">${act.payout.toLocaleString()}</div>
                    </div>
                    <div className="collab-progress-section">
                      <div className="progress-labels">
                        <span className="progress-status">{actStatus}</span>
                        <span className="progress-percent">{percent}%</span>
                      </div>
                      <div className="progress-track">
                        <div className="progress-fill" style={{ width: `${percent}%` }}></div>
                      </div>
                    </div>
                    <div className="collab-footer">
                      <span className={`due-date ${warningClass}`}>
                        <i className="ph ph-clock"></i> Due {act.dueDate} ({act.dueDays}d left)
                      </span>
                      <button 
                        className="btn-secondary btn-sm manage-collab-btn"
                        onClick={() => openActiveCollab(act)}
                      >
                        Manage
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Dynamic Detail Bottom Drawer Sheet */}
      {selectedItem && (
        <>
          <div 
            className={`bottom-sheet-backdrop ${isSheetOpen ? 'open' : ''}`}
            onClick={closeSheet}
          />
          <div className={`bottom-sheet ${isSheetOpen ? 'open' : ''}`}>
            <div className="bottom-sheet-drag-handle" onClick={closeSheet}></div>
            
            {/* Sheet Content for Collab Invitation */}
            {sheetType === 'offer' && (
              <div>
                <div className="collab-sheet-header">
                  <div className="brand-info">
                    <div className={`brand-logo ${selectedItem.logoBg} large-logo`}>
                      {selectedItem.logoLetter}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '18px', fontWeight: 800 }}>{selectedItem.brand}</h3>
                      <span className="collab-tag">{selectedItem.type}</span>
                    </div>
                  </div>
                  <div className="sheet-payout" style={{ fontSize: '20px', fontWeight: 800, color: 'var(--green)' }}>
                    ${selectedItem.payout.toLocaleString()}
                  </div>
                </div>

                <div className="sheet-body-content" style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>Campaign Brief</h4>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{selectedItem.brief}</p>
                  </div>

                  <div>
                    <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>Deliverables Required</h4>
                    <ul style={{ listStyle: 'none', paddingLeft: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {selectedItem.deliverables.map((d, index) => (
                        <li key={d.id || index} style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <i className="ph ph-dot" style={{ color: 'var(--primary)', fontSize: '18px' }}></i>
                          {d.label}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <button 
                      className="btn-secondary w-full" 
                      onClick={() => {
                        declineOffer(selectedItem.id);
                        closeSheet();
                      }}
                    >
                      Decline
                    </button>
                    <button 
                      className="btn-primary w-full" 
                      onClick={() => {
                        acceptOffer(selectedItem.id);
                        closeSheet();
                      }}
                    >
                      Accept Contract
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Sheet Content for Active Collab Management */}
            {sheetType === 'active' && activeDetailData && (
              <div>
                <div className="collab-sheet-header">
                  <div className="brand-info">
                    <div className={`brand-logo ${activeDetailData.logoBg} large-logo`}>
                      {activeDetailData.logoLetter}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '18px', fontWeight: 800 }}>{activeDetailData.brand}</h3>
                      <span className="collab-tag">{activeDetailData.type}</span>
                    </div>
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--green)' }}>
                    ${activeDetailData.payout.toLocaleString()}
                  </div>
                </div>

                {/* Campaign Progress tracker */}
                <div className="sheet-progress-wrapper" style={{ marginTop: '18px', background: 'rgba(0,0,0,0.12)', padding: '14px', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Campaign Milestones</span>
                    <span style={{ color: 'var(--primary)' }}>{progressPercent}%</span>
                  </div>
                  <div className="progress-track" style={{ height: '8px' }}>
                    <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
                  </div>
                </div>

                <div className="sheet-body-content" style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Milestones Checklist */}
                  <div>
                    <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>Tasks Checklist</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {activeDetailData.deliverables.map(del => (
                        <label 
                          key={del.id}
                          className="checklist-item" 
                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', cursor: 'pointer', fontSize: '12px', color: 'var(--text-secondary)' }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <input 
                              type="checkbox" 
                              className="del-checkbox"
                              checked={del.done}
                              onChange={() => toggleDeliverable(activeDetailData.id, del.id)}
                              style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }}
                            />
                            <span style={del.done ? { textDecoration: 'line-through', opacity: 0.6 } : {}}>
                              {del.label}
                            </span>
                          </div>
                          {del.done && <i className="ph-bold ph-check" style={{ color: 'var(--green)' }}></i>}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Brand Chat Box Room Simulator */}
                  <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '14px' }}>
                    <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
                      <i className="ph ph-chat-circle"></i> Brand Chat Room
                    </h4>
                    
                    {/* Chat Log Window */}
                    <div className="chat-messages" style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '130px', overflowY: 'auto', paddingRight: '4px', background: 'rgba(0,0,0,0.1)', padding: '8px', borderRadius: '10px' }}>
                      {(chats[activeDetailData.id] || []).map(msg => (
                        <div 
                          key={msg.id}
                          className={`msg ${msg.sender}`}
                          style={
                            msg.sender === 'brand' 
                              ? { background: 'rgba(255,255,255,0.05)', padding: '8px 12px', borderRadius: '10px', borderBottomLeftRadius: '2px', fontSize: '11px', color: 'var(--text-secondary)', width: 'fit-content', maxWidth: '85%' }
                              : { background: 'var(--primary-glow)', border: '1px solid rgba(139,92,246,0.2)', padding: '8px 12px', borderRadius: '10px', borderBottomRightRadius: '2px', fontSize: '11px', color: 'var(--text-primary)', width: 'fit-content', maxWidth: '85%', alignSelf: 'flex-end', textAlign: 'right' }
                          }
                        >
                          <span style={{ fontWeight: 800, color: msg.sender === 'brand' ? 'var(--primary)' : 'var(--accent)', display: 'block', marginBottom: '2px', fontSize: '9px' }}>
                            {msg.sender === 'brand' ? `${activeDetailData.brand} Team` : 'You'}
                          </span>
                          {msg.text}
                          <span style={{ display: 'block', fontSize: '8px', color: 'var(--text-muted)', marginTop: '4px' }}>{msg.time}</span>
                        </div>
                      ))}
                      <div ref={chatMessagesEndRef} />
                    </div>

                    {/* Chat Form Input */}
                    <form onSubmit={handleSendChat} style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                      <input 
                        type="text" 
                        placeholder="Type a message to brand manager..." 
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        className="form-input"
                        style={{ flex: 1, padding: '8px 12px', fontSize: '11px' }}
                      />
                      <button 
                        type="submit" 
                        className="btn-primary" 
                        style={{ padding: '0 12px', borderRadius: '10px', fontSize: '11px' }}
                      >
                        Send
                      </button>
                    </form>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <button className="btn-secondary w-full" onClick={closeSheet}>Close Panel</button>
                    {progressPercent === 100 && (
                      <button 
                        className="btn-primary w-full" 
                        onClick={() => {
                          requestPayout(activeDetailData.id);
                          closeSheet();
                        }}
                      >
                        Request Payout
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
}
