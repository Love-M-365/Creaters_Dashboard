import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Initial metrics data
  const [metrics, setMetrics] = useState({
    earnings: {
      total: "$12,450",
      trend: "+14.8%",
      history: [6200, 5800, 7900, 6800, 9400, 8900, 12450],
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
    },
    views: {
      total: "582.4K",
      trend: "+8.3%",
      history: [110000, 98000, 145000, 128000, 160000, 182000, 240000],
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
    },
    followers: {
      total: "678K",
      trend: "+19.2%",
      history: [480000, 510000, 550000, 580000, 610000, 642000, 678000],
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
    }
  });

  const [activeMetric, setActiveMetric] = useState('earnings');
  const [activeScreen, setActiveScreen] = useState('dashboard');
  
  // Profile settings
  const [profile, setProfile] = useState({
    name: 'Love Maggo',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80',
    handle: '@lovemaggo',
    bio: 'Tech enthusiast, workspace setups, and coding tutorials creator. Building in public.'
  });

  // Toast state
  const [toasts, setToasts] = useState([]);
  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3200);
  };

  // Dynamic Island state
  const [island, setIsland] = useState({
    visible: false,
    title: '',
    desc: '',
    imageSrc: '',
    iconClass: ''
  });

  const showIslandNotification = (title, desc, imageSrc, iconClass) => {
    setIsland({
      visible: true,
      title,
      desc,
      imageSrc,
      iconClass
    });
    showToast('New notification!', 'info');
  };

  const hideIslandNotification = () => {
    setIsland(prev => ({ ...prev, visible: false }));
  };

  // Collaborations
  const [offers, setOffers] = useState([
    {
      id: 'offer-aura',
      brand: 'Aura Audio',
      type: 'Sponsorship',
      payout: 2500,
      logoBg: 'p-violet',
      logoLetter: 'A',
      description: 'Review of Aura Glow Pro Noise-Cancelling Headphones in your next workspace setup walkthrough video.',
      applyBy: 'Jul 12',
      deliverables: [
        { id: 'd1', label: '60-second video integration', done: false },
        { id: 'd2', label: 'Link in video description', done: false },
        { id: 'd3', label: '1x Instagram Stories post', done: false }
      ],
      brief: 'We want a stylish integration focused on the ANC performance and the minimalist design that fits a modern creative workspace. Keep the tone authentic and highlight the customizable EQ settings via the app.'
    },
    {
      id: 'offer-lumina',
      brand: 'Lumina Skin',
      type: 'Reels / Shorts',
      payout: 1400,
      logoBg: 'p-pink',
      logoLetter: 'L',
      description: '60-second morning skincare routine integration highlighting Lumina Vitamin C Hydration serum.',
      applyBy: 'Jul 18',
      deliverables: [
        { id: 'd1', label: '1x Instagram Reel / TikTok', done: false },
        { id: 'd2', label: 'Usage of campaign hashtag #LuminaGlow', done: false }
      ],
      brief: 'Showcase the morning application process. Focus on the sensory experience (scent, texture, immediate hydration). Video must highlight clean aesthetic styling in a bright washroom environment.'
    }
  ]);

  const [activeCollabs, setActiveCollabs] = useState([
    {
      id: 'active-stride',
      brand: 'Stride Fitness',
      type: 'YouTube sponsor',
      payout: 3200,
      logoBg: 'p-cyan',
      logoLetter: 'S',
      description: '90-second mid-roll sponsor in Tech Setup Q&A video.',
      dueDays: 3,
      dueDate: 'Jul 04',
      deliverables: [
        { id: 'd1', label: 'Contract signing', done: true },
        { id: 'd2', label: 'Video draft upload for review', done: true },
        { id: 'd3', label: 'Publish video & bio URL integration', done: false }
      ]
    },
    {
      id: 'active-codesphere',
      brand: 'CodeSphere',
      type: 'Sponsorship',
      payout: 4500,
      logoBg: 'p-yellow',
      logoLetter: 'C',
      description: 'Dedicated overview video of Cloud IDE platform features.',
      dueDays: 14,
      dueDate: 'Jul 24',
      deliverables: [
        { id: 'd1', label: 'Contract signing', done: true },
        { id: 'd2', label: 'Record screen walkthrough preview', done: false },
        { id: 'd3', label: 'Submit raw draft cut', done: false },
        { id: 'd4', label: 'Publish dedicated video', done: false }
      ]
    }
  ]);

  // Brand chats state
  const [chats, setChats] = useState({
    'active-stride': [
      { id: 'c1', sender: 'brand', text: 'Hey Love, contract verified. Please make sure the video mentions our Summer discount promo!', time: '2 days ago' },
      { id: 'c2', sender: 'creator', text: 'Got it, the draft is uploaded to your portal and has the code overlay in the middle.', time: '1 day ago' },
      { id: 'c3', sender: 'brand', text: 'Terrific! Our marketing team is reviewing it now. Will let you know by tomorrow.', time: '5 hours ago' }
    ],
    'active-codesphere': [
      { id: 'c1', sender: 'brand', text: 'Hey Love, we loved your initial concept notes. Let us know when the draft is ready for feedback!', time: '1 day ago' }
    ]
  });

  const sendChatMessage = (collabId, text, sender = 'creator') => {
    const newMessage = {
      id: `msg-${Date.now()}`,
      sender,
      text,
      time: 'Just now'
    };
    setChats(prev => ({
      ...prev,
      [collabId]: [...(prev[collabId] || []), newMessage]
    }));
  };

  // Posts / Content Feed
  const [posts, setPosts] = useState([
    {
      id: 'p1',
      title: 'My Absolute Desk Setup Essentials for 2026',
      views: 142000,
      likes: 18200,
      platform: 'youtube',
      thumb: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=120&h=120&q=80'
    },
    {
      id: 'p2',
      title: 'React vs Vue in 2026: The honest truth...',
      views: 98000,
      likes: 11500,
      platform: 'instagram',
      thumb: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=120&h=120&q=80'
    }
  ]);

  // Notifications
  const [notifications, setNotifications] = useState([
    {
      id: 'n-1',
      type: 'collab',
      text: 'Nike Athletics sent you an exclusive invitation for their Winter Collection launch.',
      time: '12m ago',
      unread: true
    },
    {
      id: 'n-2',
      type: 'analytics',
      text: 'Your recent video "React vs Vue in 2026" gained 50k views in the last 24 hours!',
      time: '1h ago',
      unread: true
    },
    {
      id: 'n-3',
      type: 'alert',
      text: 'Payout of $4,200 from CodeSphere was successfully deposited into your Chase bank account.',
      time: '5h ago',
      unread: false
    },
    {
      id: 'n-4',
      type: 'collab',
      text: 'Aura Audio updated their deliverable guidelines for the Glow Pro headphones.',
      time: '1d ago',
      unread: false
    }
  ]);

  // Action methods
  const declineOffer = (offerId) => {
    setOffers(prev => prev.filter(o => o.id !== offerId));
    showToast('Invitation declined.', 'alert');
  };

  const acceptOffer = (offerId) => {
    const offer = offers.find(o => o.id === offerId);
    if (!offer) return;

    // Remove from offers
    setOffers(prev => prev.filter(o => o.id !== offerId));

    // Add to active
    const newActive = {
      id: `active-${Date.now()}`,
      brand: offer.brand,
      type: offer.type,
      payout: offer.payout,
      logoBg: offer.logoBg,
      logoLetter: offer.logoLetter,
      description: offer.description,
      dueDays: 10,
      dueDate: 'In 10 Days',
      deliverables: [
        { id: 'd1', label: 'Contract signing', done: true },
        ...offer.deliverables.map((d, index) => ({ id: `d${index + 2}`, label: d.label, done: false }))
      ]
    };
    setActiveCollabs(prev => [...prev, newActive]);

    // Add notification
    setNotifications(prev => [
      {
        id: `n-${Date.now()}`,
        type: 'collab',
        text: `Successfully accepted contract with ${offer.brand}. Deliverable tracker initialized.`,
        time: 'Just now',
        unread: true
      },
      ...prev
    ]);

    // Initial Brand chat welcoming
    setChats(prev => ({
      ...prev,
      [newActive.id]: [
        { id: 'c0', sender: 'brand', text: `Hi Love! Welcome to the ${offer.brand} campaign. We are excited to collaborate. Let us know if you need guidelines or raw assets.`, time: 'Just now' }
      ]
    }));

    showToast(`Signed with ${offer.brand}! Campaign started.`, 'success');
  };

  const toggleDeliverable = (collabId, delId) => {
    setActiveCollabs(prev =>
      prev.map(act => {
        if (act.id === collabId) {
          const updatedDels = act.deliverables.map(d => {
            if (d.id === delId) {
              const nextDone = !d.done;
              if (nextDone) showToast('Milestone checked!', 'success');
              return { ...d, done: nextDone };
            }
            return d;
          });
          return { ...act, deliverables: updatedDels };
        }
        return act;
      })
    );
  };

  const requestPayout = (collabId) => {
    const act = activeCollabs.find(c => c.id === collabId);
    if (!act) return;

    // Remove from active
    setActiveCollabs(prev => prev.filter(c => c.id !== collabId));

    // Update earnings metrics
    setMetrics(prev => {
      const earningsTotalVal = parseFloat(prev.earnings.total.replace('$', '').replace(',', ''));
      const newTotal = earningsTotalVal + act.payout;
      const historyCopy = [...prev.earnings.history];
      historyCopy[historyCopy.length - 1] += act.payout;

      return {
        ...prev,
        earnings: {
          ...prev.earnings,
          total: `$${newTotal.toLocaleString()}`,
          history: historyCopy
        }
      };
    });

    // Notify alert
    setNotifications(prev => [
      {
        id: `n-${Date.now()}`,
        type: 'alert',
        text: `Payment of $${act.payout.toLocaleString()} processed from ${act.brand}. Check your connected wallet.`,
        time: 'Just now',
        unread: true
      },
      ...prev
    ]);

    showToast(`Payout request for $${act.payout.toLocaleString()} sent successfully!`, 'success');
  };

  // CRUD for posts
  const addPost = (title, viewsVal, likesVal, platform) => {
    const newPost = {
      id: `p-${Date.now()}`,
      title,
      views: viewsVal,
      likes: likesVal,
      platform,
      thumb: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=120&h=120&q=80'
    };

    setPosts(prev => [newPost, ...prev]);

    // Update views in dashboard metric state if valid view count provided
    if (viewsVal > 0) {
      setMetrics(prev => {
        const currentViewsK = parseFloat(prev.views.total.replace('K', ''));
        const newTotalViews = (currentViewsK + viewsVal / 1000).toFixed(1) + 'K';
        const historyCopy = [...prev.views.history];
        historyCopy[historyCopy.length - 1] += viewsVal;
        
        return {
          ...prev,
          views: {
            ...prev.views,
            total: newTotalViews,
            history: historyCopy
          }
        };
      });
    }

    showToast('Post added successfully!', 'success');
  };

  const updatePost = (postId, updatedFields) => {
    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          return { ...p, ...updatedFields };
        }
        return p;
      })
    );
    showToast('Post updated successfully!', 'success');
  };

  const deletePost = (postId) => {
    setPosts(prev => prev.filter(p => p.id !== postId));
    showToast('Post deleted.', 'info');
  };

  // Developer simulation triggers
  const triggerBrandDealSimulation = () => {
    const brands = [
      { brand: 'Nike Athletics', desc: 'Promote our winter tech fleece collection.', logoLetter: 'N', payout: 5800, type: 'YouTube Sponsor', bg: 'p-cyan' },
      { brand: 'Epic Games', desc: 'Custom gameplay streams sponsored slot integration.', logoLetter: 'E', payout: 3500, type: 'Twitch Streams', bg: 'p-pink' },
      { brand: 'Keychron', desc: 'Workspace aesthetic review of Q1 Max Keyboard.', logoLetter: 'K', payout: 1800, type: 'Reels / Tiktok', bg: 'p-yellow' }
    ];

    const randomBrand = brands[Math.floor(Math.random() * brands.length)];
    const randomId = `offer-${Date.now()}`;

    // Add to offers
    setOffers(prev => [
      {
        id: randomId,
        brand: randomBrand.brand,
        type: randomBrand.type,
        payout: randomBrand.payout,
        logoBg: randomBrand.bg,
        logoLetter: randomBrand.logoLetter,
        description: randomBrand.desc,
        applyBy: 'Jul 28',
        deliverables: [
          { id: 'd1', label: '60s integration or dedicated reel', done: false },
          { id: 'd2', label: 'Include promo discount links', done: false }
        ],
        brief: `We want you to showcase our products naturally in your high-quality desk setup aesthetic. Let your audience see the true integration in your workflow.`
      },
      ...prev
    ]);

    // Add notification alert
    setNotifications(prev => [
      {
        id: `n-${Date.now()}`,
        type: 'collab',
        text: `New sponsor invitation from ${randomBrand.brand} offering $${randomBrand.payout.toLocaleString()}!`,
        time: 'Just now',
        unread: true
      },
      ...prev
    ]);

    // Trigger Dynamic Island Animation
    showIslandNotification(
      randomBrand.brand,
      `New Sponsor Invitation: $${randomBrand.payout.toLocaleString()}`,
      'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=100&h=100&q=80',
      'ph-bold ph-sparkle'
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    showToast('Notifications read.', 'info');
  };

  const clearNotifications = () => {
    setNotifications([]);
    showToast('All notifications cleared.', 'info');
  };

  const readNotification = (notiId) => {
    setNotifications(prev =>
      prev.map(n => {
        if (n.id === notiId) return { ...n, unread: false };
        return n;
      })
    );
  };

  return (
    <AppContext.Provider
      value={{
        metrics,
        setMetrics,
        activeMetric,
        setActiveMetric,
        activeScreen,
        setActiveScreen,
        profile,
        setProfile,
        toasts,
        showToast,
        island,
        showIslandNotification,
        hideIslandNotification,
        offers,
        activeCollabs,
        chats,
        sendChatMessage,
        posts,
        addPost,
        updatePost,
        deletePost,
        notifications,
        declineOffer,
        acceptOffer,
        toggleDeliverable,
        requestPayout,
        triggerBrandDealSimulation,
        markAllNotificationsRead,
        clearNotifications,
        readNotification
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
