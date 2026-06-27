import React, { useContext, useState, useMemo } from 'react';
import { AppContext } from '../context/AppContext';

export default function AnalyticsScreen() {
  const { posts } = useContext(AppContext);

  // Platform Filter and Sorting
  const [platformFilter, setPlatformFilter] = useState('all');
  const [sortBy, setSortBy] = useState('views-desc'); // views-desc, views-asc, likes-desc, likes-asc

  // Engagement calculator state
  const [viewsInput, setViewsInput] = useState('');
  const [likesInput, setLikesInput] = useState('');
  const [commentsInput, setCommentsInput] = useState('');
  const [calcResult, setCalcResult] = useState(null);

  // Calculate platform share percentages
  const platformStats = useMemo(() => {
    let ytViews = 0, igViews = 0, ttViews = 0;
    posts.forEach(p => {
      const views = parseInt(p.views) || 0;
      if (p.platform === 'youtube') ytViews += views;
      else if (p.platform === 'instagram') igViews += views;
      else if (p.platform === 'tiktok') ttViews += views;
    });

    const totalViews = ytViews + igViews + ttViews || 1;

    return {
      youtube: { views: ytViews, percent: Math.round((ytViews / totalViews) * 100), color: 'var(--red)', label: 'YouTube' },
      instagram: { views: igViews, percent: Math.round((igViews / totalViews) * 100), color: 'var(--accent)', label: 'Instagram' },
      tiktok: { views: ttViews, percent: Math.round((ttViews / totalViews) * 100), color: 'var(--cyan)', label: 'TikTok' }
    };
  }, [posts]);

  // Handle Filtering & Sorting
  const filteredAndSortedPosts = useMemo(() => {
    let result = posts.filter(p => {
      if (platformFilter === 'all') return true;
      return p.platform === platformFilter;
    });

    result.sort((a, b) => {
      const aViews = parseInt(a.views) || 0;
      const bViews = parseInt(b.views) || 0;
      const aLikes = parseInt(a.likes) || 0;
      const bLikes = parseInt(b.likes) || 0;

      if (sortBy === 'views-desc') return bViews - aViews;
      if (sortBy === 'views-asc') return aViews - bViews;
      if (sortBy === 'likes-desc') return bLikes - aLikes;
      if (sortBy === 'likes-asc') return aLikes - bLikes;
      return 0;
    });

    return result;
  }, [posts, platformFilter, sortBy]);

  const handleCalculateEngagement = (e) => {
    e.preventDefault();
    const views = parseFloat(viewsInput);
    const likes = parseFloat(likesInput) || 0;
    const comments = parseFloat(commentsInput) || 0;

    if (!views || views <= 0) {
      alert("Please enter a valid views count.");
      return;
    }

    const rate = (((likes + comments) / views) * 100).toFixed(2);
    let grade = 'Fair';
    let gradeColor = 'var(--yellow)';

    if (rate >= 8) {
      grade = 'Excellent (Viral Tier)';
      gradeColor = 'var(--green)';
    } else if (rate >= 4) {
      grade = 'Good (Above Average)';
      gradeColor = 'var(--cyan)';
    } else if (rate < 2) {
      grade = 'Low (Needs optimization)';
      gradeColor = 'var(--red)';
    }

    setCalcResult({ rate, grade, gradeColor });
  };

  return (
    <section id="analytics-screen" className="app-screen active">
      <h2 className="screen-title">Detailed Analytics</h2>

      {/* Platform views breakdown card */}
      <div className="glass-card" style={{ padding: '16px', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '14px', color: 'var(--text-primary)' }}>
          Platform View Share
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {Object.entries(platformStats).map(([key, data]) => (
            <div key={key}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 600, marginBottom: '4px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>{data.label}</span>
                <span>{data.percent}%</span>
              </div>
              <div className="progress-track" style={{ height: '6px' }}>
                <div 
                  className="progress-fill" 
                  style={{ width: `${data.percent}%`, background: data.color }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Content filter & sort panel */}
      <div className="glass-card" style={{ padding: '16px', marginBottom: '16px' }}>
        <div className="section-header-row" style={{ marginBottom: '12px' }}>
          <h3 style={{ fontSize: '13px', fontWeight: 700 }}>Top Performing Content</h3>
        </div>

        {/* Filter controls */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
          <select 
            value={platformFilter} 
            onChange={(e) => setPlatformFilter(e.target.value)}
            className="form-input flex-1"
            style={{ fontSize: '11px', padding: '6px 10px' }}
          >
            <option value="all">All Platforms</option>
            <option value="youtube">YouTube Only</option>
            <option value="instagram">Instagram Only</option>
            <option value="tiktok">TikTok Only</option>
          </select>

          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="form-input flex-1"
            style={{ fontSize: '11px', padding: '6px 10px' }}
          >
            <option value="views-desc">Views (High to Low)</option>
            <option value="views-asc">Views (Low to High)</option>
            <option value="likes-desc">Likes (High to Low)</option>
            <option value="likes-asc">Likes (Low to High)</option>
          </select>
        </div>

        {/* Sorted List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '180px', overflowY: 'auto' }}>
          {filteredAndSortedPosts.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '11px', textAlign: 'center', padding: '10px' }}>
              No matches found.
            </p>
          ) : (
            filteredAndSortedPosts.map(post => {
              const ytColor = post.platform === 'youtube' ? 'text-red' : (post.platform === 'instagram' ? 'text-pink' : 'text-blue');
              return (
                <div key={post.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.02)', padding: '8px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <img src={post.thumb} alt="thumb" style={{ width: '32px', height: '32px', borderRadius: '4px', objectFit: 'cover' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {post.title}
                    </h4>
                    <span style={{ fontSize: '9px', color: 'var(--text-secondary)' }}>
                      {(post.views).toLocaleString()} Views • {(post.likes).toLocaleString()} Likes
                    </span>
                  </div>
                  <div className={ytColor} style={{ fontSize: '14px' }}>
                    {post.platform === 'youtube' && <i className="ph-bold ph-youtube-logo"></i>}
                    {post.platform === 'instagram' && <i className="ph-bold ph-instagram-logo"></i>}
                    {post.platform === 'tiktok' && <i className="ph-bold ph-tiktok-logo"></i>}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Engagement Rate Calculator */}
      <div className="glass-card" style={{ padding: '16px' }}>
        <h3 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '10px' }}>
          Engagement Calculator
        </h3>
        <form onSubmit={handleCalculateEngagement} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <div className="form-group flex-1">
              <label style={{ fontSize: '9px' }}>Views</label>
              <input 
                type="number" 
                placeholder="10000"
                value={viewsInput} 
                onChange={(e) => setViewsInput(e.target.value)}
                className="form-input" 
                style={{ padding: '8px', fontSize: '11px' }}
                required 
              />
            </div>
            <div className="form-group flex-1">
              <label style={{ fontSize: '9px' }}>Likes</label>
              <input 
                type="number" 
                placeholder="400"
                value={likesInput} 
                onChange={(e) => setLikesInput(e.target.value)}
                className="form-input" 
                style={{ padding: '8px', fontSize: '11px' }}
              />
            </div>
            <div className="form-group flex-1">
              <label style={{ fontSize: '9px' }}>Comments</label>
              <input 
                type="number" 
                placeholder="50"
                value={commentsInput} 
                onChange={(e) => setCommentsInput(e.target.value)}
                className="form-input" 
                style={{ padding: '8px', fontSize: '11px' }}
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            style={{ width: '100%', padding: '10px', fontSize: '11px', fontWeight: 700 }}
          >
            Calculate Engagement Rate
          </button>
        </form>

        {calcResult && (
          <div 
            className="glass-card" 
            style={{ marginTop: '12px', padding: '12px', background: 'rgba(255,255,255,0.03)', border: `1px solid ${calcResult.gradeColor}`, borderRadius: '10px', textAlign: 'center' }}
          >
            <span style={{ display: 'block', fontSize: '9px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              Calculated Engagement
            </span>
            <h4 style={{ fontSize: '20px', fontWeight: 800, margin: '4px 0', color: calcResult.gradeColor }}>
              {calcResult.rate}%
            </h4>
            <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-primary)' }}>
              Rating: {calcResult.grade}
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
